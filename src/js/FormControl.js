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
		var $center = $('<div class="center-widget"/>').appendTo($this);
		$this.$input = $('<input class="form-control"/>').attr('type', 'text').appendTo($center);
		var $prepend, $append;

		$this.addClass('input-group');

		var hidden = false;
		$this.centerWidget = function (newvalue){
			if(arguments.length == 1){
				if(hidden){
					hidden.remove();
					hidden = null;
				}
				if(newvalue.attr('type') == 'hidden'){
					hidden = $('<input class="form-control"/>').attr({
						'disabled': 'disabled',
						'type'    : 'text'
					}).val(newvalue.attr('title'));
					$this.$input.replaceWith(hidden);
					newvalue.insertAfter(hidden);
				} else{
					$this.$input.replaceWith(newvalue.addClass('form-control'));
				}
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
