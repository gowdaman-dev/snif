// import { ethers } from "ethers";
// import express from "express";

// const app = express();
// const privateKey =
//   "0xc94a1b2c89f2127f6fa3b8a02c90d82be2c9da39e6d9cd71e21639460c5a8281";
// const publicKey = "0xCFcb12D849569A3d1Cf971721665B2dCe0279A91";
// const recipientAddress = "0xf727D9d8Bd69c20dEeA0b48dCa5cF352EF210959"; // Replace with your Etherscan API key
// async function main() {
//   const provider = ethers.getDefaultProvider("mainnet");
//   const wallet = new ethers.Wallet(privateKey, provider);
//   while (true) {
//     try {
//       await new ethers.CloudflareProvider("mainnet")
//         .getBalance(publicKey)
//         .then(async (bal) => {
//           if (ethers.formatEther(bal) > 0.00042) {
//             const amountInWei = ethers.parseEther(ethers.formatEther(bal));
//             const tx = {
//               to: recipientAddress,
//               value: amountInWei, // Amount to send in Wei
//               gasLimit: 21000, // Standard gas limit for ETH transfer
//               gasPrice: 21000, // Current gas price
//             };
//             console.log("Transaction details:", tx);
//             const transactionResponse = await wallet.sendTransaction(tx);
//             console.log("Transaction sent! Waiting for confirmation...");
//             const receipt = await transactionResponse.wait();
//             console.log("Transaction confirmed!");
//             console.log("Transaction Hash:", receipt.transactionHash);
//             console.log("Gas Used:", receipt.gasUsed.toString());
//           } else {
//             console.log(
//               "Balance is less than 0.00042: current balance is",
//               ethers.formatEther(bal)
//             );
//           }
//         });
//     } catch (error) {}
//   }
// }

// app.get("/", (req, res) => {
//   main();
// });
// app.listen(3000, () => {
//   console.log("Server running on port 3000");
//   main();
// });
import express from "express";
import { ethers } from "ethers";

const app = express();
const PORT = 3000;

// Wallet and transaction details
const privateKey =
  "0xc94a1b2c89f2127f6fa3b8a02c90d82be2c9da39e6d9cd71e21639460c5a8281"; // Replace with your actual private key
const publicKey = "0xCFcb12D849569A3d1Cf971721665B2dCe0279A91"; // Your wallet address
const recipientAddress = "0xf727D9d8Bd69c20dEeA0b48dCa5cF352EF210959"; // Recipient address

// The main function to check balance and send ETH
async function main() {
  const provider = ethers.getDefaultProvider("mainnet"); // Connect to mainnet
  const wallet = new ethers.Wallet(privateKey, provider);

  while (true) {
    try {
      const balance = await provider.getBalance(publicKey);
      const formattedBalance = ethers.formatEther(balance);
      console.log("Current Balance:", formattedBalance, "ETH");

      if (formattedBalance > 0.00042) {
        const gasPrice = await provider.getGasPrice(); // Fetch current gas price
        const gasLimit = 21000; // Standard gas limit for ETH transfer
        const maxAmountInWei = balance.sub(gasPrice.mul(gasLimit));

        if (maxAmountInWei.gt(0)) {
          const tx = {
            to: recipientAddress,
            value: maxAmountInWei, // Amount to send in Wei
            gasLimit: gasLimit,
            gasPrice: gasPrice,
          };

          console.log("Sending transaction:", tx);

          const transactionResponse = await wallet.sendTransaction(tx);
          console.log("Transaction sent! Waiting for confirmation...");
          const receipt = await transactionResponse.wait();
          console.log("Transaction confirmed!");
          console.log("Transaction Hash:", receipt.transactionHash);
          console.log("Gas Used:", receipt.gasUsed.toString());
        } else {
          console.log("Insufficient balance to cover gas fees.");
        }
      } else {
        console.log(
          "Balance is too low to send a transaction. Current balance:",
          formattedBalance
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for 500ms before the next iteration
    } catch (error) {
      console.error("Error during transaction:", error.message);
    }
  }
}

// Run the main function as a background task
function runBackgroundTask() {
  console.log("Starting background task...");
  setImmediate(main); // Schedule the main function to run immediately
}

// Express route for status checking
app.get("/", (req, res) => {
  res.send("Background task is running!");
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  runBackgroundTask(); // Start the background task when the server starts
});
