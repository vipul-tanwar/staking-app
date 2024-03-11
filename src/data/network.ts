import { ethers } from "ethers";

export   const polygonMumbai = {
    chainId: ethers.utils.hexValue(80001),
    chainName: "Matic Mumbai",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
  };