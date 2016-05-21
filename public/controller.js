var board;
var socket = io();
var lock = true;
socket.on('boardstate', function(state){
	canvasWrite(state, 'opponent');	
});
socket.on('lineclear', function(numberOfLines){
	board.addLines(numberOfLines);
});
socket.on('matching', function(msg){
    $('#message').html(msg);
})
socket.on('game-id', function(id){
    $('#game-id').html(id);
    $('#game-id').hide();
    $('#message').html('game found');
    lock = false;
    board = new Board();
});
socket.on('gameover', function(msg){
	lock = true;
    $('#message').html(msg);
});

$('#new-game').click(function() {
    location.reload();
  });
function controller(){
	board = new Board();
	cycle();
	document.addEventListener("keydown", function (event){
		switch(event.which){
	        case 32: //space bar
		        board.spaceBar();
		        window.requestAnimationFrame(getFrame);
	        break;
	        case 40: //down arrow
		        board.moveDown();
		        window.requestAnimationFrame(getFrame);
	        break;
	        case 37: //left arrow
		        board.moveLeft();
		        window.requestAnimationFrame(getFrame);
	        break;
	        case 39: //right arrow
		        board.moveRight();
		        window.requestAnimationFrame(getFrame);
	        break;
	        case 38: //up arrow
		        board.rotate();
		        window.requestAnimationFrame(getFrame)
	        break;
	        case 83: //s
		        board.moveDown();
		        window.requestAnimationFrame(getFrame);
	        break;
	        case 65: //a
		        board.moveLeft();
		        window.requestAnimationFrame(getFrame);
	        break;
	        case 68: //d
		        board.moveRight();
		        window.requestAnimationFrame(getFrame);
	        break;
	        case 87: //w
		        board.rotate();
		        window.requestAnimationFrame(getFrame)
	        break;
	        case 16: //shift
		        board.shift();
		        window.requestAnimationFrame(getFrame)
	        break;
	    }
	});
	function getFrame(){
		draw();
		if(!lock){
		    socket.emit('boardstate', [board.currentState(), $('#game-id').html()]);
		}
	}
}

function cycle(){
	setTimeout( function(){
		window.requestAnimationFrame(getFrame);
		board.update();
	} , 300);		

	function getFrame(){
		gravityDraw();
		if(!lock){
		    socket.emit('boardstate', [board.currentState(), $('#game-id').html()]);
		}
	}
}

function draw(){
	if (board.isGameOver()){
		if(!lock){
			socket.emit('gameover', $('#game-id').html());
		}
	}else{
		var gamestate = board.currentState();
		canvasWrite(gamestate, 'self');
	}
}

function canvasWrite(gamestate, who){	
	if (who == 'self'){
		var canvas = document.getElementById('self');
	}else if (who == 'opponent'){
		var canvas = document.getElementById('opponent');
	}else{
		console.log('lolwut');
		return;
	}
	if (canvas.getContext){
		var ctx = canvas.getContext('2d');
		for (var row = 0; row < gamestate.length; row ++){
			for (var column = 0; column < gamestate[0].length; column ++){
				if (gamestate[row][column] !=  null){
					ctx.fillStyle = gamestate[row][column];
					ctx.fillRect(column*30, row*30, 25, 25);
				}else{
					ctx.fillStyle = '#111111';
					ctx.fillRect(column*30, row*30, 25, 25);
				}
			}
		}
	}
	canvas = document.getElementById('hold');
	ctx = canvas.getContext('2d');
	if (board.holdPiece){
		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, 120, 120);
		switch(board.holdPiece.size){
			case 2:
			var offset = 30;
			break;
			case 3:
			var offset = 15;
			break;
			case 4:
			var offset = 0;
			break;
		}
		for (var row = 0; row < board.holdPiece.size; row ++){
			for (var column = 0; column < board.holdPiece.size; column ++){
				if (board.holdPiece.array[row][column] !=  0){
					ctx.fillStyle = board.holdPiece.color;
					ctx.fillRect(offset + column*30, offset + row*30, 25, 25);
				}
			}
		}
	}else{
		for (var row = 0; row < 4; row ++){
			for (var column = 0; column < 4; column ++){
				ctx.fillStyle = 'black';
				ctx.fillRect(column*30, row*30, 25, 25);
			}
		}

	}
	canvas = document.getElementById('next');
	ctx = canvas.getContext('2d');
	if (board.nextPiece){
		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, 120, 120);
		switch(board.nextPiece.size){
			case 2:
			var offset = 30;
			break;
			case 3:
			var offset = 15;
			break;
			case 4:
			var offset = 0;
			break;
		}
		for (var row = 0; row < board.nextPiece.size; row ++){
			for (var column = 0; column < board.nextPiece.size; column ++){
				if (board.nextPiece.array[row][column] !=  0){
					ctx.fillStyle = board.nextPiece.color;
					ctx.fillRect(offset + column*30, offset + row*30, 25, 25);
				}
			}
		}
	}else{
		for (var row = 0; row < 4; row ++){
			for (var column = 0; column < 4; column ++){
				ctx.fillStyle = 'black';
				ctx.fillRect(column*30, row*30, 25, 25);
			}
		}

	}
}		

function gravityDraw(){	
	draw();
	cycle();
}