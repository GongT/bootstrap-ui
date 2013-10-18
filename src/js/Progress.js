(function ($bui){
	"use strict";

	var Progress = $bui.Progress = plugin('Progress', ProgressConstructor);
	Progress.hook('attr', 'progress', 'set', function (progress){
		this._bui_bar._setvalue(progress);
		this._progress = progress;
	});
	Progress.hook('attr', 'progress', 'get', function (){
		return this._progress;
	});

	function ProgressConstructor(){
		this.addClass('progress');
		var $bar = $('<div class="progress-bar"  role="progressbar"/>').appendTo(this);
		var $acc = $('<span class="sr-only"/>').appendTo($bar);
		$bar._setvalue = function (v){
			$bar.css('width', v + '%');
			$acc.text('已经完成百分之' + v);
		};
		this._progress = 0;
		this._bui_bar = $bar;
		var lastalert = '';
		this.alert = function (type){
			if(lastalert){
				this.removeClass(lastalert);
				lastalert = '';
			}
			if(type){
				lastalert = 'progress-bar-'+type;
				this.addClass(lastalert);
			}
		}
	}
})($bui);
