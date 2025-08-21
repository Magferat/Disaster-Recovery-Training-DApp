// Global app state
window.app = { web3: null, account: null, contract: null, bookingFeeWei: "0" };

function getAbiPath() {
    // pages use ../abi, root uses ./abi
    return location.pathname.includes("/pages/") ? "../abi/UserManagement.json" : "./abi/UserManagement.json";
}

async function loadAbiAndAddress() {
    const res = await fetch(getAbiPath());
    const json = await res.json();
    const netId = await app.web3.eth.net.getId();
    if (!json.networks || !json.networks[netId]) {
        throw new Error("Contract not deployed on this network. Migrate with Truffle on the SAME Ganache network, then copy the JSON.");
    }
    return { abi: json.abi, address: json.networks[netId].address };
}

async function connect() {
    if (!window.ethereum) {
        alert("MetaMask not detected. Install it first.");
        return;
    }
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    app.account = accounts[0];
    app.web3 = new Web3(window.ethereum);

    const { abi, address } = await loadAbiAndAddress();
    app.contract = new app.web3.eth.Contract(abi, address);
    app.bookingFeeWei = await app.contract.methods.bookingFee().call();

    // react to changes
    ethereum.on("accountsChanged", () => location.reload());
    ethereum.on("chainChanged", () => location.reload());

    return app;
}

function fromWei(wei) { return app.web3.utils.fromWei(wei, "ether"); }
function toWei(eth) { return app.web3.utils.toWei(eth, "ether"); }

window.web3Helpers = { connect, fromWei, toWei };
