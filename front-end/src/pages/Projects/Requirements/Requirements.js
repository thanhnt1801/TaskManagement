import { faArrowRight, faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React from 'react';
import { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Moment from 'react-moment';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
function Requirements() {
   let navigate = useNavigate();
   const API_URL = 'https://localhost:5001/api/';
   const [showModal, setShowModal] = useState(false);
   const [showModalDelete, setShowModalDelete] = useState({
      show: false,
      id: null,
   });
   const [taskID, setTaskID] = useState();
   const [openTab, setOpenTab] = useState(1);
   const [user, setUser] = useState('');
   const [taskList, setTaskList] = useState([]);
   const [listAssignTo, setListAssignTo] = useState([]);
   const [taskName, setTaskName] = useState([]);
   const [listUser, setListUser] = useState([]);
   const [memberAssign, setMemberAssign] = useState('');
   const [priorityID, setpriorityID] = useState();
   const [dueDate, setDueDate] = useState();
   const [description, setDescription] = useState();
   const [isDeleteTask, setIsDeleteTask] = useState(false);
   const [hubConnection, setHubConnection] = useState(null);
   const [query, setQuery] = useState('');

   // Chat Ahear

   // useEffect(() => {
   //    const hubConnection = new HubConnectionBuilder()
   //       .withUrl('https://localhost:5001/hubs/notifications')
   //       .configureLogging(LogLevel.Information)
   //       .withAutomaticReconnect()
   //       .build();

   //    setHubConnection(hubConnection);

   //    hubConnection.start();

   //    // .then((result) => {
   //    //    console.log('Connected');
   //    // }).catch((error)=>{
   //    //    console.log(error);
   //    // })
   //    console.log(hubConnection.state);
   // }, []);

   // const sendResult = (userID) => {
   //    if (hubConnection.state === 'Connected') {
   //       try {
   //          hubConnection.send('SendNotificationResult',`${userID}`)
   //          console.log('dc');
   //       } catch (error) {
   //          console.log('loi');
   //       }
   //    } else {
   //       console.log('No connection to server yet.');
   //    }
   // };

   //ID GROUP
   const { id } = useParams();
   // console.log(taskID);

   useEffect(() => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
         setUser(user);
      } else {
         navigate('/accessdenied')
      }
   }, []);

   const handleTaskName = (e) => {
      setTaskName(e.target.value);
   };
   // Get group id htmlFor list user
   useEffect(() => {
      axios
         .get(API_URL + `Task/GetTaskInGroup?GroupID=${id}`, {})
         .then((response) => {
            // console.log(response.data);
            setTaskList(response.data.listTasks.$values);
            setListAssignTo(response.data.assignTo.$values);
            setIsDeleteTask(true);
         })
         .catch((error) => {
            console.log(error.response.data);
         });
   }, [id, showModal, showModalDelete]);

   //Get user htmlFor list select
   useEffect(() => {
      axios
         .get(API_URL + `Group/${id}`, {})
         .then((response) => {
            // console.log(response.data);
            setListUser(response.data.assignTo.$values);
         })
         .catch((error) => {
            // console.log(error.response.data);
         });
   }, [id]);

   const handleSubmit = (e) => {
      e.preventDefault();
      axios
         .post(API_URL + `Task?groupID=${id}`, {
            taskCreator: user.id,
            name: taskName,
            priorityID,
            dueDate,
            assignTo: memberAssign,
            description: description,
         })
         .then((response) => {
            // console.log(response.data);

            setShowModal(false);
            const notify = () => {
               toast.success('Add Task success');
            };
            notify();
         })
         .catch((error) => {
            console.log(error.response.data);
            setShowModal(false);
            const notify = () => {
               toast.warning(error.response.data);
            };
            notify();
         });
   };

   const handleDeleteTask = (id) => {
      console.log(id);
      setShowModalDelete({
         show: true,
         id,
      });
   };

   const handleDeleteTrue = () => {
      if (showModalDelete.show && showModalDelete.id) {
         axios
            .delete(API_URL + `Task/${showModalDelete.id}?groupID=${id}&currentUserID=${user.id}`, {})
            .then((response) => {
               const notify = () => {
                  toast.success(response.data);
               };
               notify();
               setShowModalDelete({
                  show: false,
                  id: null,
               });
               // navigate('/');
            })
            .catch((error) => {
               console.log(error.response.data);
            });
      }
   };

   
   // console.log(taskList.filter(task => task.name.toLowerCase().includes("LA")));
   return (
      <div>       
         <ToastContainer />
         <div className="flex justify-between mb-5">
            <form>
               <label htmlFor="search" className=" text-sm font-medium text-gray-900 sr-only dark:text-gray-300">
                  Your Email
               </label>
               <div className="relative">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                     <svg
                        aria-hidden="true"
                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth="2"
                           d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        ></path>
                     </svg>
                  </div>
                  <input
                     type="search"
                     id="search"
                     onChange={(e) => setQuery(e.target.value)}
                     className="p-4 pl-10 w-[700px] text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                     placeholder="Search"
                  />
                  <button
                     type="submit"
                     className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800  focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                     Search
                  </button>
               </div>
            </form>
            <button
               onClick={(e) => setShowModal(true)}
               className="px-6 py-3 border border-transparent rounded-md shadow-sm text-md font-medium text-white bg-gradient-to-br  from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
               Add Task
            </button>
         </div>

         {taskList != '' ? (
            taskList
               .filter((task) => task.name.toLowerCase().includes(query))
               .map((task, index) =>
                  task.isActive ? (
                     <div key={index}>
                        <div className="bg-gradient-to-br from-purple-100 to-blue-100 shadow-md rounded-md mb-6 hover:bg-gradient-to-bl hover:from-purple-100   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                           <div className="p-4">
                              <div className="lg:flex lg:items-center lg:justify-between">
                                 <div className="flex-1 min-w-0">
                                    <Link to={`` + task.id}>
                                       <h3 className="text-1xl leading-7 mb-5 text-gray-600 sm:text-2xl sm:truncate">
                                          {task.name}
                                       </h3>
                                    </Link>
                                    {/* label */}
                                    <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                                       {/* <div className="mt-2 flex items-center text-sm text-gray-500">
                                          <svg
                                             className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                             xmlns="http://www.w3.org/2000/svg"
                                             viewBox="0 0 20 20"
                                             fill="currentColor"
                                             aria-hidden="true"
                                          >
                                             <path
                                                fillRule="evenodd"
                                                d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                                                clipRule="evenodd"
                                             />
                                             <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                                          </svg>
                                          Full-time
                                       </div> */}
                                       {/* Priority render */}
                                       <div className="mt-2 flex items-center text-sm text-gray-500">
                                          {(() => {
                                             switch (task.priorityID) {
                                                case 1:
                                                   return (
                                                      <span className="bg-zinc-100 rounded-full inline-block px-3 py-1 font-semibold text-red-600 leading-tight">
                                                         <span
                                                            aria-hidden
                                                            className=" inset-0 bg-zinc-50 rounded-full"
                                                         ></span>
                                                         <span className="">Highest</span>
                                                      </span>
                                                   );
                                                case 2:
                                                   return (
                                                      <span className="bg-zinc-100 rounded-full inline-block px-3 py-1 font-semibold text-orange-400 leading-tight">
                                                         <span
                                                            aria-hidden
                                                            className=" inset-0 bg-zinc-50  rounded-full"
                                                         ></span>
                                                         <span className="">High</span>
                                                      </span>
                                                   );
                                                case 3:
                                                   return (
                                                      <span className="bg-zinc-100 rounded-full inline-block px-3 py-1 font-semibold text-amber-400 leading-tight">
                                                         <span
                                                            aria-hidden
                                                            className=" inset-0 bg-zinc-50  rounded-full"
                                                         ></span>
                                                         <span className="">Medium</span>
                                                      </span>
                                                   );
                                                case 4:
                                                   return (
                                                      <span className="bg-zinc-100 rounded-full inline-block px-3 py-1 font-semibold text-green-400 leading-tight">
                                                         <span
                                                            aria-hidden
                                                            className=" inset-0 bg-zinc-50  rounded-full"
                                                         ></span>
                                                         <span className="">Low</span>
                                                      </span>
                                                   );
                                                case 5:
                                                   return (
                                                      <span className="bg-zinc-100 rounded-full inline-block px-3 py-1 font-semibold text-teal-400 leading-tight">
                                                         <span
                                                            aria-hidden
                                                            className=" inset-0 bg-zinc-50  rounded-full"
                                                         ></span>
                                                         <span className="">Lowest</span>
                                                      </span>
                                                   );
                                                default:
                                                   return (
                                                      <span className="bg-zinc-100 rounded-full inline-block px-3 py-1 font-semibold text-red-900 leading-tight">
                                                         <span
                                                            aria-hidden
                                                            className=" inset-0 bg-zinc-50  rounded-full"
                                                         ></span>
                                                         <span className="">No priority yet.</span>
                                                      </span>
                                                   );
                                             }
                                          })()}
                                       </div>
                                       <div className="mt-2 flex items-center text-sm text-gray-500">
                                          <svg
                                             className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                             xmlns="http://www.w3.org/2000/svg"
                                             viewBox="0 0 20 20"
                                             fill="currentColor"
                                             aria-hidden="true"
                                          >
                                             <path
                                                fillRule="evenodd"
                                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                                clipRule="evenodd"
                                             />
                                          </svg>
                                          Due date :<Moment format="YYYY/MM/DD">{task.dueDate}</Moment>
                                       </div>
                                       <div className="mt-2 flex items-center text-sm text-gray-500">
                                          <svg
                                             className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                             xmlns="http://www.w3.org/2000/svg"
                                             viewBox="0 0 20 20"
                                             fill="currentColor"
                                             aria-hidden="true"
                                          >
                                             <path
                                                fillRule="evenodd"
                                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                                clipRule="evenodd"
                                             />
                                          </svg>
                                          Create date :<Moment format="YYYY/MM/DD">{task.createdAt}</Moment>
                                       </div>
                                    </div>
                                 </div>
                                 {/* Button */}
                                 <div className="flex p-5">
                                    <button
                                       className="border-0 font-semibold outline-none focus:outline-none"
                                       onClick={() => handleDeleteTask(task.id)}
                                    >
                                       <span className="bg-red-50 w-20 items-center text-red-400 text-2xl block outline-none rounded-md focus:outline-none">
                                          ×
                                       </span>
                                    </button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  ) : null,
               )
         ) : (
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 shadow-md rounded-md mb-6">
               <div className="flex p-12">
                  <div className="lg:flex lg:items-center lg:justify-between">
                     <div className="flex-1 min-w-0">
                        <p className="text-sm  leading-7 text-gray-900 sm:text-2xl sm:truncate">
                           No Requirements available now
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {showModal ? (
            <>
               <div className="justify-center items-center  flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
                  <div className="relative w-auto my-6 mx-auto max-w-3xl">
                     {/*content*/}
                     <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
                        {/*header*/}
                        <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                           <h3 className="text-3xl font-semibold text-indigo-500 ">Add new task</h3>
                        </div>
                        {/*body*/}
                        <div className="relative p-6 flex-auto">
                           <p className="my-4 text-slate-400 text-md leading-relaxed">
                              Add task for your group now !
                           </p>
                           <form className="space-y-2" onSubmit={handleSubmit}>
                              <input type="hidden" name="remember" value="true" />
                              <div className="rounded-md shadow-sm -space-y-px">
                                 <div>
                                    <label htmlFor="taskName" className="text-sm text-gray-400">
                                       TASK NAME
                                    </label>
                                    <input
                                       id="taskName"
                                       name="taskName"
                                       type="text"
                                       autoComplete="off"
                                       required
                                       onChange={handleTaskName}
                                       className="appearance-none my-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                       placeholder="Task name"
                                    />
                                 </div>
                                 {/* Select  */}
                                 <div>
                                    <label htmlFor="underline_select" className="text-gray-400">
                                       ASSIGN TO
                                    </label>
                                    <select
                                       id="underline_select"
                                       className="block py-3 pl-3 w-full text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-gray-900 dark:border-gray-300 focus:outline-none focus:ring-0 focus:border-indigo-500 peer"
                                       required
                                       onChange={(e) => {
                                          const memberAssign = e.target.value;
                                          setMemberAssign(memberAssign);
                                       }}
                                    >
                                       <option value={user.id}>Assign to me</option>
                                       {listAssignTo.map((user, index) => (
                                          <option value={user.id} key={index}>
                                             {user.userName}
                                          </option>
                                       ))}
                                    </select>
                                 </div>

                                 {/* priority  */}
                                 <div className="flex flex-wrap">
                                    <div className="w-full mt-5">
                                       <label htmlFor="groupName" className="text-sm text-gray-400">
                                          PRIORITY LEVEL (Highest to Lowest)
                                       </label>
                                       <ul className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row" role="tablist">
                                          <li className="-mb-px  last:mr-0 flex-auto text-center">
                                             <a
                                                className={
                                                   'text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ' +
                                                   (openTab === 1
                                                      ? 'text-white bg-indigo-600'
                                                      : 'text-indigo-600 bg-white')
                                                }
                                                onClick={(e) => {
                                                   e.preventDefault();
                                                   setOpenTab(1);
                                                   setpriorityID(1);
                                                }}
                                                data-toggle="tab"
                                                href="/"
                                                role="tablist"
                                             >
                                                1
                                             </a>
                                          </li>
                                          <FontAwesomeIcon
                                             icon={faArrowRight}
                                             className="self-center mx-2"
                                             color="#A7ADB8"
                                          />
                                          <li className="-mb-px  last:mr-0 flex-auto text-center">
                                             <a
                                                className={
                                                   'text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ' +
                                                   (openTab === 2
                                                      ? 'text-white bg-indigo-600'
                                                      : 'text-indigo-600 bg-white')
                                                }
                                                onClick={(e) => {
                                                   e.preventDefault();
                                                   setOpenTab(2);
                                                   setpriorityID(2);
                                                }}
                                                data-toggle="tab"
                                                href="#link2"
                                                role="tablist"
                                             >
                                                2
                                             </a>
                                          </li>
                                          <FontAwesomeIcon
                                             icon={faArrowRight}
                                             className="self-center mx-2"
                                             color="#A7ADB8"
                                          />
                                          <li className="-mb-px  last:mr-0 flex-auto text-center">
                                             <a
                                                className={
                                                   'text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ' +
                                                   (openTab === 3
                                                      ? 'text-white bg-indigo-600'
                                                      : 'text-indigo-600 bg-white')
                                                }
                                                onClick={(e) => {
                                                   e.preventDefault();
                                                   setOpenTab(3);
                                                   setpriorityID(3);
                                                }}
                                                data-toggle="tab"
                                                href="#link3"
                                                role="tablist"
                                             >
                                                3
                                             </a>
                                          </li>
                                          <FontAwesomeIcon
                                             icon={faArrowRight}
                                             className="self-center mx-2"
                                             color="#A7ADB8"
                                          />
                                          <li className="-mb-px  last:mr-0 flex-auto text-center">
                                             <a
                                                className={
                                                   'text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ' +
                                                   (openTab === 4
                                                      ? 'text-white bg-indigo-600'
                                                      : 'text-indigo-600 bg-white')
                                                }
                                                onClick={(e) => {
                                                   e.preventDefault();
                                                   setOpenTab(4);
                                                   setpriorityID(4);
                                                }}
                                                data-toggle="tab"
                                                value={4}
                                                href="#link2"
                                                role="tablist"
                                             >
                                                4
                                             </a>
                                          </li>
                                          <FontAwesomeIcon
                                             icon={faArrowRight}
                                             className="self-center mx-2"
                                             color="#A7ADB8"
                                          />
                                          <li className="-mb-px  last:mr-0 flex-auto text-center">
                                             <a
                                                className={
                                                   'text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ' +
                                                   (openTab === 5
                                                      ? 'text-white bg-indigo-600'
                                                      : 'text-indigo-600 bg-white')
                                                }
                                                onClick={(e) => {
                                                   e.preventDefault();
                                                   setOpenTab(5);
                                                   setpriorityID(5);
                                                }}
                                                data-toggle="tab"
                                                href="#link3"
                                                role="tablist"
                                             >
                                                5
                                             </a>
                                          </li>
                                       </ul>
                                    </div>
                                 </div>

                                 <div>
                                    <label htmlFor="taskName" className="text-sm text-gray-400">
                                       DATE
                                    </label>
                                    <input
                                       id="taskName"
                                       name="taskName"
                                       type="datetime-local"
                                       autoComplete="off"
                                       required
                                       onChange={(e) => setDueDate(e.target.value)}
                                       className="appearance-none my-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    />
                                 </div>

                                 {/* Description */}
                                 <div>
                                    <label htmlFor="description" className="text-sm text-gray-400">
                                       DESCRIPTION
                                    </label>
                                    <CKEditor
                                       editor={ClassicEditor}
                                       className="CKEditor"
                                       onChange={(e, editor) => {
                                          const desc = editor.getData();
                                          setDescription(desc);
                                          //  this.state.content = editor.getData()
                                       }}
                                    />
                                    {/* <textarea
                                       id="description"
                                       name="description"
                                       type="text"
                                       autoComplete="off"
                                       required
                                       onChange={(e) => setDescription(e.target.value)}
                                       className="appearance-none my-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                       placeholder="Description"
                                    /> */}
                                 </div>
                                 {/* File */}
                                 <div>
                                    <label htmlFor="file" className="text-sm text-gray-400">
                                       FILE
                                    </label>
                                    <input
                                       className="block mb-5 w-full text-sm  text-gray-600 bg-gray-50 rounded-md border p-5 border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400"
                                       id="file"
                                       type="file"
                                    ></input>
                                 </div>
                              </div>

                              <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                 <button
                                    className="text-red-500 background-transparent font-bold uppercase px-5 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                 >
                                    Close
                                 </button>
                                 <button
                                    className="bg-indigo-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="submit"
                                 >
                                    Create
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

         {showModalDelete.show == true ? (
            <>
               <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                  <div className="relative w-auto my-6 mx-auto max-w-3xl">
                     {/*content*/}
                     <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {/*header*/}
                        <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                           <h3 className="text-3xl font-semibold">Delete Project</h3>
                           <button
                              className="p-1 ml-auto bg-transparent border-3 border-red-600 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                              onClick={() => setShowModalDelete(false)}
                           >
                              <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                                 ×
                              </span>
                           </button>
                        </div>
                        {/*body*/}
                        <div className="relative p-6 flex-auto">
                           <p className="my-4 text-slate-500 text-lg leading-relaxed">
                              <FontAwesomeIcon
                                 icon={faWarning}
                                 className="text-4xl mr-4 align-middle"
                                 color="#F43F5E"
                              />
                              Are you sure you want to permanently remove this item ?
                           </p>
                        </div>
                        {/*Button*/}
                        <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                           <button
                              className="bg-rose-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                              type="button"
                              onClick={handleDeleteTrue}
                           >
                              Delete
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
         ) : null}
      </div>
   );
}

export default Requirements;
