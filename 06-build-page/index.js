const fs = require('fs');
const path = require('path');

const folder = path.resolve(__dirname, 'project-dist');
const assetsFolder = path.resolve(__dirname, 'assets');
const stylesFolder = path.resolve(__dirname, 'styles');
const filesFolder = path.resolve(__dirname, 'components');

fs.open(folder, err => {
  if (err) {
    fs.mkdir(folder, err => {
      if (err) throw err;
    });
  }
});

function copyDir(source, folder) {
  fs.mkdir(folder, err => {
    if (err) throw err;

    fs.readdir(source, {withFileTypes: true}, (err, files) => {
      if (err) throw err;
      files.forEach(file => {
        if (file.isFile()) {
          fs.copyFile(
            path.resolve(source, file.name),
            path.resolve(folder, file.name),
            err => {
              if (err) throw err;
            });
        } else {
          copyDir(
            path.resolve(source, file.name),
            path.resolve(folder, file.name));
        }
      });
    });
  });
}

function boundHTML() {
  let html = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');

  html.on('data', (chunk) => {
    let template = chunk.toString();
    fs.readdir(filesFolder, (err, files) => {
      if (err) throw err;

      files.forEach(file => {
        let htmlFile = fs.createReadStream(path.join(filesFolder, file));
        htmlFile.on('data', (chunk) => {
          template = template.replace(`{{${file.slice(0, file.length - 5)}}}`, chunk);
          fs.writeFile(path.join(folder, 'index.html'), template, (err) => {
            if (err) throw err;
          });
        });
      });
    });
  });
}

fs.rm(folder, {recursive: true, force: true}, () => {
  fs.mkdir(folder, { recursive: true }, (err) => {
    if (err) throw err;

    copyDir(assetsFolder, path.join(folder, 'assets'));

    const style = fs.createWriteStream(path.join(folder, 'style.css'));

    style.on('error', err => console.log(err));

    fs.readdir(
      path.join(stylesFolder),
      (err, files) => {
        if (err) throw err;

        files.forEach(file => {
          if (path.extname(file) === '.css') {
            fs.readFile(
              path.join(__dirname, 'styles', file),
              'utf-8',
              (err, file) => {
                if (err) throw err;

                fs.open(
                  path.join(folder, 'style.css'),
                  'w',
                  err => {
                    if (err) throw err;
                  }
                );

                fs.appendFile(
                  path.join(folder, 'style.css'),
                  file,
                  err => {
                    if (err) throw err;
                  });
              });
          }
        });
      });

    const html = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
    let templates = '';

    html.on('error', err => console.log(err));
    html.on('data', chunk => templates += chunk);
    html.on('end', () => boundHTML());
  });
});