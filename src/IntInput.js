(function ($bui){
	"use strict";

	function setValue(val, internal){
		this.value = parseInt(val);
		if(this.value == val && this.max > this.value && this.min < this.value){
			if(internal){
				return true;
			}
			if(this.hasClass('has-error')){
				this.value = intval(this.val());
				this.removeClass('has-error');
				return false;
			}
			this.$show.val(this.value);
			return;
		}
		if(this.max < this.value){
			this.value = this.max - 1;
		} else if(this.min > this.value){
			this.value = this.min + 1;
		} else{
			this.value = intval(this.val());
		}
		this.$show.val(this.value);
		this.addClass('has-error');
		return this.value;
	}

	function IntInput(range){
		if(!range){
			range = '';
		}
		var $obj = $('<div/>').addClass('input-group');
		$obj.prop('speed', 1);
		setRange.call($obj, range);
		$obj.$show = $('<input type="text"/>').addClass('form-control text-center').appendTo($obj).on('keypress', only_numberic);
		$obj.$show.on('change', function (){
			if($obj.val($(this).val())){
				trigger_change($obj, $obj.value);
			}
			return false;
		});

		function go(){
			if($obj.pressed){
				if($obj.pressed > 50){
					$obj.pressed -= Math.round($obj.pressed/3);
				}
				$obj.val($obj.value + go.dir*$obj.prop('speed'));
				trigger_change($obj, $obj.value);
				setTimeout(go, $obj.pressed);
			}
		}

		$obj.$left = $('<span/>').addClass('input-group-addon btn').append($('<i/>').addClass('glyphicon glyphicon-arrow-left')).prependTo($obj).mousedown(function (){
			$obj.pressed = 500;
			go.dir = -1;
			go();
			function up(){
				$obj.pressed = false;
				$(document).off('mouseup', up);
			}

			$(document).on('mouseup', up);
		});
		$obj.$right = $('<span/>').addClass('input-group-addon btn').append($('<i/>').addClass('glyphicon glyphicon-arrow-right')).appendTo($obj).mousedown(function (){
			$obj.pressed = 500;
			go.dir = 1;
			go();
			function up(){
				$obj.pressed = false;
				$(document).off('mouseup', up);
			}

			$(document).on('mouseup', up);
		});

		$obj.on('mousewheel', function (e, delta){
			$obj.pressed = 1;
			go.dir = delta;
			go();
			$obj.pressed = false;
		});
		return $obj;
	}

	var RANGE_BOTH = /^(\d+)[~-](\d+)$/;
	var RANGE_LEFT = /^(\d+)[~-]$|^[>](\d*)$/;
	var RANGE_RIGHT = /^[~-](\d+)$|^[<](\d*)$/;

	function parseRange(range){
		if(typeof range !== 'string'){
			return range;
		}
		range = $.trim(range);
		if(RANGE_LEFT.test(range)){
			range = [range.split(/[-~>]/)[1], 0];
			return [intval(range[0]), null];
		} else if(RANGE_RIGHT.test(range)){
			range = range.split(/[-~<]/);
			return [null, intval(range[1])];
		} else if(RANGE_BOTH.test(range)){
			range = range.split(/[-~]/);
			return [intval(range[0]), intval(range[1])];
		} else{
			return [null, null];
		}
	}

	function setRange(range){
		range = parseRange(range);
		if(range[0] !== null && range[0] > this.value){
			this.value = range[0];
			this.$show.val(this.value);
			trigger_change(this, this.value);
		} else if(range[1] !== null && range[1] < this.value){
			this.value = range[0];
			this.$show.val(this.value);
			trigger_change(this, this.value);
		}
		this.min = range[0] === null? -Infinity : range[0] - 1;
		this.max = range[1] === null? Infinity : range[1] + 1;
	}

	var props = {};
	props.range = setRange;
	plugin('IntInput', IntInput, setValue, props);
})($bui);
