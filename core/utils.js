/**
 * polenta
 * 
 * 
 * polenta is something like a framework, aimed at expermineting with 
 * new W3C File API for javascript. polenta is based on node + express
 * + mongodb, and implements MVC pattern. *
 *
 * Copyright (C) 2012 Federico Carrara (federico@obliquid.it)
 *
 * For more information http://obliquid.org/
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */



// VARS

/*
questa var viene impostata da polenta.js appena dopo il require di utils.js
 
in generale app viene passato come parametro alle functions di utils e di tutti
i moduli di polenta.
nel caso però si vogliano usare queste function come helper nelle view dei siti
degli utenti, la variabile app non è definita e non può essere passata alle view
per motivi di sicurezza. quindi per questi casi serve app definita come variabile
interna di utils.
*/
var app;





	



// VARIE




/* visualizza una pagina di errore e logga sulla console */
function errorPage(res, errMsg, publicMsg, useLayout) {
	if ( useLayout === undefined ) useLayout = true;
	console.log(errMsg);
	res.render('error', {
		layout: useLayout,
		errMsg: errMsg,
		publicMsg: publicMsg
	});			
}
exports.errorPage = errorPage; 


/*
questa serve quando mi arriva da un form l'oggetto req.body con tutti i campi del form, e devo salvarli nell'oggetto mongoose.
per non dover scrivere condice embedded (un assegnamento per ogni campo del form), c'è questo metodo che loopa su tutti i campi che arrivano dal form
e li salva pari pari nell'oggetto che andrà nel db.
*/
function populateModel(model, modelData) {
	//questa va lasciata così, e poi ne va creata un'altra populateContentModel che
	//fa un matching delle property da popolare direttamente sullo schema del mio model
	/*
	console.log('############### populateModel');
	console.log('model:');
	console.log(model);
	console.log('modelData:');
	console.log(modelData);
	*/
	//if(modelData.hasOwnProperty('titolo') && typeof modelData['titolo'] !== 'function') {
	
	
	
	//ciclo su tutte le property che mi arrivano in modelData (le dovrò replicare in model)
	for(var prop in modelData) {
		if(modelData.hasOwnProperty(prop) && typeof modelData[prop] !== 'function')
		{
			//assegno a model la mia property, ma solo se non si tratta dell'id
			if( prop != "id" )
			{
				/*
				console.log('### considero la prop: '+prop+' ###');
				console.log('typeof modelData[prop]='+typeof modelData[prop]);
				console.log('typeof model[prop]='+typeof model[prop]);
				console.log('modelData[prop]='+modelData[prop]);
				console.log('model[prop]='+model[prop]);
				*/
				//porcheria per gestire i valori boolean
				//il form tratta tutto come string mentre lo schema mongoose è tipizzato
				//quandi un 'false' che arriva da un form diventerebbe un true nel db in quanto stringa non vuota castata a boolean
				if ( modelData[prop] == 'sure_this_is_true' ) {
					model[prop] = true;
				} else if ( modelData[prop] == 'sure_this_is_false' ) {
					model[prop] = false;
				} else {
					model[prop] = modelData[prop];
				}
			}
		}
	}
	/*
	console.log('############### populateModel alla fine');
	console.log('model:');
	console.log(model);
	console.log('modelData:');
	console.log(modelData);
	*/
}
exports.populateModel = populateModel;

function trunc(string,length) {
	if ( string && string.length > length ) {
		return string.substr(0,length)+'...';
	} else {
		return string;
	}
}
exports.trunc = trunc; 

var is_array = function (value) {
	//versione easy: return value && typeof value === 'object' && value.constructor === Array;
	return Object.prototype.toString.apply(value) === '[object Array]'; //questo va anche per array definiti in altre windows o frame
};
exports.is_array = is_array; 

var in_array = function (arr,obj) {
    return (arr.indexOf(obj) != -1);
}
exports.in_array = in_array; 

var splice_by_element = function (my_array,array_element) {
	for(var i=0; i<my_array.length;i++ ) { 
		if ( my_array[i] == array_element ) {
			my_array.splice(i,1); 
		}
	}
	return my_array;
}
exports.splice_by_element = splice_by_element; 

/* removes an element from an array by content */
Array.prototype.remove= function(){
    var what, a= arguments, L= a.length, ax;
    while(L && this.length){
        what= a[--L];
        while((ax= this.indexOf(what))!= -1){
            this.splice(ax, 1);
        }
    }
    return this;
}

/* says if an object is empty, i.e.: obj = {} */
function is_empty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}
exports.is_empty = is_empty;

/*
quando si ha un valore booleano che non si sa se è di tipo booleano
o di tipo stringa (cioè un booleano convertito in stringa 'true' o 'false')
questa function la ritrasforma in booleano
*/
var bool_parse = function (my_bool_string) {
	if ( !my_bool_string || my_bool_string == 'false' ) {
		return false;
	} else {
		return true;
	}
}
exports.bool_parse = bool_parse; 

/*
converte le date che arrivano da mongodb in date compatibili con il datepicker usato nel frontend
*/
var mongo_to_datepicker = function(mongoDate) {
	//console.log(mongoDate);
	var jsDate = new Date(mongoDate);
	var d = zeroPad(jsDate.getDate(),2);
	var m = zeroPad(jsDate.getMonth()+1,2);
	var y = jsDate.getFullYear();
	var h = zeroPad(jsDate.getHours(),2);
	var mn = zeroPad(jsDate.getMinutes(),2);
	var s = zeroPad(jsDate.getSeconds(),2);
	var pickerDate = y+'-'+m+'-'+d+'T'+h+':'+mn+':'+s;
	//console.log(pickerDate);
	return pickerDate;
}
exports.mongo_to_datepicker = mongo_to_datepicker; 

function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}
exports.zeroPad = zeroPad; 

/* dato un modelId e un contentId, ritorna il path in cui salvare i relativi file uploadati */
function getContentPath(modelId,contentId) {
	//console.log('getContentPath:');
	modelId = modelId.toString();
	contentId = contentId.toString();
	//console.log(modelId);
	//console.log(contentId);
	var path = '';
	path += 'files/model/';
	for(var i=0; i<String(modelId).length; i++) {
		path += modelId.charAt(i)+'/';
	}
	path += 'content/';
	for(i=0; i<String(contentId).length; i++) {
		path += contentId.charAt(i)+'/';
	}
	return path;
}
exports.getContentPath = getContentPath; 

/*
crea tutte le directory che compongono un path
in input si aspetta un path assoluto sul filesystem in cui gira l'application (inizia con /)
*/
function mkPath(path) {
	console.log('mkPath con path:' + path);
	var fs = require('fs');
	var createdPath = '';
	var dirs = path.split('/');
	while ( dirs.length > 0 ) {
		var dir = dirs.shift();
		if (dir != '') {
			createdPath += '/'+dir;
			//controllo se esiste già
			try
			{
				var stats = fs.lstatSync(createdPath);
				console.log('la dir to esiste già');
			}
			catch (e)
			{
				console.log('la dir to non esiste');
				console.log('creo dir: '+createdPath);
				fs.mkdirSync(createdPath, 0775);
				console.log('creato dir: '+createdPath);
			}
		}
	}
}

/*
camuffa un poco un'email contro gli spammer
*/
function emailObfuscate(email) {
	return email.replace("@", " - at - ");
}
exports.emailObfuscate = emailObfuscate;

/*
renderizza una stringa json come literal leggibile
ovvero mette tab e mandate a capo
#### OKKIO: E' DUPLICATA IN public/javascripts/polenta.js ####
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
exports.renderJson = renderJson;

/*
è un helper da usare direttamente nei tpl jade.
data un'immagine da visualizzare (completa di file_name e file_path) e una risoluzione
crea l'immagine ridimensionata se già non esiste, e ne ritorna l'url.
essendo usata nei tpl, viene eseguita prima che il tpl arrivi all'utente,
che nel browser riceve sempre un url esplicito, e non l'url di uno script
*/
function getImg(image,width,height,cssClasses,domId) {
	//se invece di una singola immagine mi arriva un array, tengo la prima
	if (is_array(image)) image = image[0];
	
	var path = image.file_path;
	var name = image.file_name;
	if ( !domId ) domId = '';
	if ( !cssClasses ) cssClasses = '';
	if ( !width ) width = 0;
	if ( !height ) height = 0;
	//costruisco l'url dell'immagine ridimensionata
	var resizedName = 'size'+width+'x'+height+'_'+name;
	var url = process.cwd()+'/public/'+path+name;
	var resizedUrl = process.cwd()+'/public/'+path+resizedName;
	console.log('getImg()');
	//console.log('image:');
	//console.log(image);
	console.log('url:');
	console.log(url);
	console.log('resizedUrl:');
	console.log(resizedUrl);
	
	//considero i casi su width ed height = 0
	if ( width == 0 && height == 0 ) {
		//devo restituire l'immagine originale
		return "<img id='"+domId+"' class='"+cssClasses+"' src='/"+path+name+"'/>";
	}
	
	//controllo se esiste già l'immagine ridimensionata
	try
	{
		var fs = require('fs');
		var stats = fs.lstatSync(resizedUrl);
		console.log('resized esiste già');
		//ritorno l'immagine già esistente
		//ritorno l'url, con uno slash davanti, altrimenti non funzia
		return "<img id='"+domId+"' class='"+cssClasses+"' src='/"+path+resizedName+"'/>";
	}
	catch (e)
	{
		console.log('resized NON esiste, va creata');
		console.log('width:');
		console.log(width);
		console.log('height:');
		console.log(height);
		var im = require('imagemagick');
		//distinguo i casi di width o height = 0
		if ( width == 0 ) {
			console.log('fisso height');
			//prima trovo le specs dell'immagine
			im.identify(url, function(err, features){
				if (err) throw err;
				console.log(features);
				// { format: 'JPEG', width: 3904, height: 2622, depth: 8 }
				//trovo width in funzione di height
				width = height*features.width/features.height;
				im.resize({
					srcPath: url,
					dstPath: resizedUrl,
					'width':   width,
					'height':   height,
					quality: 0.9,
					//format: 'jpg',
					//progressive: false,
					strip: false,
					//filter: 'Lagrange',
					sharpening: 0.2
					//customArgs: []			
				}, function(err, stdout, stderr){
					if (err) throw err;
				});
			});
			//ritorno l'url, con uno slash davanti, altrimenti non funzia
			//ritorno l'url originario perchè la cache sta venendo generata e non è ancora disponibile
			return "<img id='"+domId+"' class='"+cssClasses+"' src='/"+path+name+"' style='height:"+height+"px;'/>";
		} else if ( height == 0 ) {
			console.log('fisso width');
			//prima trovo le specs dell'immagine
			im.identify(url, function(err, features){
				if (err) throw err;
				console.log(features);
				// { format: 'JPEG', width: 3904, height: 2622, depth: 8 }
				//trovo height in funzione di width
				height = width*features.height/features.width;
				im.resize({
					srcPath: url,
					dstPath: resizedUrl,
					'width':   width,
					'height':   height,
					quality: 0.9,
					strip: false,
					sharpening: 0.2
				}, function(err, stdout, stderr){
					if (err) throw err;
				});
			});
			//ritorno l'url, con uno slash davanti, altrimenti non funzia
			//ritorno l'url originario perchè la cache sta venendo generata e non è ancora disponibile
			return "<img id='"+domId+"' class='"+cssClasses+"' src='/"+path+name+"' style='width:"+width+"px;'/>";
		} else {
			console.log('croppo');
			//prima trovo le specs dell'immagine
			im.identify(url, function(err, features){
				if (err) throw err;
				console.log(features);
				// { format: 'JPEG', width: 3904, height: 2622, depth: 8 }
				im.crop({
					srcPath: url,
					dstPath: resizedUrl,
					'width': width,
					'height': height,
					quality: 0.9,
					sharpening: 0.2
				}, function(err, stdout, stderr){
					if (err) throw err;
				});
			});
			//ritorno l'url, con uno slash davanti, altrimenti non funzia
			//ritorno l'url originario perchè la cache sta venendo generata e non è ancora disponibile
			return "<img id='"+domId+"' class='"+cssClasses+"' src='/"+path+name+"' style='width:"+width+"px;height:"+height+"px;'/>";
		}
	}
}
exports.getImg = getImg;


