import React from "react";

const WalletDetails = ({ walletAddress }: { walletAddress: string | null }) => {
  return (
    <div>
      {walletAddress ? (
        `Wallet Address:  ${walletAddress}`
      ) : (
        <div className=" text-center ">
          You are not Connected. Please connect your metamask wallet !
        </div>
      )}
    </div>
  );
};

export default WalletDetails;
