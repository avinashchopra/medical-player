/*
 *	 *	Author: Bert De Block
 */

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