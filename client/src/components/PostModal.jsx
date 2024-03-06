import { motion } from "framer-motion";
import Backdrop from "./Backdrop";
import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";

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

const PostModal = ({ handleClose, text }) => {
  const [formData, setFormData] = useState({
    songname: "",
    songlink: "",
    genre: "",
    authorName: "",
    username: "",
  });
  const { token, userData } = useAuth();
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.songname) {
      setError("Songname is required");
      return;
    }
    if (!formData.songlink) {
      setError("SongLink is required");
      return;
    }
    formData.username = userData.username;
    setError("");
    try {
      const response = await fetch("http://localhost:5000/addPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Replace with your actual auth token
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add post");
      }

      // Reset form data
      setFormData({
        songname: "",
        songlink: "",
      });

      setError("");

      handleClose(); // Close the modal after successful submission
    } catch (error) {
      setError(error.message);
    }
    handleClose();
  };

  return (
    <Backdrop onClick={handleClose}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="modalpo orange-gradient"
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <form className="flex flex-col text-black gap-5 bg-white p-10">
          <h1 className="text-[#ab70e6] font-bold text-xl">Add Post</h1>
          <div className="flex flex-col">
            <label htmlFor="songname" className="text-gray-500">
              Song Name
            </label>
            <input
              type="text"
              id="songname"
              name="songname"
              className="border-2 border-gray-300 rounded-md w-[300px] p-2"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="songlink" className="text-gray-500">
              Song Link
            </label>
            <input
              type="songlink"
              id="songlink"
              name="songlink"
              className="border-2 border-gray-300 rounded-md p-2"
              value={formData.songlink}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="genre" className="text-gray-500">
              Genre
            </label>
            <input
              type="genre"
              id="genre"
              name="genre"
              className="border-2 border-gray-300 rounded-md p-2"
              value={formData.genre}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="authorName" className="text-gray-500">
              Author Name
            </label>
            <input
              type="authorName"
              id="authorName"
              name="authorName"
              className="border-2 border-gray-300 rounded-md p-2"
              value={formData.authorName}
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
            Add
          </motion.button>
        </form>
      </motion.div>
    </Backdrop>
  );
};

export default PostModal;
