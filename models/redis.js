var redis = require('redis'),
    client = redis.createClient();

exports.throw = function(bottle, callback) {
    bottle.time = bottle.time || Date.now();

    // Generate ID for every bottle
    var bottleId = Math.random().toString(16);
    var type = {male: 0, female: 1};


    // Select different base on different type of bottle
    client.SELECT(type[bottle.type], function() {
        // Save bottle object use hash type
        client.HMSET(bottleId, bottle, function(err, result) {

            if (err) {
                var failresult = {
                    code: 0,
                    msg: 'Try minutes later'
                }
                return callback(err, failresult);
            }

            callback(null, result);

            client.EXPIRE(bottleId, 300);
        });
    });
}

exports.pick = function (info, callback) {
    var type = {
        all: Math.round(Math.random()),
        male: 0,
        female: 1
    }

    info.type = info.type || type.all;

    // get different bottles based on diff type
    client.SELECT(type[info.type], function() {
        // random pick a bootle
        client.RANDOMKEY(function(err, bottleId) {
            if (!bottleId) {
                var failresult = {
                    code: 0,
                    msg: 'sea it empty...'
                }
                return callback(failresult);
            }

            client.HGETALL(bottleId, function(err, bottle) {
                if (err) {
                    return callback(err);
                }

                callback({
                    code: 1,
                    msg: bottle
                })
                client.DEL(bottleId);
            })
        })
    })


}