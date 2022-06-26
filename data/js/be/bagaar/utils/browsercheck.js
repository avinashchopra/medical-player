// check which browser your client has

function checkForFirox() {
	if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) { //test for Firefox/x.x or Firefox x.x (ignoring remaining digits);
		var ffversion = new Number(RegExp.$1) // capture x.x portion and store as a number
		
		if (ffversion >= 4) {
			return true;
		} else {
			//document.body.removeChild($('no_firefox'));
			//$('firefox_upgrade').setStyle('opacity', 1);
			return false;
		}
	}else{
		//document.body.removeChild($('firefox_upgrade'));
		//$('no_firefox').setStyle('opacity', 1);
	}
	
	return false;
}