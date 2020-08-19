let isConnected = false;
let id = "";

let connectButton = document.getElementById("connect-button");
let disconnectButton = document.getElementById("disconnect-button");
let accountID = document.getElementById("account-id");
let sendButton = document.getElementById("send-button");
let spinner = document.getElementById("spinner");

async function main() {
    spinner.style.display = "none";

    const config = {
        networkId: "default",
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "http://wallet.testnet.near.org",
        deps: {
            keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore(),
        },
    };

    window.near = await nearApi.connect(config); // connect to the NEAR platform
    window.wallet = new nearApi.WalletAccount(window.near); // instantiate a new wallet

    if (wallet.isSignedIn()) {
        isConnected = true;
        id = wallet.getAccountId();
        connectButton.style.display = "none";
        accountID.style.display = "block";
        accountID.innerText = "@" + id;
    } else {
        isConnected = false;
        disconnectButton.style.display = "none";
        accountID.style.display = "none";
    }

    return window;
}

async function connect() {
    if (!wallet.isSignedIn()) {
        await wallet.requestSignIn();

        connectButton.style.display = "none";
        disconnectButton.style.display = "block";
        accountID.innerText = "@" + wallet.getAccountId();
    }
}

async function disconnect() {
    if (wallet.isSignedIn()) {
        await wallet.signOut();
        connectButton.style.display = "block";
        disconnectButton.style.display = "none";
        accountID.style.display = "none";
    }
}

async function send() {
    if (wallet.isSignedIn()) {
        sendButton.style.display = "none";
        spinner.style.display = "block";
        // let user_account_privateKey = window.localStorage.getItem(
        //     `near-api-js:keystore:${wallet.getAccountId()}.testnet:default`
        // );
        // window.localStorage.setItem(
        //     `near-api-js:keystore:${wallet.getAccountId()}.testnet:default`,
        // );
        try {
            let sender = await near.account(wallet.getAccountId());
            let result = await sender.sendMoney("saimano.testnet", 10);
            console.log(result);
        } catch (err) {
            console.log(err);
            sendButton.style.display = "block";
            spinner.style.display = "none";
            alert(err);
        }
    } else {
        alert("Connect account!");
    }
}

main();
