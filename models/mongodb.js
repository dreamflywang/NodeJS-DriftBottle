var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/driftbottle');


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

        // return drift
        callback({
            code: 1,
            msg: bottle
        });
    });
}

