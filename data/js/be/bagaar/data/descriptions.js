/*
	Klasse die alle descriptions bijhoud
	Wanneer je een description wil toevoegen/verwijderen/wijzigen,
	doe je dit in de initialize functie van Chapters (regel74)
*/

/*
	Description data klasse
*/
Description = new Class({

	Implements: [Options],
	
	options: {
 		text: ''
	},
	
	text: '',
	start:'',	
	end:'',

	initialize: function(options)
	{
		this.text = options.text;
		
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
		
		/*this.__defineSetter__("start", this.setStart);
   		this.__defineGetter__("start", this.getStart);
		
		this.__defineSetter__("end", this.setEnd);
   		this.__defineGetter__("end", this.getEnd);*/
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
	Chapters data klasse, houd alle chapters bij
*/
Descriptions = new Class({
	
	data: [],	

	initialize: function(options)
	{
		var d;
		
		d = new Description({text:'Steerable Guide Catheter has hydrophilic coating '});
		d.start = '01:15';
		d.end = '01:25';
		this.data.push(d);
		
		d = new Description({text:'Septal dilation'});
		d.start = '02:03';
		d.end = '02:13';
		this.data.push(d);
		
		d = new Description({text:'Positioning in left atrium'});
		d.start = '03:00';
		d.end = '03:10';
		this.data.push(d);
		
		d = new Description({text:'Initial steering down to the valve'});
		d.start = '03:53';
		d.end = '04:03';
		this.data.push(d);
		
		d = new Description({text:'Orientation of clip arms perpendicular to the line of coaptation'});
		d.start = '05:33';
		d.end = '05:43';
		this.data.push(d);
		
		d = new Description({text:'Prepare to cross into L.V.'});
		d.start = '06:25';
		d.end = '06:35';
		this.data.push(d);
		
		d = new Description({text:'Confirm double orifice'});
		d.start = '08:05';
		d.end = '08:15';
		this.data.push(d);
		
		d = new Description({text:'Reconfirm clip is perpendicular to valve'});
		d.start = '15:13';
		d.end = '15:23';
		this.data.push(d);
		
		d = new Description({text:'Close clip prior to crossing valve'});
		d.start = '15:50';
		d.end = '16:00';
		this.data.push(d);
		
		d = new Description({text:'Open clip arms and re-establish perpendicularity'});
		d.start = '16:25';
		d.end = '16:35';
		this.data.push(d);
		
		d = new Description({text:'Open and reposition clip due to higher than desired mean ...'});
		d.start = '18:54';
		d.end = '19:04';
		this.data.push(d);
		
		d = new Description({text:'... pressure gradient and unsatisfactory MR reduction.'});
		d.start = '19:05';
		d.end = '19:15';
		this.data.push(d);
		
		d = new Description({text:'Clip repositioned more medial'});
		d.start = '19:37';
		d.end = '19:47';
		this.data.push(d);
		
		d = new Description({text:'Satisfactory reduction of MR'});
		d.start = '20:47';
		d.end = '20:57';
		this.data.push(d);
		
		d = new Description({text:'Satisfactory mean pressure gradient'});
		d.start = '21:01';
		d.end = '21:11';
		this.data.push(d);
	}
});

