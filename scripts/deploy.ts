import hre, { ethers, web3, upgrades, artifacts } from "hardhat";
import { Artifact } from 'hardhat/types';
import fs from 'fs';
import { getSignerAccount, saveContractMetadata } from "./utils/helpers";

async function deployContract(TokenArtifact: any) {
    const token = await upgrades.deployProxy(TokenArtifact, [], {
      initializer: 'initialize'
    });
    return await token.deployed();
  }

async function deployGovernor(TokenArtifact: any, tokenAddress: any) {
    const token = await upgrades.deployProxy(TokenArtifact, [tokenAddress], {
      initializer: 'initialize'
    });
    return await token.deployed();
  }

async function main() {

  const signer = await getSignerAccount();
  console.log(`Signer: ${signer.address}`);

  const hvaxCard = await ethers.getContractFactory("HVAXVoterCard", signer);
  const card = await deployContract(hvaxCard);

  await card.deployed();

  console.log("\nHVAXVoterCard contract deployed to:", card.address);

  saveContractMetadata('HVAXVoterCard', card.address);

  console.log('\nHVAXVoterCard ABI available in hvaxvotercard-scroll.json ✅');

  await card.connect(signer).safeMint(signer.address);
  const balance = await card.balanceOf(signer.address);

  console.log(`Minted ${balance} to ${signer.address}`);

  // const hvaxGovernor = await ethers.getContractFactory("HVAXVoterGovernor");
  // const governor = await deployGovernor(hvaxGovernor, '0x4E911626Fa378cC95fB1A26Cc272c070eF79e4b7');

  // console.log(
  //   "HVAXVoterGovernor contract deployed to:", governor.address
  // );

  // saveContractMetadata('HVAXVoterGovernor', governor.address);
  // console.log('\nHVAXVoterGovernor ABI available in hvaxvotergovernor.json ✅');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});