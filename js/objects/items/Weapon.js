function Weapon(id, name) {
	this.id = id;
	
	var weaponsDirectory = {
		'rifle': {power: 10},
		'superifle': {power: 25},
		'powerifle': {power: 50},
		'laser': {power: 75},
		'rocket': {power: 100}
	};
	
	if (name == 'random')
		do
		{
			var c = 0;
			for (var weapon in weaponsDirectory)
				if (Math.random() < 1/++c)
					name = weapon;
		}
		while (name == 'rifle');
	
	this.name = name;
	this.power = weaponsDirectory[name].power;
	
	this.getId = function() {
		return this.id;
	}
	
	this.getName = function() {
		return this.name;
	}
	
	this.getPower = function() {
		return this.power;
	}
}