import react, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import { BrowserRouter, Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';
// import Web3 from 'web3';
// import Web3Provider from 'react-web3-provider';


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

let mintPrice = undefined;

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


  const WriteToId = (id, val) => {
    let obj = document.getElementById(id);
    obj.textContent = val
    console.log("Wrote in", id, " ", val)
  }

  const Handle_ChainNbr = (val) => {
    if(val.chainId != 4){
      window.location.replace("../err-chain");
    }
    val = "Chain id : " + val.chainId + " (" + val.name + ")";
    WriteToId("chainNumber", val)
  }

  const W_LastBlockNbr = (val) => {
    val = "Last block number : " + val;
    WriteToId("LastBlock", val)
  }

  const W_FakeBaycName = (val) => {
    val = "Name : " + val;
    WriteToId("FakeBAYCName", val)
  }

  const W_FakeBaycNumber = (val) => {
    val = "Total token number : " + val;
    WriteToId("FakeBAYCNumber", val)
  }

  const W_NewFakeBayc = (val) => {
    let old = val - 1;
    alert("NFT " + old +  " minted ");
    W_FakeBaycNumber(val);
  }

  const W_NewNFTNeft = (val) => {
    let old = val - 1;
    alert("NFT " + old +  " minted");
  }

  const W_FakeBaycToken_bis = (val) => {
    let Desc = document.getElementById("FakeBAYCTokenDesc");
    let Img = document.getElementById("FakeBAYCTokenImg");
    Img.src = "https://gateway.pinata.cloud/ipfs/" + val.image.split("://")[1];

    let div = document.createElement("div");
    for (let i = 0; i < val.attributes.length; i++){
      let li = document.createElement("li");
      li.textContent = val.attributes[i].trait_type + " : " + val.attributes[i].value;
      div.appendChild(li)
    }  
    Desc.replaceChildren(div)
  }


  const W_FakeBaycToken = (val, id) => {
    let url = "" + val + id;
    fetch(url)
       .then((response) => response.json())
       .then((responseJson) => {
         return responseJson;
       })
       .catch((error) => {
         console.error(error);
       }).then(W_FakeBaycToken_bis)
  }

  const W_NeftMinPrice = (val) => {
    val = ethers.utils.formatEther(val);
    mintPrice = val
    val = "Min price for a token : " + val + "eth";
    WriteToId("NeftMinPrice", val)
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
        nftContrat.tokenCounter().then(W_NewFakeBayc);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const mintNftHandler_neft = async () => { 
    try {
      const { ethereum } = window;

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContrat = new ethers.Contract(FakeNefturians_address, FakeNefturians_abi, signer);

        console.log("init payment");
        let price = ethers.utils.parseEther(mintPrice + "001")
        console.log(price)
        console.log("test")
        let nftTxn = await nftContrat.buyAToken({value: price});

        console.log("mining...");
        await nftTxn.wait();

        console.log("Nft Mined");
        nftContrat.tokenCounter().then(W_NewNFTNeft);
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

  const mintNftButton_neft = () => {
    return (
      <button onClick={mintNftHandler_neft} className='cta-button mint-nft-button'>
        Mint NFT
      </button>
    )
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, [])

  const Home = () => {
    return <div>{currentAccount ? <h1>You're connected</h1> /*{disconnectWalletButton()}*/ : connectWalletButton()}</div>
    
      
  }

  const ChainInfo = () => {
    const { ethereum } = window;

    if(!ethereum){
      alert("Install metamask please");
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    provider.getNetwork().then(Handle_ChainNbr);
    provider.getBlockNumber().then(W_LastBlockNbr);

    return (
     <ul>
        <li id="chainNumber">Chain id : X</li>
        <li id="LastBlock">Last block number : XXXXXX</li>
        <li>Account used : {currentAccount}</li>
      </ul>
    )
  }

  const ErrorChain = () => {
    return <h1>La chaine utilisée n'est pas la bonne, seul Rinkeby est accepté</h1>
  }

  const FakeBAYC = () => {
    try {
      const { ethereum } = window;

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContrat = new ethers.Contract(FakeBAYC_address, FakeBAYC_abi, signer);

        nftContrat.name().then(W_FakeBaycName);
        nftContrat.tokenCounter().then(W_FakeBaycNumber);
      }
    } catch (err) {
      console.log(err);
    }
    return <div> 
        <h1>Fake BAYC page</h1>
        <p id="FakeBAYCName"></p>
        <p id="FakeBAYCNumber"></p>
        <p>{currentAccount ? mintNftButton() : "You need to be connected, go to \"Home\" page to connect with Metamask"}</p>
      </div>
  }


  const FakeBaycUnit = () => {
    const location = useLocation();
    let path_words = location.pathname.split("/");
    let id = path_words[path_words.length - 1]

    try {
      const { ethereum } = window;

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContrat = new ethers.Contract(FakeBAYC_address, FakeBAYC_abi, signer);

        nftContrat.tokenCounter().then((val) => {
          if(val <= id) {
            window.location.replace("./not");
          }
        })
        nftContrat.baseURI().then((val) => {W_FakeBaycToken(val, id)});
      }
    } catch (err) {
      console.log(err);
    }
    return <div> 
        <h1>Fake BAYC of token { id }</h1>
        <img id="FakeBAYCTokenImg"></img>
        <ul id="FakeBAYCTokenDesc"></ul>
      </div>
  }



  const FakeBaycUnitDoesntExist = () => {
    try {
      const { ethereum } = window;

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContrat = new ethers.Contract(FakeNefturians_address, FakeNefturians_abi, signer);

        nftContrat.name().then(W_FakeBaycName);
      }
    } catch (err) {
      console.log(err);
    }
    return <div> 
        <h1>Fake Nefturians page</h1>
        <p id="FakeNefturiansName"></p>
      </div>
  }



  const FakeNefturiansPage = () => {
    try {
      const { ethereum } = window;

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContrat = new ethers.Contract(FakeNefturians_address, FakeNefturians_abi, signer);

        nftContrat.tokenPrice().then(W_NeftMinPrice);
      }
    } catch (err) {
      console.log(err);
    }
    return <div> 
        <h1>Fake Nefturians page</h1>
        <p id="NeftMinPrice"></p>
        <p>{currentAccount ? mintNftButton_neft() : "You need to be connected, go to \"Home\" page to connect with Metamask"}</p>
      </div>
  }


  const ListFakeNeftDesc = (i, number) => {
    console.log("hello")
    number = parseInt(number)
    console.log(number)
    let obj = document.getElementById("FakeNeftList-" + i);
    let div = document.createElement("div");
    div.id = "FakeNefturianItem"
    let p = document.createElement("p");
    p.textContent = "Token : Nefturian #" + number;
    let img = document.createElement("img");
    img.src = "https://api.nefturians.io/nefturians/images/gif/" + number;

    div.appendChild(p)
    div.appendChild(img)
    obj.replaceChildren(div);    
  }


  const ListFakeNeft = (address, total) => {
    try {
      const { ethereum } = window;
      total = parseInt(total)

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContrat = new ethers.Contract(FakeNefturians_address, FakeNefturians_abi, signer);
        
        let obj = document.getElementById("FakeNeftList");
        let div_p = document.createElement("div");
        for (let i = 0; i < total; i++){
          let div = document.createElement("div");
          div.id = "FakeNeftList-" + i;
          div.class = "FakeNeftList_unit";
          div_p.appendChild(div)
          nftContrat.tokenOfOwnerByIndex(address, i).then((val) => { ListFakeNeftDesc(i, val); });
        }
        obj.replaceChildren(div_p)
      }
    } catch (err) {
      console.log(err);
    }
  }

  const FakeNefturiansList = () => {
    // minted 16 and 18 for address 0x67d24352aC708e3e6BB803AaBC5c9656e2918C8d
    const location = useLocation();
    let path_words = location.pathname.split("/");
    let address = path_words[path_words.length - 1]
    try {
      const { ethereum } = window;

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContrat = new ethers.Contract(FakeNefturians_address, FakeNefturians_abi, signer);
        
        nftContrat.balanceOf(address).then((val) => {ListFakeNeft(address, val)})
      }
    } catch (err) {
      console.log(err);
    }
    return <div> 
        <h1>Fake Nefturians tokens for {address}</h1>
        <div id="FakeNeftList"></div>
      </div>
  }


  return (
    <div className='main-app'>
        <BrowserRouter>
          <ul class="nav">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/chain-info">Chain infos</Link></li>
            <li><Link to="/fakeBayc">Fake BAYC</Link></li>
            <li><Link to="/fakeNefturians">Fake Nefturians</Link></li>

          </ul>
          <Routes>
            <Route exact path="/" element={<Home/>}/>
            <Route exact path="/chain-info" element={<ChainInfo/>}/>
            <Route exact path="/err-chain" element={<ErrorChain/>}/>
            <Route exact path="/fakeBayc" element={<FakeBAYC/>}/>
            <Route exact path="/fakeBayc/not" element={<FakeBaycUnitDoesntExist />} />
            <Route path="/fakeBayc/:id" element={<FakeBaycUnit />} />
            <Route exact path="/fakeNefturians" element={<FakeNefturiansPage/>}/>
            <Route exact path="/fakeNefturians/:address" element={<FakeNefturiansList/>}/>
          </Routes>
        </BrowserRouter>
    </div>
  )

}
// https://dev.to/rounakbanik/building-a-web3-frontend-with-react-340c
export default App;