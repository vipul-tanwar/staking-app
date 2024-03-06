"use client";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import stakingContractJson from "@/data/stakingContract.json";
import tokenContractJson from "@/data/tokenStakingContract.json";

const ContractRead = () => {
  const [newData, setNewData]: any = useState();
  const [newData2, setNewData2]: any = useState();

  const tokenAddress = tokenContractJson.address;
  const tokenABI = tokenContractJson.abi;
  const stakingContractAddress = stakingContractJson.address;
  const stakingContractABI = stakingContractJson.abi;
  const provider = new ethers.providers.JsonRpcProvider(
    "https://polygon-mumbai.infura.io/v3/219b1d1b9fd243aa9f83bf879622569d"
  );
  const contractInstance: any = new ethers.Contract(
    stakingContractJson.address,
    stakingContractJson.abi,
    provider
  );
  console.log("contractInstance", contractInstance);
  let readFunctionslocal = [];
  function convertVal(val) {
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
      // console.log("test", test);
      const temp = await contractInstance.getDetails();
      console.log("failed-->>", temp.claimDelay);
      // const temp2 =   parseInt (ethers.utils.formatUnits(claimCheckpoint, "ether"))
      // const temp3  =  parseInt (ethers.utils.formatUnits(temp.claimDelay, "ether"))
      const temp2 = ethers.utils.parseUnits("0.00000000000000002", 18);
      const temp3 = ethers.utils.parseUnits("0.000000001709670309", 18);
      const sum = temp2.add(temp3);

      console.log("temp2", ethers.utils.formatUnits(sum, "ether"));
      setNewData2({
        exist: exist,
        stakedAmount: stakedAmount,
        unclaimedRewards: unclaimedRewards,
        claimCheckpoint: claimCheckpoint,
        nextClaimTime: sum,
        totalRewardsClaimed: totalRewardsClaimed,
      });
      console.log("result---");
    } catch (err) {
      console.log("err", err);
    }
  }
  useEffect(() => {
    getDetailsRead();
    getStakerInfoRead("0x8332d6f173db642c1b76c63af6841b99336cc4fa");
  }, []);

  console.log("newData", newData);

  return (
    <div>
      <div className=" bg-green-700 text-black text-xl py-2 px-3 mb-3 text-center font-bold " >Read Contract</div>
      <div>
        {newData && (
          <div className=" border rounded-md  ">
            <div className=" text-center rounded-md text-black font-bold text-xl mb-4 py-2 bg-slate-400 ">
              GetDetails()
            </div>
            <div className=" p-4 ">
              {newData &&
                Object.keys(newData).map((key, index) => {
                  return (
                    <div key={index} className=" flex flex-row ">
                      <p>{key}</p> :
                      <p className="ml-2">
                        <p>{convertVal(newData[key])}</p>
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {newData2 && (
          <>
            <hr className="my-4" />

            <div className="border rounded-md ">
              <div className=" text-center rounded-md text-black font-bold text-xl mb-4 py-2 bg-slate-400  ">
                GetStakerInfo(stakerAddress)
              </div>
              <div className=" p-4 ">
                {newData2 &&
                  Object.keys(newData2).map((key, index) => {
                    return (
                      <div key={index} className=" flex flex-row ">
                        <p>{key}</p> :
                        <p className="ml-2">
                          <p>{convertVal(newData2[key])}</p>
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContractRead;
