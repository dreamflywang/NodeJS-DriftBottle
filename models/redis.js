var redis = require('redis'),
    client = redis.createClient();
var client2 = redis.createClient();
var client3 = redis.createClient();


exports.throw = function(bottle, callback) {
    // check usage first
    client2.SELECT(2, function() {
        client2.GET(bottle.user, function(err, result) {
            if (result >= 10) {
                return callback({
                    code: 0,
                    msg: 'You use out of your bottels today!'
                });
            }

            client2.INCR(bottle.user, function() {
                // 1. If firsttime, record this user and set 1day expired time
                // 2. If not, don't modify expired time
                client.TTL(bottle.user, function(err, ttl) {
                    if (ttl === -1) {
                        client2.EXPIRE(bottle.user, 86400);
                    }
                });
            });

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

        });
    });

}

exports.pick = function (info, callback) {

    client3.SELECT(3, function() {
        client3.GET(info.user, function(err, result) {
            if(result >= 10) {
                return callback({
                    code: 0,
                    msg: 'You use out of your bottels today!'
                });
            }

            client3.INCR(info.user, function() {
                // 1. If firsttime, record this user and set 1day expired time
                // 2. If not, don't modify expired time
                client.TTL(info.user, function(err, ttl) {
                    if (ttl === -1) {
                        client2.EXPIRE(info.user, 86400);
                    }
                });
            });

            // Pick a bottle.
            if (Math.random() <= 0.2) {
                return callback({
                    code : 0,
                    msg: "StarFish!"
                })
            }


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
                            msg: 'sea it empty...'   // We can change StarFish here in shelter empty..
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
                    });
                });
            });

        });
    });
}

exports.throwBack = function(bottle, callback) {
    var type = {
        male: 0,
        female: 1
    }

    // Generate ID for every bottle
    var bottleId = Math.random().toString(16);
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

            client.PEXPIRE(bottleId, bottle.time + 864000000 - Date.now());
        });
    });
}

