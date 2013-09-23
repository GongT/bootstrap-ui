(function ($bui){
	"use strict";
 
	var construct=function(h){
			var $this=this;
			$this.append('<div class="bui-switcher" data-state="off"><span class="bui-switcher-blue"></span><i class="btn btn-default bui-switcher-btn"></i> </div>');
	// var h=$this.height();
	var $switcher=$this.find('.bui-switcher');
	$switcher.css({borderRadius:h/2});
	var $clip=$switcher.find('.bui-switcher-blue');
	var $btn=$switcher.find('.bui-switcher-btn');
	
	$btn.width(h);
	var $b=$this.find('.bui-switcher-blue');
	$b.css({borderRadius:h/2});

	this.adjustSize=function(){
		var r=$switcher.offset().left+$switcher.width()-$btn.width();
	$switcher.on('click',function(){

	if($switcher.data('state')=='on'){
		$switcher.data('state','off');
		// $(this).attr('data-state','off');
		$clip.animate({right:'100%'},500);
		$b.animate({right:'100%'},500);
		var x=$switcher.width()-$btn.width();
		
		$btn.css({left:'auto'}).animate({right:x},500);
	}else{
		$switcher.data('state','on');
		// $(this).attr('data-state','on');
		$clip.animate({right:0},500);
		$b.animate({right:0},500);
		
		$btn.css({left:'auto',right:r}).animate({right:0},500);
	}
	
	});
	}
		
	};


	function setValue(value){

	}

	plugin('Switch', construct, setValue);
})($bui);
