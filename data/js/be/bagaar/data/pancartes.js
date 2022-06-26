/*
	Klasse die alle pancartes bijhoud
	Wanneer je een pancarte wil toevoegen/verwijderen/wijzigen,
	doe je dit in de initialize functie van Pancartes 
*/

/*
	Chapter data klasse
*/
Pancarte = new Class({

	Implements: [Options],
	
	options: {
		
	},
	
	start:'',	
	end:'',

	initialize: function(options)
	{
		if(!checkForFirox()) {
			Object.defineProperty(this, 'start', {
				  get: this.getStart,
				  set: this.setStart
				}
			);
		
			Object.defineProperty(this, 'end', {
				  get: this.getEnd,
				  set: this.setEnd
				}
			);
		}else{
			this.__defineSetter__("start", this.setStart);
			this.__defineGetter__("start", this.getStart);
		
			this.__defineSetter__("end", this.setEnd);
			this.__defineGetter__("end", this.getEnd);
		}
	},
	
	setStart: function(val) {
		var re = /^([0-9]*):([0-9]+)$/;
		var matches = val.toString().match(re);
		
		var newtime = 0;
		if (matches && matches.length == 3) {
			newtime = matches[1].toInt()*60 + matches[2].toInt();
		}
		
		this.startTime = newtime;
	},
	
	getStart: function() {
		return this.startTime;
	},
	
	setEnd: function(val) {
		var re = /^([0-9]*):([0-9]+)$/;
		var matches = val.toString().match(re);
		var newtime = 0;
		if (matches && matches.length == 3) {
			newtime = matches[1].toInt()*60 + matches[2].toInt();
		}
		
		this.endTime = newtime;
	},
	
	getEnd: function() {
		return this.endTime;
	}
});

/*
	Pancartes data klasse, houd alle pancartes bij
*/
Pancartes = new Class({
	
	data: [],	

	initialize: function(options)
	{
		var p;
		
		p = new Pancarte();
		p.start = '00:01';
		p.end = '00:15';
		this.data.push(p);
		
		p = new Pancarte();
		p.start = '01:34';
		p.end = '01:39';
		this.data.push(p);
		
		p = new Pancarte();
		p.start = '05:50';
		p.end = '05:55';
		this.data.push(p);
		
		p = new Pancarte();
		p.start = '10:15';
		p.end = '10:20';
		this.data.push(p);
		
		p = new Pancarte();
		p.start = '13:24';
		p.end = '13:29';
		this.data.push(p);
		
		p = new Pancarte();
		p.start = '16:57';
		p.end = '17:02';
		this.data.push(p);
		
		p = new Pancarte();
		p.start = '22:27';
		p.end = '22:32';
		this.data.push(p);
		
		p = new Pancarte();
		p.start = '23:12';
		p.end = '23:17';
		this.data.push(p);
		
		p = new Pancarte();
		p.start = '24:05';
		p.end = '24:10';
		this.data.push(p);
		
		p = new Pancarte();
		p.start = '26:11';
		p.end = '26:16';
		this.data.push(p);
		
		p = new Pancarte();
		p.start = '26:35';
		p.end = '26:40';
		this.data.push(p);
		
		p = new Pancarte();
		p.start = '27:41';
		p.end = '27:46';
		this.data.push(p);
		
		p = new Pancarte();
		p.start = '31:43';
		p.end = '31:48';
		this.data.push(p);
		
		p = new Pancarte();
		p.start = '33:03';
		p.end = '33:08';
		this.data.push(p);
		
		p = new Pancarte();
		p.start = '34:39';
		p.end = '34:44';
		this.data.push(p);
		
		p = new Pancarte();
		p.start = '38:31';
		p.end = '38:36';
		this.data.push(p);
		
		p = new Pancarte();
		p.start = '39:25';
		p.end = '39:30';
		this.data.push(p);
		
		p = new Pancarte();
		p.start = '40:14';
		p.end = '40:19';
		this.data.push(p);
		
		p = new Pancarte();
		p.start = '42:21';
		p.end = '42:26';
		this.data.push(p);
	}
});