import { convertVal } from "@/utils/helper";
import React from "react";
import Loader from "../common/Loader";
import { FunctionDetailsProp } from "@/types/LayoutInterface";

const FunctionDetails = ({
  functionName,
  functionData,
  className,
}: FunctionDetailsProp) => {
  return (
    <div className={`${className} border rounded-md `}>
      <div className=" text-center rounded-md text-black font-bold text-xl mb-4 py-2 bg-slate-400 ">
        {functionName}
      </div>
      <div className=" p-4 ">
        {functionData ? (
          Object.keys(functionData).map((key, index: number) => {
            return (
              <div key={index} className=" flex flex-row ">
                <p>{key}</p> :
                <p className="ml-2">
                  <p>{convertVal(functionData[key])}</p>
                </p>
              </div>
            );
          })
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default FunctionDetails;
