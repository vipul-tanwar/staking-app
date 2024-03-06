"use client";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { ExternalProvider } from "@ethersproject/providers";
import stakingContractJson from "@/data/stakingContract.json";
import tokenContractJson from "@/data/tokenStakingContract.json";
import { convertVal } from "@/utils/helper";
import ContractRead from "./ReadContract";

const AppComponent = () => {
  const tokenAddress = tokenContractJson.address;
  const tokenABI = tokenContractJson.abi;
  const stakingContractAddress = stakingContractJson.address;
  const stakingContractABI = stakingContractJson.abi;
  const provider = new ethers.providers.JsonRpcProvider(
    "https://polygon-mumbai.infura.io/v3/219b1d1b9fd243aa9f83bf879622569d"
  );
  const [walletAddress, setWalletAddress] = useState();
  const [signer, setSigner]: any = useState();
  const [amount, setAmount] = useState("");
  const [rewardDetails, setRewardDetails] = useState();

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

  async function getRewardBalance() {
    try {
      const stakingContract = new ethers.Contract(
        stakingContractAddress,
        stakingContractABI,
        signer
      );
      const text = await stakingContract.getRewardDetails();
      console.log("avaialble reqrds", text);

      console.log("accRewardPerShare", convertVal(text.accRewardPerShare));
      console.log("lastCheckpoint", convertVal(text.lastCheckpoint));
      console.log("rewardPerBlock", convertVal(text.rewardPerBlock));
      // setRewardDetails({
      //   accRewardPerShare: text.accRewardPerShare,
      //   lastCheckpoint: text.lastCheckpoint,
      //   rewardPerBlock: text.rewardPerBlock,
      // });
      setRewardDetails({
        accRewardPerShare: text.accRewardPerShare,
        lastCheckpoint: text.lastCheckpoint,
        rewardPerBlock: text.rewardPerBlock,
      });
      return {
        accRewardPerShare: text.accRewardPerShare,
        lastCheckpoint: text.lastCheckpoint,
        rewardPerBlock: text.rewardPerBlock,
      };
    } catch (_) {}
  }
  useEffect(() => {
    getRewardBalance();
  }, []);
  async function claimRewards() {
    try {
      const stakingContract = new ethers.Contract(
        stakingContractAddress,
        stakingContractABI,
        signer
      );
      console.log("stakingContract", stakingContract);
      getRewardBalance();
      // const gasLimit = await stakingContract.estimateGas.claimRewards();
      // console.log("Gas Limit:", await stakingContract.claimRewards({ gasLimit: 500000 }));
      // const txn = await stakingContract.claimRewards(gasLimit);
      // await txn.wait();
      console.log("Claimed rewards");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className=" py-4" >
      <div className=" flex flex-col gap-2 ">
        {" "}
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
      </div>
      {/* <button
        onClick={() => {
          requestMetamask();
        }}
      >
        Connet Wallet
      </button> */}
      <div className=" my-3 " >
        {" "}
        <input
          type="text"
          placeholder="Amount to stake"
          value={amount}
          className="text-black w-full my-2 p-2"
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className=" grid grid-cols-3 gap-4 ">
          <button
            className=" bg-blue-600 py-2 "
            onClick={() => {
              stakeTokens();
            }}
          >
            Staking{" "}
          </button>
          <button
            className=" bg-blue-600 py-2  "
            onClick={() => {
              unstakeTokens();
            }}
          >
            Unstaking{" "}
          </button>
          <button
            className=" bg-blue-600 py-2  "
            onClick={() => {
              claimRewards();
            }}
          >
            Claim Reward
          </button>
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
      <div className=" my-3 " >
        {rewardDetails && (
          <div className=" border rounded-md  ">
            <div className=" text-center rounded-md text-black font-bold text-lg mb-4 py-2 bg-slate-400 " >Reward Details</div>
            <div className=" p-4 ">
              {Object.keys(rewardDetails).map((key) => {
                return (
                  <div className="" key={key}>
                    {key}: {convertVal(rewardDetails[key])}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <ContractRead />
    </div>
  );
};

export default AppComponent;
