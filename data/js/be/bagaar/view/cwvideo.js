/*
---
description: CwVideo

authors:
  - Mario Fischer (http://www.chipwreck.de/blog/)

license:
  - MIT-style license

requires:
  core/1.2.4: '*',
  more/1.2.4: Fx.Slider

provides:
  - CwVideo
  
version:
  0.2
...
*/
CwVideo = new Class({

	Implements: [Events, Options],
	
	options: {
 		// onPlaybackHasChanged: function(event) { }, // Shortcut-event triggered on play, pause, loadstart
		implementMediaAdditions: true, // For mootools 1.2.4 necessary: Implement new events and attributes for the video-tag
		name: false
	},
	
	video: false,
	defaultPlaybackRate: 1,
	startTime: 0,
	duration: 0,	
	isPaused: false,
	isSeeking: false,
	name: false,

	initialize: function(element, options)
	{
		this.video = $(element);
		
		this.setOptions(options);
		this.name = this.options.name;
		
		if (this.options.implementMediaAdditions) {
	
			// new properties. true = read/write, false = readonly
			CwVideo.mediaProperties = {
				videoWidth: false, videoHeight: false, poster: true, // HTMLVideoElement
				error: false, networkState: false, preload: true, buffered: false, readyState: false, seeking: false, // HTMLMediaElement
				currentTime: true, startTime: false, duration: false, paused: true, // HTMLMediaElement
				defaultPlaybackRate: true, playbackRate: true, played: false, seekable: false, // HTMLMediaElement, these properties currently do *not* work in firefox  
				ended: false, autoplay: true, loop: true, // HTMLMediaElement
				controls: true, volume: true, muted: true,  // HTMLMediaElement
				autobuffer: true // n/a
			};		
			$each(CwVideo.mediaProperties, function(is_writable, key) {
				if (is_writable) {
					Element.Properties.set(key, {
						set: function(avalue) {
							this[key] = avalue;
						},
						get: function() {
							return this[key];
						}
					});
				} else {
					Element.Properties.set(key, {
						get: function() {
							return this[key];
						}
					});
				}
			});
			
			// new events
			CwVideo.mediaEvents = {
				loadstart: 2, progress: 2, suspend: 2, abort: 2,
				error: 2, emptied: 2, stalled: 2, play: 2, pause: 2,
				loadedmetadata: 2, loadeddata: 2, waiting: 2, playing: 2,
				canplay: 2, canplaythrough: 2, seeking: 2, seeked: 2,
				timeupdate: 2, ended: 2, ratechange: 2, durationchange: 2, volumechange: 2
			};
			Element.NativeEvents = $merge(Element.NativeEvents, CwVideo.mediaEvents);
		}

		// add own events
		this.video.addEvents({
			durationchange: function(event) {
				if ($defined(this.video.get('duration'))) {
					this.duration = this.video.get('duration');
				};				
				if ($defined(this.video.get('startTime'))) {
					this.startTime = this.video.get('startTime');
				};
				if ($defined(event.target.get('defaultPlaybackRate'))) {
					this.defaultPlaybackRate = event.target.get('defaultPlaybackRate');
				};
			}.bind(this),
			loadstart: function(event) { this.fireEvent('playbackHasChanged', event); }.bind(this),
			pause: function(event) { this.fireEvent('playbackHasChanged', event); }.bind(this),
			play: function(event) { this.fireEvent('playbackHasChanged', event); }.bind(this)
		});
	},

	// rewind video to the beginning	
	rewind: function()
	{
		this.video.set('currentTime', this.startTime);
	},
	
	// move playhead forward, backward (positive or negative number) or to a specific position ("mm:ss" as string)
	move: function(secs)
	{
		re = /^([0-9]*):([0-9]+)$/;
		matches = secs.toString().match(re);
		if (matches && matches.length == 3) {
			newtime = this.startTime + matches[1].toInt()*60 + matches[2].toInt();
		}
		else {
			newtime = this.video.get('currentTime') + parseFloat(secs);
		}
		
		this.video.set('currentTime', newtime.limit(this.startTime, this.startTime + this.duration));
		
	},

	toggleMute: function()
	{
		this.video.set('muted', !this.video.get('muted'));
	},
	
	// change volume by given amount (positive or negative number between 0 and 1)
	volumeChange: function(amount)
	{
		newvol = this.video.get('volume') + parseFloat(amount);
		this.video.set('volume', newvol.limit(0.0, 1.0));
	},
	
	load: function()
	{
		this.video.load();	
	},
	
	play: function()
	{
		if(!this.isPaused)
		{
			this.video.play();
			this.video.unspin();
		}
	},
	
	pause: function()
	{
		if(!this.isPaused)
		{
			this.video.pause();
		}
	},
	
	togglePlay: function()
	{
		if (this.video.paused || this.video.ended) {
			this.isPaused = false;
			this.video.play();
		}
		else {
			this.isPaused = true;
			this.video.pause();
		}
	},
	
	stop: function()
	{
		this.rewind();
		this.video.pause();
	},

	// get network state as text
	getNetworkState: function()
	{
		switch (this.video.get('networkState')) {			
			case this.video.NETWORK_EMPTY: return 'empty';
			case this.video.NETWORK_IDLE: return 'idle';
			case this.video.NETWORK_LOADING: return 'loading';
			case this.video.NETWORK_LOADED: return 'loaded';
			case this.video.NETWORK_NO_SOURCE: return 'no source';
			default: return 'unknown state';
		}
	},

	// get ready state as text	
	getReadyState: function()
	{
		switch (this.video.get('readyState')) {
	 		case this.video.HAVE_NOTHING: return 'have nothing';
	 		case this.video.HAVE_METADATA: return 'have meta';
	 		case this.video.HAVE_CURRENT_DATA: return 'have current';
	 		case this.video.HAVE_FUTURE_DATA: return 'have future data';
	 		case this.video.HAVE_ENOUGH_DATA: return 'have enough data';
	 		default: return 'unknown state';
		}
	},
	
	/*
		bijvoeging om video te scalen
	*/
	fitIntoRect: function(width, height, returnValues)
	{
		var scaleX = this.video.getSize().x / this.video.videoWidth;
		var scaleY = this.video.getSize().y / this.video.videoHeight;
		
		var scaleFactor = 0;
		if(width > height) 
		{ 
			//landscape -> width is groter dan height
			scaleFactor = width / this.video.videoWidth;
			
			if(this.video.videoHeight * scaleFactor > height) {
				scaleFactor = height / this.video.videoHeight;
			}
		}else {
			//portrait -> height is groter dan width
			scaleFactor = height / this.video.videoHeight;
			
			if(this.video.videoWidth * scaleFactor > width) {
				scaleFactor = width / this.video.videoWidth;
			}
		}
		
		if(returnValues)
		{
			return {width:Math.round(this.video.videoWidth * scaleFactor), height:Math.round(this.video.videoHeight * scaleFactor)};
		}else{
			this.video.setStyles({
				'width':Math.round(this.video.videoWidth * scaleFactor),
				'height':Math.round(this.video.videoHeight * scaleFactor)
			});
		}
	}
});

/*
---
description: CwVideo.Timeline

authors:
  - Mario Fischer (http://www.chipwreck.de/blog/)

license:
  - MIT-style license

requires:
  core/1.2.4: '*'
  more/1.2.4: Drag.Slider

provides:
  - CwVideo.Timeline
  
version:
  0.1
...
*/
CwVideo.Timeline = new Class({

	Extends: Slider,
	Implements: [Events, Options],
	
	options: {
		video:false, // id of the video element
		videos:false, //array van videos die ook aangestuurd moeten worden
		timeDisplay:false, // if set: display current time in the given element (mm.s)
		timeAsPercent:false, // if true: display current time as percent (xx%)
		timeDisplayDisabled:'--', // text to show if current time is not available
		descriptions:false,
		pancartes:false,

		onChange: function(position) {
			this.dragging = true;
			if (!position || this.duration == 0) return;
			videotime = Math.round( position / this.range * this.duration);
			
			this.updateTime(Math.round(videotime));
		},
		onComplete: function(position) {
			this.dragging = false;
			this.updateVideo(position);
		},
		onError: function(error) {
			this.detach();
			this.updateTime(false);
			this.knob.set('opacity', 0.5); // for example..
		}
	},
	
	video: false,
	videos: false,
	chapters: [],
	descriptions: [],
	duration: 0,
	startTime: 0,
	activeChapter: null,
	activeDescription: null,
	activePancarte: null,
	cuepoints: [],
	activeCue: -1,
	dragging: false,
	cueclick: false,
	
	initialize: function(element, knob, options)
	{
		this.parent(element, knob, options);
		this.setOptions(options);
		this.video = $(this.options.video);
		this.videos = this.options.videos;
		this.descriptions = this.options.descriptions;
		this.pancartes = this.options.pancartes;
		this.detach();
				
		// on video timeupdate: call updatePosition		
		this.video.addEvent('timeupdate', function(an_event) {
			//console.log('timeupdate: ' + this.video.get('currentTime'));
			this.updatePosition(this.video.get('currentTime'));
		}.bind(this));
		
		//SEEKED EVENT IS BROL
		//http://blog.jeffbeck.info/?p=89
		//http://www.whatwg.org/specs/web-apps/current-work/multipage/video.html#mediaevents
		
		// if we have finished seeking in the video: call updatePosition
		/*this.video.addEvent('seeked', function(an_event) {
			console.log('seeked');
			this.updatePosition(this.video.get('currentTime'));
		}.bind(this));*/
		
		//$('par_text').fade('out');

		// duration changed?
		this.video.addEvent('durationchange', function(an_event) {
			this.duration = this.video.get('duration');
			if (this.duration == 0) {
				this.fireEvent('error', 'Duration is zero');
			}else{
				var count = Math.round(this.duration/10);
				for(var i = 0; i<= count; i++)
				{
					var point = new Cuepoint({time:i*10});
					this.cuepoints.push(point);
				}
			}
		}.bind(this));
		
		// loaded?
		this.video.addEvent('loadstart', function(an_event) {
			this.updatePosition(this.video.get('currentTime'));
		}.bind(this));
		
		// canplay, so we can start
		this.video.addEvent('canplay', function(an_event) {
			if ($defined(this.video.get('startTime'))) {
				this.startTime = this.video.get('startTime');
			}
			//console.log('canplay');
			//this.updateTime(this.startTime);
			this.attach();
		}.bind(this));
	},
	
	updatePosition: function(time)
	{
		if(!this.dragging)
		{
			this.updateTime(time);
			
			position = this.toPosition(time / this.duration * this.range);
			this.knob.setStyle(this.property, position); // we "manually" set the knob position in order to avoid triggering another event
			
			/*
				chapters
				checken voor of newtime > positie chapter en < positie volgend chapter, zoja -> dit chapter
			*/
			var tempActiveChapter;
			this.chapters.each(function(chapter){
				if(Math.round(position) >= chapter.getPosition().x - $('timesliderBackground').getPosition().x)
				{
					tempActiveChapter = chapter;
				}
			}.bind(this));
			
			if(this.activeChapter != tempActiveChapter)
			{
				this.activeChapter = tempActiveChapter;
				this.chapters.each(function(tempChapter){
					tempChapter.setStyles({
						'background': 'rgba(189, 207, 59, 0.45)',
						'color': 'rgba(189, 207, 59, 0.45)'				
					});
					tempChapter.getElement('a').setStyle('color','rgba(189, 207, 59, 0.45)');
					tempChapter.getElement('a').store('active', false);				
				});
				
				this.activeChapter.setStyles({
					'background': 'rgba(189, 207, 59, 1)',
					'color': 'rgba(189, 207, 59, 1)'				
				});
				this.activeChapter.getElement('a').setStyle('color','rgba(189, 207, 59, 1)');
				this.activeChapter.getElement('a').store('active', true);
				
				this.videos.each(function(vid){
					vid.video.set('currentTime', time);		  
				}.bind(this));
				
				var chFx = new Fx.Tween('ch_text', {
					property: 'opacity',
					duration: 500,
					transition: Fx.Transitions.Quart.easeInOut,
					onComplete:function(){
						$('ch_text').set('text', this.activeChapter.retrieve('name'));
					}.bind(this)
				});
				
				chFx.start(1,0).chain(
					function(){this.start(0,1);}
				);
				//$('ch_text').set('text', this.activeChapter.retrieve('name'));
				
				this.fireEvent('chapterChanged', this.activeChapter.retrieve('title'));
			}
			
			/*
				cuepoint: checken welk de active index is
			*/
			if(!this.cueclick)
			{
				this.cuepoints.each(function(point){
					
					if(Math.floor(time) >= point.time && Math.floor(time) < (point.time+60))
					{
						this.activeCue = this.cuepoints.indexOf(point);	
					}
				}.bind(this));
			}
			
			
			/*
				descriptions checken
			*/
			/*if(this.activeDescription != null)
			{
				if((this.activeDescription.start).limit(this.startTime, this.startTime + this.duration) > Math.floor(time) || (this.activeDescription.end).limit(this.startTime, this.startTime + this.duration) <= Math.floor(time))
				{
					this.fireEvent('descriptionHide');
					this.activeDescription = null;
				}
			}
			
			var tempActiveDescription;
			this.descriptions.each(function(description){
				if(description.start.limit(this.startTime, this.startTime + this.duration) <= Math.floor(time) && description.end.limit(this.startTime, this.startTime + this.duration) > Math.floor(time))
				{
					
					tempActiveDescription = description;	
				}
			}.bind(this));
			
			if(this.activeDescription != tempActiveDescription)
			{
				this.activeDescription = tempActiveDescription;
				$('par_text').set('text', this.activeDescription.text);
				this.fireEvent('descriptionShow');
			}*/
			
			/*
				pancartes checken
			*/
			if(this.activePancarte != null)
			{
				if((this.activePancarte.start).limit(this.startTime, this.startTime + this.duration) > Math.floor(time) || (this.activePancarte.end).limit(this.startTime, this.startTime + this.duration) <= Math.floor(time))
				{
					this.fireEvent('pancarteHide');
					this.activePancarte = null;
				}
			}
			
			var tempActivePancarte;
			this.pancartes.each(function(pancarte){
				if((pancarte.start).limit(this.startTime, this.startTime + this.duration) <= Math.floor(time) && (pancarte.end).limit(this.startTime, this.startTime + this.duration) > Math.floor(time))
				{
					
					tempActivePancarte = pancarte;	
				}
			}.bind(this));
			
			if(this.activePancarte != tempActivePancarte)
			{
				this.activePancarte = tempActivePancarte;
				this.fireEvent('pancarteShow');
			}
		}
		
	},
	
	updateVideo: function(position)
	{
		var counter = 0;
		
		if (!position || this.duration == 0) return;
		videotime = Math.round( position / this.range * this.duration); // from position to time
		
		var minutes = Math.floor(videotime / 60);
		var seconds = videotime % 60;
		var timeString = minutes + ':' + seconds;
		
		this.videos.each(function(vid){
			//vid.pause();
			//vid.video.set('currentTime', Math.round(videotime));
			vid.move(timeString);
			//counter++;
		}.bind(this));
		
		/*if(counter == this.videos.length) 
		{
			this.videos.each(function(vid){
				vid.play();
			}.bind(this));
		}*/
		
		//this.video.set('currentTime', videotime); // if (this.video.get('readyState') != this.video.HAVE_FUTURE_DATA && this.video.get('readyState') != this.video.HAVE_ENOUGH_DATA ) { }		
	},
	
	updateTime: function(time)
	{
		if (this.options.timeDisplay) {
			if (time === false || !$defined(time)) {
				$(this.options.timeDisplay).set('html', this.options.timeDisplayDisabled);
				return;
			}
			if (this.options.timeAsPercent) {
				if (!this.duration || this.duration == 0) {
					$(this.options.timeDisplay).set('html', "0%");
				}
				else {
					$(this.options.timeDisplay).set('html', (time/this.duration*100).toInt() + "%");
				}
			}
			else {
			    hr = Math.floor(time / 3600);
			    rem = time % 3600;
			    min = Math.floor(rem / 60);
			    sec = Math.floor(rem % 60);
			    if (hr > 0) {
			    	$(this.options.timeDisplay).set('html', hr + ":" + (min < 10 ? "0"+min : min) + ":" + (sec < 10 ? "0"+sec : sec));
			    }
			    else {
			    	var data = {
			    		timeInt: time,
			    		timeStr: (min < 10 ? "0"+min : min) + ":" + (sec < 10 ? "0"+sec : sec)
			    	}
			    	
			    	$(this.options.timeDisplay).set('html', data.timeStr);
			    	this.fireEvent('onTick', data);
			    }
				
				//checken of tijd deelbaar is door 10, zoja -> alle videos terug updaten naar zelfde tijd
				//console.log('check for time: ' + this.videos);
				//console.log('rest: ' + (Math.round(time) % 10));
				/*if(this.videos != false && Math.round(time) % 10 == 0)
				{
					this.videos.each(function(vid){
						if(this.videos.indexOf(vid) != 0)
						{
							vid.video.set('currentTime', time);
						}			  
					}.bind(this));
				}*/ 
			}		
		}
	},
	
	addChapter: function(chapter){
		//aanmaken van niew component
		var display = new Element('div', {id:chapter.title, 'class':'tooltip', title:chapter.name});
		var text = new Element('a', {href:'#', text:chapter.title});
		text.setStyle('position','absolute');
		text.setPosition({
			x:5,
			y:5
		});
		text.setStyle('color','rgba(189, 207, 59, 1)');
		display.adopt(text);
		display.setStyles({
			width:1,
			height:20,
			'background': 'rgba(189, 207, 59, 1)',
			position:'absolute',
			'color': 'rgba(189, 207, 59, 1)'
		});
		
		//componenten aan timesliderBackground toevoegen
		$('bottom').adopt(display);
		this.chapters.push(display);
		
		re = /^([0-9]*):([0-9]+)$/;
		matches = chapter.time.toString().match(re);
		if (matches && matches.length == 3) {
			newtime = this.startTime + matches[1].toInt()*60 + matches[2].toInt();
		}
		else {
			newtime = this.video.get('currentTime') + parseFloat(secs);
		}
		
		newtime = newtime.limit(this.startTime, this.startTime + this.duration);
		var position = this.toPosition( newtime / this.duration * this.range );
		display.setPosition({
			x: Math.round($('timesliderBackground').getPosition().x + position - 20),
		});
		
		//event listener geven
		display.store('chapter', chapter.time);
		display.store('position', newtime);
		display.store('active', false);
		display.store('title', chapter.title);
		display.store('name', chapter.name);
		text.addEvent('click', function(e){
			var time = e.target.getParent().retrieve('chapter');
			
			var counter = 0;
			this.videos.each(function(object){
				object.pause();
				object.move(time);		
				counter++;
			});
			
			if(counter == videoObjects.length)
			{
				this.videos.each(function(object){
					object.play();	   
				});
			}
		}.bind(this));
		text.addEvent('mouseenter', function(e){
			var active = e.target.retrieve('active');
			
			if(!active)
			{
				e.target.getParent().setStyles({
					'background': 'rgba(189, 207, 59, 1)',
					'color': 'rgba(189, 207, 59, 1)'
				});
				e.target.setStyle('color','rgba(189, 207, 59, 1)');
			}
					
		}.bind(this));
		text.addEvent('mouseleave', function(e){
			var active = e.target.retrieve('active');
			
			if(!active)
			{
				e.target.getParent().setStyles({
					'background': 'rgba(189, 207, 59, 0.45)',
					'color': 'rgba(189, 207, 59, 0.45)'
				});
				e.target.setStyle('color','rgba(189, 207, 59, 0.45)');
			}
					
		}.bind(this));
	},
	
	nextCue: function() {
				
		if(this.activeCue < this.cuepoints.length-1)
		{
			this.cueclick = true;
			this.activeCue++;
			var active = this.cuepoints[this.activeCue];
			//console.log(this.activeCue);
			this.videos.each(function(vid){
				vid.video.set('currentTime', active.time);
			});
			
			this.cueclick = false;
		}
	},
	
	previousCue: function() {
		if(this.activeCue > 0)
		{
			this.cueclick = true;
			this.activeCue--;
			var active = this.cuepoints[this.activeCue];
			this.videos.each(function(vid){
				vid.video.set('currentTime', active.time);
			});
			
			this.cueclick = false;
		}
	},
	
	/*
		Slider bijvoegingen om te kunnen resizen
	*/
	update: function(step){
        // same as this.set() but doesn't fire any events
        if (!((this.range > 0) ^ (step < this.min))) step = this.min;
        if (!((this.range > 0) ^ (step > this.max))) step = this.max;
        this.step = Math.round(step);
        if (this.previousChange != this.step) this.previousChange = this.step;
        //this.knob.setStyle(this.property, this.toPosition(this.step));
		//console.log(this.property.toString() + " - " + this.toPosition(this.step).toString());
        if (this.previousEnd !== this.step) this.previousEnd = this.step;
        return this;
    },
	
	updateChapters: function(){
		this.chapters.each(function(chapter){
			var position = this.toPosition( chapter.retrieve('position') / this.duration * this.range );
			//console.log('new position: ' + chapter.retrieve('chapter'));
			chapter.setPosition({
				x: Math.round($('timesliderBackground').getPosition().x + position - 20)
			});
		}.bind(this));
	},
    
    resize: function(){
        // fire if the slider bar has been resized
        var offset = (this.options.mode == 'vertical') ? 'offsetHeight' : 'offsetWidth';
        this.full = this.element.measure(function(){
            this.half = this.knob[offset] / 2;
            return this.element[offset] - this.knob[offset] + (this.options.offset * 2);
        }.bind(this));
        this.steps = this.options.steps || this.full;
        this.stepSize = Math.abs(this.range) / this.steps;
        this.stepWidth = this.stepSize * this.full / Math.abs(this.range);
        var limit = {};
        this.drag.options.limit[this.axis] = [- this.options.offset, this.full - this.options.offset];
        if (this.options.snap){
            this.drag.options.grid = Math.ceil(this.stepWidth);
            this.drag.options.limit[this.axis][1] = this.full;
        }
        this.update(this.step);
		this.updateChapters();
        return this;
    }

});

/*
---
description: CwVideo.Volumeslider

authors:
  - Mario Fischer (http://www.chipwreck.de/blog/)

license:
  - MIT-style license

requires:
  core/1.2.4: '*'
  more/1.2.4: Drag.Slider

provides:
  - CwVideo.Volumeslider
  
version:
  0.1
...
*/
CwVideo.Volumeslider = new Class({

	Extends: Slider,
	Implements: [Events, Options],
	
	options: {
		video: false, // id of the video element
		initialVolume: false, // if given: set volume initially to this value (0.0 .. 1.0)

		onChange: function(position) {
			this.updateVolume(position);
		},
		onError: function(error) {
			this.detach();
		}
	},
	
	initialize: function(element, knob, options)
	{
		this.parent(element, knob, options);
		this.setOptions(options);
		this.detach();
				
		// on video volumeupdate: call updatePosition
		$(this.options.video).addEvent('volumechange', function(an_event) {
			if (!this.isDragging) {
				this.updatePosition($(this.options.video).get('volume'));
			}
		}.bind(this));
		
		// canplay, so we can start
		$(this.options.video).addEvent('canplay', function(an_event) {
			if (this.options.initialVolume) {
				$(this.options.video).set('volume', this.options.initialVolume);
			}
			this.attach();
		}.bind(this));
	},
	
	updatePosition: function(volume)
	{
		if (this.options.mode == 'vertical') volume = 1.0 - volume;
		position = this.toPosition( volume / 1.0 * this.range );
		this.knob.setStyle(this.property, position); // we "manually" set the knob position in order to avoid triggering another event
	},
	
	updateVolume: function(position)
	{
		volume = ( position / this.range * 1.0 ); // from position to volume
		if (this.options.mode == 'vertical') volume = 1.0 - volume;
		$(this.options.video).set('volume', volume);
	}
});
