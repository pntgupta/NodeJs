var http = require('http');
var express = require('express');
var app = express();

var server = http.createServer(app);

var io = require('socket.io')(server);

var storedmessages = [];

var storemessage = function(username,message)
{
	storedmessages.push({username,message});
	if(storedmessages.length>10){
		storedmessages.shift();
	}
}

io.on('connection',function(client){
	console.log('Client connected.....');

	client.on('username',function(username){
		client.username=username;
		for(var x in storedmessages)
		{
			username=storedmessages[x].username;
			message=storedmessages[x].message;
			client.emit('message',{username,message});
		}
	});

	client.on('messages',function(message){
		var username = client.username;
		client.broadcast.emit('message',{username,message});
		client.emit('message',{username,message});
		storemessage(username,message);
	});
});

app.get('/',function(req,res){
	res.sendFile(__dirname+'/index.html');
});

server.listen(8080);
