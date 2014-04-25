var express = require('express');
var router = express.Router();
var redis = require('../models/redis')

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

    var info = {
        user: req.query.user,
        type: req.query.type || 'all'
    }

    redis.pick(info, function(result) {
        res.json(result);
    });
})



module.exports = router;