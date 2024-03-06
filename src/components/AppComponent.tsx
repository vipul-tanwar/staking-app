"use client";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { ExternalProvider } from "@ethersproject/providers";
import stakingContractJson from "@/data/stakingContract.json";
import tokenContractJson from "@/data/tokenStakingContract.json";
const AppComponent = () => {
  const tokenAddress = tokenContractJson.address;
  const tokenABI = tokenContractJson.abi;
  const stakingContractAddress = stakingContractJson.address;
  const stakingContractABI = stakingContractJson.abi;
  const [walletAddress, setWalletAddress] = useState();
  const [signer, setSigner]: any = useState();
  const [amount, setAmount] = useState("");

  async function getSigner(address: string) {
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as ExternalProvider
      );
      const signer = provider.getSigner(address);
      setSigner(signer);
      console.log("Signer:", signer);
      return signer;
    } catch (_) {}
  }
  async function requestMetamask() {
    if (window.ethereum) {
      console.log("MetaMask is installed");
      try {
        const accounts = await (window.ethereum as ExternalProvider).request!({
          method: "eth_requestAccounts",
        });
        console.log("Connected account:", accounts[0]);
        setWalletAddress(accounts[0]);
        // getSigner(accounts[0]);
      } catch (error) {
        console.error("Error : ", error);
      }
    } else {
      console.log("MetaMask is not installed.");
    }
  }

  useEffect(() => {
    // requestMetamask();
  }, []);

  async function stakeTokens() {
    if (!amount) return;
    try {
      const token = new ethers.Contract(tokenAddress, tokenABI, signer);

      const stakingContract = new ethers.Contract(
        stakingContractAddress,
        stakingContractABI,
        signer
      );
      const amountWei = amount;
      // const amountWei = ethers.utils.parseUnits(amount, "ether");

      let tx = await token.approve(stakingContractAddress, amountWei);
      await tx.wait();

      tx = await stakingContract.stake(amountWei);
      await tx.wait();

      console.log(`Staked Tokens : ${amount}`);
    } catch (error) {
      console.error(error);
    }
  }

  async function unstakeTokens() {
    try {
      const stakingContract = new ethers.Contract(
        stakingContractAddress,
        stakingContractABI,
        signer
      );
      const txn = await stakingContract.unstake();
      await txn.wait();
      console.log("Unstaked tokens");
    } catch (error) {
      console.error(error);
    }
  }

  async function claimRewards() {
    try {
      const stakingContract = new ethers.Contract(
        stakingContractAddress,
        stakingContractABI,
        signer
      );
      const txn = await stakingContract.claimRewards();
      await txn.wait();
      console.log("Claimed rewards");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      AppComponent
      <div>Wallet Address: {walletAddress}</div>
      <div>
        {" "}
        Token Addres :{" "}
        <a
          className=" text-blue-600 "
          href={`https://mumbai.polygonscan.com/address/${tokenAddress}`}
          target="_blank"
        >
          {tokenAddress}
        </a>
      </div>
      <div>
        {" "}
        Staking Contract Address :{" "}
        <a
          className=" text-blue-600 "
          href={`https://mumbai.polygonscan.com/address/${stakingContractAddress}`}
          target="_blank"
        >
          {stakingContractAddress}
        </a>{" "}
      </div>
      <button
        onClick={() => {
          requestMetamask();
        }}
      >
        Connet Wallet
      </button>
      <input
        type="text"
        placeholder="Amount to stake"
        value={amount}
        className="text-black "
        onChange={(e) => setAmount(e.target.value)}
      />
      <div className=" grid grid-cols-3 gap-4 ">
        <button className=" bg-blue-600 py-2 " onClick={stakeTokens}>
          Staking{" "}
        </button>
        <button className=" bg-blue-600 py-2  " onClick={unstakeTokens}>
          Unstaking{" "}
        </button>
        <button className=" bg-blue-600 py-2  " onClick={claimRewards}>
          Claim Reward
        </button>
      </div>
    </div>
  );
};

export default AppComponent;
