var mysql = require('mysql');
var connection = mysql.createConnection({
	host	:'localhost',
	user	:'root',
	password:'secret',
	port	:'3306',
	database:'question'
});

connection.connect();

var sql = "select 1 from candidate where name=? limit 1;"
var name= ["a"];

connection.query(sql, name, (err, result)=>{
	if (err) {
		console.log('[Query failed] - ', err.message);
		return;
	}

	console.log('Query success - ', result);
	console.log(typeof result)
	console.log(JSON.stringify(result))
	if (JSON.stringify(result)!='[]') {
		console.log("result not null");
	}
})

connection.end();

