const fs = require('fs');
const path = require('path');
const os = require('os');
const { stdout, stdin, exit } = require('process');

const file = fs.createWriteStream(path.resolve(__dirname, 'text.txt'));
const end = 'exit' + os.EOL;

process.on('exit', () => {
  stdout.write('Ваш текст сохранен в text.txt. До свидания!');
  exit();
});
process.on('SIGINT', () => exit());

stdout.write('Введите текст:\n');

stdin.on('data', data => data.toString() !== end ? file.write(data) : process.emit('SIGINT'));
