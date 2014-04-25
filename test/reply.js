var request = require('request');


//535ae8a00a7d8d9d5ef04af0

for (var i = 1; i <= 3; i++) {
    (function(i) {
        request.post({
            url: 'http://localhost:3000/reply/535aecab8645ed9f5f694bf7',
            json:{
                "user": 'jeffwanss',
                "type": "female",
                "content": "testrelodsadsadsa 11 11  22 3/"
            }
        })
    })(i)
}