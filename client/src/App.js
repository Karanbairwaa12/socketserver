import './App.css';
import io from 'socket.io-client'
import { useEffect, useState } from 'react';
import Chat from './Chat';
const socket = io.connect("http://localhost:3001")
function App() {
  const [username, setUsername] = useState("")
  const [room, setRoom] = useState("")
  const [showChat, setShowChat] = useState(false)

  const joinRoom =() => {
    if(username !== "" && room !=="") {
      socket.emit("join_room",room)
      setShowChat(true)
    }
  }
  return (
    <div className="App">
      {
        !showChat ? (
          <div className="join-chat">
            <h3>Join a Chat</h3>
            <input
            type="text"
            placeholder="jhon...."
            onChange={(event) => {
              setUsername(event.target.value)
            }}
            />
            <input
            type="text"
            placeholder="Room Id...."
            onChange={(event) => {
              setRoom(event.target.value)
            }}
            onKeyPress={(event) => {
              if (event.key === "Enter" || event.keyCode === 13) {
                joinRoom();
              }
            }}
            />
            <button onClick={joinRoom}>Join</button>
          </div>
      
        ): (
          <Chat socket={socket} username={username} room={room}/>
        )
      }
      
      
    </div>
  );
}

export default App;
