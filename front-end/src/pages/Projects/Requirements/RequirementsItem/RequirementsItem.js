import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { faArrowRight, faArrowTrendDown, faBars, faPeopleGroup, faTags } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { faCalendar, faFile } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';
import parse from 'html-react-parser';

function RequirementsItem() {
   const API_URL = 'https://localhost:5001/api/';
   let navigate = useNavigate();
   const [user, setUser] = useState('');
   const [openTab, setOpenTab] = useState();
   const [listUser, setListUser] = useState([]);
   const [listUserRender, setListUserRender] = useState([]);
   const [listUserRenderDefault, setListUserRenderDefault] = useState([]);
   const [taskName, setTaskName] = useState([]);
   const [memberAssign, setMemberAssign] = useState('');
   const [priorityID, setpriorityID] = useState();
   const [dueDate, setDueDate] = useState();
   const [description, setDescription] = useState();
   const [file, setFile] = useState('');
   // Label
   const [showDropdown, setShowDropdown] = useState(false);
   const [label, setLabel] = useState('');
   const [listLabel, setlistLabel] = useState([]);
   const [idLabel, setIdLabel] = useState();
   const [isDelete, setIsDelete] = useState(false);

   const handleFile = (e) => {
      setFile(e.target.files[0]);
   };

   const { groupid } = useParams();
   const { id } = useParams();

   console.log(idLabel);

   const html = listUserRender.description;

   //Get time current
   var time4 = moment().format();

   //Lay selected list user assign
   useEffect(() => {
      const user = JSON.parse(localStorage.getItem('user'));
      setUser(user);
      axios
         .get(API_URL + `Group/${groupid}`, {})
         .then((response) => {
            // console.log(response.data);
            setListUser(response.data.listUser.$values);
         })
         .catch((error) => {
            console.log(error.response.data);
         });
   }, [groupid]);

   useEffect(() => {
      // get List label
      axios
         .get(API_URL + `Task/GetLabelsInGroup?groupID=${groupid}`, {})
         .then((response) => {
            // console.log(response.data.$values);
            setlistLabel(response.data.$values);
            setIsDelete(false)
         })
         .catch((error) => {
            console.log(error.response.data);
         });
   }, [showDropdown,isDelete]);

   useEffect(() => {
      axios
         .get(API_URL + `Task/${id}`, {})
         .then((response) => {
            console.log(response.data);
            setListUserRender(response.data);
            setListUserRenderDefault(response.data);
         })
         .catch((error) => {
            console.log(error.response.data);
         });
   }, []);

   const handleSubmit = (e) => {
      const formData = new FormData();
      formData.append('File', setFile);
      e.preventDefault();
      axios
         .put(
            API_URL + `Task?taskID=${id}&currentUserID=${user.id}&groupID=${groupid}`,
            {
               name: taskName,
               assignTo: memberAssign,
               dueDate,
               priorityID,
               description: description,
               lastModifiedBy: user.id,
               lastModifiedAt: time4,
               // attachment: file,
            },
            {
               // headers: {
               //    "Content-Type": "multipart/form-data",
               //  },
            },
         )
         .then((response) => {
            console.log(response.data);
            const notify = () => {
               toast.success('Update Task success');
            };
            notify();
            setTimeout(() => {
               navigate(`/projects/${groupid}/requirements`);
            }, 2000);
         })
         .catch((error) => {
            console.log(error.response.data.errors);
            const notify = () => {
               toast.warning(error.response.data.errors);
            };
            notify();
         });
   };

   const handleAddLabel = (e) => {
      e.preventDefault();
      axios
         .post(API_URL + `Task/CreateLabel?taskID=${id}&groupID=${groupid}`, {
            name: label,
         })
         .then((response) => {
            console.log(response.data);
            setShowDropdown(false);
            const notify = () => {
               toast.success(response.data);
            };
            notify();
         })
         .catch((error) => {
            console.log(error.response.data);
            setShowDropdown(false);
            const notify = () => {
               toast.warning(error.response.data);
            };
            notify();
         });
   };


   // Còn xóa
   const handleDeleteLabel = (e) => {
      e.preventDefault();
      axios
         .delete(API_URL + `Task/DeleteLabel?labelID=${idLabel}`, {})
         .then((response) => {
            console.log(response.data);
            const notify = () => {
               toast.success(response.data);
            };
            notify();
            setIsDelete(true)
         })
         .catch((error) => {
            console.log(error.response.data);
            const notify = () => {
               toast.warning(error.response.data);
            };
            notify();
         });
   };

   // Set state co van de khi sai function
   // function Dropdown() {
   // }

   return (
      <div className="grid grid-cols-4 gap-4 mt-5 ">
         <div className="col-span-1"></div>
         <div className="col-span-2">
            {/*BreadCumb*/}
            <nav
               className="flex px-5 py-3 text-indigo-700 border border-gray-200 rounded-lg bg-gray-50 "
               aria-label="Breadcrumb"
            >
               <ol className="inline-flex items-center space-x-1 md:space-x-3">
                  <li className="inline-flex items-center">
                     <a
                        href="/"
                        className="inline-flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-900 "
                     >
                        <svg
                           className="w-4 h-4 mr-2"
                           fill="currentColor"
                           viewBox="0 0 20 20"
                           xmlns="http://www.w3.org/2000/svg"
                        >
                           <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                        </svg>
                        Home
                     </a>
                  </li>
                  <li>
                     <div className="flex items-center">
                        <svg
                           className="w-6 h-6 text-gray-400"
                           fill="currentColor"
                           viewBox="0 0 20 20"
                           xmlns="http://www.w3.org/2000/svg"
                        >
                           <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                           ></path>
                        </svg>
                        <Link
                           to={`/projects/${groupid}/requirements`}
                           className="ml-1 text-sm font-medium text-indigo-400 hover:text-indigo-900 md:ml-2 "
                        >
                           Projects
                        </Link>
                     </div>
                  </li>
                  <li aria-current="page">
                     <div className="flex items-center">
                        <svg
                           className="w-6 h-6 text-gray-400"
                           fill="currentColor"
                           viewBox="0 0 20 20"
                           xmlns="http://www.w3.org/2000/svg"
                        >
                           <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                           ></path>
                        </svg>
                        <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
                           Task Editting
                        </span>
                     </div>
                  </li>
               </ol>
            </nav>
            <div className="">
               {/*header*/}
               <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold text-indigo-500 ">Edit task</h3>
               </div>
               {/*body*/}
               <div className="relative p-6 flex-auto">
                  <form className="space-y-2" onSubmit={handleSubmit}>
                     <input type="hidden" name="remember" value="true" />
                     <div className="rounded-md shadow-sm -space-y-px">
                        {/* Name */}
                        <div>
                           <input
                              id="taskName"
                              name="taskName"
                              type="text"
                              autoComplete="off"
                              required
                              defaultValue={listUserRender.taskName}
                              onChange={(e) => setTaskName(e.target.value)}
                              className="appearance-none my-2 relative block w-full px-4 py-5 mb-5 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-lg"
                              placeholder="Task name"
                           />
                        </div>

                        {/* Select  */}
                        <div>
                           <label htmlFor="underline_select" className="text-gray-800 font-bold text-2xl">
                              <FontAwesomeIcon icon={faPeopleGroup} color="#4F46E5" /> Assign to
                           </label>
                           <select
                              id="underline_select"
                              className="block py-3 pl-3 my-7 w-full text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-gray-900 dark:border-gray-300 focus:outline-none focus:ring-0 focus:border-indigo-500 peer"
                              onChange={(e) => {
                                 const memberAssign = e.target.value;
                                 setMemberAssign(memberAssign);
                              }}
                           >
                              <option value={''}>Choose member</option>
                              {listUser.map((user, index) => (
                                 <option value={user.id} key={index}>
                                    {user.userName}
                                 </option>
                              ))}
                           </select>
                        </div>

                        {/* priority  */}
                        <div className="flex flex-wrap">
                           <div className="w-full mt-5">
                              <label className="text-gray-800 font-bold text-2xl">
                                 <FontAwesomeIcon icon={faArrowTrendDown} color="#4F46E5" /> PRIORITY LEVEL (Highest to
                                 Lowest)
                              </label>
                              <ul className="flex my-7 list-none flex-wrap pt-3 pb-4 flex-row" role="tablist">
                                 <li className="-mb-px  last:mr-0 flex-auto text-center">
                                    <a
                                       className={
                                          'text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ' +
                                          (openTab === 1 ? 'text-white bg-indigo-600' : 'text-indigo-600 bg-white')
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
                                 <FontAwesomeIcon icon={faArrowRight} className="self-center mx-2" color="#A7ADB8" />
                                 <li className="-mb-px  last:mr-0 flex-auto text-center">
                                    <a
                                       className={
                                          'text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ' +
                                          (openTab === 2 ? 'text-white bg-indigo-600 ' : 'text-indigo-600 bg-white')
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
                                 <FontAwesomeIcon icon={faArrowRight} className="self-center mx-2" color="#A7ADB8" />
                                 <li className="-mb-px  last:mr-0 flex-auto text-center">
                                    <a
                                       className={
                                          'text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ' +
                                          (openTab === 3 ? 'text-white bg-indigo-600' : 'text-indigo-600 bg-white')
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
                                 <FontAwesomeIcon icon={faArrowRight} className="self-center mx-2" color="#A7ADB8" />
                                 <li className="-mb-px  last:mr-0 flex-auto text-center">
                                    <a
                                       className={
                                          'text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ' +
                                          (openTab === 4 ? 'text-white bg-indigo-600' : 'text-indigo-600 bg-white')
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
                                 <FontAwesomeIcon icon={faArrowRight} className="self-center mx-2" color="#A7ADB8" />
                                 <li className="-mb-px  last:mr-0 flex-auto text-center">
                                    <a
                                       className={
                                          'text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ' +
                                          (openTab === 5 ? 'text-white bg-indigo-600' : 'text-indigo-600 bg-white')
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

                        {/* Due Date */}
                        <div>
                           <label htmlFor="duedate" className="text-gray-800 font-bold text-2xl">
                              <FontAwesomeIcon icon={faCalendar} color="#4F46E5" /> DUE DATE
                           </label>
                           <input
                              id="duedate"
                              name="duedate"
                              type="datetime-local"
                              autoComplete="off"
                              defaultValue={listUserRender.dueDate}
                              onChange={(e) => setDueDate(e.target.value)}
                              className="appearance-none my-7 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                           />
                        </div>

                        {/* Description */}
                        <div>
                           <label htmlFor="description" className="text-gray-800 font-bold text-2xl mb-5">
                              <FontAwesomeIcon icon={faBars} color="#4F46E5" /> DESCRIPTION
                           </label>
                           <CKEditor
                              editor={ClassicEditor}
                              className="CKEditor"
                              data={listUserRender.description}
                              onChange={(e, editor) => {
                                 const desc = editor.getData();
                                 setDescription(desc);
                              }}
                           />
                        </div>
                        {/* File */}
                        <div>
                           <label htmlFor="file" className="text-gray-800 font-bold text-2xl mb-5">
                              <FontAwesomeIcon icon={faFile} color="#4F46E5" /> Attachments
                           </label>
                           <input
                              className="block my-7 w-full text-sm  text-gray-600 bg-gray-50 rounded-md border p-5 border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400"
                              id="file"
                              type="file"
                              name="file"
                              onChange={handleFile}
                           ></input>
                        </div>
                     </div>

                     {/* { parse(html)} */}

                     <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                        <button
                           className="bg-indigo-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                           type="submit"
                        >
                           Submit
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         </div>

         {/* Label */}
         <div className="text-2xl items-center">
            <div className="relative inline-block text-left mb-20">
               <div>
                  <button
                     type="button"
                     className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                     id="menu-button"
                     aria-expanded="true"
                     aria-haspopup="true"
                     onClick={(e) => setShowDropdown(!showDropdown)}
                  >
                     Label Options
                     <svg
                        className="-mr-1 ml-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                     >
                        <path
                           fillRule="evenodd"
                           d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                           clipRule="evenodd"
                        />
                     </svg>
                  </button>
               </div>
               {showDropdown && (
                  <div
                     className="origin-top-right absolute left-0 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                     role="menu"
                     aria-orientation="vertical"
                     aria-labelledby="menu-button"
                     tabindex="-1"
                  >
                     <form onSubmit={handleAddLabel}>
                        <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300">
                           Label
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
                              type="text"
                              id="label"
                              onChange={(e) => setLabel(e.target.value)}
                              className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="Create label"
                           />
                           <button
                              type="submit"
                              className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                           >
                              +
                           </button>
                        </div>
                     </form>
                  </div>
               )}
            </div>

            <div>
               <FontAwesomeIcon icon={faTags} color="#4F46E5" />  Available Label
            </div>
            <div className="flex flex-wrap flex-auto justify-cente  p-7">
               {listLabel.map((label, index) => (
                  <div
                     key={index}
                     className="group py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-white flex bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700  focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 "
                  >
                     {label.name}
                     <form onSubmit={handleDeleteLabel}>
                        <button className="hidden group-hover:block ml-2 text-white bg-red-500 rounded-full text-center px-2" 
                           type='submit'
                           onClick={(e) => setIdLabel(label.id)}>
                              x
                        </button>
                     </form>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}

export default RequirementsItem;
