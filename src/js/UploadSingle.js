(function ($bui){
	"use strict";

	var UploadSingle = $bui.UploadSingle = plugin('UploadSingle', UploadSingleConstructor);
	UploadSingle.proxyInput = true;

	var uploadButton = $('<button/>')
			.addClass('btn btn-primary')
			.prop('disabled', true)
			.text('Processing...')
			.on('click', function (){
				var $this = $(this),
						data = $this.data();
				$this
						.off('click')
						.text('Abort')
						.on('click', function (){
							$this.remove();
							data.abort();
						});
				data.submit().always(function (){
					$this.remove();
				});
			});

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
			acceptFileTypes   : /(\.|\/)(gif|jpe?g|png)$/i,
			maxFileSize       : 5000000, // 5 MB
			disableImageResize: /Android(?!.*Chrome)|Opera/.test(window.navigator.userAgent),
			previewMaxWidth   : 100,
			previewMaxHeight  : 100,
			previewCrop       : true
		}, option);

		var current = option.current;
		this.$input = $('<input/>');
		this.$input.getValue = function (){
			return current;
		};
		this.$input.setValue = function (v){
			current = v;
		};

		var $this = $bui.FormControl.call(this);
		var $input = $this.centerWidget($('<input/>').attr('type', 'file'));
		var progress = new $bui.Progress();
		progress.addClass('progress-striped active').css({'width': '200px'});
		$this.append(progress);

		var current_preview = $('<span/>').append(new $bui.Icon('eye-open'));
		$this.prepend(current_preview);
		current_preview.popover({
			html     : true,
			title    : '当前图片',
			content  : function (){
				return current? current : '<div style="width:100px;height:100px;text-align:center;">无</div>';
			},
			placement: 'auto',
			trigger  : 'hover'
		});

		var preview_content = '';
		var preview = $input.parent().popover({
			html     : true,
			title    : '没有上传',
			content  : function (){
				return preview_content;
			},
			placement: 'auto bottom',
			trigger  : 'manual hover'
		});

		var upload_instance = {};
		var uploadStart = (new $bui.Button(new $bui.Icon('cloud-upload')))
				.click(function (){
					if($(this).hasClass('disabled')){
						return;
					}
					upload_instance.submit();
					state_upload();
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
		this.append(uploadStart);
		this.append(clearUpload);

		var file_upload = $input.fileupload(option).on('fileuploadadd',function (e, data){
			data.context = $this;
			console.log('add', data)
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
					var pers = parseInt(data.loaded/data.total*100, 10);
					progress.attr('progress', pers);
				}).on('fileuploaddone',function (e, data){
					var file = data.result.files[0];
					if(file.url){
						console.log('done url', file.url);
					} else if(file.error){
						console.log('done error', file.error);
					}
					state_empty();
				}).on('fileuploadfail', function (e, data){
					preview_content = '发生网络错误，上传失败，请重试。';
					preview.popover('show');
					state_empty();
				});

		var state = 0;
		state_empty();

		function state_empty(){
			uploadStart.addClass('disabled');
			clearUpload.addClass('disabled');
			$input.val('').removeAttr('disabled');
			progress.attr('progress', 0);
			state = 0;
		}

		function state_ready(){
			uploadStart.removeClass('disabled');
			clearUpload.removeClass('disabled');
			$input.attr('disabled','disabled');
			state = 1;
		}

		function state_upload(){
			uploadStart.addClass('disabled');
			clearUpload.removeClass('disabled');
			$input.attr('disabled','disabled');
			state = 2;
		}
	}
})($bui);
