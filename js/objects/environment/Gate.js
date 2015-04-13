function Gate(id, pair, color) {
	this.id = id;
	this.pair = pair;
	this.color = color;
	
	this.getId = function() {
		return this.id;
	}
	
	this.getPair = function() {
		return this.pair;
	}
	
	this.getColor = function() {
		return this.color;
	}
	
	this.setPair = function(gate) {
		this.pair = gate;
	}
}