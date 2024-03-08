import React from "react";
import Button from "../common/Button";

const Features = ({
  connected,
  amount,
  setAmount,
  getStakeToken,
  getUnstakeToken,
  getClaimRewards,
  loadStake,
  loadUnStake,
  loadClaim,
}: any) => {
  return (
    <div>
      {" "}
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
    </div>
  );
};

export default Features;
