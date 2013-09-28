var iii = 1;
$(document).on('shown.bs.tab', function (e){
	var $this = $(e.target);
	var $that = $this.closest('ul:not(.dropdown-menu)>.active');
	if(!$that.length){
		$this.addClass('active');
	}
});
