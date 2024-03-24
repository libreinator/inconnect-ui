import React, { useContext, useEffect, useState } from 'react';
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { AuthContext } from '../context/AuthContext';
import { getDoc, doc } from "firebase/firestore";

const Nav = () => {
    const { currentUser } = useContext(AuthContext);
    const [displayName, setDisplayName] = useState(null);

    useEffect(() => {
        const fetchDisplayName = async () => {
            if (currentUser) {
                try {
                    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setDisplayName(userData.displayName);
                    } else {
                        console.log("User document does not exist");
                    }
                } catch (error) {
                    console.error("Error fetching user document:", error);
                }
            }
        };

        fetchDisplayName();

    }, [currentUser]);

    return (
        <div className='navbar'>
            <span className='logo'>Inconnect Chat</span>
            <div className="user">
                <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                <span>{displayName || "Guest"}</span>
                {currentUser && (
                    <button onClick={() => signOut(auth)}>Logout</button>
                )}
            </div>
        </div>
    );
};

export default Nav;
