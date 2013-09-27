(function ($bui){
	"use strict";
	var Checkbox = $bui.Checkbox = plugin('Checkbox', construct);
	Checkbox.proxyInput = true;
	Checkbox.hook('attr', 'label', 'set', function (v){
		this.$text.text(v);
	});
	Checkbox.hook('attr', 'label', 'get', function (){
		return this.$text.text();
	});

	function construct(label){
		var $label = $('<label>').appendTo(this);
		$('<span class="checkbox-show">').appendTo($label);
		this.$input = $('<input/>').val('false').attr('type', 'hidden').appendTo($label);
		this.$text = $('<span/>').appendTo($label);
		this.addClass('checkbox');

		var checked = false;
		this.$input.set = function (v){
			checked = bui_bool(v);
			$this[(checked? 'add' : 'remove') + 'Class']('on');
			return checked?'true':'false';
		};
		this.$input.get = function (){
			return checked;
		};

		var $this = this;
		this.click(function (){
			$this.val(!checked);
			return false;
		});

		if(label){
			this.attr('label', label);
		}
	}
})($bui);
