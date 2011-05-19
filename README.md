# multilang-chat for node.js

The trick is to create a message-array for each supported language.  When messages come in, they are added to the array for their own language, and we fire off async https requests to google-translate-api which populate the other arrays when the response comes back.

http://localhost:1337?name=Matthew&lang=en&msg=Hello+World

then

http://localhost:1337?lang=es

should give you the idea.  Only supports `en` and `es` as languages at the moment.
