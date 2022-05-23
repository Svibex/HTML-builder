const fs = require('fs');
const path = require('path');

const folder = path.join(__dirname, 'files');
const folderCopy = path.join(__dirname, 'files-copy');

function copyDir() {

  fs.open(folderCopy, err => {
    if (err) {
      fs.mkdir(folderCopy, err => {
        if (err) throw err;
      });
    }

    fs.readdir(folderCopy, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlink(path.join(folderCopy, file), err => {
          if (err) throw err;
        });
      }
    });

    fs.readdir(
      folder,
      (err, files) => {
        if (err) throw err;

        files.forEach(file => {
          fs.copyFile(
            path.join(folder, file),
            path.join(folderCopy, file),
            err => {
              if (err) throw err;
            });
        });
      });
  });
}

copyDir();