# multilang-chat for node.js

The trick is to create a message-array for each supported language.  When messages come in, they are added to the array for their own language, and we fire off async https requests to google-translate-api which populate the other arrays when the response comes back.

http://localhost:1337?name=Matthew&lang=en&msg=Hello+World

then

http://localhost:1337?lang=es
http://localhost:1337?lang=fr
http://localhost:1337?lang=ja

should give you the idea.

Supports `en`, `es`, `fr`, `ja` at the moment.  Full list of supported languages is at http://code.google.com/apis/language/translate/v2/using_rest.html#language-params, you just have to add any that you want to the array at the top.
