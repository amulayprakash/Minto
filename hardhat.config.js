require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-ethers");
// require("@openzeppelin/hardhat-upgrades");
// require('hardhat-contract-sizer');


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    goerli: {
      url: "https://goerli.infura.io/v3/08d0a9d1045146dc888e62677f83e772", //Infura url with projectId
      accounts: ["9ddfdc9f5611dae1fd7dd3874529480f54cd14d5e511e9c0dddc88c38fba69ce"] // Seller private key

      // ["ADMIN","ALANKRIT"]
    },
    matic: {
      // url: "https://rpc-mumbai.maticvigil.com",
      url: "https://matic.getblock.io/89cf7a1a-375d-4b1c-b82a-d03eb4cde880/testnet/",
      // accounts: [process.env.PRIVATE_KEY] // Seller private key
      accounts: ["fd87ebea96d89f8511d28ffd7bb772338d668bcd2a6762095aae7e69b75991ac"] // Seller private key
    },
    // mainnet:{
    //   url :"https://mainnet.infura.io/v3/08d0a9d1045146dc888e62677f83e772",
    //   accounts: [process.env.PRIVATE_KEY] // Seller private key
    // },
    forking: {
      url :"https://eth-mainnet.g.alchemy.com/v2/1F-7GfjnbYxCbj8lY27FgdPHMmX2n3PC",
      blockNumber: 16327329
      // npx hardhat node --fork https://mainnet.infura.io/v3/08d0a9d1045146dc888e62677f83e772 --fork-block-number 16326526

    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/

    // apiKey:  process.env.GOERLI_API_KEY,   // ethereum
    // apiKey:  process.env.ETHEREUM_MAINNET_API_KEY,   // ethereum mainnet
    // apiKey: process.env.POLYGONSCAN_API_KEY,      // polygon
    apiKey: "634K4G2K7ASVPHQKBWSW31C7J21NBBR53T",      // polygon
  },
  mocha: {
    timeout: 100000000,
  },
  paths:{
    artifacts: './frontend/src/artifacts',
  }
};

// npx hardhat --network matic run ./scripts/deploy.js 
// npx hardhat verify --contract contracts/DropKitPass.sol:DropKitPass --network matic 0xA38CD8f6f3018502e494F15Cedc8e3D2B16F491E
