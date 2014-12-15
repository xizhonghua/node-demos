var http = require('http');
var url = require('url');
var fs = require('fs');

//  /albums.json
//  /albums/shanghai2012.json


function handle_load_albums(req, res) {
    load_album_list(function(err, file_list) {
        if(err != null) {
            res.writeHead(503, {
                'Content-Type' : 'application/json'
            });
            res.end(JSON.stringify({error : 'file_error', message : err.message}) + "\n");    
        } else {
            res.writeHead(200,  {
                'Content-Type' : 'application/json'  
            });
            res.end(JSON.stringify({error : null, data:file_list}) + "\n");    
        }
    });
}

function handle_get_album(req, res) {

    var core_url = req.parsed_url.pathname;
    var album_name = core_url.substr(8, core_url.length - 13);
    var query = req.parsed_url.query;

    

    var page = parseInt(query.page);
    var page_size = parseInt(query.page_size);

    if(isNaN(page) || page < 0 ) page = 0;
    if(isNaN(page_size) || page_size < 0 ) page_size = 20;

    console.log('handle_get_album album_name = ' + album_name
     + ' page = ' + page + ' page_size = ' + page_size);

    load_album(album_name, page, page_size, function(err, photos) {
        if(err != null) {
            res.writeHead(503, {
                'Content-Type' : 'application/json'
            });
            res.end(JSON.stringify({error : 'file_error', message : err.message}) + "\n");    
        } else {
            res.writeHead(200,  {
                'Content-Type' : 'application/json'  
            });
            res.end(JSON.stringify({error : null, data: {album : { album_name : album_name, photos : photos}}}) + "\n");    
        }
    });
}

function handle_request(req, res){
    console.log('Incoming request: (' + req.method + ')' + req.url);

    req.parsed_url = url.parse(req.url, true);
    
    var core_url = req.parsed_url.pathname;
    var query = req.parsed_url.query;
    console.log(core_url);
    console.log(query);

    if(core_url == '/albums.json') {
        handle_load_albums(req, res);
    } else if(/albums\/.+\.json/.test(core_url)) {
        handle_get_album(req, res);
    } else {
        res.writeHead(404, { 'Content-Type' : 'application/json'});
        res.end(JSON.stringify({error:'unknown_resource'}) + '\n');
    }    
}

function load_album_list(callback){
    fs.readdir('albums/', function(err, file_list){
        if(err) {
            callback(err);
            return;
        }

        var dirs_only = [];

        (function iterator(i) {
            if(i >= file_list.length) {
                callback(null, dirs_only);
                return;
            }

            fs.stat('albums/' + file_list[i], function(err, stats){
                if(err) {
                    callback(err);
                    return;
                }

                if(stats.isDirectory())
                    dirs_only.push(file_list[i]);

                iterator(i+1);
            });
        })(0);
    });
}

function load_album(album_name, page, page_size, callback){
    fs.readdir('albums/' + album_name, function(err, file_list){
        if(err) {
            callback(err);
            return;
        }

        var files_only   = [];

        (function iterator(i) {
            if(i >= file_list.length) {
                var photos = files_only.splice(page * page_size, page_size);
                callback(null, photos);
                return;
            }

            fs.stat('albums/' + album_name + '/' + file_list[i], function(err, stats){
                if(err) {
                    callback(err);
                    return;
                }

                if(stats.isFile())
                    files_only.push(file_list[i]);

                iterator(i+1);
            });
        })(0);
    });
}

var s = http.createServer(handle_request);

s.listen(9090);

