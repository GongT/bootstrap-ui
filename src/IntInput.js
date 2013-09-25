(function ($bui){
	"use strict";

	function setValue(val){
		this.value = parseInt(val);
		if(this.value == val && this.range.test(this.value)){
			if(this.hasClass('has-error')){
				this.value = intval(this.val());
				this.removeClass('has-error');
				return false;
			}
			this.$show.val(this.value);
			return;
		}
		this.value = this.range.fit(this.value);
		this.$show.val(this.value);
		this.addClass('has-error');
		return this.value;
	}

	function IntInput(range){
		if(!range){
			range = '';
		}
		//初始化变量
		var $this = $bui.FormControl(this);
		$this.value = 0;
		$this.range = new Range();
		$this.prop('speed', 1);

		$this.$show = $('<input type="number"/>').addClass('form-control text-center').on('keydown', keycodefilter('or', '[96,105]', '[48,57]', '109', '189'));
		$this.centerWidget($this.$show);
		$this.$left = $this.prependItem($bui.Button(new $bui.Icon('arrow-left'), 'span', 'default'));
		$this.$right = $this.appendItem($bui.Button(new $bui.Icon('arrow-right'), 'span', 'default'));

		$this.$show.on('change', function (){
			if($this.val($(this).val())){
				trigger_change($this, $this.value);
			}
			return false;
		});

		//自动增减
		function go(){
			if($this.pressed){
				//console.log($this.pressed);
				if($this.pressed > 50){//最大速度
					$this.pressed -= Math.round($this.pressed/3);//加速度
				}

				$this.val(intval($this.value) + go.dir*$this.prop('speed'));
				trigger_change($this, $this.value);
				go._time=setTimeout(go, $this.pressed);
			}
		}

		//左右按钮
		$this.$left.mousedown(function (event){
			if(event.which > 2){
				return;
			}

			$this.pressed = 500; //初始速度
			go.dir = -(1 + (event.which-1)*9);
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
			go.dir = 1 + (event.which-1)*9;
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
			console.log(e,delta);
			$this.pressed = 1000;
			go.dir = delta;
			go();
			$this.pressed = false;
			return false;
		});

		Object.defineProperty($this, 'name', {
			get: function (){
				return $this.$show.attr('name');
			},
			set: function (value){
				return $this.$show.attr('name', value);
			}
		});
		if(range){
			setRange.call($this, range);
		}
		$this.alert('');

		return $this;
	}

	function setRange(rangeStr){
		this.range.fromString(rangeStr);
		var fitvalue = this.range.fit(this.value);
		if(this.value != fitvalue){
			this.value = fitvalue;
			this.$show.val(fitvalue);
			trigger_change(this, fitvalue);
		}
		return this.range;
	}

	var props = {};
	props.range = setRange;
	plugin('IntInput', IntInput, setValue, props);
})($bui);
