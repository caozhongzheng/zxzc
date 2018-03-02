var crypto = require('crypto');


function uid() {
    return Math.random().toString(36).slice(2);
}

function  saveJSON(data,filepath) {
    var filename=filepath;
    var fs = require('fs');

    if (filename=="")
        filename=uid();

    var path = require('path');
    var outputFilename = path.join(__dirname ,'../public/upload/'+ filename);

    //fs.writeFile(outputFilename, JSON.stringify(data, null, 4), function (err) {
    fs.writeFileSync(outputFilename, data);
    // return filename;
}
function  readfile(filepath){
    var fs = require('fs');

      fs.readFile(filepath,function(err,data) {
         if (err) throw err;
         var deData=decode(data.toString(),"123456");
         deData=JSON.stringify(deData);
         var jsonObj = JSON.parse(deData);
         jsonObj=JSON.parse(jsonObj);
         return jsonObj;
    });
}
function encode(text,key){
    var secret = key || "asdhjwheru*asd123&123";
    var cipher = crypto.createCipher('aes-256-cbc',secret);
    var crypted =cipher.update(text,'utf8','hex');
    crypted+=cipher.final('hex');
    return crypted;
}

function decode(text,key){
    var secret = key || "asdhjwheru*asd123&123";
    var decipher = crypto.createDecipher('aes-256-cbc',secret);
    var dec=decipher.update(text,'hex','utf8');
    dec+= decipher.final('utf8');//解密之后的值
    return dec;
}




exports.saveJSON=saveJSON;
exports.readfile=readfile;
exports.uid =uid;