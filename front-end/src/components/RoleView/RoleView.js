import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function RoleView({setShowModal}) {
    return ( <>
    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
                  <div className="relative w-auto my-6 mx-auto max-w-3xl">
                     {/*content*/}
                     <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {/*header*/}
                        <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                           <h3 className="text-3xl font-semibold text-indigo-500">List roles</h3>
                        </div>
                        {/*body*/}
                        <div className="relative p-6 flex-auto">
                            {/* Project Roles */}
                           <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                 <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gradient-to-br from-purple-100 to-blue-100 dark:text-gray-900">
                                    <tr>
                                       <th scope="col" className="px-6 py-3">
                                          Project
                                       </th>
                                       <th scope="col" className="px-6 py-3">
                                          Owner
                                       </th>
                                       <th scope="col" className="px-6 py-3">
                                          Admin
                                       </th>
                                       <th scope="col" className="px-6 py-3">
                                          Member
                                       </th>
                                       <th scope="col" className="px-6 py-3">
                                          Guest
                                       </th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    <tr className="bg-white border-b dark:bg-gradient-to-br from-purple-50 to-blue-50">
                                       <th
                                          scope="row"
                                          className="px-6 py-4 font-medium text-gray-900 dark:text-dark whitespace-nowrap"
                                       >
                                          Delete project
                                       </th>
                                       <td className="px-6 py-4 text-center"><FontAwesomeIcon icon={faCheckCircle} color="green"/></td>
                                       <td className="px-6 py-4 text-center"></td>
                                       <td className="px-6 py-4 text-center"></td>
                                       <td className="px-6 py-4 text-center"></td>
                                    </tr>
                                    <tr className="bg-white border-b dark:bg-gradient-to-br from-purple-50 to-blue-50">
                                       <th
                                          scope="row"
                                          className="px-6 py-4 font-medium text-gray-900 dark:text-dark whitespace-nowrap"
                                       >
                                          Edit project
                                       </th>
                                       <td className="px-6 py-4 text-center"><FontAwesomeIcon icon={faCheckCircle} color="green"/></td>
                                       <td className="px-6 py-4 text-center"><FontAwesomeIcon icon={faCheckCircle} color="green"/></td>
                                       <td className="px-6 py-4 text-center"></td>
                                       <td className="px-6 py-4 text-center"></td>
                                    </tr>
                                 </tbody>
                              </table>
                           </div>

                           <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
                              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                 <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gradient-to-br from-purple-100 to-blue-100 dark:text-gray-900">
                                    <tr>
                                       <th scope="col" className="px-6 py-3">
                                          User manage
                                       </th>
                                       <th scope="col" className="px-6 py-3">
                                          Owner
                                       </th>
                                       <th scope="col" className="px-6 py-3">
                                          Admin
                                       </th>
                                       <th scope="col" className="px-6 py-3">
                                          Member
                                       </th>
                                       <th scope="col" className="px-6 py-3">
                                          Guest
                                       </th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    <tr className="bg-white border-b dark:bg-gradient-to-br from-purple-50 to-blue-50 ">
                                       <th
                                          scope="row"
                                          className="px-6 py-4 font-medium text-gray-900 dark:text-dark whitespace-nowrap"
                                       >
                                          Assign role
                                       </th>
                                       <td className="px-6 py-4 text-center"><FontAwesomeIcon icon={faCheckCircle} color="green"/></td>
                                       <td className="px-6 py-4 text-center"></td>
                                       <td className="px-6 py-4 text-center"></td>
                                       <td className="px-6 py-4 text-center"></td>
                                    </tr>
                                    <tr className="bg-white border-b dark:bg-gradient-to-br from-purple-50 to-blue-50">
                                       <th
                                          scope="row"
                                          className="px-6 py-4 font-medium text-gray-900 dark:text-dark whitespace-nowrap"
                                       >
                                          Invite member
                                       </th>
                                       <td className="px-6 py-4 text-center"><FontAwesomeIcon icon={faCheckCircle} color="green"/></td>
                                       <td className="px-6 py-4 text-center"><FontAwesomeIcon icon={faCheckCircle} color="green"/></td>
                                       <td className="px-6 py-4 text-center"><FontAwesomeIcon icon={faCheckCircle} color="green"/></td>
                                       <td className="px-6 py-4 text-center"></td>
                                    </tr>
                                    <tr className="bg-white border-b dark:bg-gradient-to-br from-purple-50 to-blue-50">
                                       <th
                                          scope="row"
                                          className="px-6 py-4 font-medium text-gray-900 dark:text-dark whitespace-nowrap"
                                       >
                                          Remove member
                                       </th>
                                       <td className="px-6 py-4 text-center"><FontAwesomeIcon icon={faCheckCircle} color="green"/></td>
                                       <td className="px-6 py-4 text-center"><FontAwesomeIcon icon={faCheckCircle} color="green"/></td>
                                       <td className="px-6 py-4 text-center"></td>
                                       <td className="px-6 py-4 text-center"></td>
                                    </tr>
                                 </tbody>
                              </table>
                           </div>
                           <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                              <button
                                 className="text-red-500 background-transparent font-bold uppercase px-5 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                 type="button"
                                 onClick={() => setShowModal(false)}
                              >
                                 Close
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="opacity-25 fixed inset-0 z-40 bg-black"></div></> );
}

export default RoleView;