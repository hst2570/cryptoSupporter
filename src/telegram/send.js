var request = require('request');
var config = require('../../config').config;

var CHAT_TOKEN = config.TELEGRAM_CHAT_TOKEN;
var BOT_TOKEN = config.TELEGRAM_BOT_TOKEN;

exports.telegram = {
    send: function(message) {
        var url = 'https://api.telegram.org/bot' + BOT_TOKEN + '/sendmessage?chat_id=' + CHAT_TOKEN + '&text=' + message;

        request({
            url: url,
            method: 'GET'
        })
    }
};