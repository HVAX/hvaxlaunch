import { saveContractMetadata } from "./utils/helpers";
import hre, { ethers, web3, upgrades, artifacts } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  const HVAXVoterCard = await ethers.getContractFactory("HVAXVoterCard");
  const voterCard = await HVAXVoterCard.deploy();
  console.log("HVAXVoterCard deployed to:", voterCard.address);

  console.log("Verifying contract on Etherscan...");
  await ethers.run("verify:verify", {
    address: voterCard.address,
    constructorArguments: [],
  });
  console.log("Contract verified on Etherscan");

  saveContractMetadata('HVAXVoterCard', voterCard.address);

  console.log('\nHVAXVoterCard ABI available in hvaxvotercard.json ✅');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });