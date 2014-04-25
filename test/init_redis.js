var request = require('request');

for (var i = 1; i <= 5; i++) {
    (function(i) {
        request.post({
            url: 'http://localhost:3000',
            json:{
                "user": 'jeffwan',
                "type": "male",
                "content": "content" + i
            }
        });
    })(i);
}


for (var i = 6; i <= 10; i++) {
    (function(i) {
        request.post({
            url: 'http://localhost:3000',
            json:{
                "user": 'jeffwan',
                "type": "female",
                "content": "content" + i
            }
        })
    })(i)
}