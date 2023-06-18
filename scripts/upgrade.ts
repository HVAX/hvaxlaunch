import hre, { ethers, web3, upgrades, artifacts } from "hardhat";
import { changeDeployUpgradeableContract, saveContractMetadata } from './utils/helpers';
import fs from 'fs';

async function main() {
  const hvaxCard = await changeDeployUpgradeableContract('HVAXVoterCard');

  console.log(
    "HVAXVoterCard contract update deployed to:", hvaxCard.address
  );
  
  saveContractMetadata('HVAXVoterCard', hvaxCard.address);
  
  console.log('\nHVAXVoterCard ABI available in hvaxvotercard.json ✅');

  const hvaxGovernor = await changeDeployUpgradeableContract("HVAXVoterGovernor");

  console.log(
    "HVAXVoterGovernor contract deployed to:", hvaxGovernor.address
  );

  saveContractMetadata('HVAXVoterGovernor', hvaxGovernor.address);
 
  console.log('\nHVAXVoterGovernor ABI available in hvaxvotergovernor.json ✅');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});