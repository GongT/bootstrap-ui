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
		if(props){
			$obj.prop = function (name, value){
				if(value){
					value = props[name].call($obj, value);
				}
				return jQuery.access($obj, jQuery.prop, name, value, arguments.length > 1);
			};
		}

		$obj.appendItem = function ($item){
			var addon = $('<span/>');
			if($item.filter('input:submit,input:button,.btn').length){
				addon.addClass('input-group-btn');
			} else{
				addon.addClass('input-group-addon');
			}
			return addon.append($item).appendTo($obj);
		};

		$obj.prependItem = function ($item){
			var addon = $('<span/>');
			if($item.filter('input:submit,input:button,.btn').length){
				addon.addClass('input-group-btn');
			} else{
				addon.addClass('input-group-addon');
			}
			addon.append($item).prependTo($obj);
			return addon;
		};

		return $obj;
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

$.attrHooks[ 'name' ] = {
	set: function (elem, value){
		if(elem.type.substr(0, 4) === 'bui.'){
			//console.log('set(custom)  #' + dom.id+'['+dom.type+']', value);
			return $(elem).data('__bui__').$input.attr('name', value);
		}
		//elem.setAttribute( 'name', value + "" );
		//console.log('set(default)  #' + elem.id+'['+elem.type+'] = ', value);
	},
	get: function (elem){
		if(elem.type.substr(0, 4) === 'bui.'){
			//console.log('get(custom)  #' + dom.id+'['+dom.type+']');
			return $(elem).data('__bui__').$input.attr('name');
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
				return $.fn.attr.call($obj, name, value);
			}
		}
	}
}

module.exports[module.name] = $bui;

