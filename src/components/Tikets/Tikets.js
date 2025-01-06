import './Tikets.css';
import detectEthereumProvider from "@metamask/detect-provider";
import { Contract, ethers } from "ethers";
import myContractManifest from "../../contracts/MyContract.json";
import { useState, useEffect, useRef } from 'react';


function Tikets() {
  const myContract = useRef(null);
  const [tikets, setTikets] = useState([]);
  const [realBalance, setRealBalance] = useState(0);
  const [balanceWei, setBalanceWei] = useState(0);
  const [userBalance, setUserBalance] = useState(0);

  const [ticketId, setTicketId] = useState("");
  const [recipient, setRecipient] = useState("");

  useEffect(() => {
    initContracts();
  }, [])

  let initContracts = async () => {
    await configureBlockchain();
    let tiketsFromBlockchain = await myContract.current?.getTikets();
    if (tiketsFromBlockchain != null) {
      setTikets(tiketsFromBlockchain)
      seeBalance()
      seeUserBalance()
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

        myContract.current = new Contract(
          '0xECeD84D0566f2cc168fBb98EA3Ae3f8b060f7FFD',
          myContractManifest.abi,
          signer
        );


      }
    } catch (error) { }
  }

  let clickBuyTiket = async (i) => {
    try {
      const tx = await myContract.current.buyTiket(i, {
        value: ethers.utils.parseEther("0.02"),
        gasLimit: 6721975,
        gasPrice: 20000000000,
      });

      await tx.wait()
    } catch (error) {
      alert("Ha ocurrido un error")
    }
    const tiketsUpdated = await myContract.current.getTikets();
    setTikets(tiketsUpdated);
    seeBalance()
  }

  let withdrawBalance = async () => {
    try {
      const tx = await myContract.current.transferBalanceToAdmin();
      await tx.wait()
    } catch (error) {
      alert(error.data.message)
    }
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
    setBalanceWei(balances[1])
  }

  // Ampliacion 3
  let seeUserBalance = async () => {

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();

    const balance = await provider.getBalance(userAddress);
    const balanceInEther = ethers.utils.formatEther(balance);
    setUserBalance(balanceInEther);
  }

  let donateTiket = async (e, i) => {
    //evita que avance a la página del formulario
    e.preventDefault();

    const valueForm = e.target.elements[0].value;
    if (valueForm < 0.01) {
      alert("El valor debe ser mayor a 0.01 BNB");
      return;
    }

    const tx = await myContract.current.buyTiket(i, {
      value: ethers.utils.parseEther(valueForm),
      gasLimit: 6721975,
      gasPrice: 20000000000,
    });

    await tx.wait()

    const tiketsUpdated = await myContract.current.getTikets();
    setTikets(tiketsUpdated);
    seeBalance()
  }

  let bookTiket = async (i) => {
    try {
    const tx = await myContract.current.bookTiket(i);
    } catch (error) {
      alert(error.data ? error.data.message : "Ha ocurrido un error")
    }
  }

  let transferTiket = async (e) => {
    const tx = await myContract.current.transferTiket(ticketId, recipient);

    await tx.wait();

    const tiketsUpdated = await myContract.current.getTikets();
    setTikets(tiketsUpdated);
  }

  return (
    <div>
      <h1>Tikets store</h1>
      <button onClick={() => withdrawBalance()}>Withdraw Balance: {ethers.utils.formatEther(realBalance)} BNB</button>
      <p>Balance Wei: {ethers.utils.formatEther(balanceWei)}</p>
      <form className="form-inline" onSubmit={(e) => submitMyForm(e)}>
        <input type="text" />
        <button type="submit" > Change admin </button>
      </form>
      <p>User wallet balance: {userBalance} BNB</p>
      <form onSubmit={(e) => transferTiket(e)}>
        <div>
          <label htmlFor="ticketId">Ticket ID:</label>
          <input
            type="number"
            id="ticketId"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            required
            min="0"
          />
        </div>
        <div>
          <label htmlFor="recipient">Recipient Address:</label>
          <input
            type="text"
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            required
          />
        </div>
        <button type="submit">Transfer Ticket</button>
      </form>
      <ul>
        {tikets.map((address, i) =>
          <li>Tiket {i} comprado por {address}
            {address == ethers.constants.AddressZero &&
              <a href="#" onClick={() => clickBuyTiket(i)}> buy</a>}
            <form className="form-inline" onSubmit={(e) => donateTiket(e, i)}>
              <input type="number" step="any" placeholder="0.00" />
              <button type="submit" > Donate </button>
            </form>
            <button onClick={() => bookTiket(i)}>Book</button>
          </li>
        )}
      </ul>
    </div>
  )

}


export default Tikets;
