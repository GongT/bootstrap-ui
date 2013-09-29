(function ($bui){
	"use strict";
	var CheckBox = $bui.CheckBox = plugin('CheckBox', construct);
	CheckBox.proxyInput = true;
	CheckBox.hook('attr', 'label', 'set', function (v){
		this.$text.text(v);
	});
	CheckBox.hook('attr', 'label', 'get', function (){
		return this.$text.text();
	});

	function construct(label){
		var $label = $('<label>').appendTo(this);
		$('<span class="checkbox-show">').appendTo($label).html('<span class="ico"/>');
		this.$input = $('<input/>').val('false').attr('type', 'hidden').appendTo($label);
		this.$text = $('<span class="checkbox-title"/>').appendTo($label);
		this.addClass('checkbox');

		var checked = false;
		this.$input.set = function (v){
			checked = bui_bool(v);
			$this[(checked? 'add' : 'remove') + 'Class']('active');
			return checked?'true':'false';
		};
		this.$input.get = function (){
			return checked;
		};

		var $this = this;
		this.click(function (){
			$this.val(!checked);
			trigger_change($this,checked);
			return false;
		});

		if(label){
			this.attr('label', label);
		}
	}
})($bui);
