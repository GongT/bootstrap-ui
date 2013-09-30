function intval(val){
	var tmp;

	var type = typeof val;

	if(type === 'boolean'){
		return +val;
	} else if(type === 'string'){
		tmp = parseFloat(val);
		return (isNaN(tmp) || !isFinite(tmp))? 0 : tmp;
	} else if(type === 'number' && isFinite(val)){
		return val|0;
	} else{
		return 0;
	}
}

function keycodefilter(plogic_and, pspecial_keys){
	var filter = [], equal = [], i = 0;
	var logic_and, special_keys = false;
	if(typeof plogic_and === 'string'){
		logic_and = !(plogic_and == 'or');
		i++;
	} else if(typeof plogic_and === 'boolean'){
		logic_and = false;
		special_keys = plogic_and;
		i++;
	}
	if(typeof pspecial_keys === 'boolean'){
		i++;
		special_keys = pspecial_keys;
	}
	var fn = null;
	var len = arguments.length
	for(; i < len; i++){
		if(typeof arguments[i] == 'function'){
			fn = arguments[i];
			continue;
		}
		if(parseInt(arguments[i]) == arguments[i]){
			equal.push(parseInt(arguments[i]));
		} else{
			filter.push(Range(arguments[i]));
		}
	}
	function testSpecial(code){
		if(code < 47){
			return true;
		}
		if(90 < code && code < 94){
			return true;
		}
		if(111 < code && code < 146){
			return true;
		}
		return false;
	}

	return function (event){
		if(event.shiftKey || event.ctrlKey || event.altKey){
			return fn?fn.apply(this, arguments):true;
		}
		if(special_keys){
			if(testSpecial(event.which)){
				return fn?fn.apply(this, arguments):true;
			}
		}
		var in_range = false;
		for(var i = equal.length - 1; i >= 0; i--){
			in_range = equal[i] === event.which;
			if(logic_and && !in_range){
				event.preventDefault();
				return;
			} else if(in_range){
				return fn?fn.apply(this, arguments):true;
			}
		}
		for(i = filter.length - 1; i >= 0; i--){
			in_range = filter[i].test(event.which);
			if(logic_and && !in_range){
				event.preventDefault();
				return;
			} else if(in_range){
				return fn?fn.apply(this, arguments):true;
			}
		}
		if(in_range){
			return fn?fn.apply(this, arguments):true;
		}
		event.preventDefault();
		return;
	}
}

function Range(range){
	var r = [-Infinity, Infinity], rr = [true, true];
	var ret = {
		test      : function (value){
			return (rr[0]? r[0] <= value : r[0] < value) && (rr[1]? r[1] >= value : r[1] > value);
		},
		fit       : function (value){
			if((rr[0]? r[0] > value : r[0] >= value)){
				return rr[0]? r[0] : r[0] + 1;
			}
			if((rr[1]? r[1] < value : r[1] <= value)){
				return rr[1]? r[1] : r[1] - 1;
			}
			return value;
		},
		toString  : function (){
			return (rr[0]? '[' : '(') + r[0] + ',' + r[1] + (rr[1]? ']' : ')');
		},
		fromString: function (str){
			try{
				if(parseFloat(str) == str){
					rr[1] = rr[0] = true;
					r[0] = r[1] = parseFloat(str);
					return ret;
				}
				if(!str){
					r[0] = -Infinity;
					r[1] = Infinity;
					return ret;
				}
				r = str.split(',');

				rr[0] = r[0].substr(0, 1) == '[';
				rr[1] = r[1].substr(-1) == ']';
				r[0] = r[0].substr(1);
				r[1] = r[1].substr(0, r[1].length - 1);
				r[0] = r[0].length? intval(r[0]) : -Infinity;
				r[1] = r[1].length? intval(r[1]) : Infinity;

				return ret;
			} catch(e){
				throw new Error('范围错误：' + str);
			}
		}
	};
	Object.defineProperty(ret, 'min', {
		get: function (){
			return r[0];
		},
		set: function (value){
			return r[0] = value;
		}
	});
	Object.defineProperty(ret, 'max', {
		get: function (){
			return r[1];
		},
		set: function (value){
			return r[1] = value;
		}
	});
	Object.defineProperty(ret, 'left', {
		get: function (){
			return rr[0];
		},
		set: function (value){
			return rr[0] = value;
		}
	});
	Object.defineProperty(ret, 'right', {
		get: function (){
			return rr[1];
		},
		set: function (value){
			return rr[1] = !!value;
		}
	});
	range = $.trim(range);

	if(range.length){
		return ret.fromString(range);
	} else{
		return ret;
	}
}

function bui_bool(value){
	if(typeof value == 'string'){
		value = value.toLowerCase();
		value = (value == 'on' ) || (value == 'yes');
	}
	if(typeof value != 'boolean'){
		value = !!value;
	}
	return value;
}

function onmousedown($obj, down, up){
	function set(e){
		return down.call($obj, e);
	}

	$obj.on('mousedown', set);
	function clear(e){
		var ret = up.call($obj, e);
		$obj.off('mousedown', set);
		$(document).off('mouseup', clear);
		return ret;
	}

	$(document).on('mouseup', clear);
}

function mouse_button(expect, fn){
	if(typeof expect == 'string'){
		expect = expect.toLowerCase();
		if(expect == 'left'){
			expect = 1;
		} else if(expect == 'right'){
			expect = 3;
		} else if(expect == 'middle'){
			expect = 2;
		}
	}
	if(typeof expect === 'function'){
		fn = expect;
		expect = 1;
	}
	return function (e){
		if(e.which !== expect){
			return;
		}
		fn.apply(this, arguments);
	}
}
