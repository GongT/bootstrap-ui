(function ($bui){
	"use strict";
	var InputList = $bui.InputList = plugin('InputList', construct);
	InputList.hook('attr', 'name', 'set', function (v){
		this.$list.find('input').attr('name', v + '[]');
		return v;
	});

	function item(value, title, name){
		var li = $('<li/>');
		$('<span/>').addClass('bui-label').text(title? title : value).appendTo(li);
		$('<input/>').attr({'type': 'hidden', 'name': name + '[]'}).val(value).appendTo(li);
		$('<a/>').addClass('bui-delete').appendTo(li);
		return li;
	}

	function unserilize(val, titleMap, name){
		if(val.constructor !== Array){
			throw new TypeError("$bui.InputList.val() 参数必须是数组。");
		}
		var list = [];
		var title;
		for(var i = 0, cnt = val.length; i < cnt; i++){
			if(titleMap[val[i]]){
				title = titleMap[val[i]];
			}
			list[i] = item(val[i], title, name)[0];
		}
		return $(list);
	}

	function construct(){
		var $this = this;
		var value = [];
		var titleMap = {};
		var $list = $('<ul class="list"/>').appendTo(this);
		var control = (new $bui.FormControl()).appendTo($('<div class="control"/>').appendTo(this));
		var $center = control.centerWidget($('<input/>').attr('type', 'text'));
		var addBtn = new $bui.Button(new $bui.Icon('plus'));
		this.$list = $list;
		control.append(addBtn);

		$center.on('keydown', handler);
		this.centerWidget = function (newinput){
			$center.off('keydown', handler);
			$center = control.centerWidget(newinput);
			newinput.attr('name', '');
			newinput.on('keydown', handler);
		};
		this.on('click', '.bui-delete', function (e){
			var v = $(this).prev().val();
			var i = value.indexOf(v);
			if(i > -1){
				value.splice(i, 1);
			}
			$(this).parent().remove();
			e.preventDefault();
		});

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
				value = v;
				var o = unserilize(v, titleMap, name);
				o.appendTo($list.empty());
				return this;
			}
		};

		addBtn.on('click', mouse_button('left', function (){
			var val = $center.val();
			$center.val('').focus();
			addItem(val);
		}));

		this.addVal = addItem;
		function addItem(val, title){
			if(!val){
				return false;
			}
			if(!title){
				if(titleMap[val]){
					title = titleMap[val];
				}
			}
			if($this.data('unique') && value.indexOf(val) >= 0){
				return false;
			}
			var name = $this.attr('name');
			item(val, title, name).appendTo($list);
			value.push(val);
			trigger_change($this, value);
		}

		this.mapTitle = function (map, extend){
			if(extend === undefined || extend){
				$.extend(titleMap, map);
			} else{
				titleMap = map;
			}
			return this;
		};
	}
})($bui);
