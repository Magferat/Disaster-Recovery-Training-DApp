let web3;
let contract;
let accounts;

async function init() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

        // 1. get network id (should be 1337 for your Ganache)
        const networkId = await web3.eth.net.getId();

        // 2. get deployment info from ABI JSON
        const deployedNetwork = UserManagementArtifact.networks[networkId];

        if (!deployedNetwork) {
            alert("Contract not deployed on this network!");
            return;
        }

        // 3. make contract instance
        contract = new web3.eth.Contract(
            UserManagementArtifact.abi,
            deployedNetwork.address
        );

        console.log("Connected contract at:", deployedNetwork.address);
        console.log("Using account:", accounts[0]);
    } else {
        alert("Please install MetaMask!");
    }
}

init();
