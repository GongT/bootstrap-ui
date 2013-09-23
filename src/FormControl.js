(function ($bui){
	"use strict";
	var allow_type = /^warning|success|error$/i;
	function construct(obj){
		var $this = obj? obj : this;
		var input = $('<input type="hidden"/>');

		$this.append(input);
		$this.$input = input;
		Object.defineProperty($this, 'value', {
			get: function (){
				return input.val();
			},
			set: function (value){
				return input.val(value);
			}
		});

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
			var addon = $('<span/>');
			if($item.filter('input:submit,input:button,.btn').length){
				addon.addClass('input-group-btn');
			} else{
				addon.addClass('input-group-addon');
			}
			return addon.append($item).appendTo($this);
		};

		$this.prependItem = function ($item){
			var addon = $('<span/>');
			if($item.filter('input:submit,input:button,.btn').length){
				addon.addClass('input-group-btn');
			} else{
				addon.addClass('input-group-addon');
			}
			addon.append($item).prependTo($this);
			return addon;
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
