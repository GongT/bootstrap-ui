(function ($bui){
	"use strict";
	var Progress = $bui.Progress = plugin('Progress', ProgressConstructor);
	Progress.hook('attr', 'progress', 'set', function (progress){
		this._barlist[0].val(progress);
		return this;
	});
	Progress.hook('attr', 'progress', 'get', function (){
		return this._barlist[0].val();
	});
	Progress.hook('attr', 'striped', 'set', function (striped){
		this[striped? 'addClass' : 'removeClass']('progress-striped');
	});
	Progress.hook('attr', 'striped', 'get', function (){
		return this.hasClass('progress-striped');
	});
	Progress.hook('attr', 'active', 'set', function (active){
		this[active? 'addClass' : 'removeClass']('active');
	});
	Progress.hook('attr', 'active', 'get', function (){
		return this.hasClass('active');
	});

	function ProgressConstructor(empty){
		this.addClass('progress');
		var _barlist = this._barlist = [];
		this.addBar = function (alert, value){
			var bar = new ProgressValue();
			if(alert){
				bar.alert(alert);
			}
			if(value){
				bar.alert(value);
			}
			_barlist.push(bar);
			bar.appendTo(this);
			return this;
		};
		this.getBar = function (index){
			if(index){
				return _barlist[index];
			}else{
				return _barlist[0];
			}
		};
		this.removeBar = function (index){
			_barlist.splice(index, 1);
			return this;
		};
		if(!empty){
			this.addBar('', 0);
		}
	}

	function ProgressValue(){
		var $bar = $('<div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100"/>', document);
		var $acc = $('<span class="sr-only"/>').appendTo($bar);
		var value = 0;
		$bar.val = function (v){
			if(arguments.length){
				if(v > 100){
					v = 100;
				}
				if(v < 0){
					v = 0;
				}
				value = v;
				$bar.css('width', v + '%').attr('aria-valuenow', v);
				$acc.text('已经完成百分之' + v);
			} else{
				return value;
			}
		};
		$bar.alert = function (type){
			if(this._alert_state){
				this.removeClass(this._alert_state);
				this._alert_state = '';
			}
			if(type){
				this._alert_state = 'progress-bar-' + type;
				this.addClass(this._alert_state);
			} else{
				this._alert_state = '';
			}
		};
		return $bar;
	}
})($bui);
