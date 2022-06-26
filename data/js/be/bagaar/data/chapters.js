/* Chapter */

Chapter = new Class({
	
	Implements: [Options],
	
	options: {
		href: '',
		text: '',
		title: '',
		start: '',
		end: ''
	},
	
	href: '',
	text: '',
	title: '',
	start: '',
	end: '',
	
	initialize: function(options) {
		this.href = options.href;
		this.text = options.text;
		this.title = options.title;
		this.start = options.start;
		this.end = options.end;
	}
});

/* Chapters */

Chapters = new Class({
	
	data: [],
	
	initialize: function(options) {
		
		/*var ch1 = new Chapter({text: '01', title: 'Echo screening', start: '00:05', end: '01:25'});
		this.data.push(ch1);
		
		var ch2 = new Chapter({text: '02', title: 'Atrial transseptal puncture', start: '01:26', end: '05:35'});
		this.data.push(ch2);
		
		var ch3 = new Chapter({text: '03', title: 'Steerable guide insertion', start: '05:36', end: '12:56'});
		this.data.push(ch3);
		
		var ch4 = new Chapter({text: '04', title: 'Clip Delivery system', start: '12:57', end: '17:12'});
		this.data.push(ch4);
		
		var ch5 = new Chapter({text: '05', title: 'Initial system positioning in the left atrium', start: '17:13', end: '21:43'});
		this.data.push(ch5);
		
		var ch6 = new Chapter({text: '06', title: 'Final system positioning', start: '21:44', end: '26:47'});
		this.data.push(ch6);
		
		var ch7 = new Chapter({text: '07', title: 'Steering to the ventricle', start: '26:48', end: '29:36'});
		this.data.push(ch7);
		
		var ch8 = new Chapter({text: '08', title: 'Leaflet insertion assessment', start: '29:37', end: '36:12'});
		this.data.push(ch8);
		
		var ch9 = new Chapter({text: '09', title: 'Pre-deployment clip assessment', start: '36:13', end: '36:58'});
		this.data.push(ch9);
		
		var ch10 = new Chapter({text: '10', title: 'Clip deployment', start: '36:59', end: '41:16'});
		this.data.push(ch10);
		
		var ch11 = new Chapter({text: '11', title: 'System removal & groin closure', start: '41:17', end: '43:13'});
		this.data.push(ch11);*/
	}
});