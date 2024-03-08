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
import { getDetailsRead, getStakerInfoRead } from "@/api/callReadContract";

const ContractRead = ({ provider, walletAddress, rewardDetails }: ContractReadProps) => {
  const [stakeDetails, setStakeDetails] = useState<StakeDetailsInter | null>();
  const [stakerInfo, setStakerInfo] = useState<StakerInfoInter | null>();
  const contractInstance = new ethers.Contract(
    stakingContractJson.address,
    stakingContractJson.abi,
    provider
  );

  async function getCallDetailsRead() {
    await getDetailsRead(contractInstance, setStakeDetails);
  }

  useEffect(() => {
    getCallDetailsRead();
  }, [rewardDetails]);


  async function getCallStakerInfoRead(walletAddress: string){
    await getStakerInfoRead(walletAddress, contractInstance, setStakerInfo);
  }

  useEffect(() => {
    getCallStakerInfoRead(walletAddress);
  }, [walletAddress, rewardDetails]);

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
