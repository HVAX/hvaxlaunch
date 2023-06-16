import hre, { ethers, web3, upgrades } from 'hardhat';
import fs from 'fs';
import { Artifact } from 'hardhat/types';

export async function deployContract(TokenArtifact: any, ownerAddress: any) : Promise<ethers.Contract> {
    const token = await upgrades.deployProxy(TokenArtifact, [ownerAddress], {
      initializer: 'initialize'
    });
    return await token.deployed();
  }
  
  export async function upgradeContract(TokenArtifact: any, tokenAddress: string): Promise<ethers.Contract> {
    const contract = await upgrades.upgradeProxy(tokenAddress, TokenArtifact);
    return contract;
  }

  export async function getSignerAccount() {
    const ownerList = await ethers.getSigners();
    const owner = ownerList[0];
    return owner;
  }

  export async function initialDeployUpgradeableContract(contractName: string): Promise<ethers.Contract> {
    const artifact = await ethers.getContractFactory(contractName);
    const owner = await getSignerAccount();
    return await deployContract(artifact, owner.address);
  }

  export async function changeDeployUpgradeableContract(contractName: string, address: string): Promise<ethers.Contract> {
    const artifact = await ethers.getContractFactory(contractName);
    const artifactContract = await artifact.deploy();
    console.log(artifactContract);
    const owner = await getSignerAccount();
    console.log(owner.address);
    return await upgradeContract(artifact, address);
  }

  export function writeArtifactToJson(fileNameWithoutTypeSuffix: string, abi: any): void {
    fs.writeFileSync(
        `${fileNameWithoutTypeSuffix}.json`,
        JSON.stringify(abi, undefined, 2)
      );
}