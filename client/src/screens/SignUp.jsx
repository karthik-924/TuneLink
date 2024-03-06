import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import MusicBackground from "../assets/SignUpBackground.jpg";
import { useAuth } from "../auth/AuthProvider";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    profilePicture: "",
  });
  const [error, setError] = useState("");
  const [profilefile, setProfileFile] = useState(null); // [1]
  const [uploaded, setUploaded] = useState(false);
  const navigate = useNavigate();
  const { setToken, setUserData } = useAuth();
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    console.log(name, value, files);
    if (name === "profilePicture" && files.length > 0) {
      const file = files[0];
      setProfileFile(file); // [1]
      setUploaded(true);
      console.log("Selected file:", file);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("All fields are required");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    // if (!formData.termsChecked) {
    //   setError("Please accept the terms and conditions");
    //   return;
    // }
    if (!document.getElementById("termsChecked").checked) {
      setError("Please accept the terms and conditions");
      return;
    }
    fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        profilePicture: profilefile,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else if (res.status === 400) {
          return res.json().then((data) => Promise.reject(data.message));
        } else {
          throw new Error("Login failed");
        }
      })
      .then((data) => {
        console.log("Login successful:", data);
        setToken(data.token);
        setUserData(formData)
        navigate("/posts");
      })
      .catch((error) => {
        setError(error);
      });
    setError(""); // Clear any previous error messages
  };

  return (
    <div
      style={{
        backgroundImage: "url(src/assets/Background.gif)",
      }}
      className="max-w-[100vw] min-h-screen h-fit p-10 flex flex-col justify-center items-center bg-no-repeat bg-cover"
    >
      <div className="w-[70%] h-[115vh] bg-gray-200 shadow-md shadow-white flex">
        <div className="w-[50%] relative h-full">
          <img
            className="w-[100%] h-full object-fill"
            src={MusicBackground}
            alt="signup-image"
          />
        </div>
        <div className="w-[50%] flex justify-center items-center flex-col h-full">
          <div className="w-[80%] flex flex-col">
            <div className="flex flex-col font-bold justify-center items-center text-2xl mt-5">
              <div className="flex">
                <p>Welcome to</p>
                <p className="text-[#e973ed] font-bold text-3xl btn-shine">
                  TUNE<span className="text-[#ab70e6]">LINK</span>
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm font-light">
                  Share Your Melodies, Connect Through Music
                </p>
              </div>
            </div>
            <p className="text-[#ab70e6] font-bold text-xl mt-5 mb-3">
              Sign Up
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col">
                <label htmlFor="username" className="text-black">
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
                <label htmlFor="email" className="text-black">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="border-2 border-gray-300 rounded-md p-2"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="password" className="text-black">
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
              <div className="flex flex-col">
                <label htmlFor="confirmPassword" className="text-black">
                  Confirm Password:
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="border-2 border-gray-300 rounded-md p-2"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="profilePicture" className="text-black">
                  Upload Profile Picture:
                </label>
                <label htmlFor="file" className="custum-file-upload">
                  <div className="icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill=""
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                          fill=""
                        ></path>{" "}
                      </g>
                    </svg>
                  </div>
                  <div className="text">
                    {/* {console.log(uploaded)} */}
                    <span>
                      {uploaded ? "Uploaded" : "Click to upload image"}
                    </span>
                  </div>
                  <input
                    id="file"
                    type="file"
                    name="profilePicture"
                    onChange={handleChange}
                    accept="image/*"
                    multiple={false}
                  />
                </label>
              </div>
              <div className="flex items-center gap-3">
                <label className="checkboxcontainer">
                  <input
                    type="checkbox"
                    id="termsChecked"
                    name="termsChecked"
                    className="mr-2"
                  />
                  <svg viewBox="0 0 64 64" height="2em" width="2em">
                    <path
                      d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                      pathLength="575.0541381835938"
                      className="path"
                    ></path>
                  </svg>
                </label>
                <label htmlFor="termsChecked" className="text-black">
                  I accept the terms and conditions
                </label>
              </div>
              <div className="w-full justify-center items-center flex">
                <Button text="Sign Up" />
              </div>
              <div className="w-full justify-center items-center flex">
                <p>Already have an account? <span onClick={()=>navigate('/login')} className="text-blue-500 underline cursor-pointer">Login</span></p>
              </div>
              {error && (
                <div className="error flex justify-center items-center text-red-500 text-sm">
                  {error}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
