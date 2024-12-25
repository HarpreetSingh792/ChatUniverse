import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { RiEmojiStickerLine } from "react-icons/ri";


export default function App() {

  const [inputMessage, setInputMessage] = useState("");
  const [message, setMessage] = useState([]);
  const [socket, setSocket] = useState(null);
  const [emojiDisplay,setEmojiDisplay] = useState(false);
  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    const newSocket = io(socketUrl);
    setSocket(newSocket);


    newSocket.on("Join",(data)=>setMessage(prev=>[...prev,data]))
    newSocket.on("acknowledge", (data) => setMessage(prev=>[...prev,data]));
    newSocket.on("user-disconnected",(data)=>setMessage(prev=>[...prev,data]))
    return () => newSocket.disconnect();
  }, []);


  useEffect(()=>{
    console.log(message)
  },[message])

  const messageHandler = () => {
    socket.emit("hello", inputMessage);
    setInputMessage("");
    setEmojiDisplay(false)
  };

  const handleEmojiSelect = (emoji) => {
    setInputMessage((prev) => prev + emoji.native+" "); // Append emoji to the message
  };

  return (
    <div className="flex flex-column w-screen">
      <div className="h-80dvh border relative overflow-y flex flex-column items-center  gap-4 pb-4 pt-4" onClick={()=>setEmojiDisplay(false)}>
        {
          message.map((item,idx)=>{
             return <p className={`white flex text-md ${item.alert?" fit-content text-center border rounded-md text-sm p-2":item.id===socket.id?"self-right":"self-left"}`} key={idx}>
              {item.mssg}
              </p>
          })
        }
      </div>
      <form
        method="POST"
        onSubmit={(e) => e.preventDefault()}
        className="grid justify-center items-center p-4 relative w-screen border"
      >
        <div className="flex w-screen justify-center items-center gap-4">
          <RiEmojiStickerLine
            fill="white"
            color="white"
            size={35}
            className="cursor-pointer"
            onClick={()=>setEmojiDisplay(prev=>!prev)}
          />
          {emojiDisplay&&<div className="absolute top--25rem left-4 border">
            <Picker data={data} onEmojiSelect={handleEmojiSelect} />
          </div>}

            <input
              className="p-2 w-4-5 border-none outline-none"
              type="text"
              placeholder="Let everyone knows you exists!!"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <input
              type="submit"
              value={"▶"}
              className="p-2 cursor-pointer border-none outline-none"
              onClick={messageHandler}
            />
        </div>
      </form>
    </div>
  );
}
