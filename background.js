chrome.runtime.onInstalled.addListener(async function (details) {
    // TODO: Change to install
    if (details.reason === "update") {

        let keyPair = await crypto.subtle.generateKey({
                name: "RSA-OAEP",
                modulusLength: 4096,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256"
            },
            true,
            ["encrypt", "decrypt"]
        );

        console.log(keyPair);

        chrome.storage.local.set({
            "CryptoMailKeys": keyPair
        });

        chrome.storage.local.get(['CryptoMailKeys'], function (result) {
            console.log('Value currently is ' + result.test);
        });

    }
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    
var requestOptions = {
  method: 'POST',
  redirect: 'follow'
};

fetch("http://localhost:8000/api/client_add", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));

    // sendResponse({farewell: request.message});
  }
);