import React from "react";
import { twMerge } from "tailwind-merge";

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  align?: "left" | "right" | "center";
}

const classMap = {
  left: "",
  right: "float-right",
  center: "mx-auto w-fit",
};

const Align: React.FC<Props> = ({ align = "left", className, ...props }) => {
  return (
    <div className={twMerge(classMap[align], className)} {...props}>
      {props.children}
    </div>
  );
};
export default Align;
