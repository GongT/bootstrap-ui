(function ($bui){
	"use strict";

	function construct(inner, domtype, type){
		var $obj;
		switch(domtype){
		case 'submit':
			$obj = $('<input class="btn"/>').attr('type', 'submit');
			$obj._text = $obj.val;
			break;
		case 'input':
			$obj = $('<input class="btn"/>').attr('type', 'button');
			$obj._text = $obj.val;
			break;
		case 'button':
			$obj = $('<button class="btn"/>');
			$obj._text = $obj.append;
			break;
		default :
			$obj = $('<span class="btn"/>');
			$obj._text = $obj.append;
		}

		$obj.domtype = domtype;

		if(!type){
			type = 'default';
		}
		$obj.ctype = type;
		$obj.addClass('btn-' +type);
		$obj._text(inner);

		return $obj;
	}

	var props = {
		text: {
			get: function (){
				return this.empty()._text();
			},
			set: function (text){
				return this.empty()._text(text);
			}
		},
		type: {
			get: function (){
				return this.ctype;
			},
			set: function (value){
				if(this.ctype){
					this.removeClass('btn-' + this.ctype);
				}
				this.addClass('btn-' + value);
				this.ctype = value;
				return false;
			}
		}
	};

	plugin('Button', construct, null, props);
})($bui);
