import Chat from './component/chat/Chat';
import Main from './component/main/Main';
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';


function App() {

  return (
    <div>
      <div>
        <nav>
          <Link to={"/chat"} >Chat</Link> |
          <Link to={"/"} >Main</Link>
        </nav>
        <h1>WebRTC</h1>
      </div>


      <Routes>
        <Route path="/chat" element={<Chat />} />
        <Route path="/" element={<Main />} />
      </Routes>
    </div>
  )
}

export default App
