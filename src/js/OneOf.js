(function ($bui){
	"use strict";
	var OneOf = $bui.OneOf = plugin('OneOf', construct);

	function construct(){
		var $this = this;
		var items = [];
		var name_list = [];
		var current = -1;

		function doSelect(name){
			if(!name){
				return;
			}
			var new_index = name_list.indexOf(name);
			if(current === new_index){
				return;
			}
			var new_item = items[new_index];
			trigger_change($this, new_index, name, new_item);

			new_item._item.attr('name', name);
			new_item.addClass('active');

			if(current != -1){
				items[current]._item.attr('name', '');
				items[current].removeClass('active');
			}

			current = new_index;
		}

		this.addItem = function (buiItem){
			var name = buiItem.attr('name');
			if(!name){
				throw new Error('bui.OneOf.addItem 参数必须是其他bui object，或者有name属性的元素');
			}
			buiItem.attr('name', '');
			buiItem.attr('tabindex', '-1');
			
			var $div = $('<div class="line"/>');
			var ico = (new $bui.Icon('unchecked')).addClass('one_state');
			$('<div class="icon"/>').append(ico).appendTo($div);
			$('<div class="control"/>').append(buiItem).appendTo($div);
			$div._item = buiItem;
			$div.appendTo(this);

			items.push($div);
			name_list.push(name);
			if(current == -1){
				doSelect(name);
			}
			$div.on('click', function (){
				doSelect(name);
			});
			buiItem.on('change', function (){
				doSelect(name);
			});
			return this;
		};
		this.focus(function (){
			items[current].focus();
		});
	}
})($bui);
