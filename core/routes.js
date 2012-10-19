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




	
// ROUTES


/* carica le routes di polenta */
function defineRoutes(app) {
	
	
	//GET: home
	app.get('/', app.pol.perm.readStrucPermDefault, function(req, res){ 
		app.pol.routes.routeInit(req);
		res.render('home', {
		});
	});

	//POST: login signin
	app.post('/signin', function(req, res) {
		app.pol.routes.routeInit(req);
		//controllo se esiste il mio utente nel db
		app.pol.sess.checkValidUser(req, function(result, user_id) { 
			if ( result )
			{
				//ho trovato lo user nel db (oppure sono superadmin)
				//il login è valido
				app.pol.sess.setSignedIn(req, user_id);
				console.log("POST: login signin: login succeded for user: "+req.body.login_email);
				//alla fine ricarico la pagina da cui arrivavo
				res.redirect('back');
			}
			else
			{
				//il mio utente non c'è nel db
				app.pol.sess.setSignedOut(req);
				console.log("POST: login signin: login failed for user: "+req.body.login_email);
				//alla fine ricarico la pagina da cui arrivavo
				res.redirect('back');
			}
		});	
	});
	
	//GET: login signout
	app.get('/signout', function(req, res) {
		app.pol.routes.routeInit(req);
		//resetto le session
		console.log("POST: login signout: for user: "+req.session.email);
		app.pol.sess.setSignedOut(req);
		//alla fine ricarico la pagina da cui arrivavo
		res.redirect('back');
	});
	
	//GET: change language
	app.get('/lan/:locale?', function(req, res) {
		app.pol.routes.routeInit(req);
		//cambio la lingua
		//req.session.currentLocale = req.params.locale;
		//console.log("prima nei cookie ho:");
		//console.log(req.cookies);
		res.cookie('currentlocale', req.params.locale, { expires: new Date(Date.now() + app.pol.config.cookiesDurationMs), path: '/' });
		//console.log('dopo nei cookies ho: ');
		//console.log(req.cookies);
		//alla fine ricarico la pagina da cui arrivavo
		res.redirect('back');
	});
	
	//POST: qaptcha specific route
	app.post('/qaptcha', function(req, res) {
		app.pol.routes.routeInit(req);
		console.log(req.body);
		var response = {};
		response['error'] = false;
			
		if(req.body.action && req.body.qaptcha_key)
		{
			req.session.qaptcha_key = false;	
			
			if(req.body.action == 'qaptcha')
			{
				req.session.qaptcha_key = req.body.qaptcha_key;
			}
			else
			{
				response['error'] = true;
			}
		}
		else
		{
			response['error'] = true;
		}
		res.json( response );
	});
	
	
	
	/*
	FILTERS
	nota: ora li tengo qui, ma se aumentano sarà meglio metterli, ove possibile, nei rispettivi controllers js
	*/
	
	//GET: list filter All or Mine
	app.get('/filterAllOrMine/:filterOn', function(req, res) {
		app.pol.routes.routeInit(req);
		//posso filtrare sui miei elementi solo se sono loggato, e se non sono superadmin
		if ( req.session.loggedIn && req.session.user_id != 'superadmin' )
		{
			//sono loggato, non come superadmin, quindi posso filtrare
			req.session.filterAllOrMine = req.params.filterOn;
		}
		else if ( req.session.loggedIn && req.session.user_id == 'superadmin' )
		{
			//sono loggato come superadmin, non posso filtrare sui miei elementi ma solo su tutti
			req.session.filterAllOrMine = 'all';
		}
		else
		{
			//se invece sto cercando di attivare il filtering senza essere loggato, forzo un loagout che mi azzera tutte le sessions
			setSignedOut(req);
		}
		//alla fine ricarico la pagina da cui arrivavo
		res.redirect('back');
	});
	

}


/* questa va richiamata da ogni route, e compie operazioni utili e comuni a tutte le route.
nota che i controlli sui permessi vengono fatti dal middleware, questa servirà ad altro */
function routeInit(req)
{
	//prima loggo la route in cui sono entrato
	console.log('route matched: ('+req.route.method.toUpperCase()+') '+req.route.path);	
	
	//salvo nelle sessions la pagina in cui mi trovo (cioè il primo chunk del path)
	var chunks = req.route.path.split("/");
	req.session.currentPage = chunks[1];
}





exports.defineRoutes = defineRoutes; 
exports.routeInit = routeInit; 



