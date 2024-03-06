import React from "react";
import "./PostCard.css";

const PostCard = (props) => {
  return (
    <a href={props.post.musicURL} className="card w-full">
      <div className="title w-full h-fit">
        <p>{props.post.songname}</p>
      </div>
      <div className="text">
        <p>{props.post.genre}</p>
        <p>{props.post.authorName}</p>
      </div>
    </a>
  );
};

export default PostCard;
