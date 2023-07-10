import { faGear, faRecycle, faTasks } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './Projectcss.css';
import ProjectItem from './ProjectMenu/ProjectItem';
import ProjectMenu from './ProjectMenu/ProjectMenu';
import { toast, ToastContainer } from 'react-toastify';

function Projects() {
   const API_URL = 'https://localhost:5001/api/';
   const { id } = useParams();
   const [groupUser, setGroupUser] = useState('');
   const [showModal, setShowModal] = useState(false);
   const [inviteEmail, setInviteEmail] = useState('');
   const [inviteRole, setInviteRole] = useState();

   useEffect(() => {
      axios
         .get(API_URL + `Group/${id}`, {})
         .then((response) => {
            setGroupUser(response.data);
         })
         .catch((error) => {
            console.log(error.response.data);
         });
   }, [id]);

   const onChangeInviteEmail = (e) => {
      const inviteEmail = e.target.value;
      setInviteEmail(inviteEmail);
   };

   // console.log(inviteEmail);
   // console.log(inviteRole);

   const handleSubmit = (e) => {
      e.preventDefault();
      return axios({
         method: 'put',
         url: `https://localhost:5001/api/Group/AddUser`,
         params: {
            email: inviteEmail,
            roleName: inviteRole,
            groupID: id,
         },
         headers: {
            Accept: 'application/json, text/plain',
            'Content-Type': 'application/json;charset=UTF-8',
         },
      })
         .then((res) => {
            setShowModal(false);
            const notify = () => {
               toast.success("Add user success");
            };
            notify();
         })
         .catch((error) => {
            setShowModal(false);
            const notify = () => {
               toast.warning(error.response.data);
            };
            notify();
         });
   };

   //ID GROUP
   // console.log(id);

   return (
      <div className="w-full">
         <ToastContainer />
         <div
            className="flex flex-row rounded-lg  p-8  pl-40 "
            style={{ backgroundImage: `url(${process.env.PUBLIC_URL + '/image.png'})` }}
         >
            <div className="flex flex-col px-6">
               <div className="flex h-8 mb-8 flex-row">
                  <img
                     className="w-16 h-16 rounded-md object-cover border-2 border-slate-100 mr-4"
                     src="https://www.creativefabrica.com/wp-content/uploads/2019/02/Group-Icon-by-Kanggraphic.jpg"
                     alt="Group"
                  />
                  <div>
                     <h2 className="text-lg font-semibold text-gray-700">{groupUser.name}</h2>
                     <div className="my-2 flex flex-row space-x-2">
                        <div className="flex flex-row">
                           <svg
                              className="mr-2 h-4 w-4 fill-gray-500/80"
                              xmlns="http://www.w3.org/2000/svg"
                              version="1.1"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                           >
                              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z" />
                           </svg>

                           <div className="text-xs text-gray-400/80 hover:text-gray-400">
                               {groupUser.groupCreatorName}
                           </div>
                        </div>

                        <div className="flex flex-row">
                           <svg
                              className="mr-2 h-4 w-4 fill-gray-500/80"
                              xmlns="http://www.w3.org/2000/svg"
                              version="1.1"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                           >
                              <path d="M12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5M12,2A7,7 0 0,1 19,9C19,14.25 12,22 12,22C12,22 5,14.25 5,9A7,7 0 0,1 12,2M12,4A5,5 0 0,0 7,9C7,10 7,12 12,18.71C17,12 17,10 17,9A5,5 0 0,0 12,4Z" />
                           </svg>

                           <div className="text-xs text-gray-400/80 hover:text-gray-400">{groupUser.description}</div>
                        </div>
                     </div>
                  </div>

                  <div className="flex flex-grow flex-col items-end justify-start">
                     <div className="flex flex-row space-x-3">

                        <button
                           className="flex rounded-md bg-emerald-500 py-2 px-4 text-white transition-all duration-150 ease-in-out hover:bg-green-500"
                           onClick={() => setShowModal(true)}
                        >
                           <svg
                              className="mr-2 fill-current"
                              xmlns="http://www.w3.org/2000/svg"
                              version="1.1"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                           >
                              <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                           </svg>
                           Invite Member
                        </button>
                        {showModal ? (
                           <>
                              <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                                 <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                    {/* Dòng này max w */}
                                    {/*content*/}
                                    <div className="border-0 w-96 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
                                       {/*header*/}
                                       <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                          <h3 className="text-3xl font-semibold text-indigo-500">Invite Member</h3>
                                       </div>
                                       {/*body*/}
                                       <div className="relative p-6 flex-auto">
                                          <form className="space-y-6" onSubmit={handleSubmit}>
                                             <input type="hidden" name="remember" value="true" />
                                             <div className="rounded-md shadow-sm -space-y-px">
                                                <div className="mb-5">
                                                   <label htmlFor="inviteEmail" className="text-gray-400">
                                                      Email
                                                   </label>
                                                   <input
                                                      id="inviteEmail"
                                                      name="inviteEmail"
                                                      type="email"
                                                      value={inviteEmail}
                                                      onChange={onChangeInviteEmail}
                                                      autoComplete="off"
                                                      required
                                                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                                      placeholder="Member email"
                                                   />
                                                </div>
                                                <div>
                                                   {/* Select  */}
                                                   <label htmlFor="underline_select" className="text-gray-400">
                                                      Roles
                                                   </label>
                                                   <select
                                                      id="underline_select"
                                                      className="block py-3 pl-3 w-full text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-gray-900 dark:border-gray-300 focus:outline-none focus:ring-0 focus:border-indigo-500 peer"
                                                      onChange={(e) => {
                                                         const inviteRole = e.target.value;
                                                         setInviteRole(inviteRole);
                                                      }}
                                                   >
                                                      <option defaultValue={''}>Choose a role</option>
                                                      <option value="Member">Member</option>
                                                      <option value="Guest">Guest</option>
                                                   </select>
                                                </div>
                                             </div>

                                             <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                                <button
                                                   className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                   type="button"
                                                   onClick={() => setShowModal(false)}
                                                >
                                                   Close
                                                </button>
                                                <button
                                                   className="bg-indigo-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                   type="submit"
                                                >
                                                   Invite
                                                </button>
                                             </div>
                                          </form>
                                       </div>
                                       {/*footer*/}
                                    </div>
                                 </div>
                              </div>
                              <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                           </>
                        ) : null}
                     </div>
                  </div>
               </div>


               <div className="mt-2 flex flex-row items-center space-x-5">
                  <ProjectMenu>
                     <ProjectItem
                        to={'/projects/' + id + '/requirements'}
                        title="Requirements"
                        icon={<FontAwesomeIcon icon={faTasks} />}
                     />
                  
                     <ProjectItem
                        to={'/projects/' + id + '/settings'}
                        title="Settings"
                        icon={<FontAwesomeIcon icon={faGear}/>}
                        />
                     <ProjectItem
                        to={'/projects/' + id + '/chatroom'}
                        title="Chat room"
                        icon={<FontAwesomeIcon icon={faGear} />}
                     />
                        <ProjectItem
                        to={'/projects/' + id + '/requirements'}
                        title=""
                        icon={<FontAwesomeIcon icon={faRecycle} />}
                     />
                     <ProjectItem
                        to={'/projects/' + id + '/requirements' }
                        title=""
                        icon={<FontAwesomeIcon icon={faGear} />}
                     />
                  </ProjectMenu>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Projects;
