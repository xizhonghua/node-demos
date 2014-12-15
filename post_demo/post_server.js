var http = require('http');

function handle_incoming_request(req, res){
    console.log('Incoming request (' + req.method + ')' + req.url);

    var json_data = "";


    req.on(
        "readable",
        function() {
            var d = req.read();
            //json_data += d;
            console.log('d = ' + d + ' typeof d ' + (typeof d));
            if(typeof d == 'string') 
                json_data += d;
            else if(typeof d == 'object' && d instanceof Buffer)
                json_data + d.toString('utf8');
        });

    req.on(
        "end",
        function(){
            console.log('json_data = ' + json_data);
            var out = '';
            if(!json_data)
                out = 'I got no JSON';
            else {
                var json;
                try {

                    json = JOSN.parse(json_data);
                    console.log('json = ' + json + ' json_data = ' + json_data);
                } catch(e) {

                }

                

                if(!json)
                    out = "Invalid JSON";
                else
                    out = "Valid JSON data " + json_data;
            }

            res.end(out);
        });
}

var s = http.createServer(handle_incoming_request);
s.listen(8080);