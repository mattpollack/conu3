$('div').contents().filter(function() {
  return this.nodeType === 3;
}).wrap('<p></p>').end();
$('body').contents().filter(function() {
  return this.nodeType === 3;
}).wrap('<p></p>').end();
$('p').each(function() {
    var $this = $(this);
    if($this.html().replace(/\s|&nbsp;/g, '').length == 0)
        $this.remove();
});

function stringParse(){

	var children = document.body.children;
	console.log(children[1]);
	var myJson = addList(children);

	console.log(myJson);
}

function addList(children){
	var temp = [];
	console.log(children);
	var acceptedTags = ['P','H1','H2','H3','H4','H5','H6','SPAN','IMG','STRONG','A','B','CODE','CAPTION','DIALOG','EM','I','LABEL','LI','UL','OL','PRE','SPAN','TD','TH','VAR','U'];
	for(var i = 0; i<children.length; i++){
		if(children[i].tagName == 'DIV'){
			//console.log(children[i]);
			temp = temp.concat(addList(children[i].children));
		}else if(acceptedTags.indexOf(children[i].tagName )!= -1){
			console.log(children[i]);
			var helper = {};
			helper[children[i].tagName]=children[i].innerHTML.replace(/\s\s+/g, ' ').trim();
			temp.push(helper);
		}
		
	}
	
	return temp;
}
function stats(date, wpm){
	var helper = {};
	helper[date] = wpm;
	return (helper);

	
}

function handler(){
    /*loader("2018,10,9,10,30,8",100);
    loader("2018,10,10,11,31,9",101);
    loader("2018,10,10,12,31,9",201);
    loader("2018,10,10,13,31,9",201);
    loader("2018,10,10,14,31,9",301);
    loader("2018,10,10,15,31,9",201);
    loader("2018,10,10,16,31,9",301);
    loader("2018,10,10,17,31,9",201);
    loader("2018,10,10,18,31,9",301);
    loader("2018,10,10,19,31,9",201);
    loader("2018,10,10,20,31,9",401);	*/
}



function loader(date,wpm){
	var history = [];
	var cookie = Cookies.getJSON('stats');
	if (typeof cookie == 'undefined'){
		Cookies.set('stats', [stats(date,wpm)]);
	}else{
		history = cookie.concat(stats(date,wpm));
		
	}
	Cookies.set('stats', history);
}
window.onload = handler();

