import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import PFP from "../assets/PFP.jfif";
import { motion, AnimatePresence } from "framer-motion";
import PostModal from "../components/PostModal";
import PostCard from "../components/PostCard";

const Home = () => {
  const { userData, fetchWithToken } = useAuth();
  const [userPosts, setUserPosts] = useState([]);
  const [otherPosts, setOtherPosts] = useState([]);
  console.log(Object.entries(userData));
  const { setToken, setUserData} = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);
  useEffect(() => {
    // Fetch posts using token
    const fetchPosts = async () => {
      try {
        const postsData = await fetchWithToken(
          "http://localhost:5000/getAllPosts"
        );
        console.log(postsData)
        const currentUserPosts = postsData.filter(post => post.username === userData.username);
        console.log(currentUserPosts)
        setUserPosts(currentUserPosts)
        const otherUserPosts = postsData.filter(post => post.username !== userData.username);
        console.log(otherUserPosts)
        setOtherPosts(otherUserPosts)
        // console.log(postsData)
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, [userData.token]);

  return (
    <div className="bg-black text-white w-screen min-h-screen">
      <div className="p-4 w-full flex flex-col gap-10 justify-center items-center">
        <div className="w-[95%] bg-gray-200 gap-5 p-5 rounded-lg shadow-md flex justify-between items-center shadow-white">
          <div className="flex gap-5">
            <div>
              <img src={PFP} className="rounded-full h-40 w-40" alt="Profile" />
            </div>
            <div className="flex justify-center text-black flex-col gap-5">
              <h2>{userData.username}</h2>
            </div>
          </div>
          <div>
            <button onClick={open} className="rounded-lg relative w-36 h-10 cursor-pointer flex items-center border border-green-500 bg-green-500 group hover:bg-green-500 active:bg-green-500 active:border-green-500">
              <span className="text-gray-200 font-semibold ml-8 transform group-hover:hidden transition-all duration-300">
                Add Item
              </span>
              <span className="absolute right-0 h-full w-10 rounded-lg bg-green-500 flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300">
                <svg
                  className="svg w-8 text-white"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line x1="12" x2="12" y1="5" y2="19"></line>
                  <line x1="5" x2="19" y1="12" y2="12"></line>
                </svg>
              </span>
            </button>
          </div>
        </div>
        <div className="w-[95%] text-black bg-gray-200 gap-5 p-5 rounded-lg shadow-md flex flex-col justify-center items-center shadow-white">
          <p className="text-xl">Your Posts</p>
          <div className="w-full grid grid-cols-3 gap-5">
            {userPosts.map((post,index) => <PostCard key={index} post={post}/>)}
          </div>
        </div>
        <div className="w-[95%] text-black bg-gray-200 gap-5 p-5 rounded-lg shadow-md flex flex-col justify-center items-center shadow-white">
          <p className="text-xl">All Posts</p>
          <div className="w-full grid grid-cols-3 gap-5">
            {otherPosts.map((post,index) => <PostCard key={index} post={post}/>)}
          </div>
        </div>
      </div>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {modalOpen && <PostModal modalOpen={modalOpen} handleClose={close} />}
      </AnimatePresence>
    </div>
  );
};

export default Home;
