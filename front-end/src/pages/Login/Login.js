import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import jwt_decode from 'jwt-decode'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Login = () => {
   let navigate = useNavigate();
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const onChangeEmail = (e) => {
      const email = e.target.value;
      setEmail(email);
   };

   const onChangePassword = (e) => {
      const password = e.target.value;
      setPassword(password);
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      AuthService.login(email, password).then(() => {
         if (localStorage.getItem('user') != null) {
            setTimeout(() => {
               navigate('/');
            }, 2000);
         }
      });
   };

   // function handleCallbackResponse(response){
   //    console.log("Encoded JWT ID Token: " + response);
   //    var userObject = jwt_decode(response.credential);
   //    console.log(userObject)
   //    if (userObject) {
   //       localStorage.setItem('user', JSON.stringify(userObject));
   //       const notify = () => {
   //          toast.success("Login Google success , Welcome " + userObject.name);
   //       };
   //       notify()
   //       setTimeout(() => {
   //          navigate('/');
   //       }, 3000);
   //    }
   // }

   // const getCurrentUser = () => {
   //    return JSON.parse(localStorage.getItem("user"))
   // }

   // useEffect(() => {
   //    /* global google */
   //    google.accounts.id.initialize({
   //       client_id:"233038068976-islh5vbl1u5ibrev3o7765i9anj026hm.apps.googleusercontent.com",
   //       callback: handleCallbackResponse
   //    })
   //    google.accounts.id.renderButton(
   //       document.getElementById("signInDiv"),
   //       {theme :"outline", size:"large", width : "500px",'height': 100, }
   //    );
   // })

   return (
      <div>
         <ToastContainer />
         <div className="min-h-full flex items-center justify-center mt-48 mb-52 py-12 px-4 sm:px-6 lg:px-8 ">
            <div className="max-w-md w-full space-y-8 ">
               <div>
                  <img
                     className="mx-auto h-12 w-auto"
                     src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                     alt="Workflow"
                  />
                  <h2 className="mt-6 mb-6 text-center text-6xl font-extrabold text-gray-900">Log in</h2>
                  <p className="mt-2 text-center text-sm text-gray-600">
                     Don't have an account ?
                     <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Sign up
                     </Link>
                  </p>
                  <div className="mt-5">
                     {/* <div id="signInDiv"
                        className=" relative w-full flex justify-center py-2 px-4 border border-zinc-300  font-medium rounded-md text-black bg-white  hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        ></div> */}
                     {/* <button
                        className="group relative w-full flex justify-center py-2 px-4 border border-zinc-300  font-medium rounded-md text-black bg-white  hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                     >
                        <span className="absolute left-1/4 inset-y-0 flex items-center pl-3">
                           <svg
                              className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                           >
                              <path
                                 d="M19.9996 10.2297C19.9996 9.54995 19.9434 8.8665 19.8234 8.19775H10.2002V12.0486H15.711C15.4823 13.2905 14.7475 14.3892 13.6716 15.0873V17.586H16.9593C18.89 15.8443 19.9996 13.2722 19.9996 10.2297Z"
                                 fill="#4285F4"
                              ></path>
                              <path
                                 d="M10.2002 20.0003C12.9518 20.0003 15.2723 19.1147 16.963 17.5862L13.6753 15.0875C12.7606 15.6975 11.5797 16.0429 10.2039 16.0429C7.54224 16.0429 5.28544 14.2828 4.4757 11.9165H1.08301V14.4923C2.81497 17.8691 6.34261 20.0003 10.2002 20.0003Z"
                                 fill="#34A853"
                              ></path>
                              <path
                                 d="M4.47227 11.9163C4.04491 10.6743 4.04491 9.32947 4.47227 8.0875V5.51172H1.08333C-0.363715 8.33737 -0.363715 11.6664 1.08333 14.4921L4.47227 11.9163Z"
                                 fill="#FBBC04"
                              ></path>
                              <path
                                 d="M10.2002 3.95756C11.6547 3.93552 13.0605 4.47198 14.1139 5.45674L17.0268 2.60169C15.1824 0.904099 12.7344 -0.0292099 10.2002 0.000185607C6.34261 0.000185607 2.81497 2.13136 1.08301 5.51185L4.47195 8.08764C5.27795 5.71762 7.53849 3.95756 10.2002 3.95756Z"
                                 fill="#EA4335"
                              ></path>
                           </svg>
                        </span>
                        Sign in with Google
                     </button> */}
                  </div>
                  <hr className="mt-5 "></hr>
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
                           value={email}
                           onChange={onChangeEmail}
                           name="email"
                           type="email"
                           autoComplete="email"
                           required
                           className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                           placeholder="Email address"
                        />
                     </div>
                     <div>
                        <label htmlFor="password" className="sr-only">
                           Password
                        </label>
                        <input
                           id="password"
                           name="password"
                           value={password}
                           onChange={onChangePassword}
                           type="password"
                           autoComplete="current-password"
                           required
                           className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                           placeholder="Password"
                        />
                     </div>
                  </div>

                  <div className="flex items-center justify-between">
                     <div className="flex items-center">
                        <input
                           id="remember-me"
                           name="remember-me"
                           type="checkbox"
                           className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                           Remember me
                        </label>
                     </div>

                     <div className="text-sm">
                        <Link to="/forgotpassword" className="font-medium text-indigo-600 hover:text-indigo-500">
                           Forgot your password?
                        </Link>
                     </div>
                  </div>

                  <div>
                     <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-red-500  font-medium rounded-md text-red-400 bg-rose-50  hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                     >
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                           <svg
                              className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                           >
                              <path
                                 fillRule="evenodd"
                                 d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                 clipRule="evenodd"
                              />
                           </svg>
                        </span>
                        Continue with email
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
};
