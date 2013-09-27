(function ($bui){
	"use strict";
	var Switch = $bui.Switch = plugin('Switch', construct);
	Switch.proxyInput = true;

	function boolval(value){
		if(typeof value == 'string'){
			value = value.toLowerCase();
			value = (value == 'on' ) || (value == 'yes');
		}
		if(typeof value != 'boolean'){
			value = !!value;
		}
		$(this)[(value? 'add' : 'remove') + 'Class']('on');
		if(value){
			this.$input.removeAttr('disabled');
		} else{
			this.$input.attr('disabled', 'disabled');
		}
		this.current_status = value;
		return false;
	}

	function construct(state){
		var $this = this;
		this.current_status = !!state;
		this.$input = $('<input/>').val('true').attr('type', 'hidden').appendTo(this);
		this.$input.set = function (value){
			if(typeof value == 'string'){
				value = value.toLowerCase();
				value = (value == 'on' ) || (value == 'yes');
			}
			if(typeof value != 'boolean'){
				value = !!value;
			}
			$this[(value? 'add' : 'remove') + 'Class']('on');
			$this.current_status = value;
			return value? 'true' : 'false';
		};
		this.$input.get = function (){
			return $this.current_status;
		};

		var $switcher = $('<div/>').addClass('bui-switch-container').appendTo(this);
		var $btn = $('<span class="btn btn-default bui-switch-btn"/>').appendTo($switcher);
		var $mask = $('<div class="bui-switch-mask"/>').appendTo($switcher);
		var $clip = $('<span class="bui-switch-blue"/>');

		var dragstate = false;

		function dragHandler(e){
			$this.addClass('drag');
			var max = $this.width();
			var start = e.pageX - parseFloat($btn.css('left'));
			var left = 0;
			$(document).on('mouseup', dropHandler);
			$(document).on('mousemove', moveHandler);
			$btn.on('mouseleave', preventToggle);
			function moveHandler(e){
				left = e.pageX - start;
				if(left <= 0 || left >= max){
					return;
				}
				$btn.css('left', e.pageX - start);
				$mask.css('left', e.pageX - start);
			}

			function dropHandler(e){
				if(($this.current_status && left < max/2) || (!$this.current_status && left > max/2)){
					$this.val(!$this.current_status);
					trigger_change($this, $this.current_status);
				}
				$btn.css('left', '');
				$mask.css('left', '');
				$this.removeClass('drag');
				$(document).off('mouseup', dropHandler);
				$btn.off('mouseleave', preventToggle);
				$(document).off('mousemove', moveHandler);
			}
		}

		function preventToggle(){
			dragstate = true;
		}

		$btn.on('mousedown', dragHandler);

		this.val(this.current_status);

		this.on('click', function (){
			if(dragstate){
				dragstate = false;
				return;
			}
			$this.val(!$this.current_status);
			trigger_change($this, $this.current_status);
		});
	}
})($bui);
