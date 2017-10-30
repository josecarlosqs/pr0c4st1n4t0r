var WebSocketServer = require('websocket').server;
var http = require('http');
var qrcode = require('qrcode-terminal');
var ip = require("ip");
var robot = require("robotjs");

const IP = ip.address();
const PORT = 9393;
 
var server = http.createServer(function(request, response) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if ( req.method === 'OPTIONS' ) {
    res.writeHead(200);
    res.end();
    return;
  }

    response.writeHead(404);
    response.end();
});
server.listen(PORT,IP, function() {
    console.log((new Date()) + `Servidor iniciado en ${IP}:${PORT}`);
});
 

wsServer = new WebSocketServer({
    httpServer: server
});

var currMousePos = {}

wsServer.on('request', function(r){
  var connection = r.accept('echo-protocol', r.origin);
  connection.on('message', function(message) {
    const m = JSON.parse(message.utf8Data)
    switch(m.type){
      case 'domove':
      currMousePos = robot.getMousePos()
      break;
      case 'move':
      var x = currMousePos.x + m.dx
      var y = currMousePos.y + m.dy
      robot.moveMouse(x, y);
      break;
      case 'lclick':
      robot.mouseClick("left")
      break;
      case 'rclick':
      robot.mouseClick("right")
      break;
    }
  });
});


var dataqr = {
  ip: IP,
  port:PORT
}

dataqr = JSON.stringify(dataqr);

dataqr = new Buffer(dataqr).toString('base64')

qrcode.generate(dataqr);

console.log("Esperando conexion por parte del cliente ...")