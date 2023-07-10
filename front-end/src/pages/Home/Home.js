import axios from 'axios';
import { useEffect, useState } from 'react';
import Moment from 'react-moment';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';

function Home() {
   const API_URL = 'https://localhost:5001/api/';
   let navigate = useNavigate();
   const [items, setItems] = useState([]);
   const [showModalUser, setShowModalUser] = useState(false);
   const [userName, setUserName] = useState('');
   const [gender, setGender] = useState('');
   const [address, setAddress] = useState('');
   const [description, setDescription] = useState('');
   const [taskUser, setTaskUser] = useState([])

   useEffect(() => {
      const items = JSON.parse(localStorage.getItem('user'));
      if (items) {
         setItems(items);
      } else {
         navigate('/accessdenied')
      }
   }, [showModalUser]);

   const handleSubmit = (e) => {
      e.preventDefault();
      return axios
         .put(API_URL + `Profile/${items.id}`, {
            name: userName,
            gender,
            address,
            description,
         })
         .then((response) => {
            console.log(response);
            if (response.data) {
               localStorage.setItem('user', JSON.stringify(response.data));
            }
            setShowModalUser(false);
            const notify = () => {
               toast.success('Information has update');
            };
            notify();
         })
         .catch((error) => {
            console.log(error.response.data);
            const notify = () => {
               toast.warning(error.response.data);
            };
            notify();
         });
   };

   useEffect(() => {
      axios
         .get(API_URL + `Task/GetUserTask?userID=${items.id}`, {
         })
         .then((response) => {
            console.log(response.data.task);
            setTaskUser(response.data.task.$values)
         })
         .catch((error) => {
            console.log(error.response);
         });
   }, [items.id]);

   const handleRedirect = (taskid) => {
      return axios
         .get(API_URL + `Task/${taskid}`, {
         })
         .then((response) => {
            console.log(response.data.groupID);
            navigate(`/projects/${response.data.groupID}/requirements`)
         })
         .catch((error) => {
            console.log(error.response);
         });
   }

   function Div({task}) {
      var taskDueDate = moment(task.dueDate ).format("MMMM Do YYYY, h:mm:ss a");
      return (
         <div>
            <div className="w-96 mr-10 max-w-md">
               {/* <Link to={`/project//requirements/${task.id}`} > */}
                  <div className="bg-gradient-to-br from-purple-100 to-blue-100 shadow-md hover:bg-gradient-to-bl hover:from-purple-100   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md mb-6">
                     <div className="p-4">
                        <div className="">
                           <div className="">
                              <h3 className="text-md leading-7 mb-5 text-gray-900 font-bold sm:truncate">
                                 {task.name}
                              </h3>
                           </div>
                           <div className='flex flex-row items-center'> <FontAwesomeIcon icon={faCalendar} color="#447AF5" className='mr-2'/><div>Due date</div>: {taskDueDate}</div>
                        </div>
                     </div>
                  </div>
               {/* </Link> */}
            </div>
         </div>
      );
   }

   return (
      <div className="ml-96">
         {/* <p className="mt-5 text-3xl">Welcome, {items.userName}</p>s */}
         <div className="max-w-md md:max-w-full bg-gradient-to-br from-purple-100 to-blue-100 min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-xl mt-32">
            <div className="px-6">
               <div className="flex flex-wrap justify-center">
                  <div className="w-full flex justify-center">
                     <div className="relative">
                        <img
                           src="https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745"
                           className="shadow-xl rounded-full align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-[150px]"
                           alt=""
                        />
                        <span className='absolute top-12 -right-20 h-4 w-4 rounded-full bg-emerald-500 ring ring-white'></span>
                     </div>
                  </div>
               </div>
               <div className="text-center mt-32">
                  <h3 className="text-2xl text-slate-700 font-bold leading-normal mb-1">{items.userName}</h3>
                  <div className="text-xs mt-0 mb-2 text-slate-400 font-bold uppercase">
                     <i className="fas fa-map-marker-alt mr-2 text-slate-400 opacity-75"></i>
                     {items.email}
                  </div>
               </div>
               <div className="mt-6 py-6 border-t border-slate-200 text-center">
                  <div className="flex flex-wrap justify-center">
                     <div className="w-full px-4">
                        <p className="font-light leading-relaxed text-slate-600 mb-4">{items.description}</p>
                        <button
                           className="text-white bg-gradient-to-br px-4 from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-bold  rounded-lg text-md px-22 py-4 text-center"
                           type="button"
                           onClick={() => setShowModalUser(true)}
                        >
                           Edit profile
                        </button>
                        {showModalUser ? (
                           <>
                              <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
                                 <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                    {/* Dòng này max w */}
                                    {/*content*/}
                                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                       {/*header*/}
                                       <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                          <h3 className="text-3xl font-semibold text-indigo-500">Edit profile user</h3>
                                       </div>
                                       {/*body*/}
                                       <div className="relative p-6 flex-auto">
                                          <p className="my-4 text-slate-400 text-md leading-relaxed">
                                             Please provide a reasonable project name in order to identify your project.
                                          </p>
                                          <form className="space-y-6" onSubmit={handleSubmit}>
                                             <input type="hidden" name="remember" value="true" />
                                             {/* User name */}
                                             <div className="rounded-md shadow-sm -space-y-px">
                                                <div>
                                                   <label htmlFor="userName" className="sr-only">
                                                      User name
                                                   </label>
                                                   <input
                                                      id="userName"
                                                      value={userName}
                                                      onChange={(e) => setUserName(e.target.value)}
                                                      name="userName"
                                                      type="text"
                                                      autoComplete="off"
                                                      required
                                                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                                      placeholder="User name"
                                                   />
                                                </div>
                                             </div>
                                             {/* Gender */}
                                             <div>
                                                <select
                                                   id="underline_select"
                                                   className="block py-3 pl-3  w-full text-gray-400  border-0 border-b-2  dark:text-gray-600 dark:border-gray-300 focus:outline-none focus:ring-0 focus:border-indigo-500 peer"
                                                   onChange={(e) => {
                                                      const gender = e.target.value;
                                                      setGender(gender);
                                                   }}
                                                >
                                                   <option defaultValue={''}>Choose Gender</option>
                                                   <option value="Male">Male</option>
                                                   <option value="Female">Female</option>
                                                </select>
                                             </div>

                                             <div className="rounded-md shadow-sm -space-y-px">
                                                <div>
                                                   <label htmlFor="address" className="sr-only">
                                                      Address
                                                   </label>
                                                   <input
                                                      id="address"
                                                      value={address}
                                                      onChange={(e) => setAddress(e.target.value)}
                                                      name="address"
                                                      type="text"
                                                      autoComplete="off"
                                                      required
                                                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                                      placeholder="Address"
                                                   />
                                                </div>
                                             </div>

                                             {/* Description */}
                                             <div className="flex flex-wrap">
                                                <label
                                                   htmlFor="description"
                                                   className="block text-gray-900 dark:text-gray-400"
                                                >
                                                   Description :
                                                </label>
                                                <textarea
                                                   id="message"
                                                   rows="4"
                                                   className="block p-2.5 w-full text-sm "
                                                   value={description}
                                                   onChange={(e) => setDescription(e.target.value)}
                                                   placeholder="Your message..."
                                                ></textarea>
                                             </div>

                                             <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                                <button
                                                   className="text-red-500 background-transparent font-bold uppercase px-5 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                   type="button"
                                                   onClick={() => setShowModalUser(false)}
                                                >
                                                   Close
                                                </button>
                                                <button
                                                   className="bg-indigo-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                   type="submit"
                                                >
                                                   Edit
                                                </button>
                                             </div>
                                          </form>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                           </>
                        ) : null}
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <hr></hr>
         <h1 className="text-3xl font-medium my-10  text-sky-400">My task</h1>

         <div className="justify-center flex flex-wrap">
            {taskUser.map((task,index) => (
               <button onClick={() => handleRedirect(task.id)} className="text-left">
               <Div task={task} key={index} ></Div>
               </button>
            ))}
         </div>
      </div>
   );
}

export default Home;
