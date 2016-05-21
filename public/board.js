class Board{
	constructor(){
		this.array = Array.apply(null, Array(22)).map(function(){
			return Array.apply(null, Array(10).map(function(){
				return 'null';
			}));
		});
		this.pieceTypes = ['o', 'j', 'l', 's', 'z', 't' , 'i'];
		this.fallingPiece = null;
		this.greyLines = 0;
		this.holdPiece = null;
		this.nextPiece = Piece.createPiece(
			this.pieceTypes[ Math.floor( Math.random() * 7) ], [this.greyLines, 4]
			);;
	}
	shift(){
		if(this.holdPiece){
			var temp = this.holdPiece;
			this.holdPiece.origin = [this.greyLines, 4];
			this.holdPiece = this.fallingPiece;
			this.fallingPiece = temp;
		}else{
			this.holdPiece = this.fallingPiece;
			this.nextPiece.origin[0] = this.greyLines;
			this.fallingPiece = this.nextPiece;
			this.nextPiece = 
			Piece.createPiece(
				this.pieceTypes[ Math.floor( Math.random() * 7) ], [this.greyLines, 4]
				);
		}
	}
	currentState(){
			//return the array with the falling piece added in	
			var newArray = this.copyArray();
			if (this.fallingPiece){
				var piece = this.fallingPiece;				
				for (var r = 0; r < piece.size; r ++){
					for (var c = 0; c < piece.size; c ++){
						if (piece.array[r][c] == 1){
							newArray[r + piece.origin[0]][c + piece.origin[1]] = piece.color;
						}
					}
				}
			}
			//add in the greyLines
			for (var row = 0; row < 22 - this.greyLines; row ++){
				for (var index = 0; index < 10; index ++){
					newArray[row][index] = newArray[row + this.greyLines][index];
				}
			}
			for (var row = 22 - this.greyLines; row < 22; row ++){
				for (var index = 0; index < 10; index ++){
					newArray[row][index] = 'white';
				}
			}
			return newArray;
		}
		copyArray(){
			var newArray = []
			for (var r = 0; r < 22; r ++){
				var row = [];
				for (var c = 0; c < 10; c ++){
					row[c] = this.array[r][c];
				}
				newArray.push(row);
			}
			return newArray;
		}
		update(){
		//if the piece can move down
		if (this.fallingPiece != null && this.canMoveDown(this.fallingPiece)){
			//move the piece down
			this.fallingPiece.origin = [this.fallingPiece.origin[0] + 1, this.fallingPiece.origin[1]];
		}else{
		//the piece has reached teh bottom
			//permanently add the old falling piece to the array
			if (this.fallingPiece){
				for (var r = 0; r < this.fallingPiece.size; r ++){
					for (var c = 0; c < this.fallingPiece.size; c ++){
						if (this.fallingPiece.array[r][c] == 1){
							this.array[r + this.fallingPiece.origin[0]][c + this.fallingPiece.origin[1]] = this.fallingPiece.color;
						}
					}
				}
			}
			this.clearLines();
			//add a random piece as the new next piece
			this.nextPiece.origin[0] = this.greyLines;
			this.fallingPiece = this.nextPiece;
			this.nextPiece = Piece.createPiece(
				this.pieceTypes[ Math.floor( Math.random() * 7) ], [this.greyLines, 4]
				);
		}
	}
	spaceBar(){
		while(this.canMoveDown(this.fallingPiece)){
			this.fallingPiece.origin = [this.fallingPiece.origin[0] + 1, this.fallingPiece.origin[1]];
		}
	}
	moveDown(){
		if(this.canMoveDown(this.fallingPiece)){
			this.fallingPiece.origin = [this.fallingPiece.origin[0] + 1, this.fallingPiece.origin[1]];
		}
	}
	rotate(){
		var newArray = this.fallingPiece.copyArray();
		switch(this.fallingPiece.size){
			case 2:
			break;
			case 3:
			newArray[0][0] = this.fallingPiece.array[2][0];
			newArray[0][1] = this.fallingPiece.array[1][0];
			newArray[0][2] = this.fallingPiece.array[0][0];
			newArray[1][0] = this.fallingPiece.array[2][1];
			newArray[1][1] = this.fallingPiece.array[1][1];
			newArray[1][2] = this.fallingPiece.array[0][1];
			newArray[2][0] = this.fallingPiece.array[2][2];
			newArray[2][1] = this.fallingPiece.array[1][2];
			newArray[2][2] = this.fallingPiece.array[0][2];
			break;
			case 4:
			newArray[0][0] = this.fallingPiece.array[3][0];
			newArray[0][1] = this.fallingPiece.array[2][0];
			newArray[0][2] = this.fallingPiece.array[1][0];
			newArray[0][3] = this.fallingPiece.array[0][0];
			newArray[1][3] = this.fallingPiece.array[0][1];
			newArray[2][3] = this.fallingPiece.array[0][2];
			newArray[3][3] = this.fallingPiece.array[0][3];
			newArray[3][2] = this.fallingPiece.array[1][3];
			newArray[3][1] = this.fallingPiece.array[2][3];
			newArray[3][0] = this.fallingPiece.array[3][3];
			newArray[2][0] = this.fallingPiece.array[3][2];
			newArray[1][0] = this.fallingPiece.array[3][1];

			newArray[1][1] = this.fallingPiece.array[2][1];
			newArray[1][2] = this.fallingPiece.array[1][1];
			newArray[2][2] = this.fallingPiece.array[1][2];
			newArray[2][1] = this.fallingPiece.array[2][2];
			break;
			default:
			console.log('not a valid piece size bro wutr u doin');
		}
		if (this.isValidRotation(newArray)){
			this.fallingPiece.array = newArray;
		}		
	}

	moveLeft(){
		if(this.canMoveLeft(this.fallingPiece)){
			this.fallingPiece.origin = [this.fallingPiece.origin[0], this.fallingPiece.origin[1] - 1];
		}
	}

	moveRight(){
		if(this.canMoveRight(this.fallingPiece)){
			this.fallingPiece.origin = [this.fallingPiece.origin[0], this.fallingPiece.origin[1] + 1];
		}
	}

	isValidRotation(newArray){
		for (var r = 0; r < newArray.length; r ++){
			for (var c = 0; c < newArray.length; c ++){			
				if (newArray[r][c] == 1){		
					if (this.fallingPiece.origin[0] + r > 21){
						return false;
					}
					if (this.fallingPiece.origin[1] + c < 0){
						return false;
					}
					if (this.fallingPiece.origin[1] + c > 9){
						return false;
					}
					if(this.array[this.fallingPiece.origin[0] + r][this.fallingPiece.origin[1] + c] != null){
						return false;
					}
				}
			}		
		}
		return true;
	}
	canMoveDown(piece){
		for (var r = 0; r < piece.size; r ++){
			for (var c = 0; c < piece.size; c ++){			
				if (piece.array[r][c] == 1){		
					if (piece.origin[0] + r + 1 > 21){
						return false;
					}
					if(this.array[piece.origin[0] + r + 1][piece.origin[1] + c] != null){
						return false;
					}
				}
			}		
		}
		return true;
	}
	canMoveLeft(piece){
		for (var r = 0; r < piece.size; r ++){
			for (var c = 0; c < piece.size; c ++){			
				if (piece.array[r][c] == 1){		
					if (piece.origin[1] + c < 1){
						return false;
					}
					if(this.array[piece.origin[0] + r][piece.origin[1] + c - 1] != null){
						return false;
					}
				}
			}		
		}
		return true;
	}
	canMoveRight(piece){
		for (var r = 0; r < piece.size; r ++){
			for (var c = 0; c < piece.size; c ++){			
				if (piece.array[r][c] == 1){		
					if (piece.origin[1] + c > 8){
						return false;
					}
					if(this.array[piece.origin[0] + r][piece.origin[1] + c + 1] != null){
						return false;
					}
				}
			}		
		}
		return true;
	}
	clearLines(){
		//check each row
		//is every slot filled on that row?
		//if so set pointer to row above
		//filled cleared row with row above
		//move pointer up, keep going until pointer reaches top
		var clearedLines = 0;
		for (var r = 0; r < this.array.length; r ++){
			var clear = true;
			for (var c = 0; c < this.array[0].length; c ++){
				if (this.array[r][c] == null){
					clear = false;
				}
			}
			if (clear){
				clearedLines ++;
				for (var rowToCopy = r - 1; rowToCopy > -1; rowToCopy --){
					for (var whichItemInRow = 0; whichItemInRow < 10; whichItemInRow ++){
						this.array[rowToCopy + 1][whichItemInRow] = this.array[rowToCopy][whichItemInRow];
					}
				}
			}		
		}
		if (this.greyLines > clearedLines){
			this.greyLines -= clearedLines;
		}else{
			this.greyLines = 0;
		}
		if(!lock && clearedLines > 0){
		    socket.emit('lineclear', [clearedLines, $('#game-id').html()]);
		}
	}
	addLines(numberOfLines){
		this.greyLines += numberOfLines;
		if (this.fallingPiece.origin[0] + numberOfLines + this.fallingPiece.size < 22){
			this.fallingPiece.origin[0] += numberOfLines;
		}
	}
	isGameOver(){
		for (var x  = 0; x < this.array[this.greyLines].length; x ++){
			if (this.array[this.greyLines][x] != null){
				return true;
			}
		}
		return false;
	}
}