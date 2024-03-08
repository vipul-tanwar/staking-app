import React from "react";
import Button from "../common/Button";
import { FeaturesProps } from "@/types/LayoutInterface";

const Features = ({
  connected,
  amount,
  setAmount,
  getStakeToken,
  getUnstakeToken,
  getClaimRewards,
}: FeaturesProps) => {
  return (
    <div>
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
              isLoading={true}
            />
            <Button
              onClick={() => {
                getUnstakeToken();
              }}
              label="UnStaking"
              isLoading={true}
            />
            <Button
              onClick={() => {
                getClaimRewards();
              }}
              label="Claim Reward"
              isLoading={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Features;
