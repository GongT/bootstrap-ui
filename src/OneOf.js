(function ($bui){
	"use strict";

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
			console.log('select ' + new_index);
			if(current === new_index){
				return;
			}
			var new_item = items[new_index];
			trigger_change($this, new_index, name, new_item);

			new_item.attr('name', name);
			if(current != -1){
				items[current].attr('name', '');
			}

			current = new_index;
		}

		this.items = items;
		this.addItem = function (buiItem){
			items.push(buiItem);
			var name = buiItem.attr('name');
			name_list.push(name);
			buiItem.attr('name', '');
			if(current == -1){
				doSelect(name);
			}
			buiItem.on('click', function (){
				doSelect(name);
			});
			buiItem.on('change', function (){
				doSelect(name);
			});
			buiItem.attr('tabindex', '-1');
			if(!buiItem.parent().length){
				buiItem.appendTo(this);
			}
			return this;
		};
		this.focus(function (){
			items[current].focus();
		});
	}

	function setValue(value){

	}

	plugin('OneOf', construct, setValue);
})($bui);
