const fs = require('fs');
const path = require('path');
const {stdout} = require('process');

const text = path.join(__dirname, 'text.txt');
const stream = new fs.ReadStream(text, 'utf-8');

stream.on('readable', function(){
  let data = stream.read();
  if (data != null) stdout.write(data);
});