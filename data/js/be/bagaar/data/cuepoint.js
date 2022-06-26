/* Cuepoint */

Cuepoint = new Class({
					 
	Implements: [Options],

	options: {
		focusOn: '',
		time: ''
	},
	
	focusOn: '',
	time: '',
	
	initialize: function(options) {
		this.focusOn = options.focusOn;
		this.time = options.time;
	}
});

/* Cuepoints */

Cuepoints = new Class({
	
	data: [],
	
	initialize: function(options) {
		
		var c1 = new Cuepoint({focusOn: 'vidContainer1', time: '00:00'});
		this.data.push(c1);
		
		var c2 = new Cuepoint({focusOn: '', time: '00:04'});
		this.data.push(c2);
		
		/*var c1 = new Cuepoint({focusOn: 'vidContainer4', time: '00:08'});
		this.data.push(c1);
		
		var c2 = new Cuepoint({focusOn: 'vidContainer1', time: '01:28'});
		this.data.push(c2);
		
		var c3 = new Cuepoint({focusOn: 'vidContainer4', time: '01:52'});
		this.data.push(c3);
		
		var c4 = new Cuepoint({focusOn: 'vidContainer1', time: '02:02'});
		this.data.push(c4);
		
		var c5 = new Cuepoint({focusOn: 'vidContainer4', time: '02:41'});
		this.data.push(c5);
		
		var c6 = new Cuepoint({focusOn: 'vidContainer1', time: '04:57'});
		this.data.push(c6);
		
		var c7 = new Cuepoint({focusOn: 'vidContainer4', time: '05:01'});
		this.data.push(c7);
		
		var c8 = new Cuepoint({focusOn: 'vidContainer3', time: '05:25'});
		this.data.push(c8);
		
		var c9 = new Cuepoint({focusOn: 'vidContainer1', time: '05:38'});
		this.data.push(c9);
		
		var c10 = new Cuepoint({focusOn: 'vidContainer3', time: '08:18'});
		this.data.push(c10);
		
		var c11 = new Cuepoint({focusOn: 'vidContainer1', time: '08:26'});
		this.data.push(c11);
		
		var c12 = new Cuepoint({focusOn: 'vidContainer4', time: '08:46'});
		this.data.push(c12);
		
		var c13 = new Cuepoint({focusOn: 'vidContainer1', time: '09:00'});
		this.data.push(c13);
		
		var c14 = new Cuepoint({focusOn: 'vidContainer4', time: '09:31'});
		this.data.push(c14);
		
		var c15 = new Cuepoint({focusOn: 'vidContainer3', time: '09:40'});
		this.data.push(c15);
		
		var c16 = new Cuepoint({focusOn: 'vidContainer1', time: '09:49'});
		this.data.push(c16);
		
		var c17 = new Cuepoint({focusOn: 'vidContainer4', time: '09:58'});
		this.data.push(c17);
		
		var c18 = new Cuepoint({focusOn: '', time: '10:37'});
		this.data.push(c18);
		
		var c19 = new Cuepoint({focusOn: 'vidContainer1', time: '13:19'});
		this.data.push(c19);
		
		var c20 = new Cuepoint({focusOn: 'vidContainer3', time: '14:28'});
		this.data.push(c20);
		
		var c21 = new Cuepoint({focusOn: '', time: '14:41'});
		this.data.push(c21);
		
		var c22 = new Cuepoint({focusOn: 'vidContainer4', time: '15:03'});
		this.data.push(c22);
		
		var c23 = new Cuepoint({focusOn: 'vidContainer3', time: '15:10'});
		this.data.push(c1);
		
		var c24 = new Cuepoint({focusOn: 'vidContainer4', time: '15:18'});
		this.data.push(c23);
		
		var c25 = new Cuepoint({focusOn: '', time: '15:24'});
		this.data.push(c25);
		
		var c26 = new Cuepoint({focusOn: 'vidContainer3', time: '15:48'});
		this.data.push(c26);
		
		var c27 = new Cuepoint({focusOn: 'vidContainer4', time: '15:56'});
		this.data.push(c27);
		
		var c28 = new Cuepoint({focusOn: '', time: '17:15'});
		this.data.push(c28);
		
		var c29 = new Cuepoint({focusOn: 'vidContainer4', time: '18:13'});
		this.data.push(c29);
		
		var c30 = new Cuepoint({focusOn: '', time: '18:24'});
		this.data.push(c30);
		
		var c31 = new Cuepoint({focusOn: 'vidContainer4', time: '18:46'});
		this.data.push(c31);
		
		var c32 = new Cuepoint({focusOn: 'vidContainer3', time: '19:00'});
		this.data.push(c32);
		
		var c33 = new Cuepoint({focusOn: 'vidContainer4', time: '19:15'});
		this.data.push(c33);
		
		var c34 = new Cuepoint({focusOn: '', time: '21:20'});
		this.data.push(c34);
		
		var c35 = new Cuepoint({focusOn: '', time: '21:46'});
		this.data.push(c35);
		
		var c36 = new Cuepoint({focusOn: 'vidContainer1', time: '22:00'});
		this.data.push(c36);
		
		var c37 = new Cuepoint({focusOn: 'vidContainer3', time: '22:16'});
		this.data.push(c37);
		
		var c38 = new Cuepoint({focusOn: 'vidContainer1', time: '22:25'});
		this.data.push(c38);
		
		var c39 = new Cuepoint({focusOn: 'vidContainer3', time: '22:39'});
		this.data.push(c39);
		
		var c40 = new Cuepoint({focusOn: 'vidContainer1', time: '22:43'});
		this.data.push(c40);
		
		var c41 = new Cuepoint({focusOn: 'vidContainer4', time: '23:08'});
		this.data.push(c41);
		
		var c42 = new Cuepoint({focusOn: 'vidContainer1', time: '23:14'});
		this.data.push(c42);
		
		var c43 = new Cuepoint({focusOn: 'vidContainer4', time: '23:20'});
		this.data.push(c43);
		
		var c44 = new Cuepoint({focusOn: '', time: '26:50'});
		this.data.push(c44);
		
		var c45 = new Cuepoint({focusOn: 'vidContainer4', time: '27:16'});
		this.data.push(c45);
		
		var c46 = new Cuepoint({focusOn: '', time: '29:39'});
		this.data.push(c46);
		
		var c47 = new Cuepoint({focusOn: 'vidContainer3', time: '30:00'});
		this.data.push(c47);
		
		var c48 = new Cuepoint({focusOn: '', time: '30:13'});
		this.data.push(c48);
		
		var c49 = new Cuepoint({focusOn: 'vidContainer4', time: '30:56'});
		this.data.push(c49);
		
		var c50 = new Cuepoint({focusOn: '', time: '31:51'});
		this.data.push(c50);
		
		var c51 = new Cuepoint({focusOn: 'vidContainer4', time: '32:39'});
		this.data.push(c51);
		
		var c52 = new Cuepoint({focusOn: 'vidContainer3', time: '36:36'});
		this.data.push(c52);
		
		var c53 = new Cuepoint({focusOn: 'vidContainer1', time: '37:01'});
		this.data.push(c53);
		
		var c54 = new Cuepoint({focusOn: 'vidContainer3', time: '39:15'});
		this.data.push(c54);
		
		var c55 = new Cuepoint({focusOn: 'vidContainer1', time: '39:27'});
		this.data.push(c55);*/
	}
});