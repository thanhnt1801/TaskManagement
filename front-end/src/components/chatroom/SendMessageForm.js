import { useState } from 'react';

const SendMessageForm = ({ sendMessage }) => {
   const [message, setMessage] = useState('');

   return (
      <form
         onSubmit={(e) => {
            e.preventDefault();
            sendMessage(message);
            setMessage('');
         }}
      >
         <div className="flex mb-6">
            <div className="w-full">
               <input
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="inline-password"
                  type="text"
                  placeholder="Your message"
               />
            </div>
            <div className="">
               <button
                  variant="primary"
                  type="submit"
                  className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                  disabled={!message}
               >
                  Send
               </button>
            </div>
         </div>
      </form>
   );
};

export default SendMessageForm;
