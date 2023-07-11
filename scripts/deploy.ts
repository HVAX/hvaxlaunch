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
  const hvaxCard = await ethers.getContractFactory("HVAXVoterCard");
  const card = await deployContract(hvaxCard);

  await card.deployed();

  console.log("\nHVAXVoterCard contract deployed to:", card.address);

  saveContractMetadata('HVAXVoterCard', card.address);

  console.log('\nHVAXVoterCard ABI available in hvaxvotercard.json ✅');

  const signer = await getSignerAccount();

  await card.connect(signer).safeMint(signer.address);
  const balance = await card.balanceOf(signer.address);

  console.log(`Minted ${balance} to ${signer.address}`);

  const hvaxGovernor = await ethers.getContractFactory("HVAXVoterGovernor");
  const governor = await deployGovernor(hvaxGovernor, card.address);

  console.log(
    "HVAXVoterGovernor contract deployed to:", governor.address
  );

  saveContractMetadata('HVAXVoterGovernor', governor.address);
  console.log('\nHVAXVoterGovernor ABI available in hvaxvotergovernor.json ✅');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});