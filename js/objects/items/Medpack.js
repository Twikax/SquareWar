function Medpack(id) {
	this.id = id;
	this.healthAmount = 50;
	
	this.getId = function() {
		return this.id;
	}
	
	this.getHealthAmount = function() {
		return this.healthAmount;
	}
}