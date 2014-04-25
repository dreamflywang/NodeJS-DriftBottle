var request = require('request');

for (var i = 11; i <= 15; i++) {
    (function(i) {
        request.post({
            url: 'http://localhost:3000',
            json:{
                "user": 'jeffwan211',
                "type": "male",
                "content": "content" + i
            }
        });
    })(i);
}


for (var i = 16; i <= 20; i++) {
    (function(i) {
        request.post({
            url: 'http://localhost:3000',
            json:{
                "user": 'jeffwan12s',
                "type": "female",
                "content": "content" + i
            }
        })
    })(i)
}