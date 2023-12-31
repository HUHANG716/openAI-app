import React from "react";
import { Link as _Link } from "react-router-dom";

type Props = {
  to: string;
  className?: string;
  children?: React.ReactNode;
};

const Link = ({ children, className = "", to }: Props) => {
  return (
    <_Link
      to={to}
      className={className}
      style={{
        width: "100%",
        textDecoration: "none",
        color: "inherit",
      }}>
      {children}
    </_Link>
  );
};

export default Link;
