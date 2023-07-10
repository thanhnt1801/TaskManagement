const ConnectedUsers = ({ users }) => (
   <div className="text-center float-left  text-gray-600 w-[220px] h-[850px] mr-2">
      <h4 className="my-2 ">USER NAME</h4>
      {users.map((u, idx) => (
         <>
            <div key={idx} className="bg-violet-400 text-white rounded-xl mb-2 py-1 hover:bg-violet-500 focus:outline-none focus:ring focus:ring-violet-200">{u}</div>
         </>
      ))}
   </div>
);

export default ConnectedUsers;
