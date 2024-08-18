import hre, { ethers, web3, upgrades, artifacts } from "hardhat";
import { readContractAddressFromFile } from "./utils/helpers";

async function main() {
    const VoterCard = await ethers.getContractFactory("HVAXVoterCard");

    const cardAddress = readContractAddressFromFile("HVAXVoterCard");

    console.log(`Upgrading HVAXVoterCard at ${cardAddress}`);
    const upgraded = await upgrades.upgradeProxy(cardAddress, VoterCard);
    console.log("HVAXVoterCard upgraded to:", upgraded.target);

    // Verify HVAXVoterCard contract
    console.log("Verifying contract on Etherscan...");
    await hre.run("verify:verify", {
        address: upgraded.target,
        constructorArguments: [],
    });
    console.log("Contract verified on Etherscan");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
    