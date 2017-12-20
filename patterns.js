var patterns = {};

patterns.glider = parsePattern(
	"0 -1\n" +
	"1 0\n" +
	"-1 1\n" +
	"0 1\n" +
	"1 1"
)



function parsePattern(pattern){
	var lines = pattern.split("\n");
	var positions = [];
	for(var l = 0; l < lines.length; l++){
		var tokens = lines[l].split(" ");
		positions.push([parseInt(tokens[0]), parseInt(tokens[1])]);
	}
	
	return positions;
}