var express = require('express');
var router = express.Router();
var redis = require('../models/redis')
var mongodb = require('../models/mongodb.js');

// Throw a bottle
// POST  user==xx&type=xxx&content=xxx[&time=xxx]
router.post('/', function(req, res) {
    if (!(req.body.user && req.body.type && req.body.content)) {
        return res.json({
            code: 0,
            msg: 'Fail, message is not complete'
        });
    }

    redis.throw(req.body, function(result) {
        res.json(result);
    });
})

// Pick a bottle
// GET /?user= xxx[&type=xxx]
router.get('/', function(req, res) {
    if (!req.query.user) {
        return res.json({
            code: 0,
            msg: 'Fail, message is not complete'
        });
    }

//    var info = {
//        user: req.query.user,
//        type: req.query.type || 'all'
//    }

    redis.pick(req.query, function(result) {
        res.json(result);
        if (result.code == 1) {
            mongodb.save(req.query.user, result.msg);
        }

    });
})


// throw back a bottle
router.post('/back', function(req, res) {
    redis.throwBack(req.body, function(result) {
        res.json(result);
    })
})


// Get all bottles of a user
// GET /user/jeffwan

router.get('/user/:user', function(req, res) {
    mongodb.getAll(req.params.user, function(result) {
        res.json(result);
    })
})


router.get('/bottle/:id', function(req, res) {
    mongodb.getOne(req.params.id, function(result) {
        res.json(result);
    });
})




module.exports = router;