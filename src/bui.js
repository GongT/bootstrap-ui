var $bui = function (call, arg){
	return this[call].apply(this, Array.slice.call(arguments, 1));
};
var $ = global.jQuery;

function plugin(name, constructor, setter, props){
	var plug = $bui[name] = function (){
		var $obj = $('<div/>');
		var ret = constructor.apply($obj, arguments);
		if(ret !== undefined){
			$obj = ret;
		}
		$obj._bui_type = name.toLowerCase();

		if(!$obj.prop('type')){
			$obj.prop('type', 'bui.' + name);
		} else if($obj[0].tagName.toLowerCase() != 'div'){
			if(setter){
				$.valHooks[ $obj[0].tagName.toLowerCase()] = {
					set: setter_proxy
				};
			}
		} else{
			$obj.prop('type', 'bui.' + name);
		}
		$obj.prop('bui_id', 'bui.' + name);
		$obj.data('__bui__', $obj);
		$obj.addClass('bui bui-' + $obj._bui_type);
		if(props){
			$obj.prop = function (name, value){
				if(value){
					value = props[name].call($obj, value);
				}
				return jQuery.access($obj, jQuery.prop, name, value, arguments.length > 1);
			};
		}

		return $obj;
	};
	if(setter){
		$.valHooks[ 'bui.' + name] = {
			set: setter_proxy
		};
	}
	function setter_proxy(elem, value){
		if(!elem.bui_id || !elem.bui_id.substr(0, 4) === 'bui.'){
			return undefined;
		}
		value = setter.call($(elem).data('__bui__'), value);
		if(value === false || value === undefined){
			return value;
		}
		return elem.value = value;
	}

	return plug;
}
$bui.plugin = plugin;

$.attrHooks[ 'name' ] = {
	set: function (elem, value){
		if(elem.bui_id && elem.bui_id.substr(0, 4) === 'bui.'){
			//console.log('set(custom)  #' + dom.id+'['+dom.type+']', value);
			if($(elem).data('__bui__').$input){
				return $(elem).data('__bui__').$input.attr('name', value);
			}
		}
		//elem.setAttribute( 'name', value + "" );
		//console.log('set(default)  #' + elem.id+'['+elem.type+'] = ', value);
	},
	get: function (elem){
		if(elem.bui_id && elem.bui_id.substr(0, 4) === 'bui.'){
			//console.log('get(custom)  #' + dom.id+'['+dom.type+']');
			if($(elem).data('__bui__').$input){
				return $(elem).data('__bui__').$input.attr('name');
			}
		}
		/*var ret = jQuery.find.attr( elem, 'name' );
		 // Non-existent attributes return null, we normalize to undefined
		 ret = ret == null ?undefined :ret;
		 console.log('get(default)  #' + elem.id+'['+elem.type+'] <- ',ret);
		 return ret;*/
		return null;
	}
};

function trigger_change(ths, new_value){
	return ths.trigger('change', Array.prototype.slice.call(arguments, 1));
}

/**
 * 用 getter_setter 定义的函数代替 $.fn.attr()
 * getter_setter可以有“get”和“set”两个元素，分别是对应的函数
 * 例如
 * {
 *   get: function (){
 *       return test.val();
 *   },
 *   set: function (v){
 *      test.val(v);
 *      return this;
 *   }
 * }
 * 其中set返回值作为attr()的返回值（连贯操作的下一个this）
 * 两个函数里this都是$obj本身
 *
 * @param $obj 属性被转发的物体
 * @param attr 要转发的属性名字，可以是 name=>g_s 数组对象
 * @param getter_setter （可选）如果attr是名字，这里定义getter和setter
 */
function filter_attr($obj, attr, getter_setter){
	if(getter_setter){
		var name = attr;
		attr = {};
		attr[name] = getter_setter;
	}
	if($obj.attr !== $.fn.attr){
		$.extend($obj.attr.__list, attr);
	}
	$obj.attr = function (name, value){
		var isGet = value === undefined;
		if($obj.attr.__list[name] !== undefined && $obj.attr.__list[name][isGet? 'get' : 'set'] !== undefined){
			// 有hook的属性
			var ret;
			if(value === undefined){ // 获取
				ret = $obj.attr.__list[name].get.call($obj);
				if(ret !== undefined){
					return ret;
				}
				return $.fn.attr.call($obj, name);
			} else{ // 设置
				ret = $obj.attr.__list[name].set.call($obj, value);
				if(ret !== undefined){
					return ret;
				}
				return $.fn.attr.call($obj, name, value);
			}
		} else{
			// 没有hook(调用jq原始attr方法)
			if(value === undefined){
				return $.fn.attr.call($obj, name);
			} else{
				return $.fn.attr.call($obj, name, value);
			}
		}
	};
	$obj.attr.__list = attr;
}

/**
 * 把对象self的attr方法发给to对象
 * @param self
 * @param attr
 * @param to
 * @param chain_next 连贯操作this（默认self，true返回to对象，其他返回这个值）
 */
function send_attr_to(self, attr, to, chain_next){
	if(undefined === chain_next){
		chain_next = self;
	}
	if(chain_next === true){
		chain_next = to;
	}
	filter_attr(self, attr, {
		get: function (){
			return to.attr(attr);
		},
		set: function (v){
			to.attr(attr, v);
			return chain_next;
		}
	});
}

module.exports[module.name] = $bui;

