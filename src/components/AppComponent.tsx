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
import { polygonMumbai } from "@/data/network";

const AppComponent = () => {
  const tokenAddress = tokenContractJson.address;
  const tokenABI = tokenContractJson.abi;
  const stakingContractAddress = stakingContractJson.address;
  const stakingContractABI = stakingContractJson.abi;

  const provider = new ethers.providers.JsonRpcProvider(
    `https://polygon-mumbai.infura.io/v3/${process.env.NEXT_PUBLIC_RPC}`
  );

  debugger;
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

  //Get wallet address and call wallet signer
  async function HandleWalletState() {
    const accounts = await (window.ethereum as ExternalProvider).request!({
      method: "eth_requestAccounts",
    });
    setWalletAddress(accounts[0]);
    getSigner(accounts[0]);
    setConnected(true);
  }

  //Request metamask for connect
  async function requestMetamask() {
    if (window.ethereum) {
      console.log("MetaMask is installed");
      try {
        //Request metamask switch network to Polygon Mumbai
        await (window.ethereum as ExternalProvider).request!({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: ethers.utils.hexValue(80001) }],
        });
        //Get accounts from metamask wallet
        HandleWalletState();
      } catch (error: any) {
        console.error("Error : ", error);
        if (error.code === 4902) {
          console.log("error.code === 490");
          try {
            //Request metamask to add Polygon mumbai if not added
            await (window.ethereum as ExternalProvider).request!({
              method: "wallet_addEthereumChain",
              params: [polygonMumbai],
            });
            HandleWalletState();
          } catch (_) {
            console.log("Failed to add the network");
          }
        } else {
          console.log("Failed to switch the network");
        }
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
    const getReward = await showRewardBalance(
      stakingContractAddress,
      stakingContractABI,
      signer
    );
    setRewardDetails(getReward);
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
