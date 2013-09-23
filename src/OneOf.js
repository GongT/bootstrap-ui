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
			if(current === new_index){
				return;
			}
			//console.log('select '+name);
			var new_item = items[new_index];
			trigger_change($this, new_index, name, new_item);

			new_item.attr('name', name);
			new_item.oprepend.css('color','#356635').children().removeClass('glyphicon-unchecked').addClass('glyphicon-check');
			
			if(current != -1){
				items[current].attr('name', '');
				items[current].oprepend.css('color','').children().removeClass('glyphicon-check').addClass('glyphicon-unchecked');
			}

			current = new_index;
		}

		this.addItem = function (buiItem){
			var name = buiItem.attr('name');
			buiItem.attr('name', '');
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
			buiItem.oprepend = buiItem.prependItem($('<i class="glyphicon glyphicon-unchecked"></i>'));
			
			items.push(buiItem);
			name_list.push(name);
			if(current == -1){
				doSelect(name);
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