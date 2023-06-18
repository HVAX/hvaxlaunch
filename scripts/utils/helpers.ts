import hre, { ethers, web3, upgrades, artifacts } from 'hardhat';
import fs from 'fs';
import { Artifact } from 'hardhat/types';

export async function deployContract(TokenArtifact: any, ownerAddress: any) : Promise<ethers.Contract> {
    const token = await upgrades.deployProxy(TokenArtifact, [ownerAddress], {
      initializer: 'initialize'
    });
    return await token.deployed();
  }
  
  async function upgradeContract(TokenArtifact: any, contractName: string, contractAddress: string) {
    const deployedContract = await ethers.getContractAt(contractName, contractAddress);
    const contract = await upgrades.upgradeProxy(deployedContract, TokenArtifact);
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

  export async function changeDeployUpgradeableContract(contractName: string): Promise<ethers.Contract> {
    const artifact = await ethers.getContractFactory(contractName);
    const address = readContractAddressFromFile(contractName.toLocaleLowerCase());
    return await upgradeContract(artifact, contractName, address);
  }

  export function readContractAddressFromFile(contractName: string) {
    const jsonString = fs.readFileSync(`${contractName.toLocaleLowerCase()}-address.json`, 'utf-8');
    const data = JSON.parse(jsonString);
    return data['Address'];
  }
  
  export async function saveContractMetadata(contractName: string, tokenAddr: string) {
    const fileName = `${contractName.toLocaleLowerCase()}-address.json`;
  
    fs.writeFileSync(
      fileName,
      JSON.stringify(
        {
          Address: tokenAddr
        },
        undefined,
        2
      )
    );
  
    const TokenArtifact = artifacts.readArtifactSync(contractName);
  
    fs.writeFileSync(
      `${contractName.toLocaleLowerCase()}.json`,
      JSON.stringify(TokenArtifact, null, 2)
    );
  }