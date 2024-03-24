import React from 'react'
import Sidebar from './Sidebar'
import Chat from './Chat'
import './chat.css'


const Dashboard = () => {
    return (
        <div className='dashboard'>
            <div className="dash-container">
                <Sidebar />
                <Chat />
            </div>
        </div>
    )
}

export default Dashboard