import axios from 'axios';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'https://localhost:5001/api/';

const register = (email, userName, password, confirmPassword) => {
   return axios
      .post(API_URL + 'Register/register', {
         email,
         userName,
         password,
         confirmPassword,
      })
      .then((response) => {
         const notify = () => {
            toast.success(response.data);
         };
         notify();
         localStorage.setItem('userRegister', "registered");
      })
      .catch((error) => {
         console.log(error.response.data);
         const notify = () => {
            toast.warning(error.response.data);
         };
         notify();
      });
};

const login = (email, password) => {
   return axios
      .post(API_URL + 'Login/login', {
         email,
         password,
      })
      .then((response) => {
         const notify = () => {
            toast.success("Welcome " + response.data.userName);
         };
         notify();
         console.log(response.data);
         if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
         }
         return response.data;
      })
      .catch((error) => {
         console.log(error.response.data);
         const notify = () => {
            toast.warning(error.response.data);
         };
         notify();
      });
};

const forgotPassword = (email) => {
   return axios({
      method: 'post',
      url: `https://localhost:5001/api/Login/forgot-password`,
      params: {
         email,
      },
   })
      .then((res) => {
         const notify = () => {
            toast.success(res.data);
         };
         notify();
         localStorage.setItem('userForgot', "userForgot");

      })
      .catch((error) => {
         const notify = () => {
            toast.warning(error.response.data);
         };
         notify();
      });
};

const resetPassword = (token , password ,confirmPassword) => {
   return axios
      .post(API_URL + 'Login/reset-password', {
         token,
         password,
         confirmPassword,
      })
      .then((response) => {
         console.log(response.data);
         const notify = () => {
            toast.success(response.data);
         };
         notify();
         localStorage.setItem('resetPassword', "resetPassword");
      })
      .catch((error) => {
         console.log(error.response.data);
         const notify = () => {
            toast.warning(error.response.data);
         };
         notify();
      });
};

const verifyAccount = (token) => {
   return axios({
      method: 'post',
      url: `https://localhost:5001/api/Register/verify`,
      params: {
         token,
      },
   })
      .then((res) => {
         const notify = () => {
            toast.success(res.data);
         };
         notify();
         localStorage.setItem('verifyAccount', "verifyAccount");
      })
      .catch((error) => {
         const notify = () => {
            toast.warning(error.response.data);
         };
         notify();
      });
};

const logout = () => {
   localStorage.removeItem('user');
};

const getCurrentUser = () => {
   return JSON.parse(localStorage.getItem('user'));
};

const AuthService = {
   register,
   login,
   logout,
   forgotPassword,
   getCurrentUser,
   resetPassword,
   verifyAccount,
};

export default AuthService;
