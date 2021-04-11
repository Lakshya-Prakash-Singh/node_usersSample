const fs = require('fs');
const globals = require("./globals.json");
const { check, validationResult } = require('express-validator'); 
const { json } = require('body-parser');

module.exports = {
    logErrors: (Error) => {
        try {            
            console.log(Error);
            var logStream = fs.createWriteStream('logs.txt', {flags: 'a'});
            logStream.write("\r\n" + (new Date()).toISOString() + " ----- " + Error);
            logStream.end();
        }
        catch (Error) {
            console.log(Error);
            var logStream = fs.createWriteStream('logs.txt', {flags: 'a'});
            logStream.write("\r\n" + (new Date()).toISOString() + " ----- " + Error);
            logStream.end();
        }
    },
    
    logValidationErrors: (validationError) => {
        try {
            console.log(validationError);
            var logStream = fs.createWriteStream('validationLogs.txt', {flags: 'a'});
            var logmessage = (typeof validationError == "string")? validationError: JSON.stringify(validationError.errors);
            logStream.write("\r\n" + (new Date()).toISOString() + " ----- " + logmessage);
            logStream.end();
        }
        catch (Error) {
            console.log(Error);
            var logStream = fs.createWriteStream('logs.txt', {flags: 'a'});
            logStream.write("\r\n" + (new Date()).toISOString() + " ----- " + Error);
            logStream.end();
        }
    },

    getSixDigitOTP: () => {
        var minm = 1000000;
        var maxm = 99999;
        down.innerHTML = Math.floor(Math.random() * (maxm - minm + 1)) + minm;
    }

}