import { ethers } from "ethers";

export interface claimRewardsParams {
  stakingContractAddress: string;
  stakingContractABI: any[];
  signer: ethers.Signer | null;
  setRewardDetails: Function;
}

export interface GetDetailsReadParams {
  contractInstance: ethers.Contract;
  setStakeDetails: Function;
}

export interface GetStakerInfoReadParams {
  address: string;
  contractInstance: ethers.Contract;
  setStakerInfo: Function;
}
