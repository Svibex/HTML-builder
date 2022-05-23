const fs = require('fs');
const path = require('path');

const bundleFile = path.join(__dirname, 'project-dist', 'bundle.css');

fs.readdir(
  path.join(__dirname, 'styles'),
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
              bundleFile,
              'w',
              err => {
                if (err) throw err;
              }
            );

            fs.appendFile(
              bundleFile,
              file,
              err => {
                if (err) throw err;
              });
          });
      }
    });
  });