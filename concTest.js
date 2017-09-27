var papa = require("papaparse");
var fs = require("fs");
var mysql = require("mysql");
var async = require("async");

var stream = fs.createReadStream('finalfinal.csv');


connection = mysql.createConnection({
				host:'localhost',
				user : 'root',
				password : '',
				database : 'finalteams'
			});
	 
connection.connect(function(err){
	if(err){
	  console.log(err);
	}else{
	  console.log("Connected as id" + connection.threadId);
	}
});


var insertDb = function(name, lname){
	// console.log("Inserting for " + name);
	connection.query({
		sql : 'insert into names values(?, ?)',
		values : [name, lname]
	}, function(err, res, f){
		if(err){
			if(err.code == 'ER_DUP_ENTRY'){
				console.log("Name : " +name+ " " + lname);
			}else{
				throw err;
			}
		}
	});
}
var compareNames = function(data){

	async.eachSeries(data, function(u, cb){
		// console.log(u['Team name']);
		var teamSize = Number(u['Team size']);
		for(var i=0; i<teamSize; i++){
			insertDb(u['First name '+(i+1)], u['Last name '+(i+1)]);
		}
		cb();
	}, function(err){
		if(err) throw err;
	});
}


papa.parse(stream, {
	delimeter : ",",
	header : true,
	complete : function(result, file){
		// console.log("Parsing complete: ", result);
		// console.log(result.data);
		compareNames(result.data);
	},
	error : function(error, file){
		console.log(error);
	}
});