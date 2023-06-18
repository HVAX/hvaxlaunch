import hre, { ethers, web3, upgrades, artifacts } from "hardhat";
import { Artifact } from 'hardhat/types';
import fs from 'fs';

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

  console.log(
    "HVAXVoterCard contract deployed to:", card.address
  );

  fs.writeFileSync(
    'hvaxvotercard.json',
    JSON.stringify(artifacts.readArtifactSync('HVAXVoterCard').abi, null, 2)
  );
  console.log('\nHVAXVoterCard ABI available in hvaxvotercard.json ✅');

  const hvaxGovernor = await ethers.getContractFactory("HVAXVoterGovernor");
  const governor = await deployGovernor(hvaxGovernor, card.address);

  console.log(
    "HVAXVoterGovernor contract deployed to:", governor.address
  );

  
  fs.writeFileSync(
    'hvaxvotergovernor.json',
    JSON.stringify(artifacts.readArtifactSync('HVAXVoterGovernor').abi, null, 2)
  );
  console.log('\nVAXVoterGovernor ABI available in hvaxvotergovernor.json ✅');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});