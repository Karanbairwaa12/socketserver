import React, { useEffect, useRef,useState} from 'react'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ScrollToBottom from 'react-scroll-to-bottom'
const Chat = ({socket, username, room}) => {

  const [currentMessage,setCurrentMessage] = useState("")
  const [messageList, setMessageList] = useState([])

  const chatContainerRef = useRef(null);
  const sendMessage = async ()=> {
    if(currentMessage !== "") {
      const messageData = {
        room : room,
        author : username,
        message : currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes()
      }
      try {
        await socket.emit("send_message", messageData)
        setMessageList((list) => [...list, messageData]);
        setCurrentMessage("")
      }catch(err) {
        console.log(err)
      }
      
    }
  }

  useEffect(()=> {
    const receiveMessageHandler = (data) => {
      setMessageList((list) => [...list, data]);
      // Scroll to the bottom of the chat container when a new message arrives
      // chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    };    
    socket.on("receive_message", receiveMessageHandler);

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off("receive_message", receiveMessageHandler);
    };
  },[socket])
  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  });
  return (
    <div className='chatContainer'>
    
      <div className='chat-header'>
        <p>Live chat</p>
      </div>
      <div className='chat-body' ref={chatContainerRef}>
        <ScrollToBottom className='scroll-bottom'>
        {
            messageList.map((item,i)=> {
              return (
                <div className='message'
                      id={username === item.author ?"you":"other"}
                >
                  <div className="message-container">
                    <div className='message-content'>
                      <p>{item.message}</p>
                    </div>
                    <div className='message-meta' >
                      <div className='time'>{item.time}</div>
                      <div className='authors' id={username === item.author ?"visible":"notvisible"}>{item.author}</div>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </ScrollToBottom>
          
      </div>
      <div className="chat-footer">
        <input type="text" placeholder='Hey...'
        value={currentMessage}
        onChange={(event)=> {
          setCurrentMessage(event.target.value)
        }}
        onKeyPress={(event) => {
          if (event.key === "Enter" || event.keyCode === 13) {
            sendMessage();
          }
        }}
        />
        <button onClick={sendMessage}>
          <ArrowForwardIosIcon/>
        </button>
      </div>
    </div>
  )
}

export default Chat
