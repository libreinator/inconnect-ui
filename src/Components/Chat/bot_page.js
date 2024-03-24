import React, { useContext, useState, useEffect } from "react";
import {
    collection,
    query,
    where,
    getDocs,
    setDoc,
    doc,
    updateDoc,
    serverTimestamp,
    getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Search = () => {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);
    const [chatExists, setChatExists] = useState(false);
    const { currentUser } = useContext(AuthContext);

    const predefinedUserId = "el9VwVaAlzbwUtZqqHQtundVp1p1";

    useEffect(() => {
        const fetchPredefinedUser = async () => {
            try {
                const userDoc = await getDoc(doc(db, "users", predefinedUserId));
                if (userDoc.exists()) {
                    setUser(userDoc.data());
                } else {
                    setErr(true);
                }
            } catch (error) {
                console.error("Error fetching predefined user:", error);
                setErr(true);
            }
        };

        fetchPredefinedUser();
    }, []);

    useEffect(() => {
        if (user) {
            const combinedId =
                currentUser.uid > user.uid
                    ? currentUser.uid + user.uid
                    : user.uid + currentUser.uid;

            const checkChatExistence = async () => {
                try {
                    const res = await getDoc(doc(db, "chats", combinedId));
                    setChatExists(res.exists());
                } catch (error) {
                    console.error("Error checking chat existence:", error);
                }
            };

            checkChatExistence();
        }
    }, [user, currentUser.uid]);

    const handleSelect = async () => {
        const combinedId =
            currentUser.uid > user.uid
                ? currentUser.uid + user.uid
                : user.uid + currentUser.uid;

        try {
            const res = await getDoc(doc(db, "chats", combinedId));

            if (!res.exists()) {
                await setDoc(doc(db, "chats", combinedId), { messages: [] });
                const currentUserChatUpdate = {
                    [combinedId + ".userInfo"]: {
                        uid: user.uid,
                        displayName: user.displayName,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                };
                await updateDoc(doc(db, "userChats", currentUser.uid), currentUserChatUpdate);

                const otherUserChatUpdate = {
                    [combinedId + ".userInfo"]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                };
                await updateDoc(doc(db, "userChats", user.uid), otherUserChatUpdate);
                setUser(null);
                setUsername("");
            }
        } catch (error) {
            console.error("Error creating chat:", error);
        }
    };


    return (
        <div className="search">
            {user && !chatExists && (
                <div className="userChat" onClick={handleSelect}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                    <div className="userChatInfo">
                        {/* Render the display name only if the chat does not exist */}
                        <span>{user.displayName}</span>
                    </div>
                </div>
            )}
        </div>

    );
};

export default Search;
