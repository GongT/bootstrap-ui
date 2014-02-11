(function ($bui){
	"use strict";

	var UploadSingle = $bui.UploadSingle = plugin('UploadSingle', UploadSingleConstructor);
	UploadSingle.proxyInput = true;

	function UploadSingleConstructor(option){
		if(typeof option === 'string'){
			option = {url: option};
		}
		if(!option || !option.url){
			throw new Error('bui.UploadSingle 构造必须指定一个url');
		}
		option = $.extend({
			dataType          : 'json',
			autoUpload        : false,
			acceptFileTypes   : /\.(gif|jpe?g|png)$/i,
			maxFileSize       : 3000000, // 3 MB
			disableImageResize: /Android(?!.*Chrome)|Opera/.test(window.navigator.userAgent),
			previewMaxWidth   : 100,
			previewMaxHeight  : 100,
			maxChunkSize      : undefined,
			multipart         : true,
			previewCrop       : true,
			current           : null,
			formData          : function (){
				return [];
			}
		}, option);

		var $container = (new $bui.FormControl()).appendTo(this);

		var current = option.current;
		var $this = this;
		this.$input = $('<input style="display: none!important;"/>').attr('type', 'text').appendTo(this);
		this.$input.getValue = function (){
			return current;
		};
		this.$input.setValue = function (v){
			return current = v;
		};
		var $input = $container.centerWidget($('<input/>').attr('type', 'file'));
		var progress = new $bui.Progress();
		progress.addClass('progress-striped active').css({'width': '200px'});
		$container.append(progress);

		var current_preview = $('<span/>').append(new $bui.Icon('eye-open'));
		var $preview_holder_current = $('<div><img width="100" height="100"/><div style="width:100px;height:100px;text-align:center;">无</div></div>');
		$container.prepend(current_preview);
		current_preview.popover({
			html     : true,
			title    : '当前图片',
			content  : function (){
				$preview_holder_current.find('img').attr('src', current);
				if(current){
					$preview_holder_current.find('img').show();
					$preview_holder_current.find('div').hide();
				} else{
					$preview_holder_current.find('img').hide();
					$preview_holder_current.find('div').show();
				}
				return $preview_holder_current;
			},
			placement: 'auto',
			trigger  : 'hover'
		});

		var preview_content = '';
		var $preview_holder_select = $('<div><div style="width:100px;height:100px;text-align:center;">没有选中</div></div>');
		var preview = $input.parent().popover({
			html     : true,
			title    : '选中的图像',
			content  : function (){
				$preview_holder_select.find('canvas').remove();
				if(preview_content){
					$preview_holder_select.append(preview_content);
					$preview_holder_select.find('div').hide();
				} else{
					$preview_holder_select.find('div').show();
				}
				return $preview_holder_select;
			},
			placement: 'auto bottom',
			trigger  : 'manual hover'
		});

		var upload_instance = {};
		var upload_disabled = true;
		var uploadStart = (new $bui.Button(new $bui.Icon('cloud-upload')))
				.click(function (){
					doUpload();
				});
		var clearUpload = (new $bui.Button(new $bui.Icon('remove')))
				.click(function (){
					if($(this).hasClass('disabled')){
						return;
					}
					if(state == 2){
						upload_instance.abort();
					}
					state_empty();
				});
		$container.append(uploadStart);
		$container.append(clearUpload);

		$input.fileupload(option).on('fileuploadadd',function (e, data){
			state_ready();
		}).on('fileuploadprocessalways',function (e, data){
					upload_instance = data;
					var index = data.index;
					var file = data.files[index];
					if(!file){
						return state_empty();
					}
					if(file.preview){
						preview_content = file.preview;
						preview.popover('show');
					}
					if(file.error){
						preview_content = '上传失败';
						preview.popover('show');
					} else{
						state_ready();
					}
				}).on('fileuploadprogressall',function (e, data){
					var pers = parseInt(data.loaded*1000/data.total, 10)/10;
					progress.attr('progress', pers);
				}).on('fileuploaddone',function (e, data){
					if(data.result && data.result.success){
						$this.val(data.result.url);
						current_preview.popover('show');
					} else{
						$this.val(option.current);
						preview_content = '上传失败';
						preview.popover('show');
					}
					state_empty();
				}).on('fileuploadfail', function (e, data){
					preview_content = '发生网络错误，上传失败，请重试。';
					preview.popover('show');
					state_empty();
				});

		var state = 0;
		this.doUpload = doUpload;
		this.getInstance = function (){
			return upload_instance;
		};
		state_empty();

		function doUpload(debug){
			if(upload_disabled){
				return;
			}
			upload_instance.submit();
			upload_instance.jqXHR.url = upload_instance.url;
			LogStandardReturn(upload_instance.jqXHR, debug? debug : '单个图片文件上传');
			state_upload();
		}

		function state_empty(){
			preview.popover('hide');
			uploadStart.addClass('disabled');
			upload_disabled = true;
			clearUpload.addClass('disabled');
			$input.val('');//.removeAttr('disabled');
			progress.attr('progress', 0);
			state = 0;
		}

		function state_ready(){
			uploadStart.removeClass('disabled');
			upload_disabled = false;
			clearUpload.removeClass('disabled');
			//$input.attr('disabled', 'disabled');
			state = 1;
		}

		function state_upload(){
			preview_content = null;
			preview.popover('hide');
			uploadStart.addClass('disabled');
			upload_disabled = true;
			clearUpload.removeClass('disabled');
			//$input.attr('disabled', 'disabled');
			state = 2;
		}
	}
})($bui);
