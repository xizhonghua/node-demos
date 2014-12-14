var fs = require('fs');

fs.open('Shape.js', 'r', function(error, handle) {
    if(error == null) {
        var b = new Buffer(100000);
        fs.read(handle, b, 0, 10000, null, function(err, bytes_read){
            console.log(b.toString("utf-8", 0, bytes_read));
            console.log(bytes_read);
            fs.close(handle);
        });
    } else {
        console.log('error ! ' + error.code + ' ' + error.message);
    }
});