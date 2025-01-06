import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import detectEthereumProvider from "@metamask/detect-provider";
import { Contract, ethers } from "ethers";
import { useState, useEffect, useRef } from 'react';
import bankManifest from "../../contracts/Bank.json";

function Bank() {
  const bank = useRef(null);
  const [userBalance, setUserBalance] = useState(0);
  const [userInterest, setUserInterest] = useState(0);

  useEffect(() => {
    initContracts();
  }, [])

  let initContracts = async () => {
    await getBlockchain();
    seeUserBalance()
  }

  let getBlockchain = async () => {
    let provider = await detectEthereumProvider();
    if (provider) {
      await provider.request({ method: 'eth_requestAccounts' });
      const networkId = await provider.request({ method: 'net_version' })

      provider = new ethers.providers.Web3Provider(provider);
      const signer = provider.getSigner();

      bank.current = new Contract(
        "0x0866feEDdDCc36CdaE715cbF14077210c4B90B94",
        bankManifest.abi,
        signer
      );

    }
    return null;
  }

  let onSubmitDeposit = async (e) => {
    e.preventDefault();
    const BNBamount = parseFloat(e.target.elements[0].value);
    console.log(BNBamount)
    // Wei to BNB se pasa con ethers.utils recibe un String!!!
    const tx = await bank.current.deposit({
      value: ethers.utils.parseEther(String(BNBamount)),
      gasLimit: 6721975,
      gasPrice: 20000000000,
    });

    await tx.wait();
  }

  let clickWithdraw = async (e) => {
    await await bank.current.withdraw();
  }

  let seeUserBalance = async () => {
    const balance = await bank.current?.getBalanceBNB();
    const interes = await bank.current?.getInteres();
    setUserBalance(ethers.utils.formatEther(balance))
    setUserInterest(ethers.utils.formatEther(interes))
  }



  return (
    <div>
      <h1>Bank</h1>
      <p>Your BNB deposited: {userBalance} BNB</p>
      <p>Your generated interest: {userInterest} BMIW</p>
      <form onSubmit={(e) => onSubmitDeposit(e)} >
        <input type="number" step="0.01" />
        <button type="submit">Deposit</button>
      </form>
      <button onClick= { () => clickWithdraw() } > Withdraw </button>
    </div>
  )
}



export default Bank;
