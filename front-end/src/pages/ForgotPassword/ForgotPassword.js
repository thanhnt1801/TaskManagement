import { faBackward, faFan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AuthService from '../../services/auth.service';

function ForgotPassword() {
   let navigate = useNavigate();

   const [inforEmail, setInforEmail] = useState('');
   const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
   const [loading, setLoading] = useState(false);

   const onChangeEmail = (e) => {
      setInforEmail(e.target.value);
      const forgotPasswordEmail = e.target.value;
      setForgotPasswordEmail(forgotPasswordEmail);
   };

   const handleSubmit = (e) => {
      setLoading(true)
      e.preventDefault();
      AuthService.forgotPassword(forgotPasswordEmail).then(() => {
      setLoading(false)
         if (localStorage.getItem('userForgot') != null) {
            setTimeout(() => {
               navigate('/resetpassword');
               localStorage.removeItem('userForgot');
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
                  <h2 className="mt-6 mb-6 text-center text-6xl font-extrabold text-gray-900">Forgot password</h2>
                  {!inforEmail && (
                     <p className="mt-2 text-center text-sm text-gray-600">
                        Verification is necessary. Please click Send button.
                     </p>
                  )}
               </div>
               <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                  <input type="hidden" name="remember" value="true" />
                  <div className="rounded-md shadow-sm -space-y-px">
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
                           value={forgotPasswordEmail}
                           onChange={onChangeEmail}
                        />
                     </div>
                  </div>

                  <div>
                     <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-red-500  font-medium rounded-md text-red-400 bg-rose-50  hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                     >
                        {loading && (
                           <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                              <svg
                                 className="animate-spin h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                                 xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 20 20"
                                 fill="currentColor"
                                 aria-hidden="true"
                              >
                                 <FontAwesomeIcon icon={faFan} />
                              </svg>
                           </span>
                        )}
                        Submit code
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
};

export default ForgotPassword;
