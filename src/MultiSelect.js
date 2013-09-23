(function ($bui){
	"use strict";

	var construct=function(){
		var _self=this;
		this.$list={},this.$select={};
		this.options=[];
		if(arguments.length>0){
			var args=Array.prototype.slice.call(arguments) ;
				var args1=args.shift();
				this.name=args1.name;
				this.lines=args1.lines;
				for (var i = 0; i < args1.options.length; i++) {
					this.options.push(args1.options[i]);
				};	
			init.call(this);
		}
		function init(){
			var _ms='<ul multiple class="bui-select list-group">';
			var ms_='</ul>';
			var ss='<select multiple name="'+this.name+'[]" style="display:none;">';
			var se='</select>';
			var options='',lis='';
			for (var i = 0; i < this.options.length; i++) {
				options+=' <option value="'+this.options[i][1]+'">'+this.options[i][0]+'</option>';
				lis+=' <li class="btn  list-group-item bui-select-option">'+this.options[i][0]+'</li>';
			};
		
			_self.$list=$(_ms+lis+ms_).appendTo(_self);
			_self.$select=$(ss+options+se).appendTo(_self);
			
		};
		this.addItem=function(n,v){
			var arr=new Array(n,v);
			this.options.push(arr);
			if(!this.$list){
				this.init();
			}else{
				this.$select.append(' <option value="'+v+'">'+n+'</option>');
				this.$list.append(' <li class="btn  list-group-item bui-select-option">'+n+'</li>');
			}
		};
		this.adjustSize=function(){
			$select.css({height:this.lines*$r.find('li').get(0).clientHeight});
		};
		
	};


	function setValue(value){

	}

	plugin('MultiSelect', construct, setValue);
})($bui);
