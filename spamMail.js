var nm = require("nodemailer");
var async = require("async");
var papa = require("papaparse");
var fs = require("fs");


var transporter = nm.createTransport({
	host: 'smtp.zoho.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: 'info@ingeniushack.com',
        pass: '<PASSWORD>'
    }
});

var mailOptions = {
    from: '"inGenius 2017" <info@ingeniushack.com>', // sender address
    to: ' ', // list of receivers
    subject: 'Rules', // Subject line
    text: ' ', // plain text body
    html:' ' // html body
};

var sendMail = function(t, h){

	mailOptions.to = t;
	mailOptions.html = h;

	transporter.sendMail(mailOptions, (error, info) => {
	    if (error) {
	        return console.log(error);
	    }else{
	    	console.log("Mail sent to " + t);
	    }
	    console.log('%s Message %s sent: %s', instanceId, info.messageId, info.response);
	});

}


var showData = function(data, contentToSend){
	var i = 0;
	async.eachSeries(data, function(u, cb){
		setTimeout(function(u){
			var username = data[i]['username'];
			var commitContent = contentToSend.replace(/USERNAME_IS_THIS/g, username);
			commitContent = commitContent.replace(/PASSWORD_IS_THIS/g, data[i]['password']);
			var sendTo = data[i]['email'];
			console.log("\n\n\n");
			console.log(username + "\n" + sendTo);
			sendMail(sendTo, commitContent);
			i++;
			if(i>10){			//Limit the number of mails sent
				return;
			}
			cb();
		}, 5000);

	}, function(error){
		if(error){
			console.log(error);
		}else{
			console.log("done");
		}
	});
}


var contentToSend;
fs.readFile('rules.html', function(err, data){
	if(err) throw err;
	contentToSend = data.toString();
	console.log(contentToSend);

	var stream = fs.createReadStream("fullpass.csv");


	papa.parse(stream, {
		delimeter : ",",
		header : true,
		complete : function(result, file){
			showData(result.data, contentToSend);
		},
		error : function(error, file){
			console.log(error);
		}
	});

});
