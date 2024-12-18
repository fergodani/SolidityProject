import './Tikets.css';
import detectEthereumProvider from "@metamask/detect-provider";
import { Contract, ethers } from "ethers";
import myContractManifest from "../../contracts/MyContract.json";
import { useState, useEffect, useRef } from 'react';


function Tikets() {
  const myContract = useRef(null);
  const [tikets, setTikets] = useState([]);
  const [realBalance, setRealBalance] = useState(0);
  const [storedBalance, setStoredlBalance] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [userAddress, setUserAddress] = useState(null)

  useEffect(() => {
    initContracts();
  }, [])

  let initContracts = async () => {
    await configureBlockchain();
    let tiketsFromBlockchain = await myContract.current?.getTikets();
    if (tiketsFromBlockchain != null) {
      setTikets(tiketsFromBlockchain)
      seeBalance()
    }
  }



  let configureBlockchain = async () => {
    try {
      let provider = await detectEthereumProvider();
      if (provider) {
        await provider.request({ method: 'eth_requestAccounts' });
       
        const networkId = await provider.request({ method: 'net_version' })

        provider = new ethers.providers.Web3Provider(provider);
        const signer = provider.getSigner();

        setUserAddress(signer.address)
        console.log(signer)

        myContract.current = new Contract(
          '0x7A446cE2F2253Ab67A5E5C262db99E4D409a262D',
          myContractManifest.abi,
          signer
        );


      }
    } catch (error) { }
  }

  let clickBuyTiket = async (i) => {
    const tx = await myContract.current.buyTiket(i, {
      value: ethers.utils.parseEther("0.02"),
      gasLimit: 6721975,
      gasPrice: 20000000000,
    });

    await tx.wait();

    const tiketsUpdated = await myContract.current.getTikets();
    setTikets(tiketsUpdated);
    seeBalance()
  }

  let withdrawBalance = async () => {
    const tx = await myContract.current.transferBalanceToAdmin();
    await tx.wait()
    seeBalance()
  }

  let submitMyForm = async (e) => {
    //evita que avance a la página del formulario
    e.preventDefault();

    const valueForm = e.target.elements[0].value;
    const tx = await myContract.current.changeAdmin(valueForm);
  };

  let seeBalance = async () => {
    const balances = await myContract.current?.getContractBalance();
    setRealBalance(balances[0])
    setStoredlBalance(balances[1])
  }


  return (
    <div>
      <h1>Tikets store</h1>
      <button onClick={() => withdrawBalance()}>Withdraw Balance: {ethers.utils.formatEther(realBalance)} BNB</button>
      <form className="form-inline" onSubmit={(e) => submitMyForm(e)}>
        <input type="text" />
        <button type="submit" > Donate </button>
      </form>
      <p>User waller balance: </p>
      <ul>
        {tikets.map((address, i) =>
          <li>Tiket {i} comprado por {address}
            {address == ethers.constants.AddressZero &&
              <a href="#" onClick={() => clickBuyTiket(i)}> buy</a>}
          </li>
        )}
      </ul>
    </div>
  )

}


export default Tikets;
