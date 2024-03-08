"use client";
import { Signer, ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { ExternalProvider } from "@ethersproject/providers";
import stakingContractJson from "@/data/stakingContract.json";
import tokenContractJson from "@/data/tokenStakingContract.json";
import ContractRead from "./section/ReadContract";
import Button from "./common/Button";
import FunctionDetails from "./layout/FunctionDetails";
import { RewardDetails } from "@/types/CommonInterface";
import {
  claimRewards,
  showRewardBalance,
  stakeTokens,
  unstakeTokens,
} from "@/api/callAppComponent";
import ContractDetails from "./section/ContractDetails";
import ConnectWallet from "./common/ConnectWallet";
import WalletDetails from "./section/WalletDetails";
import Features from "./section/Features";

const AppComponent = () => {
  const tokenAddress = tokenContractJson.address;
  const tokenABI = tokenContractJson.abi;
  const stakingContractAddress = stakingContractJson.address;
  const stakingContractABI = stakingContractJson.abi;

  const provider = new ethers.providers.JsonRpcProvider(
    `https://polygon-mumbai.infura.io/v3/${process.env.NEXT_PUBLIC_RPC}`
  );
  

  debugger
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [rewardDetails, setRewardDetails] = useState<RewardDetails | null>();
  const [connected, setConnected] = useState<Boolean>(false);

  //Get signer from the wallet
  async function getSigner(address: string) {
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as ExternalProvider
      );
      const signer = provider.getSigner(address);
      setSigner(signer);
    } catch (_) {}
  }

  //Request metamask for connect
  async function requestMetamask() {
    if (window.ethereum) {
      console.log("MetaMask is installed");
      try {
        const accounts = await (window.ethereum as ExternalProvider).request!({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        getSigner(accounts[0]);
        setConnected(true);
      } catch (error) {
        console.error("Error : ", error);
      }
    } else {
      alert("MetaMask is not installed.");
      console.log("MetaMask is not installed.");
    }
  }

  //Wallet Disconnect Function
  function disconnectWallet() {
    setWalletAddress(null);
    setConnected(false);
  }

  useEffect(() => {
    requestMetamask();
  }, []);

  //Stake Token Function
  async function getStakeToken() {
    await stakeTokens(
      amount,
      tokenAddress,
      tokenABI,
      signer,
      stakingContractAddress,
      stakingContractABI
    );
    getRewardBalance();
  }
  //UnStake Token Function
  async function getUnstakeToken() {
    await unstakeTokens(stakingContractAddress, stakingContractABI, signer);
    getRewardBalance();
  }
  //Claim Reward Function
  async function getClaimRewards() {
    await claimRewards(stakingContractAddress, stakingContractABI, signer);
    getRewardBalance();
  }

  // Request Reward Details from Contract
  async function getRewardBalance() {
    setRewardDetails(null);
    await showRewardBalance(
      stakingContractAddress,
      stakingContractABI,
      signer,
      setRewardDetails
    );
  }
  useEffect(() => {
    getRewardBalance();
  }, [signer]);

  return (
    <div className=" py-4">
      <div className=" flex flex-col gap-2 ">
        <ConnectWallet
          connected={connected}
          disconnectWallet={disconnectWallet}
          requestMetamask={requestMetamask}
          className="flex justify-center"
        />
        <WalletDetails walletAddress={walletAddress} />
        <ContractDetails />
      </div>
      <Features
        connected={connected}
        amount={amount}
        setAmount={setAmount}
        getStakeToken={getStakeToken}
        getUnstakeToken={getUnstakeToken}
        getClaimRewards={getClaimRewards}
      />

      <div className=" my-3 ">
        {walletAddress && (
          <FunctionDetails
            functionName="Reward Details"
            functionData={rewardDetails}
          />
        )}
      </div>
      {walletAddress && (
        <ContractRead
          provider={provider}
          walletAddress={walletAddress}
          rewardDetails={rewardDetails}
        />
      )}
    </div>
  );
};

export default AppComponent;
