let address = document.getElementById("address");
let content = document.getElementById("content");

function encrypt_message() {
    chrome.runtime.sendMessage({
        type: "encrypt",
        address: address.value,
        message: content.value,
    }, function (res) {
        console.log(res);
        res.then(r => {
            alert(r);
        })
    });
}

document.getElementById("submit_button").onclick = encrypt_message;