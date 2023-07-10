import hre, { ethers, web3, upgrades, artifacts } from "hardhat";
import { getSignerAccount, readContractAddressFromFile } from "./utils/helpers";
require('dotenv').config();

async function main() {
    const signer = await getSignerAccount();

    const voteAddress = readContractAddressFromFile('hvaxvotercard');
    const voter = await ethers.getContractAt("HVAXVoterCard", voteAddress);
    const owner = await voter.owner();
    console.log(`Owner: ${owner} Signer: ${signer.address}`);

    const testWallets = [signer.address, "0x71686c9d109AA55abf87Cb0fac7e8B9bB84AD1A7",
        "0xeA1398A3363e470d8F68DF94AbB2D375E45f270D",
        "0xA8345d44eEe8c3948496B4031f2Ac3F0ebBA3F89",
        "0xb45aCa2DF8CB7c5cbA7b1AE55a772d666b7dF6bc",
        "0xd3476E25B9CF06193bbdb06EB9577C83CB22ea5f",
        "0xF82d57E0A486aeED1ab0Ef603542d0420450f9be",
        "0x87a7DE8D333dBAa7794AC329b49e77B9c35b9530",
        "0x4e12fc216b46C2Ea5FA9450cF5BBBC40446881CA",
        "0x8CFe1d383CE9337d65E2AA5ea6D2BFf47C7D6Da9",
        "0x9A9FD33439353f8ac338B27B9D48f53da45F84b8"]

    // await voter.connect(signer).safeMint(signer.address);
    

    // const bal = await voter.balanceOf(signer.address);
    // console.log(`Balance of ${signer.address}: ${bal}`);

    for (const wallet of testWallets) {
        try {
            const walletBal = await voter.balanceOf(wallet);
            
            if (walletBal.toNumber() > 0) {
                await voter.connect(signer).safeMint(wallet);
            } else {
                console.log(`${wallet} already has a balance of ${walletBal}`);
            }
            console.log(`Balance of ${wallet}: ${walletBal}`);
        } catch (error) {
            console.error(error);            
        }
    }

    // test no double minting
    // let testTx = await voter.connect(signer).safeMint(testWallets[0]);
    // console.log(`Double mint transaction:\r\n\t ${testTx}`);
}

main().catch((ex) => {
    console.error(ex);
    process.exitCode = 1;
});