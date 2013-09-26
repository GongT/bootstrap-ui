(function ($bui){
	"use strict";
	var Button = $bui.Button = plugin('Button', construct);

	Button.hook('attr', 'text', 'get', function (){
		return this.empty()._text();
	});
	Button.hook('attr', 'text', 'set', function (text){
		return this.empty()._text(text);
	});
	Button.hook('attr', 'type', 'get', function (){
		return this.ctype;
	});
	Button.hook('attr', 'type', 'set', function (value){
		if(this.ctype){
			this.removeClass('btn-' + this.ctype);
		}
		this.addClass('btn-' + value);
		this.ctype = value;
		return false;
	});

	function construct(inner, domtype, type){
		var that = this;
		switch(domtype){
		case 'submit':
			this.append($('<input class="btn"/>').attr('type', 'submit'));
			this._text = this.val;
			break;
		case 'input':
			this.append($('<input class="btn"/>').attr('type', 'button'));
			this._text = this.val;
			break;
		case 'button':
			this.append($('<button class="btn"/>'));
			break;
		default :
			this.addClass('btn');
		}
		if(!this._text){
			this._text = function (item){
				if(item === undefined){
					return that.text();
				} else{
					return that.empty().append(item);
				}
			};
		}

		this.domtype = domtype;

		if(!type){
			type = 'default';
		}
		this.attr({
			type: type,
			text: inner
		});
	}
})($bui);
