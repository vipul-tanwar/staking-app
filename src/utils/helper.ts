import { ethers } from "ethers";

export function convertVal(val: any) {
  if (typeof val === "object") {
    return ethers.utils.formatUnits(val, "ether");
  } else if (typeof val === "boolean") {
    return val.toString();
  } else {
    return val;
  }
}
