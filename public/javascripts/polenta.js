


/* #### VARS #### */













/* #### FUNCTIONS #### */



/* crockford */

var is_array = function (value) {
	//versione easy: return value && typeof value === 'object' && value.constructor === Array;
	return Object.prototype.toString.apply(value) === '[object Array]'; //questo va anche per array definiti in altre windows o frame
};

var in_array = function (arr,obj) {
    return (arr.indexOf(obj) != -1);
}

Array.prototype.remove= function(){
	//alert('beppe!');
	var index = this.indexOf(arguments[0]);
	this.splice(index, 1);
	return this;
	/*
    var what, a= arguments, L= a.length, ax;
    while(L && this.length){
        what= a[--L];
        while((ax= this.indexOf(what))!= -1){
            this.splice(ax, 1);
        }
    }
    return this;
	*/
}




/* JQUERY PLUGINS */

//center a div on screen
//usage: $(element).center()
jQuery.fn.center = function () {
    //this.css("top", "0px");
    //this.css("left", "0px");
	//alert(window.pageYOffset);
    this.css("position","absolute");
    this.css("top", (($(window).height() - this.outerHeight()) / 2) + $(window).scrollTop() + "px");
    this.css("left", (($(window).width() - this.outerWidth()) / 2) + $(window).scrollLeft() + "px");
    return this;
}

//open modal iframe popup
function openModal(src, width, height, data) {
	if ( !width ) width = 680;
	if ( !height ) height = 300; //ora non lo uso, perchè l'altezza è calcolata in automatico
	//var elementId = 'orcodio';
	var originalYScroll = window.pageYOffset;
	//var modalFrame = $.modal('<iframe id="'+ elementId +'" src="' + src + '" width="' + width + '" onload="centerModal(this,' + originalYScroll + ')" style="border:0">', {
	var modalFrame = $.modal('<iframe src="' + src + '" width="' + width + '" onload="centerModal(this,' + originalYScroll + ')" style="border:0">', {
		closeHTML:'',
		containerCss:{
			backgroundColor:"#fff",
			borderColor:"#fff",
			width:width,
			padding:0,
			margin:0
		},
		overlayClose:true,
		autoPosition:false,
		modal:true,
		opacity:70
	});
}
function centerModal(f, originalYScroll) {
	$(window).scrollTop(originalYScroll);
    //$('#simplemodal-container').css("top", "0px");
    //$('#simplemodal-container').css("left", "0px");
	//var height = $('#simplemodal-container').height(f.contentWindow.document.body.scrollHeight);
	//var height = 200;
	var myHeight = $('#simplemodal-container').height();
	var height = $(window).height();
	//alert( myHeight);
	//alert( height);
	f.style.height = String(height) + 'px';
	$('#simplemodal-container').height(height);
	$('#simplemodal-container').center();
}


//data() selector
(function($){
 
    // Extend jQuery's native ':'
    $.extend($.expr[':'],{
 
        // New method, "data"
        data: function(a,i,m) {
 
            var e = $(a).get(0), keyVal;
 
            // m[3] refers to value inside parenthesis (if existing) e.g. :data(___)
            if(!m[3]) {
 
                // Loop through properties of element object, find any jquery references:
                for (var x in e) { if((/jQuery\d+/).test(x)) { return true; } }
 
            } else {
 
                // Split into array (name,value):
                keyVal = m[3].split('=');
 
                // If a value is specified:
                if (keyVal[1]) {
 
                    // Test for regex syntax and test against it:
                    if((/^\/.+\/([mig]+)?$/).test(keyVal[1])) {
                        return
                         (new RegExp(
                             keyVal[1].substr(1,keyVal[1].lastIndexOf('/')-1),
                             keyVal[1].substr(keyVal[1].lastIndexOf('/')+1))
                          ).test($(a).data(keyVal[0]));
                    } else {
                        // Test key against value:
                        return $(a).data(keyVal[0]) == keyVal[1];
                    }
 
                } else {
 
                    // Test if element has data property:
                    if($(a).data(keyVal[0])) {
                        return true;
                    } else {
                        // If it doesn't remove data (this is to account for what seems
                        // to be a bug in jQuery):
                        $(a).removeData(keyVal[0]);
                        return false;
                    }
 
                }
            }
 
            // Strict compliance:
            return false;
 
        }
 
    });
})(jQuery);


//select a tab, displaying its content
function selectTab(tab,content) {
	//deseleziono tutti i tab
	$('#'+tab).parent().children().removeClass('tabButtonSelected');
	//seleziono il tab cliccato
	$('#'+tab).addClass('tabButtonSelected');
	//nascondo tutti i content
	$('#'+content).parent().children().fadeOut('fast');
	//seleziono il tab cliccato
	$('#'+content).delay(200).fadeIn('fast');
}


/* other functions */


function nameuniquize(stringDirty) {
	var allowedChars  = [
		"a",
		"b",
		"c",
		"d",
		"e",
		"f",
		"g",
		"h",
		"i",
		"j",
		"k",
		"l",
		"m",
		"n",
		"o",
		"p",
		"q",
		"r",
		"s",
		"t",
		"u",
		"v",
		"w",
		"x",
		"y",
		"z",
		"0",
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"_",
		"-"
	];
	var nameuniquizedString = '';
	for(var i=0; i<stringDirty.length; i++) {
		var dirtyChar = stringDirty.charAt(i).toLowerCase();
		if (dirtyChar == ' ') dirtyChar = '_';
		if ( in_array(allowedChars,dirtyChar) ) {
			nameuniquizedString += dirtyChar;
		}
	}
	return nameuniquizedString;
}



function checkReservedWord(word) {
	var reserved = [
		'model',
		'name_full',
		'required',
		'author',
		'created',
		'status',
		'id',
		'_id',
		'string',
		'number',
		'boolean',
		'date',
		'image',
		'objectid'
	];
	return in_array(reserved,word.toLowerCase());
}


/*
renderizza una stringa json come literal leggibile
ovvero mette tab e mandate a capo
#### OKKIO: E' DUPLICATA IN core/utils.js ####
*/
function renderJson(jsonString,tabString) {
	if (!jsonString) return '';
	if ( !tabString ) tabString = '&nbsp;&nbsp;';
	var recursionCount = 0;
	return recurse(JSON.parse(jsonString));
	function recurse(jsonObj) {
		var rowPrefix = '';
		for ( var i=0; i<recursionCount; i++ ) {
			rowPrefix += tabString;
		}
		var output = '{';
		var isFirst = true;
		for (var property in jsonObj) {
			if ( jsonObj.hasOwnProperty(property) && typeof jsonObj[property] !== 'function') {
				if (!isFirst) {
					output += ',';
				}
				isFirst = false;
				output += '\n'+rowPrefix+tabString;
				//butto fuori il nome della property
				output += '"'+property+'": ';
				//se la mia property è un object, devo ricorrere
				if ( typeof jsonObj[property] === 'object' && !is_array(jsonObj[property]) ) {
					recursionCount++;
					output += recurse(jsonObj[property]);
					recursionCount--;
				} else if ( is_array(jsonObj[property]) ) {
					output += '[';
					for ( i=0; i<jsonObj[property].length; i++ ) {
						if (i>0) output += ',';
						output += '"'+jsonObj[property][i]+'"';
					}
					output += ']';
				} else {
					output += '"'+jsonObj[property]+'"';
				}
			}
		}
		return output+'\n'+rowPrefix+'}';
	}
}








/* #### THEN THINGS TO DO ON READY #### */


$(document).ready(
	function()
	{
	}
);

	
	
	
/* #### FINALLY THINGS TO DO ON LOAD (AFTER ALL IMAGES ARE LOADED) #### */

	
$(window).load(
	function()
	{
	}
);
	

