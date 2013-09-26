(function ($bui){
	"use strict";
	var Button = $bui.Button = plugin('Button', construct);

	Button.hook('attr', 'text', 'get', function (){
		this._text();
		return false;
	});
	Button.hook('attr', 'text', 'set', function (text){
		this._text(text);
	});
	Button.hook('attr', 'type', 'get', function (){
		return this.ctype;
	});
	Button.hook('attr', 'type', 'set', function (value){
		if(this.ctype){
			this.self.removeClass('btn-' + this.ctype);
		}
		this.self.addClass('btn-' + value);
		this.ctype = value;
	});

	function construct(inner, domtype, type){
		var that = this;
		var input;
		switch(domtype){
		case 'submit':
			input = $('<input class="btn"/>').attr('type', 'submit');
			break;
		case 'input':
			input = $('<input class="btn"/>').attr('type', 'button');
			break;
		case 'button':
			that = $('<button class="btn"/>').appendTo(this);
			this._text = function (item){
				input.val(item);
			};
			break;
		default :
			this.addClass('btn');
		}
		if(input){
			this.append(input);
			this.self =input;
			this._text = function (item){
				if(item === undefined){
					input.val();
				} else{
					input.val(item);
				}
			};
		}else{
			this.self =that;
			this._text = function (item){
				if(item === undefined){
					return that.text();
				} else{
					return that.empty().append(item);
				}
			};
		}

		if(!type){
			type = 'default';
		}
		this.attr({
			type        : type,
			text        : inner,
			'data-style': domtype
		});
	}
})($bui);
