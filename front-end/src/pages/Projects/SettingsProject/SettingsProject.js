import { faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import RoleView from '../../../components/RoleView/RoleView';

function SettingsProject() {
   let navigate = useNavigate();
   const API_URL = 'https://localhost:5001/api/';
   const [user, setUser] = useState('');
   const [listGroupUser, setListGroupUser] = useState([]);
   const [showModal, setShowModal] = useState(false);
   const [showModalDelete, setShowModalDelete] = useState(false);
   const [showModalLeave, setShowModalLeave] = useState(false);
   const [showUserDelete, setShowUserDelete] = useState({
      show: false,
      id: null,
   });
   const [groupCreatorID, setgroupCreatorID] = useState('');
   const [nameGroup, setNameGroup] = useState('');
   const [descGroup, setDescGroup] = useState('');
   const [listGroupRole, setListGroupRole] = useState('');
   //ID GROUP
   const { id } = useParams();

   useEffect(() => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
         setUser(user);
      } else {
         navigate('/accessdenied');
      }
   }, []);

   // console.log(user)

   // Get group id for list user
   useEffect(() => {
      axios
         .get(API_URL + `Group/${id}`, {})
         .then((response) => {
            console.log(response.data);
            setListGroupUser(response.data.listUser.$values);
            setgroupCreatorID(response.data.groupCreatorID);
            setNameGroup(response.data.name);
            setDescGroup(response.data.description);
            setListGroupRole(response.data.listURG.$values);
            // console.log(response.data);
         })
         .catch((error) => {
            console.log(error.response.data);
         });
   }, [id, showUserDelete]);

   const handleDeleteProject = (e) => {
      e.preventDefault();
      axios
         .delete(API_URL + `Group/${id}?currentUserID=${user.id}`, {})
         .then((response) => {
            console.log(response.data);

            setShowModalDelete(false);
            setTimeout(() => {
               navigate('/');
            }, 2000);
            const notify = () => {
               toast.success(response.data);
            };
            notify();
         })
         .catch((error) => {
            console.log(error.response.data);
            const notify = () => {
               toast.error(error.response.data);
            };
            notify();
            setShowModalDelete(false);
         });
   };

   const handleDeleteUser = (id) => {
      console.log(id);
      setShowUserDelete({
         show: true,
         id,
      });
   };

   const handleDeleteTrue = () => {
      if (showUserDelete.show && showUserDelete.id) {
         axios
            .delete(API_URL + `Group/DeleteUser?id=${showUserDelete.id}&groupID=${id}&currentUserID=${user.id}`, {})
            .then((response) => {
               const notify = () => {
                  toast.success(response.data);
               };
               notify();
               setShowUserDelete({
                  show: false,
                  id: null,
               });
               // navigate('/');
            })
            .catch((error) => {
               console.log(error.response.data);
               const notify = () => {
                  toast.error(error.response.data);
               };
               notify();
            });
      }
   };

   const handleChangeNameGroup = (e) => {
      const nameGroup = e.target.value;
      setNameGroup(nameGroup);
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      return axios
         .put(API_URL + `Group?id=${id}`, {
            name: nameGroup,
            userID: user.id,
            description: descGroup,
         })
         .then((response) => {
            const notify = () => {
               toast.success('Change group name succes');
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

   const handleLeaveGroup = (e) => {
      e.preventDefault();
      axios
         .delete(API_URL + `Group/LeaveGroup?groupID=${id}&userID=${user.id}`, {})
         .then((response) => {
            console.log(response.data);

            setShowModalLeave(false);
            setTimeout(() => {
               navigate('/');
            }, 2000);
            const notify = () => {
               toast.success(response.data);
            };
            notify();
         })
         .catch((error) => {
            console.log(error.response.data);
            const notify = () => {
               toast.error(error.response.data);
            };
            notify();
            setShowModalLeave(false);
         });
   }

   return (
      <div>
         <ToastContainer />
         <div className="bg-gradient-to-br from-purple-100 to-blue-100 shadow-md rounded-md">
            <div className="flex items-center justify-center p-12">
               <div>
                  <h2 className="text-gray-600 font-semibold">Project Settings</h2>
               </div>
               <div className="mx-auto w-full max-w-[750px]">
                  <form onSubmit={handleSubmit}>
                     <div className="mb-5">
                        <label htmlFor="name" className="mb-3 block text-base font-medium text-[#07074D]">
                           Project Name
                        </label>
                        <input
                           type="text"
                           name="name"
                           id="name"
                           value={nameGroup}
                           onChange={handleChangeNameGroup}
                           autoComplete="off"
                           placeholder="Project name"
                           className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                        />
                     </div>
                     <div className="mb-5">
                        <label htmlFor="message" className="mb-3 block text-base font-medium text-[#07074D]">
                           Description
                        </label>
                        <textarea
                           rows="4"
                           name="message"
                           autoComplete="off"
                           id="message"
                           value={descGroup}
                           onChange={(e) => setDescGroup(e.target.value)}
                           placeholder="Your group Description"
                           className="w-full resize-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                        ></textarea>
                     </div>
                     <div>
                        <button className="hover:shadow-form rounded-md bg-[#6A64F1] py-3 px-8 text-base font-semibold text-white outline-none">
                           Submit
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         </div>

         <div className="mt-5 bg-gradient-to-br from-purple-100 to-blue-100 shadow-md p-8 rounded-md w-full">
            <div className=" flex items-center justify-between pb-6">
               <div>
                  <h2 className="text-gray-600 font-semibold">Manage team</h2>
                  <span className="text-xs">All member</span>
               </div>
               <div className="flex items-center justify-between">
                  <div className="lg:ml-40 ml-10 space-x-8">
                     <button
                        onClick={() => setShowModal(true)}
                        className="bg-indigo-600 px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer"
                     >
                        View roles
                     </button>
                  </div>
                  <div className="ml-2 space-x-8">
                     <button
                        onClick={() => setShowModalLeave(true)}
                        className="bg-rose-500 px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer"
                     >
                        Leave group
                     </button>
                  </div>
               </div>
            
            </div>
            <div>
               <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                  <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                     <table className="min-w-full leading-normal">
                        <thead>
                           <tr>
                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                 Name
                              </th>
                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                 Email
                              </th>
                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                 Role
                              </th>

                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                 Status
                              </th>
                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                 Delete
                              </th>
                           </tr>
                        </thead>
                        <tbody>
                           {listGroupUser?.map((user, index) => (
                              <tr key={index}>
                                 <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <div className="flex items-center">
                                       <div className="flex-shrink-0 w-10 h-10">
                                          <img
                                             className="w-full h-full rounded-full"
                                             src="https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745"
                                             alt=""
                                          />
                                       </div>
                                       <div className="ml-3">
                                          <p className="text-gray-900 whitespace-no-wrap">{user.userName}</p>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{user.email}</p>
                                 </td>
                                 <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">
                                       {listGroupRole.map((role, index) =>
                                          role.userID == user.id ? (
                                             <div key={index}>
                                                {(() => {
                                                   switch (role.roleID) {
                                                      case 1:
                                                         return 'Owner';
                                                      case 2:
                                                         return 'Admin';
                                                      case 3:
                                                         return 'Member';
                                                      case 4:
                                                         return 'Guest';
                                                      default:
                                                         return null;
                                                   }
                                                })()}
                                             </div>
                                          ) : null,
                                       )}
                                    </p>
                                 </td>

                                 <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {user.isActive ? (
                                       <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                          <span
                                             aria-hidden
                                             className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                                          ></span>
                                          <span className="relative">Active</span>
                                       </span>
                                    ) : (
                                       <span className="relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight">
                                          <span
                                             aria-hidden
                                             className="absolute inset-0 bg-red-200 opacity-50 rounded-full"
                                          ></span>
                                          <span className="relative">Inactive</span>
                                       </span>
                                    )}
                                 </td>

                                 <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {!(groupCreatorID == user.id) ? (
                                       <button
                                          className="bg-rose-500 px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer"
                                          onClick={() => handleDeleteUser(user.id)}
                                       >
                                          Remove User
                                       </button>
                                    ) : null}
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
         </div>

         <div className="mt-5 bg-slate-50 shadow-md p-8 rounded-md w-full">
            <div className=" flex items-center justify-between pb-6">
               <div>
                  <h2 className="text-gray-600 font-semibold">Delete this project</h2>
                  <span className="text-xs">
                     Once you delete this project, all entries inside will be removed as well and you can't get it back.
                     Please be certain.
                  </span>
               </div>
               <div className="flex items-center justify-between">
                  <div className="lg:ml-40 ml-10 space-x-8">
                     <button
                        className="bg-rose-500 px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer"
                        onClick={() => setShowModalDelete(true)}
                     >
                        Delete project
                     </button>
                  </div>
               </div>
            </div>
         </div>
         {/* Modal view roles */}
         {showModal ? (
            <>
               <RoleView setShowModal={setShowModal} />
            </>
         ) : null}

         {/* Modal view delete project */}
         {showModalDelete ? (
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
                              onClick={handleDeleteProject}
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
         

         {showModalLeave ? (
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
                              onClick={() => setShowModalLeave(false)}
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
                              Are you sure you want to leave this group ?
                           </p>
                        </div>
                        {/*Button*/}
                        <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                           <button
                              className="bg-rose-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                              type="button"
                              onClick={handleLeaveGroup}
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

         {showUserDelete.show == true ? (
            <>
               <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                  <div className="relative w-auto my-6 mx-auto max-w-3xl">
                     {/*content*/}
                     <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {/*header*/}
                        <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                           <h3 className="text-3xl font-semibold">Delete member</h3>
                           <button
                              className="p-1 ml-auto bg-transparent border-3 border-red-600 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                              onClick={() => setShowUserDelete(false)}
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
                              Are you sure you want to permanently remove this user ?
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

export default SettingsProject;
