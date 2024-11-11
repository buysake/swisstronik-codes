import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const PRIVATE_KEY = vars.get("SWISSTRONIK_CODES_PRIVATE_KEY");

const config: HardhatUserConfig = {
  defaultNetwork: "swisstronik",
  solidity: "0.8.20",
  networks: {
    swisstronik: {
      url: "https://json-rpc.testnet.swisstronik.com/",
      accounts: [`${PRIVATE_KEY}`],
    },
  },
};

export default config;
