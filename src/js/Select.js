(function ($bui){
	var plug = $bui.Select = plugin('Select', Select);
	plug.proxyInput = true;
	plug.init = function (){
		$(document).on('click', hide);
	};

	var current = null;

	function hide(){
		if(current){
			current.removeClass('active');
			current = null;
		}
	}

	function item(title, value){
		return $('<li/>').attr('value', value).append($('<a/>').html(title));
	}

	function Select(){
		var item_list = {};
		var $this = this.addClass('form-control btn btn-default');
		var $list = $('<ul class="dropdown-menu" role="menu"/>');

		this.addOption = function (title, value){
			item_list[value] = title;
			$list.append(item(title, value));
		};
		this.find('option').each(function (){
			$this.addOption($(this).val(), $(this).text());
			$(this).remove();
		});
		$list.append(this.children()).appendTo(this);

		var $btn = $('<div class="bui-toggle"/>').prependTo($this);
		$this.$show = $('<span/>').html('请选择').appendTo($btn);
		$('<span class="caret"/>').appendTo($btn);

		$this.$input = $('<input/>').attr('type', 'hidden').val('').prependTo($this);
		$this.$input.setValue = function (v){
			if(!item_list.hasOwnProperty(v)){
				$this.$show.text('请选择');
				return '';
			}
			$this.$show.text(item_list[v]);
			return v;
		};

		// active
		$this.click(function (){
			if($this.hasClass('active')){
				hide();
			} else{
				hide();
				current = $this.addClass('active');
			}
			return false;
		});
		$list.on('click', 'li', function (){
			var v = $(this).attr('value');
			$this.$input.val(v);
			$this.$show.text($(this).text());
			hide();
			trigger_change($this, v);
			return false;
		});

	}

})($bui);
