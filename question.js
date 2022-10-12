var http=require('http')
var url=require('url')
var util=require('util')
var querystring=require('querystring')
var serveStatic=require('serve-static')
var finalhandler=require('finalhandler')
var fs=require('fs')
var serve = serveStatic('public', {'index': ['index.html', 'index.htm']})
var crypto = require('crypto')

http.createServer((req, resp)=> {
//	var post='';
//
//	req.on('data', function(chunk){
//		post += chunk;
//	});
//
//	req.on('end', function(){
//		post = querystring.parse(post);
//		resp.end(util.inspect(post));
//	});
	var pathname = url.parse(req.url).pathname;
	var method = req.method;
	if(pathname=='/' && method=='POST')
	{
		// Get posted data
		var post='';
		req.on('data',(chunk)=> {
			post += chunk;
		});
		req.on('end',()=> {
			post = querystring.parse(post);
			resp.writeHead(200,{'Content-Type': 'text/html; charset=utf8'});
			if (post.name) {
				var localName = post.name.concat(req.socket.remoteAddress);
				// compute hash
				const namedHash = crypto.createHash('sha256').update(localName).digest('hex').substr(0,20);
				// for debug
//				resp.write("get name "+ localName);
//				resp.write("<br>");
				resp.write("hash "+ namedHash);
				resp.write("<br>");
//				resp.write("host "+ req.socket.remoteAddress);
				resp.end();
				// connect to database
				var mysql = require('mysql');
				var connection = mysql.createConnection({
					host	:'localhost',
					user	:'root',
					password:'secret',
					port	:'3306',
					database:'question'
				});
				connection.connect();
				var sql = 'Insert into candidate (name,host,hash) values (?,?,?);'
				var pair = [post.name,req.socket.remoteAddress,namedHash]
				connection.query(sql, pair, (err, result)=>{
					if (err) {
						console.log('Insert failed -', err.message);
						return;
					}
				})
				connection.end();
			}
		});
		return;
	}
	else if(pathname=='/' && method=='GET') 
	{
		serve(req, resp, finalhandler(req,resp));
		return;
	} 
	else 
	{
		resp.end("ok")
		console.log("Fail")
	}

}).listen(80);
