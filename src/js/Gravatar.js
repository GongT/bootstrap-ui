
(function ($bui){
	var gravatar = $bui.Gravatar = plugin('Gravatar', Gravatar);
	gravatar.hook('attr', 'hash', 'set', function (hash){
		this._gravatar.hash = hash;
		this._reset();
		return hash;
	});
	gravatar.hook('attr', 'size', 'set', function (size){
		this._gravatar.size = size;
		this._reset();
		return size;
	});

	function buildUrl(data){
		var ret = 'http://www.gravatar.com/avatar/';
		ret += data.hash;
		ret += '.' + (data.type? data.type : 'png');
		ret += '?';
		ret += 'd=' + (data.default? encodeURIComponent(data.default) : 'identicon');
		ret += '&s=' + data.size;

		if(data.rating){
			ret += '&r=' + data.rating;
		}
		return ret;
	}

	gravatar.build = buildUrl;

	function Gravatar(size, hash){
		this.addClass('gravatar');
		this._gravatar = {};
		this._reset = function (){
			var href = buildUrl(this._gravatar);
			this.css({'backgroundImage': 'url(' + href + ')',
				'height'               : this._gravatar.size,
				'width'                : this._gravatar.size
			});
		};
		this.attr({size: size, hash: hash});
	}
})($bui);
