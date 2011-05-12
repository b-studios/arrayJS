/*!
 * arrayJS JavaScript Library v0.2.1
 * http://b-studios.de
 *
 * Copyright 2010, Jonathan Brachthäuser
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://b-studios.de/licence
 *
 * Date: Sat Nov 27 18:03:45 2010 +0100
 *
 * Changes from v0.2
 * - Fixed filter method. filter$ did not work properly because of splicing
 * - added copy()
 * - fixed uniq(), ie had problems because of indexOf
 * - optimized uniq$, got chrome from 1.5s down to 11ms and IE from 15s to 362ms 
 * - fixed some IE-Issues with fastUniq
 */ 
/**
 * Factorymethod for collections.
 *		
 * @param 	{Array, String}	elements 	The elements which are used, to form the collection
 * @param 									variadic	If there are multiple arguments, every argument is 
 *																		considered to be an element of an array.
 *
 * @returns Collection
 */
var arrayjs = function(elements) {

	var applyToCopy = function(old, method) {	
		return function() {
			var copy = new Collection(old.toArray());
			method.apply(copy, arguments);
			return copy;
		}			
	}

	var Collection = function(elements) {				
		
		this.isCollection = true;	
			
		/**
		 * Implemented in Array by default:		 
		 * -push
		 * -pop
		 * -shift
		 * -unshift		 
		 * -slice
		 * -splice
		 * -sort
		 * -filter (reimplemented this one for consistency)
		 */
		/** 
		 * provide indexOf Method if it does not exist. (Internet Explorer)
		 */
		if( !Array.prototype.indexOf ) {			
			this.indexOf = function(element) {			
				for(var i = 0; i < this.length; i++) {				
					if(this[i] == element) {
						return i;
					}				
				}		
				return -1;				
			}
		}
	
		/**
		 * Iterates over all elements of this collection. Block gets element as this-context and
		 * can receive two arguments (i, el)
		 */
		this.each = function(block) {
			for(var i = 0; i < this.length; i++) {					
				block.call(this[i], i, this[i]);
			}			
			return this;			
		};
		
	  /**
	 	 * Modifies each element in existing array using the specified block
		 * <pre>
		 *	  _([1,5,6,7]).collect(function(i,el) {
		 *     return this*2;
		 *	  });
		 *
		 *   -> _(2,10,12,14)
		 * </pre>
		 */	
		this.collect$ = function(block) {
			
			var that = this;
			return this.each(function(i) {
				that[i] = block.call(that[i], i, that[i]);
			});
		}
		this.collect = applyToCopy(this, this.collect$);
		

	  /** 
		 *	Facade for this.collect and this.collect$
		 */
		this.map$ = this.collect$;
		this.map = this.collect;		
		
	  /**
	 	 * Own implementation of [].filter(), because of consistency in use:
	 	 * <pre>
	 	 *	 $([1,5,6,7]).filter(function(i,el) {
	 	 *    return this > 5;
	 	 *	 });
	 	 * </pre>
	 	 * FIXED: splice reduced the length, but each won't take notice of it.
	 	 */			
		this.filter$ = function(block) {
			for(var i = 0; i < this.length; i++) {			
				if( !block.call(this[i],i,this[i]) )
					this.splice(i--,1);
			};
			return this
		}
		this.filter = function(block) {		
			var elements = [];			
			
			this.each( function(i, el) {					
				if( block.call(el, i, el) ) 
					elements.push(el);							
			});					
			
			return new Collection(elements);				
		}

		/**
		 * Invert-filter
		 */
		this.reject$ = function(block) {
			return this.filter$(function(i, el) {
				return !block.call(this, i, el);
			});
		}
		this.reject = function(block) {
			return this.filter(function(i, el) {
				return !block.call(this, i, el);
			});
		}		
		
		/**
		 * Replaces all occurances of toReplace with otherItem
		 */
		this.replace$ = function(toReplace, otherItem) {
			var that = this;
			return this.each(function(i,el) {
				if(that[i] == toReplace)
					that[i] = otherItem;			
			});
		}
		this.replace = applyToCopy(this, this.replace$);
		
	  /**
	 	 * Removes all empty nodes (null or undefined) from Array
		 */
		this.compact$ = function() {
			return this.filter$(function(i, el) {
				return !(el == undefined || el == null);
			});
		}
		this.compact = function() {
			return this.filter(function(i, el) {
				return !(el == undefined || el == null);
			});
		}				

	  /**
		 * Removes matching elements from Array
		 * Idea: use multiple arguments to specify, which items to be removed
		 * or: use second argument for comparison function
		 */
		this.remove$ = function(element) {
			return this.filter$(function(i,el) {
				return el != element;
			});
		}
		this.remove = function(element) {		
			return this.filter(function(i,el) {
				return el != element;
			});
		}
		
		/**
		 * Deletes the element at the specified index
		 */
		this.deleteAt$ = function(index) {
			this.splice(index, 1);
			return this;
		}
		this.deleteAt = applyToCopy(this, this.deleteAt$);		
		this.removeAt$ = this.deleteAt$;
		this.removeAt = this.deleteAt;
		
		/**
		 * Removes all duplicate entries from array. Currently not very performant. Use fastUniq
		 * instead, if you are experience problems.
		 * This algorithm has O(n²)
		 */
		this.uniq$ = function() {
			var elements = arrayjs();
			
			for(var i = 0; i < this.length; i++) {				
				if(elements.indexOf(this[i]) == -1)
					elements.push(this[i]);
			}
			
			this.clear();
			Array.prototype.push.apply(this, elements.toArray());
			return this;
		}
		this.uniq = function() {
			var elements = arrayjs();
			
			for(var i = 0; i < this.length; i++) {				
				if(elements.indexOf(this[i]) == -1)
					elements.push(this[i]);
			}
			
			return elements;
		}
		
		/**
		 * returns sorted and unique array
		 * O(n*log(n) + n)
		 *
		 * The comparison-block is optional, but needed for complex objects or arrays to work
		 */
		this.fastUniq$ = function(comparison) {
			var that = this;
			// IE won't work with undefined comparison as argument, so we need
			// this if-clause. Further it does not work with this.sort - so we
			// use Array.prototype.sort
			if(comparison)
				Array.prototype.sort.call(this, comparison);
			else 
				Array.prototype.sort.call(this);
			
			for(var i = 0; i < this.length; i++) {
				if(i > 0 && that[i-1] == that[i])
					that.splice(i--,1);			
			}
			return this;				
		}
		this.fastUniq = applyToCopy(this, this.fastUniq$);
		
		/**
		 * Accepts variable argumentlength. First Argument specifies index to insert at. All following
		 * elements are inserted at this place.
		 */		
		this.insert$ = function(index) {
		
			if(arguments.length < 2) 
				throw "Please specify index and element(s) to insert."
				
			Array.prototype.splice.call(arguments, 1,0,0);
			Array.prototype.splice.apply(this, arguments);
			return this;
		}
		this.insert = applyToCopy(this, this.insert$);		
		
		/**
		 * Attaches the elements of other to the end of this collection
		 */
		this.concat$ = function(other) { 
			Array.prototype.push.apply(this, this.toArray.call(other));
			return this;
		}
		this.concat = function(other) {
			// the second argument of concat intentionally uses this.toArray, because it could be
			// a real array and therefore doesn't have the method 'toArray'
			return new Collection(Array.prototype.concat.call(this.toArray(), this.toArray.apply(other)));
		}
		this.cat$ = this.concat$;
		this.cat = this.concat;
		
	  /** 
		 * Reverse could be inherited from Array.prototype, but then the reversal would be saved
		 * to original Collection and not a new one would be returned
		 */
		this.reverse$ = function() { 
			Array.prototype.reverse.apply(this);
			return this;
		}
		this.reverse = applyToCopy(this, this.reverse$);
			
		/**
		 * Removes all items from this collection, which are contained in otherArray and therefore 
		 * creating the difference
		 */
		this.dif$ = function(otherArray) {
			var other = arrayjs(otherArray);
			for(var i = 0; i < this.length; i++) {
				if(other.contains(this[i]))
					this.splice(i--,1);
			}
			return this;
		}
		this.dif = applyToCopy(this, this.dif$);
		
		/**
		 * Returns the cut (intersection) of this array with otherArray. 
		 * To be a little more efficient it does NOT prevent duplicates. This results in O(n²) instead
		 * of O(n³)
		 */		 
		this.cut$ = function(otherArray) {			
			var other = arrayjs(otherArray);
			for(var i = 0; i < this.length; i++) {
				if(!other.contains(this[i]))
					this.splice(i--,1);
			}
			return this;
		}
		this.cut = applyToCopy(this, this.cut$);	
	
		/**
		 * ATTENTION: This method really clears THIS-collection. It should be named clear$, but that
		 * maybe a little confusing?! What do you think?
		 */
		this.clear = function() {
		// have to check this in IE!!!
		Array.prototype.splice.call(this, 0, this.length);
		return this;
		}
		this.empty = this.clear;
	
	
   //------------------------------- NOT CHAINING METHODS -----------------------------------------	
	
	 /**
		*	Finds first occurance of element and returns true if found and false if not found
		*/
		this.contains = function(element) {			
			return this.indexOf(element) == -1? false: true;	
		}	
		
		/**
		 * Get's the index of the searched element. Facade for indexOf, but returns null, if the
		 * element is not found.
		 */
		this.index = function(element) {
			var index = this.indexOf(element);
			return index == -1? null :index;			
		}
		
	  /**
		 * Counts the occurances of element in Array
		 */
		this.count = function(element) {
			return this.filter(function(i,el) {
				return element == el;
			}).length;		
		}
		
		/**
		 * Probably fastest way to convert to real Array.
		 * Should multidimentsional arrays be converted to multidimensional
		 * collections in the first place and then reconverted to multidimensional
		 * native arrays with this methods???
		 */
		this.toArray = function() {					
			return Array.prototype.slice.call(this);
		}	 
		
		/**
		 * Facade for bracket-access
		 */
		this.item = function(index) {
			return this[index];
		}
		
		/**
		 * Returns first element of this collection
		 */
		this.first = function() {
			return this[0];
		}
		
		/**
		 * Returns last element of this collection
		 */		
		this.last = function() {
			return this[this.length-1];
		}
		
		/**
		 * Returns values, which are specified at indices. Mutliple arguments are allowed. The values are returned in a new collection.
		 *
		 * for example: _(1,5,7,8,9).valuesAt(0,2,3);
		 * -> [1,7,8]
		 */
		this.valuesAt = function() {		
			var elements = new Collection();						
			for(var i = 0; i < arguments.length; i++) {
				elements.push(this[arguments[i]]);
			}
			return elements;
		}	
		
		/**
		 * Returns true or false, if this collection is empty
		 */
		this.isEmpty = function() { return this.length == 0; }
		
		/**
		 * Returns the size of this collection. Facade for this.length
		 */
		this.size = function() { return this.length; }		
		
		/**
		 * Can be used to get copy of this collection and work modifying on that,
		 * whithout influencing original collection.
		 */
		 this.copy = function() {
			return arrayjs(this);
		 }
		
		/**
		 * @returns "_[element0, element1, element 2 etc.]"
		 */
		this.toString = function() {
			return '_['+ this.join(', ') +']';
		}		
		
	 /**
		* Thanks to John Resig (jQuery):
		*
		*	 "Resetting the length to 0, then using the native Array push
		*	  is a super-fast way to populate an object with array-like 
		*	  properties."
		*/	
		this.length = 0;
		Array.prototype.push.apply( this, elements );
		
		return this;
	}
	// Now Collection looks like a real Array!
	Collection.prototype = Array.prototype;	
	
	// no arguments given
	if( elements == undefined )
		elements = [];		
		
	// It's a string
	if( elements.charAt != undefined )
	  elements = elements.split(' ');
	
	// it's already a Collectionobject
	if( elements && elements.isCollection )
		return elements;
	
	// There are multiple arguments, so tread them as array
	// fix: the first argument was an array itself...
	if(arguments.length > 1) {	
		//arguments[0] = arguments[0][0];	
		return new Collection(Array.prototype.slice.call(arguments));
	} else {
		return new Collection(elements);	
	}	
}
var _ = _ || arrayjs;
