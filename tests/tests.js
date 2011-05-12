/* tests */
module("Initialization");
test("Using the Factory _() with different Arguments", function() {	
	deepEqual(_().toArray(), [], "Empty _()");	
	deepEqual(_([1,2,3,4,5]).toArray(), [1,2,3,4,5], "Array [1,2,3,4,5]");
	deepEqual(_(1,2,3,4,5).toArray(), [1,2,3,4,5], "Multiple Arguments 1,2,3,4,5");	
	deepEqual(_("foo bar baz bam bap boo").toArray(), ["foo","bar","baz","bam","bap","boo"], "Whitespace separated string");
});
test("Array inherited functionality", function() {	
	
	var data = tools.fib();
	
	// length
	equal(data.c.length, data.a.length, "length");
	equal(data.c.size(), data.a.length, "size == length?");
	
	// indexOf
	if(Array.prototype.indexOf) {
		equal(data.c.indexOf(5), data.a.indexOf(5), "indexOf(5)");
		equal(data.c.indexOf(100), data.a.indexOf(100), "indexOf(100)");
	} else {
		ok(false, "This Browser doesn't support the native use of indexOf()");
	}
	// push and pop
	data.c.push(6); data.a.push(6);	
	deepEqual(data.c.toArray(), data.a, "push(6)");
	equal(data.c.pop(), data.a.pop(), "pop()");
	equal(_().pop(), [].pop(), "pop an empty array");
	
	// shift and unshift
	data.c.unshift(0); data.a.unshift(0);
	deepEqual(data.c.toArray(), data.a, "unshift(0)");
	equal(data.c.shift(), data.a.shift(), "shift()");
	equal(_().shift(), [].shift(), "shift an empty array");
	
	// slice	
	
	// splice
	
	// sort
	
});

module("Not Chaining Methods");
test("contains()", function() {
	
	var fib = tools.fib().c;
	var bool = tools.bool();
	
	equal(fib.contains(5), true, "fib.contains(5)");
	equal(fib.contains(1), true, "fib.contains(1)");
	equal(fib.contains(4), false, "fib.contains(4)");
	equal(bool.c_false.contains(false), true, "bool.false.contains(false)");
	equal(bool.c_false.contains(true), false, "bool.false.contains(true)");
	equal(bool.c_mixed.contains(false), true, "bool.mixed.contains(false)");
	equal(bool.c_mixed.contains(true), true, "bool.mixed.contains(true)");
	
});
test("index()", function() {
	
	var fib = tools.fib().c;
	var bool = tools.bool();
	
	equal(fib.index(5), 4, "fib.index(5)");
	equal(fib.index(1), 0, "fib.index(1)");
	equal(fib.index(4), null, "fib.index(4)");
	equal(bool.c_false.index(false), 0, "bool.false.index(false)");
	equal(bool.c_false.index(true), null, "bool.false.index(true)");
	equal(bool.c_mixed.index(false), 0, "bool.mixed.index(false)");
	equal(bool.c_mixed.index(true), 2, "bool.mixed.index(true)");
	
});
test("count()", function() {
	
	var fib = tools.fib().c;
	var bool = tools.bool();
	
	equal(fib.count(5), 1, "fib.count(5)");
	equal(fib.count(1), 2, "fib.count(1)");
	equal(fib.count(4), 0, "fib.count(4)");
	equal(bool.c_false.count(false), 4, "bool.false.count(false)");
	equal(bool.c_false.count(true), 0, "bool.false.count(true)");
	equal(bool.c_mixed.count(false), 3, "bool.mixed.count(false)");
	equal(bool.c_mixed.count(true), 3, "bool.mixed.count(true)");
	
});
test("toArray()", function() {

	var rand = tools.rand(25);
	var multi = tools.multi();	
	
	deepEqual(rand.c.toArray(), rand.a, "Comparing random collection with native array");
	deepEqual(_().toArray(), [], "Empty collection");
	deepEqual(multi.c.toArray(), multi.a, "Empty collection");
	
});
test("item access: [], item(), valuesAt()", function() {

	var fib = tools.fib().c;
	equal(fib[5], 8, "fib[5]");
	equal(fib.item(5), fib[5], "fib.item(5)");
	equal(fib[18], undefined, "fib[18]");
	equal(fib.item(18), fib[18], "fib.item(18)");
	equal(fib[0], 1, "fib[0]");
	equal(fib.first(), 1, "fib.first()");	
	equal(fib.last(), 89, "fib.last()");
	
	var foo = _([0,1,2]);
	
	foo.push(98);
	equal(foo[3], 98, "Attached elements using push...");
	equal(foo.length, 4, "...length should have changed");
	
	foo[4] = 99;
	equal(foo[4], 99, "Attached elements using index-access...");
	equal(foo.length, 5, "...length should have changed");

	foo.push(100);
	equal(foo[5], 100, "Attached elements using push again...");
	equal(foo.length, 6, "...length should have changed");
	
	deepEqual(fib.valuesAt(0,3,7,99).toArray(), [1,3,21,undefined], "fib.valuesAt(0,3,7,99)");
});
test("isEmpty()", function() {
	var rand = tools.rand(15);
	equal(rand.c.isEmpty(), false, "isEmpty on random Array with 15 elements.");
	equal(_().isEmpty(), true, "isEmpty on _()");
	equal(_([]).isEmpty(), true, "isEmpty on _([])");
});
test("toString()", function() {
	var fib = tools.fib();
	equal(fib.c.toString(), "_[1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]", "toString of fibonacci");
	equal(_().toString(), "_[]", "toString of empty collection");
});

// Methods, that can be chained together, but are not changing the content of the original Collection
module("Chaining Methods");
test("iteration with each()", function(){
	var objects = tools.objects();
	var result = [];
	_(objects).each(function(i,el) {
		result.push({
			id: i,
			name: el.name,
			age: this.age
		});	
	});
	deepEqual(result, objects, "rebuild objects using each-iterator and accessed i,el and this");
	
	// performance testing of each
	var large = tools.rand(60000);
	var x = 0;
	var start = new Date();
	for(var i = 0; i < large.a.length; i++) {
			x = large.a[i];
	}
	ok(true, "60,000 iterations with native for() took "+ (new Date() - start) +"ms");
	
	
	var start = new Date(), i = 0;
	while(i < large.a.length) {
			x = large.a[i++];
	}
	ok(true, "60,000 iterations with native while() took "+ (new Date() - start) +"ms");
	
			
	var start = new Date();
	large.c.each(function(i,el) {
		x = this;
	});
	ok(true, "60,000 iterations with arrayjs.each and this took "+ (new Date() - start) +"ms");
	
	var start = new Date();
	large.c.each(function(i,el) {
		x = el;
	});
	ok(true, "60,000 iterations with arrayjs.each and el took "+ (new Date() - start) +"ms");
	
});
test("collect()", function(){
	var objects = _(tools.objects());
	var expected = [35,42,31,27];
	var result = objects.collect(function(i,el) {
		return this.age;
	}).toArray();
	deepEqual(result, expected, "Only collecting one attribute.");
	deepEqual(objects.toArray(), tools.objects(), "collection should not have changed");
	
	var result = objects.collect$(function(i,el) {
		return this.age;
	}).toArray();
	deepEqual(result, expected, "$ Only collecting one attribute.");
	deepEqual(objects.toArray(), expected, "$ collection should have changed");
});
test("map()", function() {
	var foo = _();
	equal(foo.map, foo.collect, "Map is the same as collect");
	equal(foo.map$, foo.collect$, "$ Map is the same as collect");
});
test("filter()", function() {
	
	var filter = function(i,el) {
		return this > 5 && el > 5 && this == el;
	};	
	
	var fib = tools.fib().c;	
	var filtered = fib.filter(filter).toArray();
	deepEqual(filtered, [8,13,21,34,55,89], "Filtered > 5");
	deepEqual(fib, tools.fib().c, "collection should stay unchanged");
	
	var fib = tools.fib().c;
	var filtered$ = fib.filter$(filter).toArray();
	deepEqual(filtered$, [8,13,21,34,55,89], "$ Filtered > 5");
	deepEqual(fib.toArray(), [8,13,21,34,55,89] , "$ collection should save changes");
	equal(fib.length, 6, "$ length should change also");

});
test("reject()", function() {
	
	var filter = function(i,el) {
		return this > 5 && el > 5 && this == el;
	};	
	
	var fib = tools.fib().c;	
	var filtered = fib.reject(filter).toArray();
	deepEqual(filtered, [1,1,2,3,5], "Reject > 5");
	deepEqual(fib, tools.fib().c, "collection should stay unchanged");
	
	var fib = tools.fib().c;
	var filtered$ = fib.reject$(filter).toArray();
	deepEqual(filtered$, [1,1,2,3,5], "$ Reject > 5");
	deepEqual(fib.toArray(), [1,1,2,3,5] , "$ collection should save changes");
	equal(fib.length, 5, "$ length should change also");

});
test("replace()", function() {
		
	var fib = tools.fib().c;		
	var replaced = fib.replace(1,99).toArray();
	var expected = [99,99,2,3,5,8,13,21,34,55,89];
	deepEqual(replaced, expected, "Reject > 5");
	deepEqual(fib, tools.fib().c, "collection should stay unchanged");
	
	var fib = tools.fib().c;	
	var replaced = fib.replace$(1,99).toArray();
	deepEqual(replaced, expected, "$ Reject > 5");
	deepEqual(fib.toArray(), expected, "$ collection should have changed, too");

});
test("compact()", function(){
	
	var arr = [null, undefined, null, "foo", "bar", 3, 4 ,8, true, false, 8, undefined, null, 4, null];

	var expected = ["foo", "bar", 3, 4, 8, true, false, 8, 4];
	var foo = _(arr);
	deepEqual(foo.compact().toArray(), expected, "Using compact to remove null and undefined values");
	deepEqual(foo.toArray(), arr, "Foo itself should stay unchanged");
	
	deepEqual(foo.compact$().toArray(), expected, "$ Using compact to remove null and undefined values");
	deepEqual(foo.toArray(), expected, "$ Foo itself should change it's content");	
	
});
test("insert()", function() {
	
	var fib = tools.fib().c;
	var expected = [1,99,98,97,1,2,3,5,8,13,21,34,55,89];
	deepEqual(fib.insert(1,99,98,97).toArray(),expected,"Inserting 99,98,97 at Position 1");
	deepEqual(fib.toArray(),tools.fib().a,"Only copy should be influenced");

	deepEqual(fib.insert$(1,99,98,97).toArray(),expected,"$ Inserting 99,98,97 at Position 1");
	deepEqual(fib.toArray(),expected, "$ Collection should have changed, too");
});
test("remove()", function() {
	var fib = tools.fib().c;
	var expected = [2,3,5,8,13,34,55,89];
	var result = fib.remove(1).remove(21).remove(99).toArray();
	deepEqual(result, expected, "Removed 1, 21 and non existing 99 from fibonacci");
	deepEqual(fib.toArray(),tools.fib().a,"Only copy should be influenced");
	
	var result = fib.remove$(1).remove$(21).remove(99).toArray();
	deepEqual(result, expected, "$ Removed 1, 21 and non existing 99 from fibonacci");
	deepEqual(fib.toArray(),expected,"$ Collection should have changed, too");
});
test("deleteAt()", function() {
	var fib = tools.fib().c;
	var expected = [1,2,3,5,8,13,34,55,89];
	var result = fib.deleteAt(0).deleteAt(6).deleteAt(99).toArray();
	deepEqual(result, expected, "Removed 1, 21 and non existing 99 from fibonacci");
	deepEqual(fib.toArray(),tools.fib().a,"Only copy should be influenced");
	
	var result = fib.deleteAt$(0).deleteAt$(6).deleteAt$(99).toArray();
	deepEqual(result, expected, "$ Removed 1, 21 and non existing 99 from fibonacci");
	deepEqual(fib.toArray(),expected,"$ Collection should have changed, too");
});
test("removeAt()", function() {
	var foo = _();
	equal(foo.removeAt, foo.deleteAt, "removeAt is the same as deleteAt");
	equal(foo.removeAt$, foo.deleteAt$, "$ removeAt is the same as deleteAt");
});
test("uniq() / fastuniq()", function() {
	var arr = [1,2,5,8,10,10,10,1,10,6,2,2,3,4,3,9,7];	
	var expected = [1,2,5,8,10,6,3,4,9,7];
	
	// uniq	
	var foo = _(arr);	
	var result = foo.uniq().toArray();	
	deepEqual(result, expected, "uniq() with 17/10 Elements without sorting")
	deepEqual(foo.toArray(),arr,"Only copy should be influenced");
	
	var result = foo.uniq$().toArray();
	deepEqual(result, expected, "$ uniq() with 17/10 Elements without sorting")
	deepEqual(foo.toArray(),expected,"$ Collection should have changed, too");
	
	// fastuniq
	var foo = _(arr);
	var expected = [1,10,2,3,4,5,6,7,8,9];
	var result = foo.fastUniq().toArray();
	deepEqual(result, expected, "fastUniq() with 17/10 Elements with sorting")
	deepEqual(foo.toArray(),arr,"Only copy should be influenced");
	
	var result = foo.fastUniq$().toArray();
	deepEqual(result, expected, "$ fastUniq() with 17/10 Elements with sorting")
	deepEqual(foo.toArray(),expected,"$ Collection should have changed, too");
	
	// IE needs new Date() instead of Date.now();
	
	// performancetest uniq
	var large = tools.rand(10000).c;
	var start = new Date();
	var reduced = large.uniq().length;
	var time = new Date() - start;
	ok(true, "uniq() with 10000/"+reduced + " in "+time+"ms");
	
	// performancetest uniq$	
	var start = new Date();
	var reduced = large.copy().uniq$().length;
	var time = new Date() - start;
	ok(true, "$ uniq() with 10000/"+reduced + " in "+time+"ms");
	
	// performancetest fastUniq
	var start = new Date();
	var reduced = large.fastUniq().length;
	var time = new Date() - start;
	ok(true, "fastUniq() with 10000/"+reduced + " in "+time+"ms");
	
	
	// performancetest fastUniq$
	var start = new Date();
	var reduced = large.copy().fastUniq$().length;
	var time = new Date() - start;
	ok(true, "$ fastUniq() with 10000/"+reduced + " in "+time+"ms");
	
});

// TODO insert()
// TODO concat/cat()
// TODO reverse()
// TODO copy / clear / empty
// TODO dif/cut