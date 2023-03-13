import { ethers } from "ethers";
import { useState } from "react";
import Web3Modal from "web3modal";
import UnBlacklistUser from "../components/UnBlacklistUser";

import { contractABI, contractAddress } from "../constants/config";

const BlacklistUserPage = () => {
  const [account, setAccount] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    // creating a signer
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    const BlacklistUserTransaction = await contract.blacklistAddress(account);

    setTransactionHash(`Mining... ${BlacklistUserTransaction.hash}`);
    await BlacklistUserTransaction.wait();
    setTransactionHash(`Mined... ${BlacklistUserTransaction.hash}`);

    setAccount("");
  };

  return (
    <div className="mt-10">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-6 md:space-x-4 mx-auto items-center justify-center mt-14">
          <h1 className="justify-center text-3xl mx-auto items-center text-center text-blue-600">
            Blacklist Address
          </h1>

          {/* Individual Container */}
          <div className="space-y-2 flex flex-col">
            <label htmlFor="account" className="text-blue-600 mr-2">
              Address (account)
            </label>

            <input
              type="text"
              value={account}
              placeholder="Enter Address (account)"
              required
              onChange={(e) => setAccount(e.target.value)}
              className="rounded-lg p-2 border border-blue-600 w-72"
            />

            <button
              type="submit"
              className="bg-blue-900 rounded-xl py-2 px-4 text-white ml-2"
            >
              Blacklist
            </button>
          </div>
        </div>
      </form>

      <h3 className="text-center justify-center mt-8">{transactionHash}</h3>

      <UnBlacklistUser />
    </div>
  );
};

export default BlacklistUserPage;
