var http  = require('http');
var https = require('https');
var url   = require('url');
var qs    = require('querystring');

var messages = { en:[], fr:[], es:[], ja:[] };

http.createServer(function (req, res) {
  var params = url.parse(req.url, true).query;

  var message = params.msg;
  var name    = params.name || "anonymous";
  var lang    = params.lang || "en";

  if ( message ){
    messages[lang].push( msg(name, message) );
    for ( var otherLang in messages ){
      if ( messages.hasOwnProperty( otherLang ) && lang !== otherLang ){
        var f = function( l ){
          var googleUrl = "https://www.googleapis.com/language/translate/v2" +
                          "?key=AIzaSyDQvD2F99tMbspU6aA6-WWFQ1nZ1Ote0eA" +
                          "&source=" + lang +
                          "&target=" + l +
                          "&q=" + qs.escape(message);

          https.get( { host: "www.googleapis.com", path: googleUrl },
                     function( res ){
                       res.on( 'data', function(d){
                         var googleResp  = JSON.parse(d);
                         var translation = googleResp.data.translations[0].translatedText;
                         messages[l].push( msg(name, translation) );
                       } );
                     }
                   );
        }(otherLang);
      }
    }
  }

  res.writeHead(200, {'Content-Type': 'text/plain; charset=UTF-8'});
  res.end(messages[lang].map( function(m){ return "["+m.name+"] "+m.message } ).join(",\n"));

}).listen(1337, "127.0.0.1");

function msg( name, message ){
  return { name: name, message: message };
}
