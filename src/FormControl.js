(function ($bui){
	"use strict";
	var allow_type = /^warning|success|error$/i;
	var FormControl = $bui.FormControl = plugin('FormControl', construct);
	FormControl.proxyInput = true;

	function parseNewElement($item){
		var type = $item.data('bui');
		if(type == 'button'){
		} else if(type == 'icon'){
			$item = $('<span class="bui-icon-outer"/>').append($item);
		} else if($item.filter('input:not(:button,:submit)').length){
			$item.addClass('form-control')
		} else if($item.filter('span,a').length){
			$item.addClass('bui-icon-outer')
		}
		return $item;
	}

	function construct(){
		var $this = this;
		$this.$input = $('<input class="form-control center-widget"/>').attr('type', 'text').appendTo($this);
		var $prepend, $append;

		$this.addClass('input-group');

		$this.centerWidget = function (newvalue){
			if(arguments.length == 1){
				$this.$input.removeClass('center-widget').replaceWith(newvalue.addClass('center-widget form-control'));
				$this.$input = newvalue;
			}
			return $this.$input;
		};

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

		$this.append = function ($item){
			if(!$append){
				$append = $('<div class="input-group-btn btn-group bui-append"/>');
				$.fn.append.call($this, $append);
			}
			$item = parseNewElement($item);
			$item.appendTo($append);
			return $item;
		};

		$this.prepend = function ($item){
			if(!$prepend){
				$prepend = $('<div class="input-group-btn bui-prepend"/>');
				$.fn.prepend.call($this, $prepend);
			}
			$item = parseNewElement($item);
			return $item.prependTo($prepend);
		};
	}
})($bui);
