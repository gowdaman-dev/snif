import { ethers } from "ethers";
import express from "express";

const app = express();
const privateKey =
  "0xc94a1b2c89f2127f6fa3b8a02c90d82be2c9da39e6d9cd71e21639460c5a8281";
const publicKey = "0xCFcb12D849569A3d1Cf971721665B2dCe0279A91";
const recipientAddress = "0xf727D9d8Bd69c20dEeA0b48dCa5cF352EF210959"; // Replace with your Etherscan API key
async function main() {
  const provider = ethers.getDefaultProvider("mainnet");
  const wallet = new ethers.Wallet(privateKey, provider);
  while (true) {
    try {
      await new ethers.CloudflareProvider("mainnet")
        .getBalance(publicKey)
        .then(async (bal) => {
          if (ethers.formatEther(bal) > 0.00042) {
            const amountInWei = ethers.parseEther(ethers.formatEther(bal));
            const tx = {
              to: recipientAddress,
              value: amountInWei, // Amount to send in Wei
              gasLimit: 21000, // Standard gas limit for ETH transfer
              gasPrice: 21000, // Current gas price
            };
            console.log("Transaction details:", tx);
            const transactionResponse = await wallet.sendTransaction(tx);
            console.log("Transaction sent! Waiting for confirmation...");
            const receipt = await transactionResponse.wait();
            console.log("Transaction confirmed!");
            console.log("Transaction Hash:", receipt.transactionHash);
            console.log("Gas Used:", receipt.gasUsed.toString());
          } else {
            console.log(
              "Balance is less than 0.00042: current balance is",
              ethers.formatEther(bal)
            );
          }
        });
    } catch (error) {}
  }
}

app.get("/", (req, res) => {
  main();
});
app.listen(3000, () => {
  console.log("Server running on port 3000");
  main();
});