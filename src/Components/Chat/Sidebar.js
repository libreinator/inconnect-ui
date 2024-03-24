import React from 'react';
import Nav from './Nav';
import BotPage from './bot_page';
import Chatting from './Chatting';

const Sidebar = () => {
    return (
        <div className='sidebar'>
            <Nav />
            <BotPage />
            <Chatting />
        </div>
    );
}

export default Sidebar;
