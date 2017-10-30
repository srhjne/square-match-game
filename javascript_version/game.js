var score = 0;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function initializeBoard(size){
	var gameBoard = [];
	for (var i=0; i<parseInt(size);i++){
		var rowSquares = [];
		for (var j=0; j<parseInt(size);j++){
			var color = getRandomInt(0,3);
			rowSquares.push(color);
		};
		gameBoard.push(rowSquares);
	};
	return gameBoard;
}

function drawBoard(board) {
	var colors = ["r", "g", "b"];
	console.log("I am testing stuff");
	var size = board.length;
	$("#game").html("");
	for (var i=0; i<parseInt(size);i++){
		console.log("i is "+i);
		var square_string = "";
		for (var j=0; j<parseInt(size);j++){
			var color = board[i][j];
			var squareNum = size*i+j;
			square_string = square_string+"<div id="+squareNum+" class='square "+colors[color]+"'></div>";
		};
		var row_string = "<div class='game-row'>"+square_string+"</div>";
		console.log(row_string);
		$("#game").append(row_string);
	};
}

function removeTiles(coords, board){
	if (coords[1] === 0){
		var y = coords[1];
		var color = getRandomInt(0,3);
		board[coords[0]][y] = color;	
	}

	for (var y=coords[1]-1;y>-1;y--){
		board[coords[0]][y+1] = board[coords[0]][y]
		if (y === 0){
			var color = getRandomInt(0,3);
			board[coords[0]][y] = color;
		}
	}
}


function checkForLines(board) {
	var size = board.length;
	for (var x=0; x < size; x++){
		console.log(x);
		for (var y=0; y <size; y++){
			var startx = x;
			var starty = y;
			var i = 1;
			var color = board[startx][starty];
			var line = [[startx,starty]]
			while (startx +i <size){
				if (board[startx+i][starty] === color){
					line.push([startx+i, starty]);
				} else {
					break;
				}
				i++;
			}
			
			if (line.length >= 3){
				score+=line.length
				console.log("found line of length"+line.length);
				for (point of line){
					removeTiles(point, board);
				}
				return true;
			}
			var i = 1;
			var line = [[startx,starty]]
			while (starty +i < size){
				console.log("board"+board[startx][starty+i]);
				console.log("color "+color);
				if (board[startx][starty+i] === color){
					line.push([startx, starty+i]);
				} else {
					break;
				}
				i++;
			}

			if (line.length >= 3){
				score +=line.length;
				console.log("found line of length"+line.length);
				for (point of line){
					console.log(point);
					removeTiles(point, board);
				}
				return true;
			}
		}
	}
	return false;
}


function playGame(board, size){
	var pair = [];
	var moves = 15;
	score = 0;
	$("#score-item").html("Score is <span id='score'></span>")
	$("#moves-item").html("Moves left <span id='moves'></span>")
	$("#score").html(score);
	$("#moves").html(moves);
	$("#game").on("click", function(evt){
		var targetSquare = parseInt(evt.target.id);
		var x = Math.floor(targetSquare/size);
		var y = targetSquare % size;
		pair.push([x,y]);
		evt.target.className+=" highlight";
		if (moves === 0){
			$("#game").off("click");
		}
		if (pair.length === 2){
		var first_pair = pair[0];
		var second_pair = pair[1];
		if ((first_pair[0]=== second_pair[0] && Math.abs(first_pair[1]-second_pair[1])===1) || (first_pair[1]=== second_pair[1] && Math.abs(first_pair[0]-second_pair[0])===1) ){
			moves--;
			var holdColor = board[first_pair[0]][first_pair[1]];
			board[first_pair[0]][first_pair[1]] = board[second_pair[0]][second_pair[1]]
			board[second_pair[0]][second_pair[1]] = holdColor;
			var check = true;
			while (check){
				console.log("checking for lines");
				check = checkForLines(board);
				drawBoard(board);
			}
		};
		var targetId_first = first_pair[0]*size+first_pair[1];
		var targetId_second = second_pair[0]*size+second_pair[1];
		$("#"+targetId_first).removeClass("highlight");
		$("#"+targetId_second).removeClass("highlight");
		$("#score").html(score);
		$("#moves").html(moves);
		pair = [];

	}

	});
	
}

$("#game-form").on("submit", function(evt){
	evt.preventDefault();
	var size = $("#size").val();
	var board = initializeBoard(size);
	score = 0;
	drawBoard(board);
	var check = true;
	while (check){
		console.log("checking for lines");
		check = checkForLines(board);
	}
	drawBoard(board);
	playGame(board, size);
	


});