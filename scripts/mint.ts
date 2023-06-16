import hre, { ethers, web3, upgrades, artifacts } from "hardhat";
import { getSignerAccount } from "./utils/helpers";
require('dotenv').config();

async function main() {
    const signer = await getSignerAccount();

    const voteAddress = '0x9044cdCD81365439e80c0Bd91C6f7328BbBc9B27';
    const voter = await ethers.getContractAt("HVAXVoterCard", voteAddress);
    const owner = await voter.owner();
    console.log(`Owner: ${owner} Signer: ${signer.address}`);

    voter.connect(signer).safeMint(signer.address);
    

    const bal = await voter.balanceOf(signer.address);
    console.log(`Balance of ${signer.address}: ${bal}`);
}

main().catch((ex) => {
    console.error(ex);
    process.exitCode = 1;
});