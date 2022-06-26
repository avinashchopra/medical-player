const pageWisePlayer = {
    1: 1,
    2: 1,
    3: 1,
    4: 3,
    5: 3,
    6: 4,
    7: 4, 
    8: 4, 
    9: 4, 
    10: 3,
    11: 2,
    12: 1,
    13: 2
};
//to-do add the PDF link here  
var videoIds = ['vid1', 'vid2', 'vid3', 'vid4' ];
var vidContainers = ['vidContainer1', 'vidContainer2', 'vidContainer3', 'vidContainer4'];
var views = ['main', 'top', 'center', 'bottom'];
//var views = ['main', 'top', 'angio', 'echo'];
var activeVideoId;
function getIds(url = window.location.hash) {
    const substrs = url.replace('#', '').split('&');
    let id;
    let title;
    let region;
    try{
        for(let i=0;substrs && i <substrs.length; i++) {
            const s = substrs[i].split('=');
            if(s[0].toLowerCase() === 'id') {
                id = parseInt(s[1]); 
            } else if(s[0].toLocaleLowerCase() === 'title') {
                title = s[1];
            } else if(s[0].toLocaleLowerCase() === 'region') {
                region = s[1];
            }
        }
    } catch(err) {
        console.log('Error in getIds methods', err);
    }
    return {id, title, region};
}
