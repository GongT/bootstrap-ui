var $bui = function (call, arg){
	return this[call].apply(this, Array.slice.call(arguments, 1));
};
var $ = global.jQuery;

function plugin(name, constructor, setter, props){
	$bui[name] = function (){
		var $obj = $('<div/>');
		var input = $('<input type="hidden"/>');
		$obj.append(input);
		$obj.$input = input;
		Object.defineProperty($obj, 'value', {
			get: function (){
				return input.val();
			},
			set: function (value){
				return input.val(value);
			}
		});
		constructor.apply($obj, arguments);
		$obj.prop('type', 'bui.' + name);
		$obj.data('__bui__', $obj);
		$obj.prop = function (name, value){
			if(value){
				value = props[name].call($obj, value);
			}
			return jQuery.access($obj, jQuery.prop, name, value, arguments.length > 1);
		};
		return $obj;
	};
	$.attrHooks[ 'name' ] = {
		set: function (dom, value){
			if(dom.type.substr(0, 4) === 'bui.'){
				$(dom).data('__bui__').$input.attr('name', value);
				return false;
			}
		},
		get:function(dom){
			if(dom.type.substr(0, 4) === 'bui.'){
				return $(dom).data('__bui__').$input.attr('name');
			}
		}
	};
	$.valHooks[ 'bui.' + name] = {
		set: function (dom, value){
			value = setter.call($(dom).data('__bui__'), value);
			if(value === false || value === undefined){
				return value;
			}
			return dom.value = value;
		}
	};
}
$bui.plugin = plugin;

function trigger_change(ths, new_value){
	return ths.trigger('change', [new_value]);
}

function filter_attr($obj, attr){
	if($obj.attr !== $.fn.attr){
		throw new Error('重复调用 filter_attr()');
	}
	$obj.attr = function (name, value){
		if(attr[name] === undefined){
			if(value === undefined){
				return $.fn.attr.call($obj, name);
			} else{
				return $.fn.attr.call($obj, name, value);
			}
		} else{
			var ret;
			if(value === undefined){
				ret = attr[name].get();
				if(ret !== undefined){
					return ret;
				}
				return $.fn.attr.call($obj, name);
			} else{
				ret = attr[name].set(value);
				if(ret !== undefined){
					return ret;
				}
				return $.fn.attr.call($obj, value);
			}
		}
	}
}

module.exports[module.name] = $bui;

