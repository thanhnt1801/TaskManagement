import { faBackward } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AuthService from '../../services/auth.service';

export const VerifyAccount = () => {
   const [token, setToken] = useState('');
   let navigate = useNavigate();

   const onChangeToken = (e) => {
      const token = e.target.value;
      setToken(token);
   };


   const handleSubmit = (e) => {
      e.preventDefault();
      AuthService.verifyAccount(token).then(() => {
         if (localStorage.getItem('verifyAccount') != null) {
            setTimeout(() => {
               navigate('/login');
               localStorage.removeItem('verifyAccount');
            }, 3000);
         }
      });
   };

   return (
      <div className="">
         <hr />
         <ToastContainer />
         <div className="min-h-full flex items-center justify-center mt-48 pb-52 py-12 px-4 sm:px-6 lg:px-8 center">
            <div className="max-w-md w-full space-y-8">
               <div>
                  <Link to="/login" className="text-2xl text-indigo-400 hover:text-indigo-500">
                     <FontAwesomeIcon
                        color="#6366F1"
                        fontSize={22}
                        icon={faBackward}
                        className="hover:text-indigo-600 mr-2"
                     />
                     Back
                  </Link>
                  <img
                     className="mx-auto h-12 w-auto"
                     src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                     alt="Workflow"
                  />
                  <h2 className="mt-6 mb-6 text-center text-6xl font-extrabold text-gray-900">Verify account</h2>
               </div>
               <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                  <input type="hidden" name="remember" value="true" />
                  <div className="rounded-md shadow-sm -space-y-px">
                     <div>
                        <label htmlFor="token" className="sr-only">
                           Token
                        </label>
                        <input
                           id="token"
                           name="token"
                           type="text"
                           autoComplete="username"
                           required
                           className="appearance-none rounded-md relative block w-full px-3 py-5 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                           placeholder="Token from your email"
                           value={token}
                           onChange={onChangeToken}
                        />
                     </div>
                  </div>

                  <div>
                     <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-red-500  font-medium rounded-md text-red-400 bg-rose-50  hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                     >
                        Verify your account
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
};
