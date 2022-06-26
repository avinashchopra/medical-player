/*	Variabelen */
//main
var videoObjects = new Array();
var timeslider;
var counter = 0;
var numberOfViews;
//	chapters
var chapters = new Chapters();
//	cuepoints
var cuepoints = new Cuepoints();
//views
var modus = '';
var activeClicked;
var previousActiveClicked;
var smallVids = new Array();
var inited = false;
var intro = false;
var delayedCall;
//var descriptionShown = false;
var animating = false;
var backwardClicked = false;
var forwardClicked = false;

var seeking1 = false;
var seeking2 = false;
var seeking3 = false;
var seeking4 = false;

var vid1Spinner;
var vid2Spinner;
var vid3Spinner;
var vid4Spinner;

var maxWidth = 100;
//var maxHeight = 786;
var maxHeight = 100;

var sp;
var contentMask = new Mask('container');
contentMask.show();
var footerMask = new Mask('footer');
footerMask.show();
var introMask = new Mask('intro');
introMask.hide();

//footer
var footerRollover = true;
let marginBetween = 5;
let heightBetween = 120;
let smallPlayerHeight = 170;
window.addEvent('domready', checkBrowser);
window.addEvent('resize', resizeHandler);

window.onkeydown = function(e) {
	if (e.keyCode == 32) {
		return false;
	}
};
const diff = 320;
/**	check hash tag */
var hash = window.location.hash;
if (hash) {
	var hashVars = hash.replace(/#/, ''),
		urlVars = [],
		region,
		title,
		id;
	
	hashVars = hashVars.split('&');
	for (var i = 0; i < hashVars.length; i++) {
		var urlVar = hashVars[i].split('=');
		urlVars[urlVar[0]] = urlVar[1];
	}
	region = urlVars['region'];
	title = urlVars['title'].replace(/_/g, ' ');
	id = parseInt(urlVars['id']);
	if (id && typeof id == 'number') {
		activeVideoId = id;
		for (var i = 0; i < pageWisePlayer[id]; i++) {
			var videoId = videoIds[i],
				video = document.getElementById(videoId);
			var source = document.createElement('source');
			const src = '../data/video/' + 'h264' + '/' + views[i] + '/' + id + '.mp4';
			source.setAttribute('src', src);
			source.setAttribute('type', 'video/mp4');
			video.append(source);
			var isPlaying = video.currentTime > 0 && !video.paused && !video.ended && video.readyState > video.HAVE_CURRENT_DATA;
			if (!isPlaying) {
				video.play();
			}
		}
	}
}

$$('.tooltip').addEvent('click', function(event) {
	var target = event.target.toString();
	if (target.indexOf('/player/') != -1) {
		setLocation(target);
	}
});

function setLocation(href)
{
	window.location.href = href;
	window.location.reload();
}

function setTitle(id, title) {
    if (title) {
		var titleId = id;
		if (titleId < 10) {
			titleId = '0' + titleId;
		}
		$('ch_text').set('text', titleId + '. ' + title);
	}
}

/* Opbouw van de site */
function checkBrowser() {
	const {id, title, region} = getIds();
	const numberOfcontainers = pageWisePlayer[id] || 4;
	videoIds = videoIds.slice(0, numberOfcontainers);
	vidContainers = vidContainers.slice(0, numberOfcontainers);
	for(let i=numberOfcontainers+1;i <= 4;i++) {
		$('vidContainer'+i).remove();
	}
	if(id) {
        activeVideoId = id;
    }
	init();
	setTitle(id, title.replace(/_/g, ' '));
	if (region) {
        var tooltips = $$('.tooltip');
        for (var i = 0; i < tooltips.length; i++) {
            var link = tooltips[i].getElement('a'),
                href = link.getAttribute('href');
            if (i == 0) {
                link.setAttribute('href', '../CLICK_HERE_TO_START_(' + region.toUpperCase() + ').html')
            }
            else {
                link.setAttribute('href', href + '&region=' + region);
            }
        }
    }
	resizeHandler(null);
	document.getElementById('allchapterpdf').setAttribute('download',"MonarchNotes.pdf");
	document.getElementById('allchapterpdf').setAttribute('href', './../data/pdf/Monarch Tutorial Chapter Keypoints.pdf');
}

function init(){
	//van elke video die zich in html code bevind, maken we een video object
	videoIds.each(function(vid){
		var video = new CwVideo(vid, {
			name:vid	
		}); 
		video.video.addEvent('seeking', seekingHandler);
		video.video.addEvent('seeked', seekedHandler);
		video.video.addEvent('ended', endedHandler);
		videoObjects.push(video);
		//video.load();
	});
	//tijdslijn die de controle over alle 4 de videos voorziet
	timeslider = new CwVideo.Timeline('timesliderBackground', 'timeslider', {
		video: videoIds[0],
		timeDisplay: 'indicator',
		descriptions:[],
		pancartes:[]
	});
	timeslider.addEvent('onTick', onTickHandler);
	sp = new Spinner(document.body, {message:'loading...', containerPosition:{allowNegative:true, offset:{x:25, y:-300}}});
	sp.show();
	videoIds.forEach((ids)=> {
		$(ids).set('spinner')
	});
}

let debounce;
let countTracker = 0;
function initPlay() {
	countTracker++;
	if(debounce) {
		clearTimeout(debounce);
	}
	debounce = setTimeout(()=>{
		if(countTracker >= videoIds.length) {
			counter = videoIds.length - 1;
			loadedHandler();
		}
	}, 250)
}

function loadedHandler(e) {
	counter++;
	//als alle videos ingeladen zijn, mag er pas worden afgespeeld
	if(counter == videoIds.length) {
		//video objecten aan timeslider toekennen
		//dit mag pas hier gebeuren, anders hebben de video objecten geen data!
		//denk eraan, dit is en blijft ***JAVASCRIPT***, écht OOP is niet mogelijk
		timeslider.videos = videoObjects;
		chapters.data.each(function(chapter) {
			var chapterli = new Element('li', {'class': 'tooltip', 'title': chapter.title});
			var chaptera = new Element('a', {'href': '#', 'text': chapter.text, 'data-start': chapter.start});
			chaptera.addEvent('click', changeChapter);
			chapterli.adopt(chaptera);
			$('viewNavUl').adopt(chapterli);
		});
		$('playpause').store('playing', false);
		window.addEvent('keydown', keydownHandler);
		$('playpause').addEvent('click', playpauseClickHandler);
		$('playpause').addEvent('mouseenter', playpauseOverHandler);
		$('playpause').addEvent('mouseleave', playpauseOutHandler);
		$('forward').addEvent('click', forwardClickHandler);
		$('forward').addEvent('mouseenter', forwardOverHandler);
		$('forward').addEvent('mouseleave', forwardOutHandler);
		$('backward').addEvent('click', backwardClickHandler);
		$('backward').addEvent('mouseenter', backwardOverHandler);
		$('backward').addEvent('mouseleave', backwardOutHandler);
		var tooltip = new Tips('.tooltip', {
			className:'customTip',
			onHide:function(tip, hovered) {
				new Fx.Morph(tip, {duration:500, transition:Fx.Transitions.Sine.easeInOut}).start({'opacity': 0});
			},
			onShow:function(tip, hovered) {
				new Fx.Morph(tip, {duration:500, transition:Fx.Transitions.Sine.easeInOut}).start({'opacity': 1});
			}
		});
		vidContainers.forEach((ids) => {
			$(ids).addEvent('click', vidClickedHandler);
		})
		$('sound').addEvent('click', soundClickHandler);
		$('playpause').store('muted', true);
		window.addEvent('mousemove', mousemoveHandler);
		modus = 'big';
		doFooterRollout()
		inited = true;
		sp.hide();
		intro = true;
		startPresentation();
	}
}

//	change chapter
function changeChapter() {
	var start = this.get('data-start');
	videoObjects.each(function(vid) {
		vid.move(start);
	});
	return false;
}

//	time slider on tick
function onTickHandler(data) {
	cuepoints.data.each(function(cuepoint) {
		if (cuepoint.time === data.timeStr) {
			if (cuepoint.focusOn != '') {
				setVidBig($(cuepoint.focusOn));
			} else {
				gridHandler(null);
			}
		}
	});
	
	if (typeof(data.timeStr) === 'string') {
		
		var seconds = toSeconds(data.timeStr);
		
		chapters.data.each(function(chapter) {
			
			var start = toSeconds(chapter.start),
				end = toSeconds(chapter.end);
			
			if (seconds >= start && seconds <= end) {
				$('ch_text').set('text', chapter.text + '. ' + chapter.title);
			}
		});
	}
}

//	convert to seconds
function toSeconds(time) {
	var re = /^([0-9]*):([0-9]+)$/,
		matches = time.match(re),
		seconds = matches[1].toInt() * 60 + matches [2].toInt();
	
	return seconds;
}

function endedHandler(e){	
	var tooltip = $('tooltip' + activeVideoId).getNext();
	if (tooltip) {
		var children = tooltip.getChildren();
		setLocation(children[0]);
	}
	$('playpause').getElement('a').getElement('img').setStyle('margin-left', 0);
	$('playpause').store('playing', false);
}

function mousemoveHandler(e) {
	// TO make footer static
	// var mouseX = e.page.x;
    // var mouseY = e.page.y;
	// var positionX = $('footer').getPosition().x;
	// var positionWidth = $('footer').getPosition().x + $('footer').getSize().x;
	// var positionY = $('footer').getPosition().y;
	// if(mouseX >= positionX && mouseX <= positionWidth) {
	// 	if(mouseY >= positionY) {
	// 		if(!footerRollover) {
	// 			doFooterRollover();
	// 			footerRollover = true;	
	// 		}
	// 	}else{
	// 		if(footerRollover) {
	// 			doFooterRollout();
	// 			footerRollover = false;
	// 		}
	// 	}
	// }
}

function doFooterRollover(){
	var bottomFx = new Fx.Tween('footer', {
		property: 'top',
		duration: 400
	});
	// bottomFx.start(maxHeight-$('footer').getSize().y+15);
	smallVidsChange();
}

function smallVidsChange() {
	var videoFx = new Fx.Tween('videocontainer', {
		property: 'height',
		duration: 400
	});
	var rHeight = maxHeight - $('footer').getSize().y + heightBetween;
	videoFx.start(rHeight);
	var rWidth = maxWidth;
	var returnValues = activeClicked.vid.fitIntoRect(rWidth-diff, rHeight, true);
	if(getNumberOfView() === 1){
		morphanObjectHandler(activeClicked.vid.video.id, null, null, rWidth, returnValues.height);
	} else {
		morphanObjectHandler(activeClicked.vid.video.id, null, null, returnValues.width, returnValues.height);
	}
	if(smallVids.length === 1) {
		morphanObjectHandler(smallVids[0].container.id,null, marginBetween)
	} else {
		smallVids.forEach(function(smallVid, index){
			returnValues = smallVid.vid.fitIntoRect(rWidth/3, smallPlayerHeight, true);
			morphanObjectHandler(smallVid.vid.video.id , null, null, returnValues.width, returnValues.height);					
		});
	}
}

function doFooterRollout(){
	var bottomFx = new Fx.Tween('footer', {
		property: 'top',
		duration: 400
	});
	console.log("footerRollout ", maxHeight-$('footer').getSize().y + 150)
	//bottomFx.start(maxHeight-$('footer').getSize().y + 150);
	smallVidsChange()
}

function morphanObjectHandler(id, left, top, width, height) {
	let obj = {};
	if(left) {
		obj.left = left;
	}
	if(top) {
		obj.top = top;
	}
	if(width) {
		obj.width = width;
	}
	if(height) {
		obj.height = height;
	}
	if(id) {
		const vid4Fx = new Fx.Morph(id, { duration: 0});
		vid4Fx.start(obj);
	}
}

function seekingHandler(e) {
	switch(e.target) {
		case $('vid1') :
			seeking1 = false;
			videoIds.forEach(ids => {
				$(ids).spin();
			})
			videoObjects.each(function(vid) {
				vid.pause();
			});
			break;
		case $('vid2') :
			seeking2 = false;
			break;
		case $('vid3') :
			seeking3 = false;
			break;
		case $('vid4') :
			seeking4 = false;
			break;
	}
}

function seekedHandler(e) {
	$('videocontainer').setStyle('visibility', 'visible');
	switch(e.target){
		case $('vid1') :
			seeking1 = true;
			break;
		case $('vid2') :
			seeking2 = true;
			break;
		case $('vid3') :
			seeking3 = true;
			break;
		case $('vid4') :
			seeking4 = true;
			break;
	}
	clearTimeout(endSeek);
	seekingDelay = setTimeout('endSeek()', 500);
}

function seekingValidate () {
	for(let i = 0;i<vidContainers.length;i++) {
		if(i===0) {
			if(seeking1 === false) {
				return false;
			}
		} else if(i===1) {
			if(seeking2 === false) {
				return false;
			}
		} else if(i===2) {
			if(seeking3 === false) {
				return false;
			}
		} else if(i===3) {
			if(seeking4 === false) {
				return false;
			}
		}
	}
	return true;
}

function endSeek(){
	if(seekingValidate()) {
		videoIds.forEach(ids => {
			$(ids).unspin();
		})
		$('playpause').getElement('a').getElement('img').setStyle('margin-left', -39);
		$('playpause').store('playing', true);
		videoObjects.each(function(vid) {
			vid.play();
		});
	}
}

function startPresentation() {
	contentMask.destroy();
	footerMask.destroy();
	introMask.show();
	$('container').setStyle('visibility', 'visible');
	$('videocontainer').setStyle('visibility', 'visible');
	$('footer').setStyle('visibility', 'visible');
	$('intro').setStyle('visibility', 'hidden');
	resizeHandler(null);
}

/* functie wanneer men op een chapteritem uit de navigatielijst klikt */
function changeVideoTime(e) {
	var time = e.target.retrieve('time');
	var counter = 0;
	videoObjects.each(function(object){
		object.pause();
		object.move(time);		
		counter++;
	});
	if(counter == videoObjects.length) {
		videoObjects.each(function(object){
			object.play();	   
		});
	}
	e.target.getParent().toggleClass('current');
}

function pancarteShowHandler(e){
	setVidBig($('vidContainer1'));
}

function pancarteHideHandler(e){
	if(previousActiveClicked != null) {
		setVidBig(previousActiveClicked.container);
		previousActiveClicked = null;	
	}else{
		gridHandler(null);	
	}
}

function gridHandler(e){
	if(modus != 'grid') {
		modus = 'grid';
		// $('big').removeClass('current');
		resizeHandler(null);
	}
	return false;
}

function bigHandler(e){
	if(modus != 'big') {
		modus = 'big';
		//$('big').addClass('current');
		organiseBigVids();
		resizeHandler(null);
	}
	return false;
}

function organiseBigVids(){
	activeClicked = {container:$('vidContainer1'), vid:videoObjects[0]};
	smallVids.empty();
	for(let i = 1; i<vidContainers.length;i++ ) {
		smallVids[i-1] = {container:$('vidContainer'+ (i+1)), vid:videoObjects[i]};
	}
}

function vidClickedHandler(e){
	if(modus != 'big') {
		modus = 'big';
		//$('big').addClass('current');
		organiseBigVids();
	}
	var target = e.target.getParent();
	if(target != activeClicked.container) {
		//zoeken naar een smallVid die als container target heeft
		var index;
		var currentVid;
		smallVids.each(function(smallVid){
			if(smallVid.container == target) {
				index = smallVids.indexOf(smallVid);
				currentVid = smallVid;
			}
		});
		smallVids[index] = activeClicked;
		activeClicked = currentVid;
	}
	resizeHandler(null);
}

function setVidBig(target){
	if(modus != 'big') {
		modus = 'big';
		organiseBigVids();
		previousActiveClicked = null;
	}else{
		previousActiveClicked = activeClicked;	
	}
	if(target != activeClicked.container) {
		//zoeken naar een smallVid die als container target heeft
		var index;
		var currentVid;
		smallVids.each(function(smallVid){
			if(smallVid.container == target)
			{
				index = smallVids.indexOf(smallVid);
				currentVid = smallVid;
			}
		});
		smallVids[index] = activeClicked;
		activeClicked = currentVid;
	}
	resizeHandler(null);
}

function playpauseClickHandler(e) {
	var playing = $('playpause').retrieve('playing');
	if(playing) {
		$('playpause').getElement('a').getElement('img').setStyle('margin-left', 0);
	}else{
		$('playpause').getElement('a').getElement('img').setStyle('margin-left', -39);
	}
	videoObjects.each(function(object){
		object.togglePlay();
	});
	$('playpause').store('playing', !playing);
	return false;
}

function playpauseOverHandler(e) {
	var playPauseFx = new Fx.Tween('playpause', {
		property: 'opacity',
		duration: 300
	});
	playPauseFx.start(1);
}

function playpauseOutHandler(e) {
	var playPauseFx = new Fx.Tween('playpause', {
		property: 'opacity',
		duration: 300
	});
	playPauseFx.start(.6);
}

function forwardClickHandler(e) {
	if(!forwardClicked) {
		timeslider.nextCue();
	}
	return false;
}

function forwardBackwardDelay(){
	forwardClicked = false;	
	backwardClicked = false;
}

function forwardOverHandler(e) {
	var forwardFx = new Fx.Tween('forward', {
		property: 'opacity',
		duration: 300
	});
	forwardFx.start(.6, 1);
}

function forwardOutHandler(e) {
	var forwardFx = new Fx.Tween('forward', {
		property: 'opacity',
		duration: 300
	});
	forwardFx.start(1, .6);
}

function backwardClickHandler(e) {
	if(!backwardClicked) {
		timeslider.previousCue();
	}
	return false;
}

function backwardDelay() {
	backwardClicked = false;	
}

function backwardOverHandler(e) {
	var backwardFx = new Fx.Tween('backward', {
		property: 'opacity',
		duration: 300
	});
	backwardFx.start(.6, 1);
}

function backwardOutHandler(e) {
	var backwardFx = new Fx.Tween('backward', {
		property: 'opacity',
		duration: 300
	});
	backwardFx.start(1, .6);
}

function keydownHandler(e){
	switch(e.key) {
		case "right" :
			forwardClickHandler(null);
			break;
		case "left" :
			backwardClickHandler(null);
			break;
		case "space" :
			playpauseClickHandler(null);
			break;
	}
}

function soundClickHandler(e){
	var muted = $('sound').retrieve('muted');
	if(muted) {
		$('sound').getElement('a').getElement('img').setStyle('margin-left', 0);
		$('sound').store('muted', false);
	}else{
		$('sound').getElement('a').getElement('img').setStyle('margin-left', '-57px');
		$('sound').store('muted', true);
	}
	videoObjects[0].toggleMute();	
	return false;
}

/* Wanneer browserwindow resized */
function resizeHandler(e){
	maxWidth = window.innerWidth;
	maxHeight = window.innerHeight;
	if(document.getSize().x > maxWidth) {
		maxWidth = document.getSize().x;	
	}
	if(document.getSize().y > maxHeight) {
		maxHeight = document.getSize().y;	
	}
	$('start').setPosition({
		x:Math.round(maxWidth/2 - $('start').getSize().x/2),
		y:Math.round(maxHeight/2 - $('start').getSize().y/2)
	});
	if(inited) {
		//positioneren van vaste content
		$('playpause').setPosition({
			x:20				   
		});
		$('backward').setPosition({
			x:70				   
		});
		$('forward').setPosition({
			x:105				   
		});
		//tijdslijn moet mee resizen met browser breedte
		timeslider.resize();
		//width en height om te resizen
		var rWidth;
		var rHeight;
		if(footerRollover) {
			rWidth = maxWidth;
			rHeight = maxHeight - $('footer').getSize().y - 20;	
		}else{
			rWidth = maxWidth;
			rHeight = maxHeight - $('footer').getSize().y /*- $('bottom').getSize().y*/ + heightBetween;
		}
		$('footer').setStyle('width', rWidth);
		$('indicator').setPosition({
			x:Math.round($('footer').getSize().x - 58)
		});
		$('timesliderBackground').setStyle('width', $('footer').getSize().x - $('playpause').getSize().x - $('indicator').getSize().x - $('forward').getSize().x - $('backward').getSize().x - 80);
		$('videocontainer').setStyles({
			'width':rWidth,
			'height':rHeight
		});
		console.log("y --", maxHeight - $('footer').getSize().y + 15, maxHeight - $('footer').getSize().y + 150);
		if(footerRollover) {
			$('footer').setPosition({
				x:Math.round(maxWidth/2 - $('footer').getSize().x/2),
				y:maxHeight - $('footer').getSize().y + 15
			});
		}else{
			$('footer').setPosition({
				x:Math.round(maxWidth/2 - $('footer').getSize().x/2),
				y:maxHeight - $('footer').getSize().y + 150
			});
		}
		
		$('viewNav').setPosition({
			x:-15,
			y:70
		});
		
		$('navbox').setPosition({
			x:Math.round($('footer').getSize().x - $('viewNav').getSize().x - $('navbox').getSize().x - 25),
			y:-10
		});
		
		$('line').setStyle('width', $('footer').getSize().x );
		$('line2').setStyle('width', $('footer').getSize().x );
		$('line').setPosition({
			x:20,
			y:30
		});
		$('line2').setPosition({
			x:20,
			y:70
		});
		
		$('serial').setPosition({
			x:Math.round($('footer').getSize().x - $('viewNav').getSize().x - $('serial').getSize().x - 185),
			y:60
		});

		if(activeClicked && getNumberOfView() > 1) {
			activeClicked.vid.fitIntoRect(rWidth-diff, rHeight);
			activeClicked.container.setPosition({
				x: marginBetween, 
				y: marginBetween
			});
		}
		smallVids.each(function(smallVid){
			smallVid.vid.fitIntoRect(rWidth/3, smallPlayerHeight);						
		}.bind(this));
		if(smallVids.length === 1) {
			smallVids[0].container.setPosition({
				x: Math.round($('videocontainer').getSize().x - smallVids[0].vid.video.getSize().x - marginBetween),
				y: marginBetween
			});
		} else {
			smallVids.forEach((ids, index)=>{
				if(index === 0) {
					smallVids[0].container.setPosition({
						x:Math.round($('videocontainer').getSize().x - smallVids[0].vid.video.getSize().x - marginBetween),
						y: marginBetween + smallPlayerHeight + marginBetween
					});
				}
				else if(index === 1 ) {
					smallVids[1].container.setPosition({
						x:Math.round($('videocontainer').getSize().x - smallVids[1].vid.video.getSize().x -marginBetween),
						y: marginBetween
					});
				} else if(index === 2) {
					smallVids[2].container.setPosition({
						x:Math.round($('videocontainer').getSize().x - smallVids[2].vid.video.getSize().x - marginBetween),
						y: marginBetween + smallPlayerHeight + marginBetween + smallPlayerHeight + marginBetween
					});
				}
			});
		}
		videoIds.forEach((ids) => {
			$(ids).get('spinner').position();
		})
		$('bottom').setPosition({
				y:80
		});
		
		$('sound').setPosition({
			x:Math.round($('viewNav').getPosition().x - 180),
			y:17
		});
	}else{
		$('intro').setStyle('visibility', 'visible');	
	}
}

function setTooltipSelected() {
	const {id} = getIds();
	if(!id) {return };
	let length = 0;
	for( var key in pageWisePlayer ) {
		if( pageWisePlayer.hasOwnProperty(key) ) {
			++length;
		}
	}
	for(let i=1;i<=length;i++) {
		document.getElementById('tooltip'+i) && document.getElementById('tooltip'+i).removeClass('selectedTooltip');
	}
	document.getElementById('tooltip'+id) && document.getElementById('tooltip'+id).addClass('selectedTooltip');
}

function getNumberOfView() {
	if(!numberOfViews) {
		const {id} = getIds();
		numberOfViews = pageWisePlayer[id] || 4;
	}
	return numberOfViews;
}