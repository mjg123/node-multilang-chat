var http = require('http');
var https = require('https');
var url = require('url');
var qs = require('querystring');

var messages = { "en":[], "es":[], "ja":[], "fr":[] };

http.createServer(function (req, res) {

  var urlParams = url.parse(req.url, true).query;

  var msgLang = urlParams.lang || "en";

  if ( urlParams.msg ) {
    messages[msgLang].push( urlParams );

    for ( lang in messages ){
      if ( messages.hasOwnProperty(lang) && lang !== msgLang ){

        var f = function (l){
      
        var translateUrl = "/language/translate/v2?" +
                           "key=AIzaSyDQvD2F99tMbspU6aA6-WWFQ1nZ1Ote0eA&"+
                           "source=" + msgLang + "&" +
                           "target=" + l + "&" +
                           "q=" + qs.escape(urlParams.msg);

        https.get( { host: "www.googleapis.com",
                 path: translateUrl },
               function ( res ){
                  res.on( 'data', function(d){
                    var translation = JSON.parse(d);
                    var transMsg = translation.data.translations[0].translatedText;
                    var otherMsg = { "name" : urlParams.name, "msg": transMsg }
                    messages[l].push( otherMsg );
                } );
               }
             );
         }(lang);



      }
    }
  }

  res.writeHead(200, {'Content-Type': 'text/plain; charset=UTF-8'});
  res.end( (messages[msgLang]||[]).map( function(x){ return "[" + (x.name||"anonymous") + "] " + x.msg; } ).join(",\n") );


}).listen(1337, "127.0.0.1");


console.log('Server running at http://127.0.0.1:1337/');
