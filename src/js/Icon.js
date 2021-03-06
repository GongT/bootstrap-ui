(function ($bui){
	"use strict";
	var list = 'adjust,align-center,align-justify,align-left,align-right,arrow-down,arrow-left,arrow-right,arrow-up,asterisk,backward,ban-circle,barcode,bell,bold,book,bookmark,briefcase,bullhorn,calendar,camera,certificate,check,chevron-down,chevron-left,chevron-right,chevron-up,circle-arrow-down,circle-arrow-left,circle-arrow-right,circle-arrow-up,cloud,cloud-download,cloud-upload,cog,collapse-down,collapse-up,comment,compressed,copyright-mark,credit-card,cutlery,dashboard,download,download-alt,earphone,edit,eject,envelope,euro,exclamation-sign,expand,export,eye-close,eye-open,facetime-video,fast-backward,fast-forward,file,film,filter,fire,flag,flash,floppy-disk,floppy-open,floppy-remove,floppy-save,floppy-saved,folder-close,folder-open,font,forward,fullscreen,gbp,gift,glass,globe,hand-down,hand-left,hand-right,hand-up,hd-video,hdd,header,headphones,heart,heart-empty,home,import,inbox,indent-left,indent-right,info-sign,italic,leaf,link,list,list-alt,lock,log-in,log-out,magnet,map-marker,minus,minus-sign,move,music,new-window,off,ok,ok-circle,ok-sign,open,paperclip,pause,pencil,phone,phone-alt,picture,plane,play,play-circle,plus,plus-sign,print,pushpin,qrcode,question-sign,random,record,refresh,registration-mark,remove,remove-circle,remove-sign,repeat,resize-full,resize-horizontal,resize-small,resize-vertical,retweet,road,save,saved,screenshot,sd-video,search,send,share,share-alt,shopping-cart,signal,sort,sort-by-alphabet,sort-by-alphabet-alt,sort-by-attributes,sort-by-attributes-alt,sort-by-order,sort-by-order-alt,sound-5-1,sound-6-1,sound-7-1,sound-dolby,sound-stereo,star,star-empty,stats,step-backward,step-forward,stop,subtitles,tag,tags,tasks,text-height,text-width,th,th-large,th-list,thumbs-down,thumbs-up,time,tint,tower,transfer,trash,tree-conifer,tree-deciduous,unchecked,upload,usd,user,volume-down,volume-off,volume-up,warning-sign,wrench,zoom-in,zoom-out'.split(',');

	var Icon = $bui.Icon = plugin('Icon', construct);
	Icon.list = list;
	Icon.hook('attr','icon','get',function (){
		return this.change();
	});
	Icon.hook('attr','icon','set',function (text){
		this.change(text);
	});
	
	function construct(icon){
		this.addClass('glyphicon');
		var last = '';
		this.change = function (icon){
			if(!icon){
				return last;
			}
			if(last){
				this.removeClass('glyphicon-' + last);
			}
			this.addClass('glyphicon-' + icon);
			last = icon;
			return this;
		};
		if(icon){
			this.change(icon);
		}
	}
})($bui);
