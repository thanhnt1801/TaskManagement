import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const Lobby = ({ joinRoom }) => {
    const[items,setItems] = useState([])
   const [user, setUser] = useState();
   const [room, setRoom] = useState();
   const {id} = useParams()

   console.log(id);
   console.log(items.userName);

   useEffect(() => {
    const items = JSON.parse(localStorage.getItem('user'));
    if (items) {
       setItems(items);
    }
    setUser(items.userName)
    setRoom(id)
   }, [])
   
   const handleEnter = () => {

   }

   return (
      <form
         className="w-[400px]"
         onSubmit={(e) => {
            e.preventDefault();
            joinRoom(user, room);
         }}
      >
         <div className="w-full h-screen  pt-8">
            <div className="bg-white p-3 max-w-md mx-auto">
               <div className="text-center">
                  <h1 className="text-3xl font-bold">Room Chat</h1>
                  <div className="mt-4 flex">
                     <input
                        placeholder="Enter your name"
                        // onChange={(e) => setUser(e.target.value)}
                        className="w-80 p-3 border-b-2 pl-2 border-gray-500 text-black hidden"
                        type="text"
                     />
                  </div>
                  <div className="mt-4 flex">
                     <input
                        // onChange={(e) => setRoom(e.target.value)}
                        className="w-80 p-3 border-b-2 pl-2 border-gray-500 text-black hidden"
                        type="text"
                        placeholder="Enter your room name"
                     />
                  </div>
               </div>
               <div className='flex'>
               <div className="mt-8">
                  <button
                     className="border-2 border-indigo-500 p-2 text-indigo-500 ml-32"
                     type="submit"
                     onSubmit={handleEnter}
                     disabled={!user || !room}
                  >
                     Join Room
                  </button>
               </div>
               <div className="mt-8">
                  <Link
                     className="border-2 border-indigo-500 p-2 text-indigo-500 ml-1"
                     type="submit"
                     to={'/projects/' + id + '/requirements'}
                  >
                     Back
                  </Link>
               </div>
               </div>
            </div>
         </div>
      </form>
   );
};

export default Lobby;
