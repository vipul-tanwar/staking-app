import React from "react";
import stakingContractJson from "@/data/stakingContract.json";
import tokenContractJson from "@/data/tokenStakingContract.json";
const ContractDetails = () => {
  return (
    <div>
      <div>
        Token Addres :{" "}
        <a
          className=" text-blue-600 "
          href={`https://mumbai.polygonscan.com/address/${tokenContractJson.address}`}
          target="_blank"
        >
          {tokenContractJson.address}
        </a>
      </div>
      <div>
        Staking Contract Address :{" "}
        <a
          className=" text-blue-600 "
          href={`https://mumbai.polygonscan.com/address/${stakingContractJson.address}`}
          target="_blank"
        >
          {stakingContractJson.address}
        </a>{" "}
      </div>
    </div>
  );
};

export default ContractDetails;
