import './App.css'; 
// import { ethers } from 'ethers';
import contractABI from './Vendor-Contract-ABI.json';
const ethers = require("ethers");
const contractAddress = '0xeBCAF963525639997eB3F5064Bd6D4293005B0CA'; 

let provider = new ethers.providers.Web3Provider(window.ethereum)
let contract = new ethers.Contract(contractAddress, contractABI, provider); 
let signer;

// connect metamask
const connect = async () => {
    // metamask require request permission to connect user accounts
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    const accountAddress = await signer.getAddress();
    console.log("account address: ", accountAddress);
    document.getElementById("Account").innerHTML = "Account address is : " + accountAddress;        
}

// get balance from connected account 
const getBalance = async () => {
    const balance = await signer.getBalance();
    const converToEth = 1e18;
    console.log("account's balance: ", balance.toString() / converToEth);
    document.getElementById("userBalance").innerHTML = "Account Balance is : " + balance.toString() / converToEth;
}

// buyToken
const buyToken = async () => {
  let userAmount = document.getElementById('puchase-amount').value; 
  const weiAmount = ethers.utils.parseEther(userAmount);
  console.log(weiAmount.toString() / 1e18);
  const tx = await contract.connect(signer).buyTokens({ value: weiAmount});
  const receipt = await tx.wait;
  console.log(receipt);
}  

// get tokentransfered indicater
const tokenTransferIndi = async () => {
  const tx = await contract.connect(signer).isTknTransfer();
  //const Resp = await tx.wait;
  console.log(tx);
}  

function App() {
  return (
    <div className="App">
      <header className="App-header">        
        <p>
          Token sell vendor machine.
        </p>
        <div className="App-body">       
          
          <div className="App-button-box">
            <button onClick={connect}>CONNECT to Metamask</button>
            <output id="Account" name="ShowAccount"></output>   
          </div>
          
          <div className="App-button-box">
            <button onClick={getBalance}>Get Account Balance</button>
            <output id="userBalance" name="ShowBalance"></output>              
          </div>

          <div className="App-button-box">  
            <input type="text" id="puchase-amount" placeholder= "ETH" />
            <button onClick={buyToken}>BuyToken</button>
          </div>       

          <div className="App-button-box">  
            <button onClick={tokenTransferIndi}>ChkTokenTransfer</button>
            <output id="checktoken" name="CheckToken"></output>  
          </div>   

        </div>  
        </header>      
    </div>
  )
}

export default App;
