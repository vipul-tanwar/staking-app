import React, { useState } from "react";
import Loader from "./Loader";
import { ButtonProps } from "@/types/CommonInterface";

const Button = ({ label, onClick, className, isLoading }: ButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (isLoading) {
      setLoading(true);
      await onClick(e);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } else {
      onClick(e);
    }
  };
  return (
    <button
      className={`${className} bg-blue-600 py-2 rounded-sm `}
      onClick={handleClick}
    >
      {loading ? <Loading /> : label}
    </button>
  );
};

export default Button;

const Loading = () => {
  return (
    <div className="flex justify-center items-center h  ">
      <div className="animate-spin  rounded-full  h-6 w-6 border-b-4 border-white "></div>
    </div>
  );
};
