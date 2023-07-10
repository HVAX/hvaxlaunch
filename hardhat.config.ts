import { HardhatUserConfig, extendEnvironment } from 'hardhat/config';
import { NetworkUserConfig } from 'hardhat/types';
import '@nomicfoundation/hardhat-toolbox';
import * as dotenv from 'dotenv';
import '@nomiclabs/hardhat-ethers';
dotenv.config();
import '@nomiclabs/hardhat-web3';
import '@openzeppelin/hardhat-upgrades';
import "@buildship/hardhat-ipfs-upload";

const baseGoerliUrl = 'https://goerli.infura.io/v3/';
const baseMainnnetUrl = 'https://mainnet.infura.io/v3/';

extendEnvironment((env) => {
  const Web3 = require('web3');
  env.Web3 = Web3;

  env.web3 = new Web3(env.network.provider);
});

const networks: { [index: string]: NetworkUserConfig } = {
  hardhat: {
    chainId: 31337,
    forking: {
      url: `${baseGoerliUrl}${process.env.INFURA_API_KEY}`
    }
  },
  mainnet: {
    chainId: 1,
    url: `${baseMainnnetUrl}${process.env.INFURA_API_KEY}`
  },
  goerli: {
    chainId: 5,
    url: `${baseGoerliUrl}${process.env.INFURA_API_KEY}`,
    accounts: {
      mnemonic: process.env.MNEMONIC
    },
    gasPrice: 8000000000,
    timeout: 999999
  },
  buildbear : {
    url: 'https://rpc.buildbear.io/blushing-ben-quadinaros-e0e43e61',
    accounts: 
      process.env.PRIVATE_KEY != undefined ? [process.env.PRIVATE_KEY] : []
  }
};

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.12',
    settings: {
      metadata: {
        bytecodeHash: 'none'
      },
      optimizer: {
        enabled: true,
        runs: 1
      }
    }
  },
  mocha: {
    timeout: 100000
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY || '',
      goerli: process.env.ETHERSCAN_API_KEY || ''
    }
  },
  networks: networks,
  defaultNetwork: 'goerli'
};

export default config;
