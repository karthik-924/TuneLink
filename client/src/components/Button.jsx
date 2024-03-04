import React from "react";
import "./Button.css";

const Button = (props) => {
    const { text } =props
  return (
    <button className="w-[60%]">
      <span className="shadow"></span>
      <span className="edge"></span>
          <span className="front text"> {text}</span>
    </button>
  );
};

export default Button;
