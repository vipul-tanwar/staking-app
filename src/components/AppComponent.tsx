"use client";
import { Signer, ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { ExternalProvider } from "@ethersproject/providers";
import stakingContractJson from "@/data/stakingContract.json";
import tokenContractJson from "@/data/tokenStakingContract.json";
import ContractRead from "./ReadContract";
import Button from "./common/Button";
import FunctionDetails from "./layout/FunctionDetails";
import { RewardDetails } from "@/types/CommonInterface";

const AppComponent = () => {
  const tokenAddress = tokenContractJson.address;
  const tokenABI = tokenContractJson.abi;
  const stakingContractAddress = stakingContractJson.address;
  const stakingContractABI = stakingContractJson.abi;

  const provider = new ethers.providers.JsonRpcProvider(
    "https://polygon-mumbai.infura.io/v3/219b1d1b9fd243aa9f83bf879622569d"
  );

  const [walletAddress, setWalletAddress] = useState<string>();
  const [signer, setSigner] = useState<Signer | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [rewardDetails, setRewardDetails] = useState<RewardDetails | null>();

  async function getSigner(address: string) {
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as ExternalProvider
      );
      const signer = provider.getSigner(address);
      setSigner(signer);
    } catch (_) {}
  }

  async function requestMetamask() {
    if (window.ethereum) {
      console.log("MetaMask is installed");
      try {
        const accounts = await (window.ethereum as ExternalProvider).request!({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        getSigner(accounts[0]);
      } catch (error) {
        console.error("Error : ", error);
      }
    } else {
      console.log("MetaMask is not installed.");
    }
  }

  useEffect(() => {
    requestMetamask();
  }, []);

  async function stakeTokens() {
    if (!amount) return alert("Please enter amount");
    try {
      const token = new ethers.Contract(tokenAddress, tokenABI, signer!);

      const stakingContract = new ethers.Contract(
        stakingContractAddress,
        stakingContractABI,
        signer!
      );
      const amountWei = amount;
      // const amountWei = ethers.utils.parseUnits(amount, "ether");

      let tx = await token.approve(stakingContractAddress, amountWei);
      await tx.wait();

      tx = await stakingContract.stake(amountWei);
      await tx.wait();
      alert(`Staked Tokens : ${amount}`);
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
        signer!
      );
      debugger;
      const txn = await stakingContract.unstake();
      await txn.wait();
      alert("Unstaked tokens");
      console.log("Unstaked tokens");
    } catch (error) {
      console.log(error);
    }
  }

  async function claimRewards() {
    try {
      const stakingContract = new ethers.Contract(
        stakingContractAddress,
        stakingContractABI,
        signer!
      );
      const txn = await stakingContract.claimRewards();
      await txn.wait();
      console.log("Claimed rewards");
    } catch (error) {
      console.log(error);
    }
  }

  async function getRewardBalance() {
    try {
      const stakingContract = new ethers.Contract(
        stakingContractAddress,
        stakingContractABI,
        signer!
      );
      const rewardDetails = await stakingContract.getRewardDetails();

      setRewardDetails({
        accRewardPerShare: rewardDetails.accRewardPerShare,
        lastCheckpoint: rewardDetails.lastCheckpoint,
        rewardPerBlock: rewardDetails.rewardPerBlock,
      });
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getRewardBalance();
  }, [signer]);

  return (
    <div className=" py-4">
      <div className=" flex flex-col gap-2 ">
        <div>Wallet Address: {walletAddress}</div>
        <div>
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
      </div>
      {/* <button
        onClick={() => {
          requestMetamask();
        }}
      >
        Connet Wallet
      </button> */}
      <div className=" my-3 ">
        {" "}
        <input
          type="text"
          placeholder="Amount to stake"
          value={amount}
          className="text-black w-full my-2 p-2"
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className=" grid grid-cols-3 gap-4 ">
          <Button
            onClick={() => {
              stakeTokens();
            }}
            label="Staking"
          />
          <Button
            onClick={() => {
              unstakeTokens();
            }}
            label="Unstaking"
          />
          <Button
            onClick={() => {
              claimRewards();
            }}
            label="Claim Reward"
          />
        </div>
      </div>
      {/* <button
        className="text-green-500 font-bold  "
        onClick={() => {
          getRewardBalance();
        }}
      >
        Detdetails
      </button> */}
      <div className=" my-3 ">
        {walletAddress && (
          <FunctionDetails
            functionName="Reward Details"
            functionData={rewardDetails}
          />
        )}
      </div>
      {walletAddress && (
        <ContractRead provider={provider} walletAddress={walletAddress} />
      )}
    </div>
  );
};

export default AppComponent;
