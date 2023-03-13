import { ethers } from "ethers";
import { useState } from "react";
import { useAsyncError } from "react-router-dom";
import Web3Modal from "web3modal";

import { contractABI, contractAddress } from "../constants/config";

const TotalSupply = () => {
  const [transactionHash, setTransactionHash] = useState("");

  const totalSupplyHandler = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    // creating a signer
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    const totalSupplyTransaction = await contract.totalSupply();

    setTransactionHash(`Mining... ${totalSupplyTransaction.hash}`);
    await totalSupplyTransaction.wait();
    setTransactionHash(`Mined... ${totalSupplyTransaction.hash}`);
  };

  return (
    <div className="mt-10">
      <button
        onClick={totalSupplyHandler}
        className="bg-green-600 rounded-xl py-2 px-4 text-white ml-2"
      >
        {" "}
        TotalSupply{" "}
      </button>
      <h3 className="text-center justify-center mt-8">{transactionHash}</h3>

      {/* <h3 className="text-center justify-center mt-8">{balances}</h3> */}
    </div>
  );
};

export default TotalSupply;

// Todo: Fix Bug in TotalSupply, not rendering the correct data
