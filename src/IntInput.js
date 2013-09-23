(function ($bui){
	"use strict";

	function setValue(val){
		this.value = parseInt(val);
		if(this.value == val && this._range.test(this.value)){
			if(this.hasClass('has-error')){
				this.value = intval(this.val());
				this.removeClass('has-error');
				return false;
			}
			this.$show.val(this.value);
			return;
		}
		this.value = this._range.fit(this.value);
		this.$show.val(this.value);
		this.addClass('has-error');
		return this.value;
	}

	function IntInput(range){
		if(!range){
			range = '';
		}
		//初始化变量
		var $obj = $('<div/>').addClass('input-group');
		$obj.value = 0;
		$obj._range = new Range();
		$obj.prop('speed', 1);

		$obj.$show = $('<input type="text"/>').addClass('form-control text-center').appendTo($obj).on('keydown', typefilter('[0,32)', '[48,57]', '45'));
		$obj.$left = $('<span/>').addClass('input-group-addon btn').append($('<i/>').addClass('glyphicon glyphicon-arrow-left')).prependTo($obj)
		$obj.$right = $('<span/>').addClass('input-group-addon btn').append($('<i/>').addClass('glyphicon glyphicon-arrow-right')).appendTo($obj)

		$obj.$show.on('change', function (){
			if($obj.val($(this).val())){
				trigger_change($obj, $obj.value);
			}
			return false;
		});

		//自动增减
		function go(){
			if($obj.pressed){
				if($obj.pressed > 50){//最大速度
					$obj.pressed -= Math.round($obj.pressed/3);//加速度
				}
				$obj.val($obj.value + go.dir*$obj.prop('speed'));
				trigger_change($obj, $obj.value);
				setTimeout(go, $obj.pressed);
			}
		}

		//左右按钮
		$obj.$left.mousedown(function (){
			$obj.pressed = 500; //初始速度
			go.dir = -1;
			go();
			function up(){
				$obj.pressed = false;
				$(document).off('mouseup', up);
			}

			$(document).on('mouseup', up);
		});
		$obj.$right.mousedown(function (){
			$obj.pressed = 500; //初始速度
			go.dir = 1;
			go();
			function up(){
				$obj.pressed = false;
				$(document).off('mouseup', up);
			}

			$(document).on('mouseup', up);
		});

		// 滚轮调整
		$obj.on('mousewheel', function (e, delta){
			$obj.pressed = 1;
			go.dir = delta;
			go();
			$obj.pressed = false;
		});

		setRange.call($obj, range);
		$obj.removeClass('has-error');
		return $obj;
	}

	function setRange(rangeStr){
		this._range.fromString(rangeStr);
		var fitvalue = this._range.fit(this.value);
		if(this.value != fitvalue){
			this.value = fitvalue;
			this.$show.val(fitvalue);
			trigger_change(this, fitvalue);
		}
		return this._range;
	}

	var props = {};
	props.range = setRange;
	plugin('IntInput', IntInput, setValue, props);
})($bui);
