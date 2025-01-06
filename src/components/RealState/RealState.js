import React from 'react';
import ReactDOM from 'react-dom';
import detectEthereumProvider from "@metamask/detect-provider";
import { Contract, ethers } from "ethers";
import { useState, useEffect, useRef } from 'react';
import realStateContractManifest from "../../contracts/RealStateContract.json";
import realStateContractCitiesManifest from "../../contracts/RealStateContractCities.json";

function RealState() {
    const realStateCities = useRef(null);
    const realState = useRef(null);
    const [realStateArray, setRealStateArray] = useState([])
    const [history, setHistory] = useState([])

    useEffect(() => {
        initContracts();
    }, [])

    let initContracts = async () => {
        await getBlockchain();
    }

    let getBlockchain = async () => {
        let provider = await detectEthereumProvider();
        if (provider) {
            await provider.request({ method: 'eth_requestAccounts' });
            const networkId = await provider.request({ method: 'net_version' })

            provider = new ethers.providers.Web3Provider(provider);
            const signer = provider.getSigner();

            realState.current = new Contract(
                '0x12e0Aa678F29a147DA300c8C4C50788f61dE84d9',
                realStateContractManifest.abi,
                signer
            );

            realStateCities.current = new Contract(
                '0x3fe6C08bcE0aB16887240b3Ba10f6506498aE7fc',
                realStateContractCitiesManifest.abi,
                signer
            );


        }
        return null;
    }

    let onSubmitAddRealState = async (e) => {
        e.preventDefault();
        try {
            // this function use gas
            const tx = await realStateCities.current.addRealState({
                city: e.target.elements[0].value,
                street: e.target.elements[1].value,
                number: parseInt(e.target.elements[2].value),
                meters: parseInt(e.target.elements[3].value),
                registration: parseInt(e.target.elements[4].value),
                owner: e.target.elements[5].value,
                timestamp: 0,
                requester: "0x0000000000000000000000000000000000000000",
                price: parseInt(e.target.elements[6].value)
            });


            await tx.wait();
        } catch (error) {
            console.log(error)
            alert(error.data.message)
        }
    }

    let onSubmitSearchRealState = async (e) => {
        e.preventDefault();

        let city = e.target.elements[0].value;
        console.log(city)
        let newProperties = await realStateCities.current.getRealStateByCity(city);
        setRealStateArray(newProperties)
    }

    let clickOnDeleteRealState = async (registration) => {

        const tx = await realState.current.deleteRealStateByRegistration(registration);
        await tx.wait();
        setRealStateArray([])
    }

    let onSubmitAddAuthorizedAddress = async (e) => {
        e.preventDefault();

        let address = e.target.elements[0].value;
        const tx = await realStateCities.current.addAuthorizedAddress(address);
        await tx.wait();
    }

    let seeHistory = async () => {
        let history = await realStateCities.current.getRealStateHistory();
        setHistory(history)
    }

    return (
        <div>
            <h1>RealState</h1>
            <h2>Add RealState</h2>
            <form onSubmit={(e) => onSubmitAddRealState(e)} >
                <input type="text" placeholder="city" />
                <input type="text" placeholder="street" />
                <input type="number" placeholder="number" />
                <input type="number" placeholder="meters" />
                <input type="number" placeholder="registration" />
                <input type="text" placeholder="owner name" />
                <input type="number" placeholder="price" />
                <button type="submit">Add</button>
            </form>
            <h2>Add authorized address</h2>
            <form onSubmit={(e) => onSubmitAddAuthorizedAddress(e)}>
                <input type='text' placeholder='0x00000' />
                <button type='submit'>Add</button>
            </form>
            <h2>Search RealState</h2>
            <form onSubmit={(e) => onSubmitSearchRealState(e)} >
                <input type="text" placeholder="city" />
                <button type="submit">Search</button>
            </form>

            {realStateArray.map((r) =>
            (<p>
                <button onClick={() => { clickOnDeleteRealState(r.registration) }}>Delete</button>
                {r.city} -
                {r.street} -
                {ethers.BigNumber.from(r.number).toNumber()} -
                {ethers.BigNumber.from(r.meters).toNumber()} -
                {ethers.BigNumber.from(r.registration).toNumber()} -
                {r.owner} -
                {ethers.BigNumber.from(r.price).toNumber()}
            </p>)

            )}
            <button onClick={() => {seeHistory()}} >See history</button>
            {history.map((r) =>
            (<p>
                {r.city} -
                {r.street} -
                {ethers.BigNumber.from(r.number).toNumber()} -
                {ethers.BigNumber.from(r.meters).toNumber()} -
                {ethers.BigNumber.from(r.registration).toNumber()} -
                {r.owner}
            </p>)

            )}
        </div>
    )

}

export default RealState;
