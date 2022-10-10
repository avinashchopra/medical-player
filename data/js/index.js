/*
 *	 *	Author: Bert De Block
 */

function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function setCookie(name,value,days) {
	
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

$(function()
{
	//	elements
	var $chapters = $('#chapters'),
		$disclaimerWrapper = $('#disclaimerWrapper');
		$instructionWrapper = $('#instructionWrapper');
	
	var animationOptions = {duration: 250, easing: 'easeInOutExpo'};
	
	$chapters.carouFredSel(
	{
		auto: false,
		circular: false,
		infinite: false,
		onCreate: function()
		{
			$chapters.animate({opacity: 1}, animationOptions);
		},
		prev: $('#prev'),
		next: $('#next'),
		scroll: {
			duration: 250,
			easing: 'easeInOutExpo',
			items: 1
		},
		width: '100%'
	});
	
	$('.disclaimer').click(function(event)
	{
		event.preventDefault();
		$disclaimerWrapper.show().animate({opacity: 1}, animationOptions);
		$disclaimerWrapper.css({'display': 'flex', 'justify-content': 'center'})
	});
	
	$('#disclaimer').click(function(event)
	{
		event.stopPropagation();
	});
	
	$disclaimerWrapper.click(function()
	{
		$disclaimerWrapper.animate({opacity: 0}, {duration: 250, easing: 'easeInOutExpo', complete: function()
		{
			$disclaimerWrapper.hide();
		}});
	});

	$('.instruction').click(function(event)
	{
		event.preventDefault();
		$instructionWrapper.show().animate({opacity: 1}, animationOptions);
		$instructionWrapper.css({'display': 'flex', 'justify-content': 'center'})
	});

	$('#instruction').click(function(event)
	{
		event.stopPropagation();
	});

	$instructionWrapper.click(function()
	{
		$instructionWrapper.animate({opacity: 0}, {duration: 250, easing: 'easeInOutExpo', complete: function()
		{
			$instructionWrapper.hide();
		}});
	});
});

window.onload = function () {
	const cookiesValue = getCookie('showInstruction')
	if(cookiesValue === null) {
		$disclaimerWrapper = $('#disclaimerWrapper');
		$disclaimerWrapper.show().animate({opacity: 1}, {duration: 250, easing: 'easeInOutExpo'});
		$disclaimerWrapper.css({'display': 'flex', 'justify-content': 'center'})
		setCookie('showInstruction', '1', 1);
	}
}