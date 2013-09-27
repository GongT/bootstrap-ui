(function ($bui){
	"use strict";
	var OneOf = $bui.OneOf = plugin('OneOf', construct);

	function construct(){
		var $this = this;
		var items = [];
		var name_list = [];
		var current = -1;

		function doSelect(name){
			//console.log('select '+name);
			//console.trace()
			if(!name){
				return;
			}
			var new_index = name_list.indexOf(name);
			if(current === new_index){
				return;
			}
			var new_item = items[new_index];
			trigger_change($this, new_index, name, new_item);

			new_item.attr('name', name);
			new_item.oprepend.css('color', '#356635').change('check').addClass('alert-success');

			if(current != -1){
				items[current].attr('name', '');
				items[current].oprepend.change('unchecked').removeClass('alert-success');
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
			var ico = new $bui.Icon('unchecked');
			buiItem.oprepend = ico;
			if(buiItem.data('bui') == 'formcontrol'){
				buiItem.prepend(ico);
			}else{
				ico.insertBefore(buiItem);
			}

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
})($bui);
