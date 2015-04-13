function Player(id, name, team, weapon) {
	this.id = id;
	this.name = name;
	this.team = team;
	this.weapon = weapon;
	this.health = 100;
	this.isDefended = false;
	
	this.getId = function() {
		return this.id;
	}
	
	this.getName = function() {
		return this.name;
	}
	
	this.getTeam = function() {
		return this.team;
	}
	
	this.getWeapon = function() {
		return this.weapon;
	}
	
	this.getHealth = function() {
		return this.health;
	}
	
	this.setWeapon = function(weapon) {
		this.weapon = weapon;
	}
	
	this.isAlive = function() {
		if (this.health <= 0)
			return false;
		return true;
	}
	
	this.defend = function() {
		this.isDefended = true;
	}
	
	this.attack = function(target) {
		this.isDefended = false;
		if (target.isDefended)
			target.receiveDamage(this.weapon.getPower() / 2);
		else
			target.receiveDamage(this.weapon.getPower());
	}
	
	this.receiveDamage = function(damage) {
		this.health -= damage;
	}
	
	this.receiveHealth = function(amount) {
		if (this.health+amount > 150)
			this.health = 150;
		else
			this.health += amount;
	}
}