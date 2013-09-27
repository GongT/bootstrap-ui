(function ($bui){
	"use strict";
	var IntInput = $bui.IntInput = plugin('IntInput', IntInputConstruct);

	IntInput.hook('attr', 'range', 'get', function (){
		return this.range.toString();
	});
	IntInput.hook('attr', 'range', 'set', function (rangeStr){
		this.range.fromString(rangeStr);
		var value = this.val();
		var fitvalue = this.range.fit(value);
		if(value != fitvalue){
			this.val(fitvalue);
			trigger_change(this, fitvalue);
		}
	});
	IntInput.proxyInput = true;

	function IntInputConstruct(range){
		if(!range){
			range = '';
		}
		//初始化变量
		var last_success_value = 0;
		var $this = $bui.FormControl.call(this);
		$this.val(0);
		var r = $this.range = new Range();
		$this.prop('speed', 1);

		// 输入框和左右按钮
		var $input = $this.$input = $this.centerWidget().addClass('text-center').attr('type', 'number').on('keydown', keycodefilter('or', '[96,105]', '[48,57]', '109', '189'));
		$this.$left = $this.prepend($bui.Button(new $bui.Icon('arrow-left'), 'span', 'default'));
		$this.$right = $this.append($bui.Button(new $bui.Icon('arrow-right'), 'span', 'default'));

		$input.set = function (val){
			var value = parseInt(val);
			if(value == val && r.test(value)){
				if($this.hasClass('has-error')){
					$this.removeClass('has-error');
					return false;
				}
				last_success_value = val;
				return val;
			}
			value = r.fit(value);
			$this.addClass('has-error');
			return value + '';
		};
		$input.get = intval;

		$this.attr('range', range);
		$this.alert('');

		//自动增减
		function go(){
			if($this.pressed){
				//console.log($this.pressed);
				if($this.pressed > 50){//最大速度
					$this.pressed -= Math.round($this.pressed/3);//加速度
				}
				var v = $this.val() + go.dir*$this.prop('speed');
				$this.val(v);
				if(v==last_success_value){
					trigger_change($this, v);
				}
				go._time = setTimeout(go, $this.pressed);
			}
		}

		//左右按钮
		$this.$left.mousedown(function (event){
			if(event.which > 2){
				return;
			}

			$this.pressed = 500; //初始速度
			go.dir = -(1 + (event.which - 1)*9);
			go();
			function up(){
				clearTimeout(go._time);
				$this.pressed = false;
				$(document).off('mouseup', up);
			}

			$(document).on('mouseup', up);
		});
		$this.$right.mousedown(function (){
			if(event.which > 2){
				return;
			}

			$this.pressed = 500; //初始速度
			go.dir = 1 + (event.which - 1)*9;
			go();
			function up(){
				clearTimeout(go._time);
				$this.pressed = false;
				$(document).off('mouseup', up);
			}

			$(document).on('mouseup', up);
		});

		// 滚轮调整
		$this.on('mousewheel', function (e, delta){
			$this.pressed = 1000;
			go.dir = delta;
			go();
			$this.pressed = false;
			return false;
		});

		return $this;
	}
})($bui);
