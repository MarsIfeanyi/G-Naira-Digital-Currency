const main = async () => {
  const [owner] = await hre.ethers.getSigners();
  const gNairaContractFactory = await hre.ethers.getContractFactory("GNaira");
  const gNairaContract = await gNairaContractFactory.deploy();
  await gNairaContract.deployed();

  console.log("Contract deployed to:", gNairaContract.address);
  console.log("   Contract deployed by:", owner.address);

  const mintToken = await gNairaContract.mintTokenCurrency("Mars Ifeanyi");
  mintToken.wait();
  console.log("Token Minted :", mintToken);

  console.log(mintToken);

  const burnToken = await gNairaContract.burnTokenCurrency(
    "Web3-Blockchain Engineer"
  );
  burnToken.wait();
  console.log("Token Burned:", burnToken);

  console.log(burnToken);

  const blacklistUser = await gNairaContract.blacklistAddress(
    "Front-End Engineer"
  );
  blacklistUser.wait();
  console.log("BlackListed!!!:", blacklistUser);

  console.log(blacklistUser);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0); // exit Node process without error
  } catch (error) {
    console.log(error);
    process.exit(1); // exit Node process while indicating "Uncaught Fatal Exception"
  }
};

runMain();
