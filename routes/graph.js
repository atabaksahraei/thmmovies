/**
 * Created by atabaksahraei on 20/12/14.
 */
var express = require('express');
var router = express.Router();
var http = require('http');

router.post('/', function(req, res) {

    var options = {
        host: '127.0.0.1',
        path: '/api/v1/query/gremlin',
        port: '64210',
        method: 'POST'
    };

    callback = function(response) {
        var str = ''
        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            res.send(str);
        });
    }

    var inner_req = http.request(options, callback);
    //This is the data we are posting, it needs to be a string or a buffer
    inner_req.write(req.body.cmd);
    inner_req.end();
});

module.exports = router;
