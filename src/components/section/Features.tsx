import React, { useState } from "react";
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
  const [inputValue, setInputValue] = useState<number>();

  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(parseFloat(value));
    setAmount(value ? parseFloat(value) * 1000000 : 0);
  };

  return (
    <div>
      {connected && (
        <div className=" my-3 ">
          {" "}
          <input
            type="number"
            placeholder="Amount to stake"
            value={inputValue}
            className="text-black w-full my-2 p-2"
            onChange={inputChange}
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
