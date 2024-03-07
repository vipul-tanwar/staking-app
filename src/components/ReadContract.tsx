"use client";
import { BigNumber, ethers } from "ethers";
import React, { useEffect, useState } from "react";
import stakingContractJson from "@/data/stakingContract.json";
import FunctionDetails from "./layout/FunctionDetails";
import {
  ContractReadProps,
  StakeDetailsInter,
  StakerInfoInter,
} from "@/types/CommonInterface";

const ContractRead = ({ provider, walletAddress }: ContractReadProps) => {
  const [stakeDetails, setStakeDetails] = useState<StakeDetailsInter | null>();
  const [stakerInfo, setStakerInfo]: any = useState<StakerInfoInter | null>();
  const contractInstance: any = new ethers.Contract(
    stakingContractJson.address,
    stakingContractJson.abi,
    provider
  );

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
      setStakeDetails({
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
      const getDetails = await contractInstance.getDetails();
      const claimCheckpointVal  = ethers.BigNumber.from(claimCheckpoint);
      const claimDelayVal = ethers.BigNumber.from(getDetails.claimDelay);
      const nextClaimTimesSum  = claimCheckpointVal.add(claimDelayVal);
      const nextClaimTimes = ethers.utils.formatUnits(nextClaimTimesSum, 18);

      setStakerInfo({
        exist: exist,
        stakedAmount: stakedAmount,
        unclaimedRewards: unclaimedRewards,
        claimCheckpoint: claimCheckpoint,
        nextClaimTime: nextClaimTimes,
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

  return (
    <div className=" my-4 ">
      <div className=" bg-green-700 text-black text-xl py-2 px-3 mb-3 text-center font-bold ">
        Read Contract
      </div>
      <div>
        <FunctionDetails
          functionName="GetDetails()"
          functionData={stakeDetails}
        />
        <FunctionDetails
          functionName="GetStakerInfo(stakerAddress)"
          functionData={stakerInfo}
          className="mt-4"
        />
      </div>
    </div>
  );
};

export default ContractRead;
