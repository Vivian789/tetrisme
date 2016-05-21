var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var redis   = require("redis");
if (process.env.REDIS_URL) {
    // production
    var rtg = require("url").parse(process.env.REDIS_URL);
    var client = redis.createClient(rtg.port, rtg.hostname);
    client.auth(rtg.auth.split(":")[1]);
} else {
    // development
    var client = redis.createClient();
}

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/canvas.html');
});

client.set("gameId", 0);

io.on('connection', function(socket){
  console.log(socket.id + " has connected");
    io.sockets.connected[socket.id].emit('matching', "Waiting for Player2!");
    // add id of socket into the queue
    client.rpush("gameQueue", String(socket.id));
    setTimeout(function(){
        client.llen("gameQueue", function(err, length){
            if (length >= 2) {
                client.lpop("gameQueue", function(err, player1){
                    client.lpop("gameQueue", function(err, player2){
                        client.get("gameId", function(err, id){
                            client.hmset(id, "player1", player1, "player2", player2);
                            console.log("player1: " + player1);
                            console.log("player2: " + player2);
                            io.sockets.connected[player1].emit('game-id', String(id));
                            io.sockets.connected[player2].emit('game-id', String(id));
                        });
                    });
                });
            // increments the gameId value to keep each game unique
            client.incr("gameId");
            // send clients proper game ID info
            };
        });
    },Math.random()*4000 );
    
  socket.on('boardstate', function(message){
    client.hmget(message[1], 'player1', 'player2', function(err, reply){
      var player1 = reply[0];
      var player2 = reply[1];
      if(socket.id == player1){
        if(io.sockets.sockets[player2]!=undefined){
          io.sockets.connected[player2].emit('boardstate', message[0]);
        }
      }else if(socket.id == player2){
        if(io.sockets.sockets[player1]!=undefined){
         io.sockets.connected[player1].emit('boardstate', message[0]);
        }
      }
    });
  });
  
  socket.on('lineclear', function(message){
    client.hmget(message[1], 'player1', 'player2', function(err, reply){
      var player1 = reply[0];
      var player2 = reply[1];
      if(socket.id == player1){
        if(io.sockets.sockets[player2]!=undefined){
          io.sockets.connected[player2].emit('lineclear', message[0]);
        }
      }else if(socket.id == player2){
        if(io.sockets.sockets[player1]!=undefined){
         io.sockets.connected[player1].emit('lineclear', message[0]);
        }
      }
    });
  });
  
  socket.on('gameover', function(message){
    client.hmget(message, 'player1', 'player2', function(err, reply){
      var player1 = reply[0];
      var player2 = reply[1];
      if(socket.id == player1){
        if(io.sockets.sockets[player2]!=undefined){
          io.sockets.connected[player2].emit('gameover', 'You won!');
        }
        if(io.sockets.sockets[player1]!=undefined){
         io.sockets.connected[player1].emit('gameover', 'You lost!');
        }
      }else if(socket.id == player2){
        if(io.sockets.sockets[player1]!=undefined){
         io.sockets.connected[player1].emit('gameover', 'You won!');
        }
        if(io.sockets.sockets[player2]!=undefined){
          io.sockets.connected[player2].emit('gameover', 'You lost!');
        }
      }
    });
  });
  
  socket.on('disconnect', function(){
    console.log(socket.id + ' has disconnected');
    // removes disconnected socket from the queue
    client.lrem("gameQueue", -1, String(socket.id))
  });
});

http.listen(process.env.PORT, process.env.IP, function(){
	console.log('server issa runnin');
});

