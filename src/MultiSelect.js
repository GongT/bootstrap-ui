(function ($bui){
	"use strict";

	var construct = function (){
		this.init = function (){
			var _ms = '<ul multiple class="bui-select list-group">';
			var ms_ = '</ul>';
			var ss = '<select multiple name="' + this.name + '[]" style="display:none;">';
			var se = '</select>';
			var options = '', lis = '';
			for(var i = 0; i < this.options.length; i++){
				options += ' <option value="' + this.options[i][1] + '">' + this.options[i][0] + '</option>';
				lis += ' <li class="btn  list-group-item bui-select-option">' + this.options[i][0] + '</li>';
			}

			this.$list = $(_ms + lis + ms_);
			this.$select = $(ss + options + se);
			this.append(this.$list);
		};
		this.addItem = function (n, v){
			var arr = new Array(n, v);
			this.options.push(arr);
			if(this.$list){
				this.$select.append(' <option value="' + v + '">' + n + '</option>');
				this.$list.append(' <li class="btn  list-group-item bui-select-option">' + n + '</li>');
			} else{
				this.init();
			}
		};
		/*this.adjustSize=function(){
		 $select.css({height:this.lines*this.$r.find('li').get(0).clientHeight});
		 };*/
		this.$list = {};
		this.$select = {};
		this.options = [];
		if(arguments.length > 0){
			var args = Array.prototype.slice.call(arguments);
			var args1 = args.shift();
			this.name = args1.name;
			this.lines = args1.lines;
			for(var i = 0; i < args1.options.length; i++){
				this.options.push(args1.options[i]);
			}
			this.init();
		}
	};

	function setValue(value){

	}

	plugin('MultiSelect', construct, setValue);
})($bui);
