class Piece{
	constructor(letter, array, color, size, origin){
		this.color = color;
		this.array = array;
		this.letter = letter;
		this.size = size;
		this.origin = origin;
	}
	static createPiece(letter, coordinates){
		switch(letter){
			case 'o':
			return new Piece('o', [[1, 1], [1, 1]], '#FC8181', 2, coordinates);
			break;
			case 'j':
			return new Piece('j', [[1, 0, 0], [1, 1, 1], [0, 0, 0]], '#FCB66F', 3, coordinates);
			break;
			case 'l':
			return new Piece('l', [[0, 0, 1], [1, 1, 1], [0, 0, 0]], '#FFE896', 3, coordinates);
			break;
			case 'z':
			return new Piece('z', [[1, 1, 0], [0, 1, 1], [0, 0, 0]], '#8FF788', 3, coordinates);
			break;
			case 's':
			return new Piece('s', [[0, 1, 1], [1, 1, 0], [0, 0, 0]], '#92EFF7', 3, coordinates);
			break;
			case 't':
			return new Piece('t', [[0, 1, 0], [1, 1, 1], [0, 0, 0]], '#A59CF7', 3, coordinates);
			break;
			case 'i':
			return new Piece('i', [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], '#FFA8E2', 4, coordinates);
			break;
			default:
			console.log('not a piece specified');
		}
	}
	
	copyArray(){
		var newArray = []
		for (var r = 0; r < this.size; r ++){
			var row = [];
			for (var c = 0; c < this.size; c ++){
				row[c] = this.array[r][c];
			}
			newArray.push(row);
		}
		return newArray;
	}
}