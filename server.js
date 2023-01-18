/** @format */

const express = require("express");
const http = require("http");
const app = express();
var server = http.createServer(app);
var io = require("socket.io")(server);
var fs = require("fs");

io.on(`connection`, socket => {
  var fileData = fileConnect();

  socket.emit(`content`, fileData);

  socket.on(`lines`, lines => {
    var fileData = fileConnect(lines);
    socket.emit(`content`, fileData);
  });

  //   console.log(`a user connected`);

  //   socket.on(`disconnect`, () => {
  //     console.log(`user disconnected`);
  //   });
});

app.get(`/`, (req, res) => {
  res.sendFile(__dirname + `/index.html`);
});

function fileConnect(lines = 5) {
  var fileData = fs.readFileSync(`./content.txt`, `utf8`);
  fileData = fileData.trim().split(`\n`);
  return fileData.length > lines
    ? fileData.slice(fileData.length - lines)
    : fileData;
}

fs.watchFile(`./content.txt`, { interval: 1000 }, _stats => {
  var fileData = fileConnect();
  io.sockets.emit(`content`, fileData);
});

server.listen(3000, () => console.log(`server listening on port 3k`));
