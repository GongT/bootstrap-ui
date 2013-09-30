(function ($bui){
	"use strict";
	var Switch = $bui.Switch = plugin('Switch', construct);
	Switch.proxyInput = true;

	Switch.hook('attr', 'disabled', 'set', function (v){
		if(typeof v === 'string'){
			v = v.toLowerCase() == 'disabled';
		}
		if(v){
			this.$btn.addClass('disabled');
			this.addClass('disabled');
		} else{
			this.$btn.removeClass('disabled');
			this.removeClass('disabled');
		}
		this._lock = v;
		return v;
	});

	function boolval(value){
		value = bui_bool(value);
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
		this.icon = new $bui.Icon('');
		this.$input = $('<input/>').val('true').attr('type', 'hidden').appendTo(this);
		this.$input.setValue = function (value){
			value = bui_bool(value);
			$this[(value? 'add' : 'remove') + 'Class']('on');
			$this.current_status = value;
			return value? 'true' : 'false';
		};
		this.$input.getValue = function (){
			return $this.current_status;
		};

		var $switcher = $('<div/>').addClass('bui-switch-container').appendTo(this);
		var $btn = $('<span class="btn btn-default bui-switch-btn"/>').appendTo($switcher);
		var $mask = $('<div class="bui-switch-mask"/>').appendTo($switcher);
		var $clip = $('<span class="bui-switch-blue"/>');

		this.$btn = $btn;
		var dragstate = false;

		function dragHandler(e){
			if($this._lock){
				return;
			}
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
			if($this._lock){
				return;
			}
			$this.val(!$this.current_status);
			trigger_change($this, $this.current_status);
		});
	}
})($bui);
