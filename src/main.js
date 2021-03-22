var request = require('request');

var telegram = require('./telegram/send').telegram;

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
        var message = '';

        recentData.forEach(recent => {
            var tokenA = recent.tokenA.toLowerCase();
            var tokenB = recent.tokenB.toLowerCase();

            var amountA = recent.amountA.slice(0, -15);
            var amountB = recent.amountB.slice(0, -15);

            var gap = amountA / amountB;
            var gap2 = amountB / amountA;

            var nameA;
            var nameB;

            if (isNaN(gap) || isNaN(gap2)) {
                gap = 'none amount';
                gap2 = 'none amount'
            } else {
                gap = gap.toFixed(8);
                gap2 = gap2.toFixed(8);
            }

            if (tokenList[tokenA] && tokenList[tokenB]) {
                nameA = tokenList[tokenA].name;
                nameB = tokenList[tokenB].name;
            } else if(!tokenList[tokenA] && tokenList[tokenB]) {
                nameA = tokenA;
                nameB = tokenList[tokenB].name;
            } else if(tokenList[tokenA] && !tokenList[tokenB]) {
                nameA = tokenList[tokenA].name;
                nameB = tokenB;
            } else {
                nameA = tokenA;
                nameB = tokenB;
            }

            message += nameA.toUpperCase() + ' / ' + nameB.toUpperCase() + '\n A to B: ' + gap + '\n B to A: ' + gap2 + '\n-------------------------\n'
        });
        telegram.send(message);
    });
})

function jsonParser(string) {
    var jsonBody = JSON.parse(string);
    return jsonBody;
}
