/** Testing Tools */
var tools = {

	objects: function() {
		
		return [{
				id:0,
				name: 'Alex',
				age: 35			
			},{
				id:1,
				name: 'Peter',
				age: 42			
			},{
				id:2,
				name: 'George',
				age: 31			
			},{
				id:3,
				name: 'James',
				age: 27			
			}];	
	},

	series: function() {
	
		return {			
			a: [1,2,3,4,5,6,7],
			c: _(1,2,3,4,5,6,7)			
		}
	
	},

	fib: function() {
	
		return {			
			a: [1,1,2,3,5,8,13,21,34,55,89],
			c: _(1,1,2,3,5,8,13,21,34,55,89)			
		}
	
	},
	
	rand: function(size) {
	
		var array = [];
		
		for(var i = 0; i < size; i++) {
			array.push(Math.floor(Math.random()*100));
		}
		
		return {
			a: array,
			c: _(array)
		}
	
	},
	
	bool: function() {
		
		return {
			a_false: [false, false, false, false],
			c_false: _(false, false, false, false),
			a_mixed: [false, false, true, true, false, true],
			c_mixed: _(false, false, true, true, false, true)
			
		}
	
	},
	
	multi: function() {
	
		var array = [[0,1,2],[3,4,5],["foo", "bar", "baz"]];
		return {
		
			a: array,
			c: _(array)
		
		}
	
	},

	string: function() {
		return {
			a: ["Foo", "foo", "Bar", "bar", "BAZ"],
			c: _("Foo", "foo", "Bar", "bar", "BAZ")
		};
	}
}