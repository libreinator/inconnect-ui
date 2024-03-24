import React, { useEffect, useState, useContext } from 'react';
import Msg from './messages';
import Input from './input';
import { ChatContext } from '../context/ChatContext';

const Chat = () => {
    const { data } = useContext(ChatContext);

    return (
        <div className='chat'>
            <div className="chatInfo">
                <span>{data.user.displayName || "Welcome to inconnect"}</span>
            </div>
            <Msg />
            <Input />
        </div>
    )
}

export default Chat;
