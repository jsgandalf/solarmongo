/* Upload script */

var knox = require("knox"),
    config = require('../../config/config');

var client = knox.createClient({
  key: "AKIAJQLIVXV5DPLXTP4A",
  secret: "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",
  bucket: "solarmongo"
  //port: 8080
});

var fs = require('fs');

/*app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(__dirname));*/



exports.put = function(req, response) {
  var buffer = new Buffer('a string of data');
  var headers = {
    'Content-Type': 'text/plain'
  };
  client.putBuffer(buffer, 'test.txt', headers, function(err, res){
    if (200 == res.statusCode) { 
      console.log('Uploaded to mazon S3'); 
      response.jsonp({"message":"success"});
    }else { 
      console.log('Failed to upload file to Amazon S3'); 
      response.jsonp({"message":err});
    }
  });

}

exports.head = function(req, res) {
  // HEAD object
  client.headFile("key", function(err, res) {
    console.log("Headers:\n", res.headers);
  });
}

exports.get = function(req, res) {
  // GET object
  client.getFile("key", function(err, res) {
    res.on('data', function(chunk){
      console.log(chunk.toString());
    });
  });
}

exports.destroy = function(req, res){
  // DELETE object
  client.deleteFile("key", function(err, res) {
    console.log(res.statusCode);
  });
}