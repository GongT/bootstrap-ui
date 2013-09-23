(function ($bui){
	"use strict";
	var allow_type = /^warning|success|error$/i;

	function parseNewElement($item){
		if($item._bui_type == 'button'){
		} else if($item._bui_type == 'icon'){
			$item = $('<span class="bui-icon-outer"/>').append($item);
		} else if($item.filter('input:not(:button,:submit)').length){
			$item.addClass('form-control')
		}else if($item.filter('span,a').length){
			$item.addClass('bui-icon-outer')
		}
		return $item;
	}

	function construct(obj){
		var $this = obj? obj : this;
		var input = $('<input type="hidden"/>');
		var $center = $('<input/>');
		var $prepend = $('<div class="input-group-btn bui-prepend"/>');
		var $append = $('<div class="input-group-btn btn-group bui-append"/>');

		$this.append($prepend);
		$this.append($center);
		$this.append(input);
		$this.append($append);
		$this.$input = input;
		Object.defineProperty($this, 'value', {
			get: function (){
				return input.val();
			},
			set: function (value){
				return input.val(value);
			}
		});

		$this.centerWidget = function (newvalue){
			if(arguments.length == 1){
				$center.removeClass('center-widget').replaceWith(newvalue.addClass('center-widget form-control'));
				$center = newvalue;
			}
			return $center;
		};

		$this.addClass('input-group');

		var alert = '';
		$this.alert = function (type){
			if(alert == type){
				return;
			}
			$this.removeClass('alert-' + alert);
			if(allow_type.test(type)){
				$this.addClass('alert-' + type.toLowerCase());
				alert = type;
			} else{
				alert = '';
			}
		};

		$this.appendItem = function ($item){
			$item = parseNewElement($item);
			$item.addClass('pull-left').appendTo($append);
			return $item;
		};

		$this.prependItem = function ($item){
			$item = parseNewElement($item);
			$item.prependTo($prepend);
			return $item;
		};
		if(obj){
			return $this;
		}
	}

	function setValue(value){
		return this.$input.val(value);
	}

	plugin('FormControl', construct, setValue);
})($bui);
