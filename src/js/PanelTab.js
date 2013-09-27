(function ($bui){
	"use strict";

	var construct=function(){
		init.call(this);
/*		if(arguments.length>0){
			var args=Array.prototype.slice.call(arguments) ;
				var args1=args.shift();
				this._id=args1.id;
				this.label=args1.label;
				this.checked=args1.checked;
				this.name=args1.name;
			
		}*/
		function init(){
			var $panel=$('<div class="panel panel-primary panel-tab"></div>');
			var $heading=$('<div class="panel-heading"></div>');
			var $body=$('<div class="panel-body"></div>');
			var $nav=$('<ul class="nav nav-tabs"></ul>');
  			var $tab=$('<div class="tab-content"></div>');
			var $tabPane=$(' <div class="tab-pane"></div>');
			var $footer=$('<div class="panel-footer"></div>');
			$nav.appendTo($heading);
			$tabPane.appendTo($tab);
			$tab.appendTo($body);
			$heading.appendTo($panel);
			$body.appendTo($panel);
			$footer.appendTo($panel);

			$panel.appendTo(this);

		};
		
	};


	function setValue(value){

	}

	plugin('PanelTab', construct, setValue);
})($bui);