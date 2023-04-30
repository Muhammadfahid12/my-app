import React, { useState } from 'react';
import Web3 from 'web3';

function App() {
  const [sender, setSender] = useState('');
  const [smartContractAddress, setSmartContractAddress] = useState('');
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');

  async function walletConnect() {
    try {
      if (window.ethereum) {
        await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
      } else {
        alert('Please Install MetaMask in Your Browser');
      }
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      setSender(account);
      alert('Connected');
    } catch (error) {
      console.error(error);
      alert('Failed to connect wallet');
    }
  }

  async function ercTransfer() {
    try {
      const abi = [
        {
          constant: false,
          inputs: [
            { name: '_to', type: 'address' },
            { name: '_value', type: 'uint256' },
          ],
          name: 'transfer',
          outputs: [{ name: '', type: 'bool' }],
          type: 'function',
        },
      ];

      const from = sender;
      const to = receiver;
      const value = parseFloat(amount);
      const web3= new Web3(window.ethereum)
      const value2 = web3.utils.toBN(String(value * Math.pow(10, 18)));
      const contract = new web3.eth.Contract(
        abi,
        smartContractAddress
      );
      const obj = {
        from: from,
        to: smartContractAddress,
        data: contract.methods.transfer(to, value2).encodeABI(),
      };

      const txHash = await web3.eth.sendTransaction(obj);
      console.log(txHash);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
    <h2>Transfer ERC20 Tokens</h2>
    <div className='input'>
             <input
        type="text"
        value={sender}
        onChange={(e) => setSender(e.target.value)}
        placeholder="Sender Address"
      />
      <br />
      <input
        type="text"
        value={smartContractAddress}
        onChange={(e) => setSmartContractAddress(e.target.value)}
        placeholder="Smart Contract Address"
      />
      <br />
      <input
        type="text"
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
        placeholder="Receiver Address"
      />
      <br />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />
      <br />
      <div className="btn">
        <button onClick={walletConnect} className='glow-on-hover'>Connect Wallet</button>
        <button onClick={ercTransfer} className='glow-on-hover'>Transfer</button>
      </div>
    </div>
    </>
  );
}

export default App;
