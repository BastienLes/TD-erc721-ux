import react, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Web3Provider from 'react-web3-provider';


import FakeBAYC from './contracts/FakeBAYC_abi.json';
import FakeNefturians from './contracts/FakeNefturians_abi.json';
import FakeMeebits from './contracts/FakeMeebits_abi.json';
import FakeMeebitsClaimer from './contracts/FakeMeebitsClaimer_abi.json';

const FakeBAYC_address = "0x6b740C7a965d75A4801642Fabc650DA92CeA47ef";
const FakeNefturians_address = "0x14e68d0ba29c07478bd68f4a479a0211bd48ca4e";
const FakeMeebits_address = "0x66e0f56e86906fd7ee186d29a1a25dc12019c7f3";
const FakeMeebitsClaimer_address = "0x656ec82544a3464f07bb86bea3447a4fdf489c1b";

const FakeBAYC_abi = FakeBAYC.abi; 
const FakeNefturians_abi = FakeNefturians.abi; 
const FakeMeebits_abi = FakeMeebits.abi; 
const FakeMeebitsClaimer_abi = FakeMeebitsClaimer.abi; 


function App() {

  const [currentAccount, setCurrentAccount] = useState(null);

  const checkWalletIsConnected = () => { 
    const { ethereum } = window;
    if (!ethereum){
      console.log("Make sure metamask is installed!");
      return;
    } else {
      console.log("Wallet exists.");
    }
  }

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if(!ethereum){
      alert("Install metamask please");
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts'});
      console.log("Found an annount! Address : ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err)
    }
  }

  const mintNftHandler = async () => { 
    try {
      const { ethereum } = window;

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContrat = new ethers.Contract(FakeBAYC_address, FakeBAYC_abi, signer);

        console.log("init payment");
        let nftTxn = await nftContrat.claimAToken();

        console.log("mining...");
        await nftTxn.wait();

        console.log("Nft Mined");
        let nft_id = await nftContrat.tokenCounter();
        console.log(nft_id)
        await nft_id.wait();
        console.log("test")

        console.log(nft_id)
      }
    } catch (err) {
      console.log(err);
    }
  }

  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        Connect Wallet
      </button>
    )
  }

  const mintNftButton = () => {
    return (
      <button onClick={mintNftHandler} className='cta-button mint-nft-button'>
        Mint NFT
      </button>
    )
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, [])

  const Home = () => {
    return <div>{currentAccount ? mintNftButton() : connectWalletButton()}</div>
  }

  const ChainInfo = () => {
    const { ethereum } = window;

    if(!ethereum){
      alert("Install metamask please");
    }
    let chainNumber = ethereum.request({ method: 'eth_chainId' });
    // let chainNumber = ethereum.request({ method: 'net_version' });
    let lbn = ethereum.request({ method: 'blockNumber' })

    return <ul>
        <li>Chain id : {chainNumber} </li>
        <li>Last block number : {lbn} </li>
      </ul>
  }

  const ErrorChain = () => {
    return <h1>La chaine utilisée est </h1>
  }


  return (
    <div className='main-app'>
        <BrowserRouter>
          <ul class="nav">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/chain-info">Chain infos</Link></li>
          </ul>
          <Routes>
            <Route exact path="/" element={<Home/>}/>
            <Route exact path="/chain-info" element={<ChainInfo/>}/>
          </Routes>
        </BrowserRouter>
      {/*<Router>
        <main>
          <nav>
            <ul>
              <li>              
                <Link to="/">Home</Link>            
              </li>            
              <li>              
                <Link to="/about">About</Link>            
              </li>            
              <li>              
                <Link to="/contact">Contact</Link>           
              </li>          
            </ul>        
          </nav>

          <Route path="/" exact component={Home} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
        </main>
      </Router>*/}
    </div>
  )

}
// https://dev.to/rounakbanik/building-a-web3-frontend-with-react-340c
export default App;