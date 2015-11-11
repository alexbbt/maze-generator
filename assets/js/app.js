var x;
var y;
var squares;
var maze;
var walls;
var halls;
var unproccessed;
var proccessed;
var walked;
var current;
var startTime;
var endTime;
var mazeReady = false;
var points


$(document).ready(function() {
	$('#suggestedForm').submit(function() {
		go();
		return fasle;
	});
	$('#customForm').submit(function() {
		go();
		return fasle;
	});
});
var newMaze = function() {
	$('#loading').hide();
	$('ul.tabs').tabs('select_tab', 'suggested');
	$('#suggested').show();
	$('#top').slideDown();
	$('#bottom').hide();
	$('body').css('overflow', 'scroll');
}

var go = function() {
	var suggested = ($('ul.tabs .active').attr('href') == '#suggested');
	// console.log(suggested);
	if (suggested) {
		var xy = parseInt($('input[name="size"]:checked').val());
		// console.log(xy);

		$('#suggested').hide();
		$('#custom').hide();
		$('#loading').show();
		generateMaze(xy, xy);
	} else{
		var newX = parseInt($('#width').val());
		var newY = parseInt($('#height').val());
		var valid = (newX > 2 && newY > 2);
		if (valid) {
			$('#suggested').hide();
			$('#custom').hide();
			$('#loading').show();
			generateMaze(newX, newY);
		};
	};
}

var generateMaze = function(givenX,givenY) {
	mazeReady = false;
	points = 0;
	$('#score').text(points);
	x = givenX;
	y = givenY;
	squares = x * y;
	maze = [];
	walls = [];
	halls = [];
	unproccessed = [];
	proccessed = [];
	walked = [1];
	current = 1;

	for (var i = 1; i <= squares; i++) {
		maze.push([i]);
	};
	// console.log(maze);


	for (var a = 1; a <= squares; a++) {
		// console.log('a ' + a);
		var b = [a-x,a+x];
		if (a % x != 0) {b.push(a+1)};
		if (a % x != 1) {b.push(a-1)};
		for (var i = 0; i < b.length; i++) {
			// console.log(b[i]);
			if (b[i] > 0 && b[i] <= squares) {
				// console.log('used');
				// console.log(unproccessed);
				// console.log(arrayIndex(unproccessed,[a,b[i]]));
				// console.log(arrayIndex(unproccessed,[b[i],a]));
				// console.log(a);
				// console.log(b[i]);
				if (arrayIndex(unproccessed,[a,b[i]]) == -1 && arrayIndex(unproccessed,[b[i],a]) == -1) {
					unproccessed.push([a,b[i]]);
				};
			};
		};
	};

	// console.log(unproccessed);

	while (maze.length > 1) {
		var i = Math.floor(Math.random() * unproccessed.length);
		// console.log('a ' + a);
		var a = unproccessed[i][0];
		var b = unproccessed[i][1]
		unproccessed.splice(i,1);
		proccess(a,b);
		proccessed.push([a,b]);
	}
	while(unproccessed.length > 0) {
		walls.push(unproccessed[0]);
		unproccessed.splice(0,1);
	};

	// console.log(unproccessed);
	// console.log(maze);
	// console.log(walls);
	var index = 1
	var table = $('#mazeTable');
	table.html('');
	for (var i = 0; i < y; i++) {
		var row = $('<tr>');
		for (var j = 0; j < x; j++) {
			var tuple = $('<td>');
			tuple.attr('id', index);
			tuple.attr('class','cell');
			// tuple.text(index);
			index++;
			row.append(tuple);
		};
		table.append(row);
		// console.log(row);
	};
	for (var i = 0; i < walls.length; i++) {
		// console.log(walls[i][0] +' '+ walls[i][1]);
		// console.log(Math.min(walls[i][0] , walls[i][1]));
		if ([-1,1].indexOf(walls[i][0] - walls[i][1]) != -1) {
			// console.log('sameline');
			$('#'+Math.min(walls[i][0] , walls[i][1])).css("border-right", "solid black 5px");
		} else if ([-x,x].indexOf(walls[i][0] - walls[i][1]) != -1) {
			// console.log('next line');
			$('#'+Math.min(walls[i][0] , walls[i][1])).css("border-bottom", "solid black 5px");
		};
	};
	for (var i = 1; i <= x; i++) {
		$('#'+i).css("border-top", "solid black 5px");
		$('#'+(i+((y-1)*x))).css("border-bottom", "solid black 5px");
	};
	for (var i = 1; i <= y; i++) {
		$('#'+(i*x-(x-1))).css("border-left", "solid black 5px");
		$('#'+(i*x)).css("border-right", "solid black 5px");
	};
	$('#1').css("border-left", "0").css('background-color', 'green');
	$('#'+squares).css("border-right", "0");
	$('#top').slideUp();
	$('#bottom').show();
	$('body').css('overflow', 'hidden');
	mazeReady = true;
	$('td').mouseover(function(){
  	//console.log(this.id);
  	if (mazeReady) {
  		move(parseInt(this.id));
  	};
	}).bind('touchend', function(e) {
    e.preventDefault();
    //console.log(this.id);
    if (mazeReady) {
  		move(parseInt(this.id));
  	};
  }).bind('touchmove', function(e){
		e.preventDefault();
		//console.log("(" + e.originalEvent.changedTouches[0].pageX + ", " + e.originalEvent.changedTouches[0].pageY + ")");
		//console.log(document.elementFromPoint(e.originalEvent.changedTouches[0].pageX, e.originalEvent.changedTouches[0].pageY).id);
		if (mazeReady) {
  		move(parseInt(document.elementFromPoint(e.originalEvent.changedTouches[0].pageX, e.originalEvent.changedTouches[0].pageY).id));
  	};
	});
}

$(document).on('keydown', function(e) {
	// console.log(e.keyCode);
	if (mazeReady && [37,38,39,40].indexOf(e.keyCode) != -1) {
		key(e.keyCode);
	};
});



var key = function(k) {
	var next;
	switch (k) {
		case 37:
			// console.log('left');
			next = current - 1;
			break;
		case 38:
			// console.log('up');
			next = current - x;
			break;
		case 39:
			// console.log('right');
			next = current + 1;
			break;
		case 40:
			// console.log('down');
			next = current + x;
			break;
	}
	move(next);
}
var move = function(next) {
	if (current == 1) {
		var d = new Date();
		startTime = d.getTime();
	};
	// console.log(next);
	// console.log(arrayIndex(halls, [current,next]));
	// console.log(arrayIndex(halls, [next,current]));
	var can = (arrayIndex(halls, [current,next]) != -1 || arrayIndex(halls, [next,current]) != -1);
	// console.log(can);
	if (can) {
		
		$('#'+current).css('background-color', '#98FB98');
		$('#'+next).css('background-color', 'green');
		if (walked.indexOf(next) != -1) {
			$('#'+current).css('background-color', 'yellow');
			points++;
			$('#score').text(points);
		};
		walked.push(next);
		current = next;
		if (current == squares) {
			var d = new Date();
			endTime = d.getTime();
			end();
		};
	};
}

var end = function() {
	mazeReady = false;
	var games = new Firebase('https://maze-generator.firebaseio.com/games');
	vex.dialog.prompt({
	  message: 'You win!!! it took you only ' + ((endTime - startTime)/1000) + ' seconds and you made ' + points + ' mistake' + ((points == 1) ? '' : 's') + '<br>Woulds you like to save this to a username?' ,
	  placeholder: 'User Name',
	  callback: function(value) {
	    games.push({
			'start': startTime,
			'end': endTime,
			'time': ((endTime -startTime)/1000),
			'walls': walls,
			'halls': halls,
			'walked': walked,
			'points': points,
			'x':x,
			'y':y,
			'user': value
			});
	  }
	});
}


var find = function(a) {
	var item;
	for (var i = 0; i < maze.length; i++) {
		if (maze[i].indexOf(a) != -1) {
			item = maze[i];
		};
	};
	return item;
}
var proccess = function(numA,numB) {
	if (numA==numB) {return};
	var a = find(numA);
	var b = find(numB);
	// console.log('----');
	// console.log(numA);
	// console.log(a);
	// console.log(numB);
	// console.log(b);
	if (a === b) {
		// console.log('wall');
		walls.push([numA, numB]);
	} else {
		// console.log('hall');
		halls.push([numA, numB]);
		union(a,b);
		// console.log(a);
	};
	// console.log('----');
	return maze;	
}
var union = function(a,b) {
	if (a !== b) {
		for (var i = 0; i < b.length; i++) {
			a.push(b[i]);
		};
		maze.splice(maze.indexOf(b),1);
		//remove(numB);
	};
	return maze;	
}


function arrayIndex(a,b) {
	for (var i = 0; i < a.length; i++) {
		if (arraysEqual(a[i], b)) { return i;};
	};
	return -1;
}

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}