var $bui = function (call, arg){
	return this[call].apply(this, Array.slice.call(arguments, 1));
};
var $ = global.jQuery;

function plugin(name, constructor, setter, props){
	$bui[name] = function (){
		var $obj = constructor.apply(constructor, arguments);
		$obj.prop('type', 'bui.' + name);
		$obj.data('__bui__', $obj);
		$obj.prop = function (name, value){
			if(value){
				value = props[name].call($obj, value);
			}
			return jQuery.access($obj, jQuery.prop, name, value, arguments.length > 1);
		};
		for(var prop in props){
			(function (prop){
				Object.defineProperty($obj, prop, {
					get   : function (){
						$obj.prop.call($obj, prop);
					}, set: function (value){
						$obj.prop.call($obj, prop, value);
					}
				});
			})(prop);
			prop = null;
		}
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
	}
}
$bui.plugin = plugin;

function trigger_change(ths, new_value){
	return ths.trigger('change', [new_value]);
}

module.exports[module.name] = $bui;
