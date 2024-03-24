import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import * as dotenv from "dotenv";
dotenv.config();

const { ALCHEMY_API_KEY, METAMASK_PRIVATE_KEY } = process.env;
const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY ?? ""}`,
      accounts: [METAMASK_PRIVATE_KEY ?? ""],
    },
  },
};

export default config;
