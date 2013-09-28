var $bui = function (call, arg){
	return this[call].apply(this, Array.slice.call(arguments, 1));
};

function plugin(name, constructor){
	function BuiItemConstructor(){
		var $obj;
		if(this.__proto__ == $.fn){
			$obj = this;
		} else{
			$obj = $('<div/>');
		}

		$obj.addClass('bui' + (p.class? ' bui-' + p.class : ''));
		$obj.data('bui', name.toLowerCase());
		$obj.data('_bui', $obj);

		$obj.large=function(){
			if($obj.hasClass('bui-' + p.class+'-sm')){
				$obj.removeClass('bui-' + p.class+'-sm');
			}
			$obj.addClass('bui-' + p.class+'-lg');
			return $obj;
		};
		$obj.small=function(){
			if($obj.hasClass('bui-' + p.class+'-lg')){
				$obj.removeClass('bui-' + p.class+'-lg');
			}
			$obj.addClass('bui-' + p.class+'-sm');
			return $obj;
		};

		if(p.proxyInput){
			jquery_function_replace($obj, 'attr')('name', function (n){
				$obj.$input.attr('name', n);
			}, function (){
				return $obj.$input.attr('name');
			});
			$obj.val = function (v){
				if(arguments.length<1){//get
					v = $obj.$input.val();
					return $obj.$input.get? $obj.$input.get(v) : v;
				} else{// set
					if($obj.$input.set){
						v = $obj.$input.set(v);
						if(v === false){
							return this;
						}
					}
					$obj.$input.val(v);
					return this;
				}
			}
		}

		modify_jquery($obj);
		var fn;
		for(var type in handles){
			fn = jquery_function_replace($obj, type);
			for(var n in handles[type]){
				fn(n, handles[type][n]['set'], handles[type][n]['get']);
			}
		}
		for(type in proxis){
			$obj[type] = proxis[type];
		}

		constructor.apply($obj, arguments);
		if(p.proxyInput && !$obj.$input){
			throw new Error("目标输入域没有定义（$bui." + name + ".$input）");
		}
		return $obj;
	}

	var handles = {};
	var proxis = {};
	var p = BuiItemConstructor;

	p.class = name.toLowerCase();
	p.hook = function (type, name, gs, func){
		if(!handles[type]){
			handles[type] = {};
		}
		if(!handles[type][name]){
			handles[type][name] = {};
		}
		handles[type][name][gs] = func;
		return this;
	};
	p.proxy = function (func, cb){
		proxis[func] = cb;
		return this;
	};

	return p;
}
$bui.plugin = plugin;

function trigger_change(ths, new_value){
	return ths.trigger('change', Array.prototype.slice.call(arguments, 1));
}

/**
 * 劫持 $obj 对象的 jquery 方法，转发到自定义函数
 *
 * @param $obj 属性被转发的物体
 * @param func_name 要转发的方法名字
 *
 * $obj[func].handle(name,get,set);
 *
 * 两个函数里this都是$obj本身，而不是对应的dom对象
 * 其中set返回值用来调用原始jq方法，不返回值则原始的方法不会被调用
 * get方法返回值就是最终结果，不返回值则调用原始函数
 *
 * 例如：
 *   get: function (){
 *       return testInput.val();
 *   }
 *   set: function (v){
 *      testInput.val(v);
 *      // no return -> 不要改变this的属性
 *   }
 *
 * 只能hook双参数的东西（data,attr,css...）
 *
 */
function jquery_function_replace($obj, func_name){
	if($.fn[func_name] && !$obj[func_name]){
		if(window.JS_DEBUG){
			console.error($obj);
		}
		throw new Error(' * 参数不是jquery对象。');
	}
	if($.fn[func_name] != $obj[func_name]){
		return $obj[func_name].handle; // 已经注册过了
	}
	//console.log('replace jquery method: '+func_name);
	function processor(elem, name, value){
		var handle = '_' + name;
		var isGet = value === undefined;
		if($obj[func_name].handle[handle] !== undefined &&
		   $obj[func_name].handle[handle][isGet? 'get' : 'set'] !== undefined){
			// 有hook的属性
			if(isGet){ // 获取
				//console.log('access get : '+func_name+'('+name+','+value+')');
				value = $obj[func_name].handle[handle].get.call($obj);
				if(value !== undefined){
					return value;
				}
			} else{ // 设置
				//console.log('access set : '+func_name+'('+name+','+value+')');
				value = $obj[func_name].handle[handle].set.call($obj, value);
				if(value === undefined){
					return false;
				}
			}
		}
		// 没有hook(调用jq原始方法)
		return $.fn[func_name].apply($obj, Array.prototype.slice.call(arguments, 1));
	}

	$obj[func_name] = function (name, value){
		return jQuery.access(this, processor, name, value, false);
	};
	$obj[func_name].handle = function (name, setter, getter){
		if(typeof name === 'object'){
			for(var n in name){
				$obj[func_name].handle(n, name[n].set, name[n].get);
			}
		}
		var handle = '_' + name;
		if(!$obj[func_name].handle[handle]){
			$obj[func_name].handle[handle] = {};
		}
		if(setter){
			//console.log('create set handle: '+func_name+'('+name+')');
			$obj[func_name].handle[handle].set = setter;
		}
		if(getter){
			//console.log('create get handle: '+func_name+'('+name+')');
			$obj[func_name].handle[handle].get = getter;
		}
		return $obj[func_name].handle[handle];
	};
	return $obj[func_name].handle;
}

// 防止调用后属性消失，但是这样就不能同时appendTo多个目标了（使用0下标的那个）
function modify_jquery($obj){
	$.each({
		appendTo    : "append",
		prependTo   : "prepend",
		insertBefore: "before",
		insertAfter : "after",
		replaceAll  : "replaceWith"
	}, function (name, original){
		$obj[ name ] = function (selector){
			var target = $(selector);
			if(target.length == 0){
				return this;
			}
			$(target[0])[original](this);
			return this;
		};
	});
}

module.exports[module.name] = $bui;

