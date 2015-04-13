function Object(id, ref, coordinates, type) {
	this.id = id;
	this.ref = ref;
	this.coordinates = coordinates;
	this.type = type;
	
	this.getId = function() {
		return this.id;
	}
	
	this.getRef = function() {
		return this.ref;
	}
	
	this.getCoordinates = function() {
		return this.coordinates;
	}
	
	this.getType = function() {
		return this.type;
	}
	
	this.setCoordinates = function(coordinates) {
		this.coordinates = coordinates;
	}
}