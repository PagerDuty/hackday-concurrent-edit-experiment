const WebSocket = require('ws');

/* data-structure define the document that can be edited*/
// 1st version: 10 line document
const dataStruct = {
  document: ["line 1", "line 2","line 3","line 4","line 5","line 6"],
  version: 0
};

const wss = new WebSocket.Server({ port: 3030 });
wss.on('connection', function connection(ws) {
  // 'ws' reprensents the client that is incoming
  console.log('New Client Connected');

  ws.send(JSON.stringify(dataStruct));

  ws.on('close', function incoming(code,reason){
    console.log('Client Closed => code:['+code+'] reason:['+reason+']')
  });

  ws.on('message', function incoming(dataString) {
    // This broadcasts to each registered client, each incoming message (data)
    // the same data to each client, excluding the client
    // that send the data originally
  data = JSON.parse(dataString);
  if (data.current_document_version == dataStruct.version) {
    console.log("New Edit Recived")
    console.log(data.name)// editor
    console.log(data.new_value) // entry for dataStructures document
    console.log(data.line_number)
    console.log(data.current_document_version)
    // merge to datastructure
    dataStruct.document[data.line_number] = data.new_value;  
    dataStruct.version++; // record new version
  } else {
    console.log(data.current_document_version + " doesn't match document version ..."+ dataStruct.version)
  }

    console.log(dataStruct)
    // then spread new datastruture.
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        // TODO : Merge into Document.
        client.send(JSON.stringify(dataStruct));
      }; 
    });
  });
});