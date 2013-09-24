(function ($bui){
	"use strict";

	var construct=function(){
		
		if(arguments.length>0){
			var args=Array.prototype.slice.call(arguments) ;
				var args1=args.shift();
				this._id=args1.id;
				this.label=args1.label;
				this.checked=args1.checked;
				this.name=args1.name;
			init.call(this);
		}
		function init(){
			 var $input=$('<input type="checkbox" '+(this.checked ? 'checked' : '')+' name="'+this.name+'" class="bui-checkbox" id="'+this._id+'" style="display:none">');
			
			 var c=this.checked ? ' label-primary' : '';
	var s='<label for="'+this._id+'" class="label bui-checkbox-con'+c+'"></label>';
			 var label= '<label for="'+this._id+'" class="checkbox-label inline">'+this.label+'</label>';
			        	
	$input.appendTo(this);
	this.append(s+label);

	$input.on('change',function(){
		var $this=$(this);
		if(this.checked){
		$this.next().addClass('label-primary');	
		}else{
			$this.next().removeClass('label-primary');	
		}
	});
		};
		
	};


	function setValue(value){

	}

	plugin('Checkbox', construct, setValue);
})($bui);