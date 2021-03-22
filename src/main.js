var request = require('request');

var customToken = {
    KLAYTN: '0x0000000000000000000000000000000000000000',
    BBC: '0x321bc0b63efb1e4af08ec6d20c85d5e94ddaaa18',
    HINT: '0x4dd402a7d54eaa8147cb6ff252afe5be742bdf40',
    BEE: '0xa128e62cfb454ab5b580a7385de2f228ad7b69d1',
    WEMIX: '0x5096db80b21ef45230c9e423c373f1fc9c0198dd'
}

var URLS = {
    TOKEN: 'https://stat.klayswap.com/token.json',
    RECENT: 'https://stat.klayswap.com/recentPoolStatus.json'
}

var options = {
    url: 'https://stat.klayswap.com/token.json',
    method: 'GET'
};

var promise = new Promise(function(resolve, reject) {
    request({
        url: URLS.TOKEN,
        method: 'GET'
    },
    function(e, response, body) {
        var token = jsonParser(body);
        var tokenList = {};

        Object.keys(customToken).forEach(function(key) {
            var custom = customToken[key];
            tokenList[custom] = {
                name: key
            };
        });

        token.forEach(t => {
            var address = t.token_address.toLowerCase();
            tokenList[address] = {
                name: t.name
            }
        });

        resolve(tokenList);
    });
});

promise.then(function(tokenList) {
    request({
        url: URLS.RECENT,
        method: 'GET'
    },
    function(e, response, body) {
        var result = jsonParser(body);
        var recentData = result.data;

        console.log(tokenList);

        recentData.forEach(recent => {
            var tokenA = recent.tokenA.toLowerCase();
            var tokenB = recent.tokenB.toLowerCase();

            var amountA = recent.amountA.slice(0, -15);
            var amountB = recent.amountB.slice(0, -15);

            var gap = amountA / amountB;
            var gap2 = amountB / amountA;

            if (isNaN(gap) || isNaN(gap2)) {
                gap = '물량 없음';
                gap2 = '물량 없음'
            }

            if (tokenList[tokenA] && tokenList[tokenB]) {
                console.log(tokenList[tokenA].name);
                console.log(tokenList[tokenB].name);
                console.log('gap => A to B: ', gap, ', B to A: ', gap2);
                console.log('--------');
            } else if(!tokenList[tokenA] && tokenList[tokenB]) {
                console.log(tokenA);
                console.log(tokenList[tokenB].name);
                console.log('gap => A to B: ', gap, ', B to A: ', gap2);
                console.log('--------');
            } else if(tokenList[tokenA] && !tokenList[tokenB]) {
                console.log(tokenList[tokenA].name);
                console.log(tokenB);
                console.log('gap => A to B: ', gap, ', B to A: ', gap2);
                console.log('--------');
            } else {
                console.log(tokenA);
                console.log(tokenB);
                console.log('gap => A to B: ', gap, ', B to A: ', gap2);
                console.log('--------');
            }
        });
    });
})

function jsonParser(string) {
    var jsonBody = JSON.parse(string);
    return jsonBody;
}
