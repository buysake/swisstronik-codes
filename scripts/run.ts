import { ethers, network } from "hardhat";
import { parseEther } from "ethers";

type HardhatEthersSigner = Awaited<ReturnType<typeof ethers.getSigner>>;

import { encryptDataField } from "@swisstronik/utils";

const sendShieldedTransaction = async (
  signer: HardhatEthersSigner,
  destination: string,
  data: string,
  value: string | number
) => {
  const config = network.config;
  const url = "url" in config ? config.url : "";
  const [encryptedData] = await encryptDataField(url, data);
  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });
};

export const sleep = async (n: number) =>
  new Promise((r) => setTimeout(() => r(null), n));

(async () => {
  try {
    const [deployer] = await ethers.getSigners();

    const erc20 = await ethers.getContractFactory("STNERC20");

    const erc20Deploy = await erc20.deploy(deployer.address, {});
    await erc20Deploy.waitForDeployment();

    const mintErc20Tx = await sendShieldedTransaction(
      deployer,
      erc20Deploy.target.toString(),
      erc20.interface.encodeFunctionData("mint", [
        deployer.address,
        parseEther("100"),
      ]),
      0
    );

    await mintErc20Tx.wait();

    const sendErc20Tx = await sendShieldedTransaction(
      deployer,
      erc20Deploy.target.toString(),
      erc20.interface.encodeFunctionData("transfer", [
        "0x16af037878a6cAce2Ea29d39A3757aC2F6F7aac1",
        parseEther("1"),
      ]),
      0
    );

    await sendErc20Tx.wait();

    const output = {
      contract: {
        erc20: erc20Deploy.target,
      },
      tx: {
        mintErc20: mintErc20Tx.hash,
        sendErc20Tx: sendErc20Tx.hash,
      },
    };

    console.log("🌟 Succes", output);
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  }
})();
