/*
* Ordering Object
* By: Trent Richardson [http://trentrichardson.com]
* Version 0.1
* Last Modified: 02/02/2011
* 
* Copyright 2011 Trent Richardson
* Dual licensed under the MIT and GPL licenses.
* http://trentrichardson.com/Impromptu/GPL-LICENSE.txt
* http://trentrichardson.com/Impromptu/MIT-LICENSE.txt
*/

(function(){

	var Ordering = this.Ordering = function(obj,sf){
	
		var keys = [], values = {};
		
		this.length = 0;
		this.sortfn = null;
			
		this.feed = function(obj){
			for(k in obj){
				if(obj.hasOwnProperty(k)){
					this.set(k, obj[k]);
				}
			}
			return this;
		};
		
		this.get = function(key){
			return values[key];
		};
		
		this.getAt = function(index){
			if(index >= this.length) return null;
			return values[key[index]];
		};

		this.indexOf = function(key){
			return keys.indexOf(key);
		};
		
		this.set = function(key, value){
			var index = keys.indexOf(key);
			if (index !== -1){
				values[key] = value;
			} else if(this.sortfn === null){
				values[key] = value;
				keys[this.length++] = key;
			} else {
				this.inject(key, value, function(pk, pv, nk, nv, t){
					return (t.sortfn.call(null, key, value, nk, nv) < 0);
				});
			}
			return this;
		};
		
		this.clone = function(){
			return new Ordering(values, this.sortfn);
		};

		this.keys = function(){
			return keys.slice(0);
		};
		
		this.erase = function(key){
			var index = keys.indexOf(key);
			if(index !== -1){
				keys.splice(index,1);
				delete values[key];
				this.length--;
			}
			return this;
		};

		this.each = function(fn, bind){
			for (var i=0, l=this.length; i < l; i++){
				if(fn.call(bind, keys[i], values[keys[i]], this) === false) break;
			}
			return this;
		};

		this.inject = function(newKey, newVal, fn, bind){
			var prevKey=null, prevVal=null, 	inserted=false, 	keyslength = this.length;

			if(values[newKey] !== undefined) return false;

			values[newKey] = newVal;
			
			for (var i=0; i<keyslength; i++){
				var currKey = keys[i], currVal = values[currKey];

				if( !inserted && fn.call(bind, prevKey, prevVal, currKey, currVal, this) ){
					keys.splice(i, 0, newKey);
					inserted=true;
				}
				
				prevKey = currKey;
				prevVal = currVal;
			}
			if(!inserted){
				keys[keyslength] = newKey;
			}
			this.length++;
			
			return this;
		};

		this.sort = function(fn, bind){
			if(fn === undefined && this.sortfn === undefined){
				keys.sort();
			}
			else {
				if(fn === undefined) 
					fn = this.sortfn;
				
				keys.sort(function(a, b){
					return fn.call(bind, a, values[a], b, values[b], this);
				});
			}
			return this;
		};

		this.filter = function(fn, bind){
			var c = this.clone();
			for (var i=0,l=this.length; i<l; i++){
				if(!fn.call(bind, keys[i], values[keys[i]], c)) c.erase(k);
			}
			return c;
		};

		this.subset = function(arr){
			var c = new Ordering();
			for (var i=0,l=this.length; i<l; i++){
				if(arr.indexOf(keys[i]) >= 0) c.set(keys[i], values[keys[i]]);
			}
			return c;
		};

		this.slice = function(start, end){
			var c = new Ordering(),
				ks = this.keys().slice(start, end);
			for (var i=0,l=ks.length; i<l; i++){
				c.set(ks[i], values[ks[i]]);
			}
			return c;
		};
		
		this.some = function(fn, bind){
			for (var i=0,l=this.length; i<l; i++){
				if(fn.call(bind, keys[i], values[keys[i]], this)) return true;
			}
			return false;
		};

		this.every = function(fn, bind){
			for (var i=0,l=this.length; i<l; i++){
				if(!fn.call(bind, keys[i], values[keys[i]], this)) return false;
			}
			return true;
		};

		this.map = function(fn, bind){
			var c = this.clone();
			for (var i=0,l=this.length; i<l; i++){
				c.set(keys[i], fn.call(bind, keys[i], values[keys[i]], c));
			}
			return c;
		};
		
		if(obj !== undefined)
			this.feed(obj);
		if(sf !== undefined)
			this.sortfn = sf;
		if(this.length > 1 && this.sortfn !== null)
			this.sort(this.sortfn);
	};
	
	if (this.Type) new Type('Ordering', Ordering);
	
})();
