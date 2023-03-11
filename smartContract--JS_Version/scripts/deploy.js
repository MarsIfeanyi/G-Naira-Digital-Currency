// imports
const { ethers, run, network } = require("hardhat");
const { verify } = require("../utils/verify");

// async main function
async function main() {
  const gNairaContractFactory = await ethers.getContractFactory("GNaira");
  console.log("Deploying contract...");

  const gNairaContract = await gNairaContractFactory.deploy();
  await gNairaContract.deployed();
  console.log(`Contract deployed to: ${gNairaContract.address}`);

  // if we are on the sepolia  testnet and the ETHERSCAN_API_KEY exist, then wait for block confirmations and then verify contract
  if (
    network.config.chainId === 11155111 ||
    (5 && process.env.ETHERSCAN_API_KEY)
  ) {
    console.log("Waiting for block confirmations...");

    //wait for 6 block confirmations before verifying the transaction
    await gNairaContract.deployTransaction.wait(3);
    await verify(gNairaContract.address, []);
  }
}

// call main function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
