

## 1. Start Ganache

Run Ganache in the terminal:

```bash
ganache -p 8545 -i 1337 -d --gasLimit 5000000000
```

* This will create **10 accounts**, each with an address, private key, and a shared mnemonic.
* Copy Mnemonic from this part

```
HD Wallet
==================
Mnemonic:      myth like bonus scare over problem client lizard pioneer submit female collect
Base HD Path:  m/44'/60'/0'/0/{account_index}
```

### Add to MetaMask

* Open MetaMask → **Import Wallet** → paste the mnemonic.
* This will add the 10 Ganache accounts into MetaMask.

---

## 2. Add Custom Network in MetaMask

Go to **Networks → Add network manually** and enter:

* **Name:** `Ganache` (or any name you like)
* **RPC URL:** `http://127.0.0.1:8545`
* **Chain ID:** `1337`
* **Currency Symbol:** `ETH`

When Ganache is running, terminal will show:

```
RPC Listening on 127.0.0.1:8545
```

keep that terminal open

---

## 3. Compile & Deploy Contracts with Truffle
To deploy contracts to the Ganache blockchain, Open a **new terminal**:

```bash
cd Disaster_DAAP/truffle
truffle compile         # this will create the "build" folder
truffle migrate --reset --network development
```

T

---

## 4. Copy ABI to Frontend

After migration, to copy the ABI JSON file from backend → frontend paste this

```bash
cp build/contracts/UserManagement.json ../client/abi/UserManagement.json
```

Now frontend knows the deployed address + ABI of the contract.

---

## 5. Start Frontend Server

Go back to the project root and run the frontend by this ->

```bash

npx http-server client -p 8080
```

open:(http://localhost:8080)

MetaMask will show a pop-up asking to connect. 
if connected: right side of navbar will show Role - addr - connect button 
if not connected: Unconnected · — connect button 
Every time u refresh or go to another page, u need to click the connect button


---



* If you make changes to **Solidity contracts**, re-run:

  ```bash
  truffle migrate --reset --network development
  cp build/contracts/UserManagement.json ../client/abi/
  ```
* If you only change **frontend JS/HTML/CSS**, just refresh your browser (no need to re-migrate).

