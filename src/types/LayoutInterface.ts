export interface FunctionDetailsProp {
  functionName: string;
  functionData: any;
  className?: string;
}

export interface FeaturesProps {
  connected: Boolean;
  amount: string;
  setAmount: Function
  getStakeToken: () => void;
  getUnstakeToken: () => void;
  getClaimRewards: () => void;
}