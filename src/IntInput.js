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
		var $this = this.addClass('input-group');
		$this.value = 0;
		$this.range = new Range();
		$this.prop('speed', 1);

		$this.$show = $('<input type="number"/>').addClass('form-control text-center').appendTo($this).on('keydown', keycodefilter('or', '[96,105]', '[48,57]', '109', '189'));
		$this.$left = $('<span/>').addClass('input-group-addon btn').append($('<i/>').addClass('glyphicon glyphicon-arrow-left')).prependTo($this);
		$this.$right = $('<span/>').addClass('input-group-addon btn').append($('<i/>').addClass('glyphicon glyphicon-arrow-right')).appendTo($this);

		$this.$show.on('change', function (){
			if($this.val($(this).val())){
				trigger_change($this, $this.value);
			}
			return false;
		});

		//自动增减
		function go(){
			if($this.pressed){
				if($this.pressed > 50){//最大速度
					$this.pressed -= Math.round($this.pressed/3);//加速度
				}

				$this.val(intval($this.value) + go.dir*$this.prop('speed'));
				trigger_change($this, $this.value);
				setTimeout(go, $this.pressed);
			}
		}

		//左右按钮
		$this.$left.mousedown(function (){
			$this.pressed = 500; //初始速度
			go.dir = -1;
			go();
			function up(){
				$this.pressed = false;
				$(document).off('mouseup', up);
			}

			$(document).on('mouseup', up);
		});
		$this.$right.mousedown(function (){
			$this.pressed = 500; //初始速度
			go.dir = 1;
			go();
			function up(){
				$this.pressed = false;
				$(document).off('mouseup', up);
			}

			$(document).on('mouseup', up);
		});

		// 滚轮调整
		$this.on('mousewheel', function (e, delta){
			$this.pressed = 1;
			go.dir = delta;
			go();
			$this.pressed = false;
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
		$this.removeClass('has-error');

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
