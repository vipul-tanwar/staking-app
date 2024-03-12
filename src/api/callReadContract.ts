import { StakeDetailsInter } from "@/types/CommonInterface";
import { Contract, ethers } from "ethers";
interface GetDetailsReadParams {
  contractInstance: Contract;
  setStakeDetails: (details: StakeDetailsInter | null) => void;
}

export async function getDetailsRead(contractInstance: Contract) {
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
    return {
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
    };
  } catch (err) {
    console.log("err", err);
  }
}

export async function getStakerInfoRead(
  address: string,
  contractInstance: Contract,
) {
  try {
    const [
      exist,
      stakedAmount,
      unclaimedRewards,
      claimCheckpoint,
      totalRewardsClaimed,
    ] = await contractInstance.getStakerInfo(address);
    const getDetails = await contractInstance.getDetails();
    const claimCheckpointVal = ethers.BigNumber.from(claimCheckpoint);
    const claimDelayVal = ethers.BigNumber.from(getDetails.claimDelay);
    const nextClaimTimesSum = claimCheckpointVal.add(claimDelayVal);
    const nextClaimTimes = ethers.utils.formatUnits(nextClaimTimesSum, 18);
    return {
      exist: exist,
      stakedAmount: stakedAmount,
      unclaimedRewards: unclaimedRewards,
      claimCheckpoint: claimCheckpoint,
      nextClaimTime: nextClaimTimes,
      totalRewardsClaimed: totalRewardsClaimed,
    };
  } catch (err) {
    console.log("err", err);
  }
}
