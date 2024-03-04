import { motion } from "framer-motion";
import Backdrop from "./Backdrop";
import { useState } from "react";

const dropIn = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
    zIndex: 10,
  },
  exit: {
    y: "100vh",
    opacity: 0,
  },
};

const Modal = ({ handleClose, text }) => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.password) {
      setError("Password is required");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    handleClose();
  };

  return (
    <Backdrop onClick={handleClose}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="modal orange-gradient"
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <form className="flex flex-col gap-5 bg-white p-10">
          <h1 className="text-[#ab70e6] font-bold text-xl">Change Password</h1>
          <div className="flex flex-col">
            <label htmlFor="password" className="text-gray-500">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="border-2 border-gray-300 rounded-md w-[300px] p-2"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-gray-500">
              Confirm Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="border-2 border-gray-300 rounded-md p-2"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          {error && <div className="error">{error}</div>}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-white w-[60%] p-2 self-center bg-[#e973ed]"
            onClick={handleSubmit}
          >
            Change
          </motion.button>
        </form>
      </motion.div>
    </Backdrop>
  );
};

export default Modal;
