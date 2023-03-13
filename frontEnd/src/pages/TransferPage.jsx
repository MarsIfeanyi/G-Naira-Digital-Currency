import { ethers } from "ethers";
import { useState } from "react";
import Web3Modal from "web3modal";
import Balances from "../components/Balances";

import { contractABI, contractAddress } from "../constants/config";

const TransferPage = () => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const [transactionHash, setTransactionHash] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    // creating a signer
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    if (recipient && amount) {
      const transferTransaction = await contract.transfer(recipient, amount);

      setTransactionHash(`Mining... ${transferTransaction.hash}`);
      await transferTransaction.wait();
      setTransactionHash(`Mined... ${transferTransaction.hash}`);

      setRecipient("");
      setAmount("");
    }
  };

  return (
    <div className="mt-10">
      <h1 className="justify-center text-3xl mx-auto items-center text-center text-blue-600">
        Transfer Token Currency
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-6 md:space-x-4 mx-auto items-center justify-center mt-14">
          {/* Individual Container */}
          <div className="space-y-2 flex flex-col">
            <label htmlFor="recipient" className="text-blue-600 mr-2">
              Recipient
            </label>

            <input
              type="text"
              value={recipient}
              placeholder="Enter Address (account)"
              required
              onChange={(e) => setRecipient(e.target.value)}
              className="rounded-lg p-2 border border-blue-600 w-72"
            />

            <label htmlFor="amount" className="text-blue-600 mr-2">
              Amount
            </label>

            <input
              type="number"
              value={amount}
              placeholder="Enter Amount"
              required
              onChange={(e) => setAmount(e.target.value)}
              className="rounded-lg p-2 border border-blue-600 w-72"
            />

            <button
              type="submit"
              className="bg-green-800 rounded-xl py-2 px-4 text-white ml-2"
            >
              Transfer
            </button>
          </div>
        </div>
      </form>
      <h3 className="text-center justify-center mt-8">{transactionHash}</h3>
      <Balances />
    </div>
  );
};

export default TransferPage;
