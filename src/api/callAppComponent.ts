import { ethers } from "ethers";

export async function stakeTokens(
  amount: string,
  tokenAddress: string,
  tokenABI: any[],
  signer: ethers.Signer | null,
  stakingContractAddress: string,
  stakingContractABI: any[]
) {
  if (!amount) return alert("Please enter amount");
  try {
    const token = new ethers.Contract(tokenAddress, tokenABI, signer!);

    const stakingContract = new ethers.Contract(
      stakingContractAddress,
      stakingContractABI,
      signer!
    );
    const amountWei = amount;
    // const amountWei = ethers.utils.parseUnits(amount, "ether");

    let txn = await token.approve(stakingContractAddress, amountWei);
    await txn.wait();

    txn = await stakingContract.stake(amountWei);
    await txn.wait();
    
    alert(`Staked Tokens : ${parseFloat(amount)/1000000}`);
    console.log(`Staked Tokens : ${parseFloat(amount)/1000000}`);
  } catch (error) {
    alert(error);
    console.log(error);
  }
}

export async function unstakeTokens(
  stakingContractAddress: string,
  stakingContractABI: any[],
  signer: ethers.Signer | null
) {
  try {
    const stakingContract = new ethers.Contract(
      stakingContractAddress,
      stakingContractABI,
      signer!
    );
    const txn = await stakingContract.unstake();
    await txn.wait();
    alert("Unstaked tokens");
    console.log("Unstaked tokens");
  } catch (error) {
    alert(error);
    console.log(error);
  }
}

export async function claimRewards(
  stakingContractAddress: string,
  stakingContractABI: any[],
  signer: ethers.Signer | null
) {
  try {
    const stakingContract = new ethers.Contract(
      stakingContractAddress,
      stakingContractABI,
      signer!
    );
    const txn = await stakingContract.claimRewards();
    await txn.wait();
    console.log("Reward Claimed");
    alert("Reward Claimed");
  } catch (error) {
    alert(error);
    console.log(error);
  }
}

export async function showRewardBalance(
  stakingContractAddress: string,
  stakingContractABI: any[],
  signer: ethers.Signer | null,
  setRewardDetails : Function
) {
  try {
    const stakingContract = new ethers.Contract(
      stakingContractAddress,
      stakingContractABI,
      signer!
    );
    const rewardDetails = await stakingContract.getRewardDetails();

    setRewardDetails({
      accRewardPerShare: rewardDetails.accRewardPerShare,
      lastCheckpoint: rewardDetails.lastCheckpoint,
      rewardPerBlock: rewardDetails.rewardPerBlock,
    });

  } catch (error) {
    console.log(error);
  }
}
