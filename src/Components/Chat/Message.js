import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { FaPlay, FaPause } from "react-icons/fa";
import Moment from "react-moment";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef();

  useEffect(() => {
    if (message.audio) {
      setAudioUrl(message.audio);
    }
  }, [message]);
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  const handleVideoPlay = () => {
    console.log(message.video);
    window.open(message.video);
  };
  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  return (
    <div
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
          alt=""
        />
        <span>
          <Moment fromNow>{message.date.toDate()}</Moment>
        </span>
      </div>
      <div className="messageContent">
        {audioUrl ? (
          <div className="audiowrapper">
            <a
              href={message.videoURL}
              onClick={handleVideoPlay}
              target="_blank"
            >
              <img
                style={{
                  marginRight: "5px",
                  marginTop: "2px",
                  cursor: "pointer",
                }}
                src="https://upload.wikimedia.org/wikipedia/commons/f/f8/Video-solid-white.svg"
              />
            </a>
            {isPlaying ? (
              <FaPause
                style={{
                  marginRight: "5px",
                  marginTop: "2px",
                  cursor: "pointer",
                }}
                onClick={handlePlayPause}
              />
            ) : (
              <FaPlay
                style={{
                  marginRight: "5px",
                  marginTop: "2px",
                  cursor: "pointer",
                }}
                onClick={handlePlayPause}
              />
            )}
            Audio
            <audio
              ref={audioRef}
              style={{ display: "none" }}
              onEnded={handleAudioEnd}
            >
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        ) : (
          <p>{message.text}</p>
        )}
      </div>
    </div>
  );
};

export default Message;
