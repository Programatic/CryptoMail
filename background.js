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
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify({
                    "address": "fms34@case.edu",
                    "value": Array.from(new Uint8Array(key))
                });

                console.log(raw)

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };

                fetch("http://localhost:8000/api/client_add", requestOptions)
                    .then(response => response.text())
                    .then(result => console.log(result))
                    .catch(error => console.log('error', error));
                // GET EXPORTED KEY HERE
                console.log(key);
            });

            chrome.storage.local.set({
                "CryptoMailKeys": keyPair
            });


            // TEST CODE ONLY

        });
    }
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.type === "encrypt") {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "address": request.address
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            sendResponse(new Promise(function (resolve) {

                fetch("http://localhost:8000/api/client_query", requestOptions)
                    .then(response => response.text())
                    .then(result => {
                        let json = JSON.parse(result);

                        crypto.subtle.importKey("spki", new Uint8Array(json.key), {
                            name: "RSA-OAEP",
                            hash: "SHA-256"
                        }, true, ["encrypt"]).then(key => {

                            let enc = new TextEncoder();

                            window.crypto.subtle.encrypt({
                                    name: "RSA-OAEP"
                                },
                                key,
                                enc.encode(request.message)
                            ).then(res => {
                                let dec = new TextDecoder();
                                console.log(dec.decode(res));
                                resolve(dec.decode(res));
                            });

                        });
                    })
                    .catch(error => console.log('error', error));
            }));
        if (request.greeting == "getKey") {
            chrome.storage.local.get("CryptoMailKeys", function(value) {
                sendResponse({key: value});
            })
        }
    }
);