import { faGear, faHome, faSignOut, faTasks, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import Menu from './Menu/Menu';
import MenuItem from './Menu/MenuItem';
import MenuPopper from '../Popper/Menu/MenuPopper';
import axios from 'axios';
import GroupService from '../../services/group.service';

function Sidebar() {
   const API_URL = 'https://localhost:5001/api/';
   const [items, setItems] = useState([]);
   const [listGroup, setListGroup] = useState([]);
   const [showModal, setShowModal] = useState(false);
   const [groupName, setGroupName] = useState('');
   const [groupUserID, setGroupUserID] = useState('');

   // useEffect(() => {
   //    const items = JSON.parse(localStorage.getItem('user'));
   //    if (items) {
   //       setItems(items);
   //    }
   // }, []);


   useEffect(() => {
      const items = JSON.parse(localStorage.getItem('user'));
      if (items) {
         setItems(items);
      }
      axios
         .get(API_URL + `Group/GetGroups?userID=${items.id}`, {
         })
         .then((response) => {
            console.log(listGroup)
            setListGroup(response.data.$values);
         })
         .catch((error) => {
            console.log(error.response.data);
         });
   }, [showModal]);


   // console.log(listGroup)
   // console.log(items.id);

   const onChangeGroupName = (e) => {
      const groupName = e.target.value;
      setGroupName(groupName);
      setGroupUserID(items.id);
      console.log(groupUserID);
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      GroupService.getGroup(groupName, groupUserID).then(() => {
         setShowModal(false);
      });
   };

   const userMenu = [
      {
         icon: <FontAwesomeIcon icon={faUser} />,
         title: 'Center',
         to: '/',
      },
      {
         icon: <FontAwesomeIcon icon={faSignOut} />,
         title: 'Log out',
         to: '/login',
         separate: true,
         logout: true,
      },
   ];

   // const notify = () => toast("Wow so easy!");

   return (
      <>
         {/* <button onClick={notify}>Notify!</button> */}
         <ToastContainer />
         <aside className="w-96 h-screen p-8 fixed -ml-4 bg-gradient-to-br from-purple-100 to-blue-100  rounded-md">
            <div className="flex items-center space-x-4 mb-5">
               <MenuPopper items={userMenu}>
                  <img
                     className="w-12 h-12 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
                     src={items.picture || 'https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745'}
                     alt="Bordered avatar"
                  />
               </MenuPopper>
               <div className="space-y-1 font-bold text-gray-600 first-letter:uppercase">
                  <div>{items.userName || items.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{items.email}</div>
               </div>
            </div>
            <hr className="border-gray-500 mb-2" />
            <Menu>
               <MenuItem title="Home" to="/" icon={<FontAwesomeIcon icon={faHome} />} />
               {/* <MenuItem title="My Task" to="/mytask" icon={<FontAwesomeIcon icon={faTasks} />} /> */}
               <hr className="border-gray-500 mb-2 mt-2" />
               <label className='block text-gray-400 text-sm font-bold mb-2'>Projects </label>
               {listGroup?.map((group, index) =>
                   group.isActive ? (
                     <MenuItem
                        key={index}
                        title={group.name}
                        to={'/projects/' + group.id +'/requirements'}
                        image="https://www.creativefabrica.com/wp-content/uploads/2019/02/Group-Icon-by-Kanggraphic.jpg"
                     />
                  ) : null,
               )}
            </Menu>

            <button
               className="text-white bg-gradient-to-br absolute inset-x-6 bottom-3 from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-bold  rounded-lg text-md px-22 py-6 text-center"
               type="button"
               onClick={() => setShowModal(true)}
            >
               Create New Group
            </button>
            {showModal ? (
               <>
                  <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
                     <div className="relative w-auto my-6 mx-auto max-w-3xl">
                        {/* Dòng này max w */}
                        {/*content*/}
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                           {/*header*/}
                           <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                              <h3 className="text-3xl font-semibold text-indigo-500">Create Group</h3>
                           </div>
                           {/*body*/}
                           <div className="relative p-6 flex-auto">
                              <p className="my-4 text-slate-400 text-md leading-relaxed">
                                 Please provide a reasonable project name in order to identify your project.
                              </p>
                              <form className="space-y-6" onSubmit={handleSubmit}>
                                 <input type="hidden" name="remember" value="true" />
                                 <div className="rounded-md shadow-sm -space-y-px">
                                    <div>
                                       <label htmlFor="groupName" className="sr-only">
                                          Group Name
                                       </label>
                                       <input
                                          id="groupName"
                                          value={groupName}
                                          onChange={onChangeGroupName}
                                          name="groupName"
                                          type="text"
                                          autoComplete="off"
                                          required
                                          className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                          placeholder="Group name"
                                       />
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
            
         </aside>
      </>
   );
}

export default Sidebar;
