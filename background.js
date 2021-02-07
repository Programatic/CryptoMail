chrome.runtime.onInstalled.addListener(async function (details) {
    // TODO: Change to install
    if (details.reason === "update") {
        let kp = crypto.subtle.generateKey({
                name: "RSA-OAEP",
                modulusLength: 4096,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256"
            },
            true,
            ["encrypt", "decrypt"]
        ).then(function (keyPair) {
            crypto.subtle.exportKey("spki", keyPair.publicKey).then(function (key) {
                // GET EXPORTED KEY HERE
                console.log(key);
            });

            chrome.storage.local.set({
                "CryptoMailKeys": keyPair
            });


            // TEST CODE ONLY
            chrome.storage.local.get(['CryptoMailKeys'], function (result) {
                console.log('Value currently is ' + result);
            });
        });
    }
});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});
  }
);