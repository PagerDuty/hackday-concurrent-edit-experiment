const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3030 });

wss.on('connection', function connection(ws) {
  // 'ws' reprensents the client that is incoming
  console.log('New Client Connected');
    ws.on('close', function incoming(code,reason){
    console.log('Client Closed => code:['+code+'] reason:['+reason+']')
  });
  
  ws.on('message', function incoming(data) {
    // This broadcasts to each registered client, each incoming message (data)
    // the same data to each client, excluding the client
    // that send the data originally
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});