"use client";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import stakingContractJson from "@/data/stakingContract.json";
import tokenContractJson from "@/data/tokenStakingContract.json";
import FunctionDetails from "./layout/FunctionDetails";
interface ContractReadProps {
  provider: any;
  walletAddress: string;
}

const ContractRead = ({ provider, walletAddress }: ContractReadProps) => {
  const [newData, setNewData]: any = useState();
  const [newData2, setNewData2]: any = useState();
  const tokenAddress = tokenContractJson.address;
  const tokenABI = tokenContractJson.abi;
  const stakingContractAddress = stakingContractJson.address;
  const stakingContractABI = stakingContractJson.abi;

  // const provider = new ethers.providers.JsonRpcProvider(
  //   "https://polygon-mumbai.infura.io/v3/219b1d1b9fd243aa9f83bf879622569d"
  // );
  const contractInstance: any = new ethers.Contract(
    stakingContractJson.address,
    stakingContractJson.abi,
    provider
  );
  console.log("contractInstance", contractInstance);
  let readFunctionslocal = [];
  function convertVal(val: string | object | number | any) {
    if (typeof val === "object") {
      return ethers.utils.formatUnits(val, "ether");
    } else if (typeof val === "boolean") {
      return val.toString();
    } else {
      return val;
    }
  }

  async function getDetailsRead() {
    try {
      const [
        isPaused,
        resetClaimDelay,
        stakeToken,
        rewardToken,
        startBlock,
        endBlock,
        claimDelay,
        totalRewards,
        totalFundsStaked,
        totalRewardsDistributed,
      ] = await contractInstance.getDetails();
      setNewData({
        isPaused: isPaused,
        resetClaimDelay: resetClaimDelay,
        stakeToken: stakeToken,
        rewardToken: rewardToken,
        startBlock: startBlock,
        endBlock: endBlock,
        claimDelay: claimDelay,
        totalRewards: totalRewards,
        totalFundsStaked: totalFundsStaked,
        totalRewardsDistributed: totalRewardsDistributed,
      });
      console.log("result");
    } catch (err) {
      console.log("err", err);
    }
  }

  async function getStakerInfoRead(address: string) {
    try {
      const [
        exist,
        stakedAmount,
        unclaimedRewards,
        claimCheckpoint,
        totalRewardsClaimed,
      ] = await contractInstance.getStakerInfo(address);
      const temp = await contractInstance.getDetails();
      console.log("failed-->>", temp.claimDelay);
      // const temp2 =   parseInt (ethers.utils.formatUnits(claimCheckpoint, "ether"))
      // const temp3  =  parseInt (ethers.utils.formatUnits(temp.claimDelay, "ether"))
      const temp2 = ethers.utils.parseUnits("0.00000000000000002", 18);
      const temp3 = ethers.utils.parseUnits("0.000000001709670309", 18);
      debugger;
      const sum = temp2.add(temp3);
      debugger;
      console.log("temp2", ethers.utils.formatUnits(sum, "ether"));
      setNewData2({
        exist: exist,
        stakedAmount: stakedAmount,
        unclaimedRewards: unclaimedRewards,
        claimCheckpoint: claimCheckpoint,
        nextClaimTime: sum,
        totalRewardsClaimed: totalRewardsClaimed,
      });
    } catch (err) {
      console.log("err", err);
    }
  }
  useEffect(() => {
    getDetailsRead();
  }, []);
  useEffect(() => {
    getStakerInfoRead(walletAddress);
  }, [walletAddress]);

  console.log("newData", newData);

  return (
    <div className=" my-4 ">
      <div className=" bg-green-700 text-black text-xl py-2 px-3 mb-3 text-center font-bold ">
        Read Contract
      </div>
      <div>
        <FunctionDetails functionName="GetDetails()" functionData={newData} />
        <FunctionDetails
          functionName="GetStakerInfo(stakerAddress)"
          functionData={newData2}
          className="mt-4"
        />
      </div>
    </div>
  );
};

export default ContractRead;
