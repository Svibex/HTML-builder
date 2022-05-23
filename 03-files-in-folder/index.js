const fs = require('fs');
const path = require('path');
const { stdout } = require('process');

const folder = path.join(__dirname, 'secret-folder');

fs.readdir(
  path.join(__dirname, 'secret-folder'),
  (err, files) => {
    if (err) throw err;

    files.forEach(file => {
      fs.stat(path.join(folder, file), (err,stats) => {
        if (err) throw err;
        const point = file.indexOf('.');
        const name = file.slice(0, point);
        const extension = file.slice(point + 1);
        if (!stats.isDirectory()) {
          stdout.write(`${name} - ${extension} - ${stats.size}b \n`);
        }});
    });
  }
);
