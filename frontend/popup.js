let address = document.getElementById("address");
let content = document.getElementById("content");

function encrypt_message() {
    chrome.runtime.sendMessage({
        type: "address",
        address: address.value,
        message: content.value,
    });
}

document.getElementById("submit_button").onclick = encrypt_message;