var crypto = require('crypto')
var name = "zeke";
const hash = crypto.createHash('sha256').update(name).digest('base64');
console.log(hash)
