import axios from 'axios';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'https://localhost:5001/api/';

const getGroup = (groupName, groupUserID) => {
   return axios
         .post(
            API_URL + 'Group',
            {
               name: groupName,
               userID: groupUserID,
            },
            {
               headers: {
                  Accept: 'application/json, text/plain',
                  'Content-Type': 'application/json;charset=UTF-8',
               },
            },
         )
         .then((response) => {
            // const notify = () =>  toast.success(response.data.id);
            const notify = () =>  toast.success("Create new group success");
            notify();
            console.log(response);
         })
         .catch((error) => {
            const notify = () => {
               toast.warning(error.response.data);
            };
            notify();
         });
};

const GroupService = {
    getGroup,
};

export default GroupService;
