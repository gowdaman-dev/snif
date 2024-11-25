import { ethers } from "ethers";

const balance = new ethers.CloudflareProvider("mainnet")
  .getBalance("0xCFcb12D849569A3d1Cf971721665B2dCe0279A91")
  .then((bal) => {
    console.log("Balance:", ethers.formatEther(bal));
  });
