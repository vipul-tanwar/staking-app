import React from "react";
import Button from "./Button";
import { ConnectWalletProps } from "@/types/CommonInterface";

const ConnectWallet = ({
  connected,
  disconnectWallet,
  requestMetamask,
  className,
}: ConnectWalletProps) => {
  return (
    <div className={`${className}`}>
      {connected ? (
        <Button
          onClick={() => {
            disconnectWallet();
          }}
          label="Disconnect Wallet"
          className=" px-4 !bg-red-500 "
        />
      ) : (
        <Button
          onClick={() => {
            requestMetamask();
          }}
          label="Connect Wallet"
          className="px-4 !bg-green-500 "
        ></Button>
      )}
    </div>
  );
};

export default ConnectWallet;
