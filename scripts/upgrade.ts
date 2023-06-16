import hre, { ethers, web3, upgrades, artifacts } from "hardhat";
import { changeDeployUpgradeableContract } from './utils/helpers';
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
  const hvaxCard = await changeDeployUpgradeableContract("HVAXVoterCard", '0x2d8798D114d4424Eb61a6350F149DADa7f25aC36');
  await hvaxCard.deployed();

  console.log(
    "HVAXVoterCard contract deployed to:", hvaxCard.address
  );

  fs.writeFileSync(
    'hvaxvotercard.json',
    JSON.stringify(artifacts.readArtifactSync('HVAXVoterCard').abi, null, 2)
  );
  console.log('\nVAXVoterCard ABI available in hvaxvotercard.json ✅');

  const hvaxGovernor = await changeDeployUpgradeableContract("HVAXVoterGovernor", '0xADc02448AFaD3A51a327912148eA672fD2e7D099');

  console.log(
    "HVAXVoterGovernor contract deployed to:", hvaxGovernor.address
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