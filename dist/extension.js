(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

// loader-code: wait until gmailjs has finished loading, before triggering actual extensiode-code.
const loaderId = setInterval(() => {
    if (!window._gmailjs) {
        return;
    }

    clearInterval(loaderId);
    startExtension(window._gmailjs);
}, 100);

// actual extension-code
function startExtension(gmail) {
    console.log("Extension loading...");
    window.gmail = gmail;

    gmail.observe.on("load", () => {
        const userEmail = gmail.get.user_email();
        console.log("Hello, " + userEmail + ". This is your extension talking!");

        gmail.observe.on("view_email", (domEmail) => {
            const DELIMETER = "/Encrypt/";

            const originalBody = domEmail.body();
            var encryptedData = extractEncryptionData(domEmail.body(), DELIMETER);
            if (originalBody.indexOf(DELIMETER) > 0) {
                var getKey = chrome.runtime.sendMessage("elmaljbnnbpkikogaonmigpbfhhikhba", {message: "getKey"}, function(response) {
                    console.log(response);
                    domEmail.body(originalBody.replaceAll(DELIMETER, "").replace(encryptedData, "fords a hoe"));
                });

                /*getKey.then(function(response) {
                    console.log(response);
                    domEmail.body(originalBody.replaceAll(DELIMETER, "").replace(encryptedData, "fords a hoe"));
                }, function(err) {});*/
            }
        });
    });
}

},{}]},{},[1]);

function extractEncryptionData(str, DELIMETER) {
    var newStr = str.substring(
        str.indexOf(DELIMETER) + DELIMETER.length,
        str.lastIndexOf(DELIMETER)
    );
    return newStr;
}
