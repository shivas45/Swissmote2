import React, { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';

function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [provider, setProvider] = useState(null);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const [side, setSide] = useState('heads');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const ethersProvider = new ethers.BrowserProvider(window.ethereum);
        const signer = ethersProvider.getSigner();
        const address = await signer.getAddress();
        const balance = await ethersProvider.getBalance(address);
        setProvider(ethersProvider);
        setWalletAddress(address);
        setBalance(ethers.formatEther(balance));
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert('MetaMask is required to connect wallet');
    }
  };

  const flipCoin = async () => {
    if (!provider) {
      alert('Please connect your wallet first');
      return;
    }

    setLoading(true);
    const randomSide = Math.random() > 0.5 ? 'heads' : 'tails';
    const win = side === randomSide;
    const newBalance = win ? parseFloat(balance) + parseFloat(amount) : parseFloat(balance) - parseFloat(amount);

    setTimeout(() => {
      setResult(`The coin landed on ${randomSide}. You ${win ? 'won' : 'lost'}!`);
      setBalance(newBalance.toFixed(4));
      setLoading(false);
    }, 1000); // Simulate a delay for the coin flip
  };

  return (
    <div className="App">
      <h1>Coinflip Game</h1>
      <div className="container">
        <button className="connect-btn" onClick={connectWallet}>
          Connect Wallet
        </button>
        {walletAddress && (
          <div className="game">
            <p><strong>Wallet Address:</strong> {walletAddress}</p>
            <p><strong>Balance:</strong> {balance} ETH</p>
            <div className="form-group">
              <label htmlFor="amount">Amount to Bet:</label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
              />
            </div>
            <div className="form-group">
              <label htmlFor="side">Choose Side:</label>
              <select id="side" onChange={(e) => setSide(e.target.value)} value={side}>
                <option value="heads">Heads</option>
                <option value="tails">Tails</option>
              </select>
            </div>
            <button className="flip-btn" onClick={flipCoin} disabled={loading}>
              {loading ? 'Flipping...' : 'Flip Coin'}
            </button>
            {result && <p className="result">{result}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
