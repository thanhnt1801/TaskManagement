import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useState } from "react";
import Lobby from '../../../components/chatroom/Lobby';
import Chat from '../../../components/chatroom/Chat';


function ChatRoom() {

    const [connection, setConnection] = useState();
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
  
    const joinRoom = async (user, room) => {
      try {
        const connection = new HubConnectionBuilder()
          .withUrl("https://localhost:5001/chat")
          .configureLogging(LogLevel.Information)
          .build();
  
        connection.on("ReceiveMessage", (user, message) => {
          setMessages(messages => [...messages, { user, message }]);
        });
  
        connection.on("UsersInRoom", (users) => {
          setUsers(users);
        });
  
        connection.onclose(e => {
          setConnection();
          setMessages([]);
          setUsers([]);
        });
  
        await connection.start();
        await connection.invoke("JoinRoom", { user, room });
        setConnection(connection);
      } catch (e) {
        console.log(e);
      }
    }
  
    const sendMessage = async (message) => {
      try {
        await connection.invoke("SendMessage", message);
      } catch (e) {
        console.log(e);
      }
    }
  
    const closeConnection = async () => {
      try {
        await connection.stop();
      } catch (e) {
        console.log(e);
      }
    }
    return ( 
        <div>
            {!connection
                  ? <Lobby joinRoom={joinRoom} />
                  : <Chat sendMessage={sendMessage} messages={messages} users={users} closeConnection={closeConnection} />}
        </div>
     );
}

export default ChatRoom;