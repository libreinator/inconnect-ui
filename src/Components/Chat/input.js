import {
  Timestamp,
  arrayUnion,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import React, { useRef, useState, useEffect, useContext } from "react";
import {
  FaMicrophone,
  FaUpload,
  FaPlay,
  FaPause,
  FaTimes,
} from "react-icons/fa";
import WaveSurfer from "wavesurfer.js";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function swapHalves(input) {
  // Split the input string into two equal halves
  const midpoint = input.length / 2;
  const firstHalf = input.slice(0, midpoint);
  const secondHalf = input.slice(midpoint);

  // Swap the two halves and return the result
  return secondHalf + firstHalf;
}

const Input = () => {
  const wavesurferRef = useRef(null);
  const [audioSrc, setAudioSrc] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audio, setAudio] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    if (audioSrc) {
      const wavesurfer = WaveSurfer.create({
        container: wavesurferRef.current,
        waveColor: "violet",
        progressColor: "purple",
        barWidth: 2,
        cursorWidth: 1,
        height: 70,
        responsive: true,
      });
      wavesurfer.load(audioSrc);
      wavesurfer.on("ready", function () {
        wavesurfer.setVolume(0.5);
      });
      wavesurfer.on("play", function () {
        setIsPlaying(true);
      });
      wavesurfer.on("pause", function () {
        setIsPlaying(false);
      });
      wavesurferRef.current = wavesurfer;
    }
  }, [audioSrc]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith("audio/")) {
        setAudio(file);
        setAudioSrc(URL.createObjectURL(file));
      } else {
        alert("Please select an audio file.");
        event.target.value = null;
      }
    }
  };

  const startRecording = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const recorder = new MediaRecorder(stream);
          setMediaRecorder(recorder);
          const chunks = [];
          recorder.ondataavailable = (e) => {
            chunks.push(e.data);
          };
          recorder.onstop = () => {
            const blob = new Blob(chunks, { type: "audio/webm" });
            const audioFile = new File([blob], `${uuid()}.wav`, {
              type: "audio/wav",
            });
            setAudioSrc(URL.createObjectURL(blob));
            setAudio(audioFile);
          };
          recorder.start();
          setIsRecording(true);
        })
        .catch((error) =>
          console.error("Error accessing the microphone:", error),
        );
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleRecordClick = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const handlePlayPause = () => {
    if (wavesurferRef.current) {
      if (isPlaying) {
        wavesurferRef.current.pause();
      } else {
        wavesurferRef.current.play();
      }
    }
  };

  const handleCancel = () => {
    setAudio(null);
    setAudioSrc(null);
  };

  const handleSend = async () => {
    if (audio) {
      const storageRef = ref(storage, uuid());

      const file = audio;

      try {
        await uploadBytes(storageRef, audio);

        const downloadURL = await getDownloadURL(storageRef);

        await fetch("http://localhost:5000/speechurl", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: "follow", // manual, *follow, error
          referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify([downloadURL]), // body data type must match "Content-Type" header
        });
        const res = await fetch("http://localhost:5000/video");
        console.log("uploading video");
        const videoStorageRef = ref(storage, uuid());
        console.log(res);
        const blob = await res.blob();
        await uploadBytes(videoStorageRef, blob);
        console.log(blob);
        console.log("done");
        console.log("video");
        const videoURL = await getDownloadURL(videoStorageRef);

        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            senderId: currentUser.uid,
            date: Timestamp.now(),
            audio: downloadURL,
            video: videoURL,
          }),
        });
        console.log(swapHalves(data.chatId));
        await updateDoc(doc(db, "chats", swapHalves(data.chatId)), {
          messages: arrayUnion({
            id: uuid(),
            senderId: currentUser.uid,
            date: Timestamp.now(),
            audio: downloadURL,
            video: videoURL,
          }),
        });

        setAudio(null);
        setAudioSrc(null);

        const lastMessage = { text: "audio" };
        const userChatsUpdates = {
          [data.chatId + ".lastMessage"]: lastMessage,
          [data.chatId + ".date"]: serverTimestamp(),
        };

        await Promise.all([
          updateDoc(doc(db, "userChats", currentUser.uid), userChatsUpdates),
          updateDoc(doc(db, "userChats", data.user.uid), userChatsUpdates),
        ]);
      } catch (error) {
        console.error("Error uploading audio:", error);
      }
    }
  };

  return (
    <div className="input">
      {audioSrc ? (
        <>
          <div className="left-buttons">
            <button onClick={handlePlayPause}>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button onClick={handleCancel}>
              <FaTimes />
            </button>
          </div>
          <div style={{ width: "30%" }} ref={wavesurferRef}></div>
          <div className="right-buttons">
            <button onClick={handleSend}>Send</button>
          </div>
        </>
      ) : (
        <>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="fileInput"
          />
          <label htmlFor="fileInput" className="uploadButton">
            <FaUpload />
          </label>
          <h5>or</h5>
          <label
            htmlFor="recordButton"
            className="recordButton"
            onClick={handleRecordClick}
          >
            {isRecording ? (
              <FaMicrophone style={{ color: "red" }} />
            ) : (
              <FaMicrophone />
            )}
          </label>
        </>
      )}
    </div>
  );
};

export default Input;
