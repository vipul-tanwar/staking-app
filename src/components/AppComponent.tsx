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
import {
  claimRewards,
  showRewardBalance,
  stakeTokens,
  unstakeTokens,
} from "@/api/callAppComponent";

const AppComponent = () => {
  const tokenAddress = tokenContractJson.address;
  const tokenABI = tokenContractJson.abi;
  const stakingContractAddress = stakingContractJson.address;
  const stakingContractABI = stakingContractJson.abi;

  const provider = new ethers.providers.JsonRpcProvider(
    "https://polygon-mumbai.infura.io/v3/219b1d1b9fd243aa9f83bf879622569d"
  );

  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [rewardDetails, setRewardDetails] = useState<RewardDetails | null>();
  const [connected, setConnected] = useState<Boolean>(false);

  const [loadStake, setLoadStake] = useState<Boolean>(false);
  const [loadUnStake, setLoadUnStake] = useState<Boolean>(false);
  const [loadClaim, setLoadClaim] = useState<Boolean>(false);

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
        setConnected(true);
      } catch (error) {
        console.error("Error : ", error);
      }
      debugger;
    } else {
      alert("MetaMask is not installed.");
      console.log("MetaMask is not installed.");
    }
  }

  function disconnectWallet() {
    setWalletAddress(null);
    setConnected(false);
  }

  useEffect(() => {
    requestMetamask();
  }, []);

  async function getStakeToken() {
    setLoadStake(true);
    await stakeTokens(
      amount,
      tokenAddress,
      tokenABI,
      signer,
      stakingContractAddress,
      stakingContractABI
    );
    setLoadStake(false);
    getRewardBalance();
  }
  async function getUnstakeToken() {
    setLoadUnStake(true);
    await unstakeTokens(stakingContractAddress, stakingContractABI, signer);
    setLoadUnStake(false);
    getRewardBalance();
  }
  async function getClaimRewards() {
    setLoadClaim(true);
    await claimRewards(stakingContractAddress, stakingContractABI, signer);
    setLoadClaim(false);
    getRewardBalance();
  }

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
        <div className=" flex justify-center ">
          {connected ? (
            <Button
              onClick={() => {
                disconnectWallet();
              }}
              label="Disconnect Wallet"
              className=" px-4 !bg-red-500 "
            />
          ) : (
            <Button
              onClick={() => {
                requestMetamask();
              }}
              label="Connect Wallet"
              className="px-4 !bg-green-500 "
            ></Button>
          )}
        </div>
        <div>
          {walletAddress ? (
            `Wallet Address:  ${walletAddress}`
          ) : (
            <div className=" text-center ">
              You are not Connected. Please connect your metamask wallet !
            </div>
          )}
        </div>

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

      {connected && (
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
                getStakeToken();
              }}
              label="Staking"
              isLoading={loadStake ? true : false}
            />
            <Button
              onClick={() => {
                getUnstakeToken();
              }}
              label="UnStaking"
              isLoading={loadUnStake ? true : false}
            />
            <Button
              onClick={() => {
                getClaimRewards();
              }}
              isLoading={loadClaim ? true : false}
              label="Claim Reward"
            />
          </div>
        </div>
      )}
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
