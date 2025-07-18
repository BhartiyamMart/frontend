import React from "react";
import classNames from "classnames";

export const Badge = ({ children, className = "", ...props }) => {
  return (
    <span
      {...props}
      className={classNames(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800",
        className
      )}
    >
      {children}
    </span>
  );
};
