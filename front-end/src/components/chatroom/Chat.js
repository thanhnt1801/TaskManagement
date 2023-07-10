import SendMessageForm from './SendMessageForm';
import MessageContainer from './MessageContainer';
import ConnectedUsers from './ConnectedUsers';

const Chat = ({ sendMessage, messages, users, closeConnection }) => (
   <div className="mr-96 mt-5">
      <div
         onClick={() => closeConnection()}
         className="text-center mb-2 bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded"
      >
         <button variant="danger">Leave Room</button>
      </div>
      <ConnectedUsers users={users} />
      <div className="grid">
         <MessageContainer messages={messages} />
         <SendMessageForm sendMessage={sendMessage} />
      </div>
   </div>
);

export default Chat;
