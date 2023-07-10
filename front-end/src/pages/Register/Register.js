import { faBackward,  faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';

//Toast
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Register = () => {
   let navigate = useNavigate();
   const [inforEmail, setInforEmail] = useState('');

   const [email, setEmail] = useState('');
   const [userName, setUserName] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [loading, setLoading] = useState(false);

   const onChangeEmail = (e) => {
      setInforEmail(e.target.value);
      const email = e.target.value;
      setEmail(email);
   };

   const onChangeUserName = (e) => {
      const userName = e.target.value;
      setUserName(userName);
   };

   const handleChangePassword = (e) => {
      const password = e.target.value;
      setPassword(password);
   };

   const HandleConfirmPassword = (e) => {
      const confirmPassword = e.target.value;
      setConfirmPassword(confirmPassword);
   };

   const handleSubmit = (e) => {
      setLoading(true);
      e.preventDefault();
      AuthService.register(email, userName, password, confirmPassword).then(() => {
         setLoading(false);
         if (localStorage.getItem('userRegister') != null) {
            setTimeout(() => {
               navigate('/verifyaccount');
               localStorage.removeItem('userRegister');
            }, 3000);
         }
      });
   };

   return (
      <div className="">
         <hr />
         <ToastContainer autoClose={6000} />
         <div className="min-h-full flex items-center justify-center mt-20 pb-52 py-12 px-4 sm:px-6 lg:px-8 center">
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
                  <h2 className="mt-6 mb-6 text-center text-6xl font-extrabold text-gray-900">Sign up</h2>
                  {!inforEmail && (
                     <p className="mt-2 text-center text-sm text-gray-600">
                        Once you enter your email address and press the button 'Send verification code', we'll send a
                        code to validate your email.
                     </p>
                  )}
               </div>
               <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                  <input type="hidden" name="remember" value="true" />
                  <div className="rounded-md shadow-sm -space-y-px">
                     {/* Email Input */}
                     <div>
                        <label htmlFor="email-address" className="sr-only">
                           Email address
                        </label>
                        <input
                           id="email-address"
                           name="email"
                           type="email"
                           autoComplete="email"
                           required
                           className="appearance-none rounded-md relative block w-full px-3 py-5 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                           placeholder="Email address"
                           value={email}
                           onChange={onChangeEmail}
                        />
                     </div>
                     {/* Username Input */}
                     <div>
                        <label htmlFor="userName" className="sr-only">
                           User name
                        </label>
                        <input
                           id="userName"
                           name="userName"
                           type="text"
                           autoComplete="userName"
                           required
                           className="appearance-none mt-2 rounded-md relative block w-full px-3 py-5 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                           placeholder="User name"
                           value={userName}
                           onChange={onChangeUserName}
                        />
                     </div>
                     {/* Password Input */}
                     <div>
                        <label htmlFor="password" className="sr-only">
                           Password
                        </label>
                        <input
                           id="password"
                           name="password"
                           type="password"
                           autoComplete="password"
                           required
                           className="appearance-none mt-2 rounded-md relative block w-full px-3 py-5 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                           placeholder="Password"
                           value={password}
                           onChange={handleChangePassword}
                        />
                     </div>
                     {/* Confirm Password Input */}
                     <div>
                        <label htmlFor="confirmpassword" className="sr-only">
                           Confirm password
                        </label>
                        <input
                           id="confirmpassword"
                           name="confirmpassword"
                           type="password"
                           autoComplete="confirmpassword"
                           required
                           className="appearance-none mt-2 rounded-md relative block w-full px-3 py-5 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                           placeholder="Confirm password"
                           value={confirmPassword}
                           onChange={HandleConfirmPassword}
                        />
                     </div>
                  </div>

                  <div>
                     <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-red-500  font-medium rounded-md text-red-400 bg-rose-50  hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        disabled={loading}
                     >
                        {loading && ( <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                           <svg
                              className=" animate-spin h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                           >
                              <FontAwesomeIcon icon={faSpinner}/>
                             
                           </svg>
                        </span>)}
                        
                        Send verification code
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
};
