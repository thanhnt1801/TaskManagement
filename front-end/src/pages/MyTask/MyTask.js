import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { toast } from 'react-toastify';

function MyTask() {
   const API_URL = 'https://localhost:5001/api/';
   let navigate = useNavigate();
   const [items, setItems] = useState([]);
   const [taskUser, setTaskUser] = useState([]);
   const [hubConnection, setHubConnection] = useState(null);

   useEffect(() => {
      const items = JSON.parse(localStorage.getItem('user'));
      if (items) {
         setItems(items);
      } else {
         navigate('/accessdenied');
      }
   }, []);

   useEffect(() => {
      axios
         .get(API_URL + `Task/GetUserTask?userID=${items.id}`, {})
         .then((response) => {
            console.log(response.data.task);
            setTaskUser(response.data.task.$values);
         })
         .catch((error) => {
            console.log(error.response);
         });
   }, [items.id]);

   useEffect(() => {
      const hubConnection = new HubConnectionBuilder()
         .withUrl('https://localhost:5001/hubs/notifications')
         .configureLogging(LogLevel.Information)
         .withAutomaticReconnect()
         .build();

      setHubConnection(hubConnection);

      hubConnection.start().then((result) => {
         // hubConnection.on('RecieveNotificationResult', (result) => {
         //    const notify = () => {
         //                   toast.success(result);
         //                };
         //    notify()
         // })
         let string1 = result;
         let string2 = items.id
       
            hubConnection.on('RecieveNotificationResult', (result) => {
               if (string1 == string2) {
               const notify = () => {
                  toast.success(result);
               };
               notify();
            }else {
               console.log("loi");
            }
            });
      });
   }, []);

   function Div({ task }) {
      var taskDueDate = moment(task.dueDate).format('MMMM Do YYYY, h:mm:ss a');
      return (
         <div className="">
            <div className="w-96 mr-10 max-w-md">
               <Link to={`/project/${task.id}/requirements`}>
                  <div className="bg-gradient-to-br from-purple-100 to-blue-100 shadow-md hover:bg-gradient-to-bl hover:from-purple-100   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md mb-6">
                     <div className="p-4">
                        <div className="">
                           <div className="">
                              <h3 className="text-md leading-7 mb-5 text-gray-900 font-bold sm:truncate">
                                 {task.name}
                              </h3>
                           </div>
                           <div className="flex flex-row items-center">
                              {' '}
                              <FontAwesomeIcon icon={faCalendar} color="#447AF5" className="mr-2" />
                              <div>Due date</div>: {taskDueDate}
                           </div>
                        </div>
                     </div>
                  </div>
               </Link>
            </div>
         </div>
      );
   }

   return (
      <div className="grid grid-cols-2 gap-2">
         <div className=" ml-96 mt-20 justify-center flex flex-wrap h-[860px] overflow-y-auto">
            {taskUser.map((task, index) => (
               <Div task={task} key={index}></Div>
            ))}
         </div>
         <div className="mt-20">
            <h1 className="text-3xl font-medium text-sky-400 mb-5">Notification</h1>
            <div className=" flex flex-wrap bg-slate-700 pt-10 pl-10 mr-10 rounded-lg">
               {taskUser.map((task, index) => (
                  <Div task={task} key={index}></Div>
               ))}
            </div>
         </div>
      </div>
   );
}

export default MyTask;
