import React from "react";
import Loader from "./Loader";
import { ButtonProps } from "@/types/CommonInterface";

const Button = ({ label, onClick, className, isLoading }: ButtonProps) => {
  return (
    <button
      className={`${className} bg-blue-600 py-2 rounded-sm `}
      onClick={(e) => {
        onClick(e);
      }}
    >
      {isLoading ? (
        <div className="flex justify-center items-center h  ">
          <div className="animate-spin  rounded-full  h-6 w-6 border-b-4 border-white "></div>
        </div>
      ) : (
        label
      )}
    </button>
  );
};

export default Button;
