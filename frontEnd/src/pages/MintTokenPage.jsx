import { ethers } from "ethers";
import { useState } from "react";
import Web3Modal from "web3modal";

import { contractABI, contractAddress } from "../constants/config";

const MintTokenPage = () => {
  const [mintToken, setMintT] = useState("");
  const [transactionHash, setTransactionHash] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    // creating a signer
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    //const transaction = await contract.sendFeedBack(feedback);

    setTransactionHash(`
            Mining... ${transaction.hash}
            
            `);
    await transaction.wait();
    setTransactionHash(
      `
            Mined... ${transaction.hash}`
    );

    setFeedback("");
  };

  return (
    <div
      className="mt-20 
    "
    >
      <h1
        className="justify-center text-3xl mx-auto items-center text-center text-blue-600 
      "
      >
        Mint New Token Currency
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-6  space-x-0  md:space-x-4  mx-auto items-center justify-center mt-14">
          {/* Individual Container */}
          <div className="space-y-2 md:space-y-0 flex-col md:flex-row  ">
            <label htmlFor="feedback" className="text-blue-600 mr-2">
              Recipient - Amount
            </label>

            <input
              type="text"
              value={feedback}
              placeholder="Enter Address(account) and Amount"
              required
              onChange={(e) => setFeedback(e.target.value)}
              className="rounded-lg p-2 border border-blue-600 w-72"
            />
            <button
              type="submit"
              className="bg-blue-600 rounded-xl py-2 px-4 text-white ml-2   "
            >
              Mint Token
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MintTokenPage;
