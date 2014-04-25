var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/driftbottle');
//mongoose.connect('mongodb://driftbottle:driftbottle@ds035498.mongolab.com:35498/driftbottle');


// Define bottle model
var bottleModel = mongoose.model('Bottle', new mongoose.Schema({
    bottle: Array,
    message: Array
}, {
    collection: 'bottles'
 }));

// save picker bottles
exports.save = function(picker, _bottle) {
    var bottle = {bottle:[], message:[]};
    bottle.bottle.push(picker);
    bottle.message.push([_bottle.user, _bottle.time, _bottle.content]);
    bottle = new bottleModel(bottle);
    bottle.save();
}

// used for list all bottles for one user
exports.getAll = function(user, callback) {
    bottleModel.find({'bottle' : user}, function(err, bottles) {
        if (err) {
            return callback({
                code: 0,
                msg: 'get bottle list fail...'
            });
        }

        callback({
            code: 1,
            msg: bottles
        })
    });
}

// list one bottle
exports.getOne = function(id, callback) {
    bottleModel.findById(id, function(err, bottle) {
        if (err) {
            return callback({
                code: 0,
                msg: 'bottle read fails..'
            });
        }

        if (bottle == null){
            callback({
                code: 1,
                msg: 'bottle not exist'
            });
        }

        // return drift
        callback({
            code: 1,
            msg: bottle
        });
    });
}


exports.reply = function(id, reply, callback) {
    reply.time = reply.time || Date.now();
    // find bottle by id
    bottleModel.findById(id, function(err, _bottle) {
        if (err) {
            return callback({
                code: 0,
                msg:'reply bottle fail...'
            });
        }

        var newBottle = {};
        newBottle.bottle = _bottle.bottle;
        newBottle.message = _bottle.message;
        // if the picker first reply, add owner

        if (newBottle.bottle.length === 1) {
            newBottle.bottle.push(_bottle.message[0][0]); // _bottle..messae[0][0] == owner
        }

        // add reply message
        newBottle.message.push([reply.user, reply.time, reply.content]);
        bottleModel.findByIdAndUpdate(id, newBottle, function(err, bottle) {
            if (err) {
                return callback({
                    code : 0,
                    msg: 'reply bottle fail'
                })
            }

            callback({
                code: 1,
                msg:bottle
            });
        });
    });
};



exports.delete = function(id, callback) {
    bottleModel.findByIdAndRemove(id, function(err) {
        if (err) {
            return callback({
                code:0,
                msg:'delete bottle fail'
            })
        }

        callback({
            code: 1,
            msg: 'delete successfully!'
        });
    });
}
