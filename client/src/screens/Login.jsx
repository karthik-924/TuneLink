import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import MusicBackground from "../assets/MusicBackground.jpg";
import Button from "../components/Button";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../components/Modal";
import Background from "../assets/Background.gif";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [err, setErr] = useState("");

  const navigate = useNavigate();
  const { setToken, setUserData} = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setErr("All fields are required");
      return;
    }

    fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else if (res.status === 401) {
          return res.json().then((data) => Promise.reject(data.message));
        } else {
          setErr("Login failed")
        }
      })
      .then((data) => {
        console.log("Login successful:", data);
        setToken(data.token);
        setUserData({
          username: formData.username,
        })
        navigate("/posts");
      })
      .catch((err) => {
        setErr(err);
      });
  };

  return (
    <div
      style={{
        background: "url(src/assets/Background.gif)",
      }}
      className="max-w-[100vw] min-h-screen flex gap-5 flex-col font-roboto justify-center items-center bg-no-repeat bg-cover"
    >
      <p className="text-[#e973ed] font-bold text-4xl btn-shine">
        TUNE<span className="text-[#ab70e6]">LINK</span>
      </p>
      <div className="w-[60%] h-[70vh] bg-gray-200 flex">
        <div className="w-[50%] flex justify-center items-center flex-col h-full">
          <div className="w-[80%] gap-10 flex flex-col">
            <p className="text-[#ab70e6] font-bold text-xl">Login</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col">
                <label htmlFor="email" className="text-gray-500">
                  Username:
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="border-2 border-gray-300 rounded-md p-2"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="password" className="text-gray-500">
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="border-2 border-gray-300 rounded-md p-2"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 1 }}
                  className="text-[#ab70e6] underline"
                  onClick={() => (modalOpen ? close() : open())}
                >
                  Forgot Password?
                </motion.button>
              </div>
              <div className="w-full justify-center items-center flex">
                <Button text="Login" />
              </div>
              <div className="w-full justify-center items-center flex">
                <p>
                  Don&apos;t have an account?
                  <a href="/signup" className="text-[#ab70e6] underline">
                    Signup
                  </a>
                </p>
              </div>
              {err && (
                <div className="err flex justify-center items-center text-red-500 text-sm">
                  {err}
                </div>
              )}
            </form>
          </div>
        </div>
        <div className="w-[50%] relative h-full">
          <div className="absolute bottom-16 left-10 w-10">
            <p className="text-black font-bold text-2xl">Hello Welcome back.</p>
          </div>
          <img
            className="w-[100%] h-full object-fill"
            src={MusicBackground}
            alt="login-image"
          />
        </div>
      </div>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {modalOpen && <Modal modalOpen={modalOpen} handleClose={close} />}
      </AnimatePresence>
    </div>
  );
};

export default Login;
