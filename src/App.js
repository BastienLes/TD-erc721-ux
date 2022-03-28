import react, { useEffect, useState, useReducer } from 'react';
import { ethers } from 'ethers';
import './App.css';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';
// import Web3 from 'web3';
// import Web3Provider from 'react-web3-provider';


import NFTree_contract from './contracts/NFTree_contract_abi.json';
const NFTree_contract_abi = NFTree_contract.abi; 

const NFTree_contract_address = "0x4e5b4677BF2Dc0c34457A0472583E5FB9E4d0960";


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


  const W_NewNFT = (val) => {
    let old = val - 1;
    alert("Your know own " + old +  " NFTrees");
    // W_FakeBaycNumber(val);
  }

  const mintNftHandler = async () => { 
    try {
      const { ethereum } = window;

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContrat = new ethers.Contract(NFTree_contract_address, NFTree_contract_abi, signer);

        console.log("init payment");
        let nftTxn = await nftContrat.safeMint(currentAccount, "test");

        console.log("mining...");
        await nftTxn.wait();

        console.log("Nft Mined");
        nftContrat.balanceOf(currentAccount).then(W_NewNFT );
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
    return <div>Page d'accueil</div>     
  }


  const ListFakeNeftDesc = (i, val) => {
    console.log("ListFakeNeftDesc(", i, ", ", val, ")")
  }


  const ListMyNFT_i = (address, total) => {
    try {
      const { ethereum } = window;
      total = parseInt(total)

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContrat = new ethers.Contract(NFTree_contract_address, NFTree_contract_abi, signer);
        
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


  const ListMyNFTrees_redirect = () => {
    return <div>Page d'accueil</div>     
  }

  const NFTreeMarket = () => {
    return <div>Page des NFTrees en ventes</div>     
  }

  const formReducer = (state, event) => {
   return {
     ...state,
     [event.name]: event.value
   }
  }

  // const NewNFTree = () => { return <div></div> }
  const NewNFTree = () => { 
    const [formData, setFormData] = useReducer(formReducer, {});
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = event => {
      event.preventDefault();
      alert('Formulaire envoyé avec : number = ' + event.target.number.value + " | geoloc = " + event.target.geoloc.value + " | size = " + event.target.size.value + " | horizon = " + event.target.horizon.value)
    }

    const handleChange = event => {
      setFormData({
        number: event.target.number,
        geoloc: event.target.geoloc,
        size: event.target.size,
        horizon: event.target.horizon,
      });
    }

    return(
      <div className="wrapper">
        <h1>Formulaire pour nouveau NFTree</h1>
        {submitting &&
          <div>
            You are submitting the following:
            <ul>
              {Object.entries(formData).map(([name, value]) => (
                <li key={name}><strong>{name}</strong>:{value.toString()}</li>
              ))}
            </ul>
          </div>
        }
        <form onSubmit={handleSubmit}>
          <fieldset class="form">
            <label> Numéro de parcelle 
              <input name="number" onChange={handleChange}/>
            </label>
            <label> Géolocalisation 
              <input name="geoloc" onChange={handleChange}/>
            </label>
            <label> Superficie 
              <input name="size" onChange={handleChange}/>
            </label>
            <label> Horizon de coupe 
              <input name="horizon" onChange={handleChange}/>
            </label>
          </fieldset>
          <button type="submit">Submit</button>
        </form>
      </div>
    )
  }

  const ListMyNFTrees = () => {
    const location = useLocation();
    let path_words = location.pathname.split("/");
    let address = path_words[path_words.length - 1]
    try {
      const { ethereum } = window;

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContrat = new ethers.Contract(NFTree_contract_address, NFTree_contract_abi, signer);
        
        nftContrat.balanceOf(address).then((val) => {ListMyNFT_i(address, val)})
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
          <div class="nav-main">
            <ul class="nav">
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/market">Marché</Link></li>
              <li><Link to="/myNFTrees">Mes NFTrees</Link></li>
              <li><Link to="/newNFTree">Nouveau NFTree</Link></li>
            </ul>
            {currentAccount ? <h1>Connected</h1> : connectWalletButton()}
          </div>
          <Routes>
            <Route exact path="/" element={<Home/>}/>
            <Route exact path="/market/" element={<NFTreeMarket/>} />
            <Route exact path="/newNFTree/" element={<NewNFTree/>} />
            <Route exact path="/myNFTrees" element={<ListMyNFTrees_redirect/>}/>
            <Route exact path="/myNFTrees/:address" element={<ListMyNFTrees/>}/>
          </Routes>
        </BrowserRouter>
    </div>
  )

}
// https://dev.to/rounakbanik/building-a-web3-frontend-with-react-340c
export default App;