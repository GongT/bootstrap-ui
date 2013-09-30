(function ($bui){
	"use strict";
	var InputList = $bui.InputList = plugin('InputList', construct);
	InputList.hook('attr', 'name', 'set', function (v){
		this.$list.find('input').attr('name', v + '[]');
		return v;
	});

	function item(value, name){
		var li = $('<li/>');
		$('<span/>').addClass('bui-label').text(value).appendTo(li);
		$('<input/>').attr({'type': 'hidden', 'name': name + '[]'}).val(value).appendTo(li);
		$('<span/>').addClass('bui-delete').appendTo(li);
		return li;
	}

	function unserilize(val, name){
		if(val.constructor !== Array){
			throw new TypeError("$bui.InputList.val() 参数必须是数组。");
		}
		var list = $();
		for(var i = 0, cnt = val.length; i < cnt; i++){
			list.pushStack(item(val[i], name));
		}
		return list;
	}

	function construct(){
		var $this = this;
		var value = [];
		var $list = $('<ul class="list"/>').appendTo(this);
		var control = (new $bui.FormControl()).appendTo(this);
		var $center = control.centerWidget($('<input/>').attr('type', 'text'));
		var addBtn = new $bui.Button(new $bui.Icon('plus'));
		this.$list = $list;
		control.append(addBtn);

		$center.on('keydown', handler);
		this.centerWidget = function (newinput){
			newinput.removeAttr('name');
			$center.replaceWith(newinput);
			$center.addClass('center-widget');
			$center.off('keydown', handler);
			newinput.on('keydown', handler);
			$center = newinput;
		};

		function handler(event){
			if(event.shiftKey || event.ctrlKey || event.altKey){
				return;
			}
			if(event.which == 13){
				var val = $center.val();
				$center.val('').focus();
				addItem(val);
				return false;
			}
		}

		this.val = function (v){
			if(arguments.length == 0){
				return value;
			} else{
				var name = $this.attr('name');
				value.push(v);
				unserilize(v, name).appendTo($list.empty());
				return this;
			}
		};

		addBtn.on('click', mouse_button('left', function (){
			var val = $center.val();
			$center.val('').focus();
			addItem(val);
		}));

		function addItem(val){
			if(!val){
				return false;
			}
			if($this.data('unique') && value.indexOf(val) >= 0){
				return false;
			}
			var name = $this.attr('name');
			item(val, name).appendTo($list);
			value.push(val);
			trigger_change($this, value);
		}
	}
})($bui);
