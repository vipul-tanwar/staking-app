import { BigNumber } from "ethers";

export interface ButtonProps {
  label: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  isLoading?: boolean;
}

export interface RewardDetails {
  accRewardPerShare: BigNumber;
  lastCheckpoint: BigNumber;
  rewardPerBlock: BigNumber;
}

export interface ContractReadProps {
  provider: any;
  walletAddress: string;
}

export interface StakeDetailsInter {
  isPaused: boolean;
  resetClaimDelay: boolean;
  stakeToken: string;
  rewardToken: string;
  startBlock: BigNumber;
  endBlock: BigNumber;
  claimDelay: BigNumber;
  totalRewards: BigNumber;
  totalFundsStaked: BigNumber;
  totalRewardsDistributed: BigNumber;
}

export interface StakerInfoInter{
  exist: boolean;
  stakedAmount: BigNumber;
  unclaimedRewards: BigNumber;
  claimCheckpoint: BigNumber;
  totalRewardsClaimed: BigNumber;
}