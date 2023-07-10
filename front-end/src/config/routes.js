const routes = {
   home: '/',
   notfound: '*',
   login: '/login',
   signup : '/signup',
   forgotpassword : '/forgotpassword',
   resetpassword : '/resetpassword',
   verifyaccount : '/verifyaccount',
   mytask : '/mytask',
   projects: '/projects/:id',
   requirements :'/projects/:id/requirements',
   requirementsitem :'projects/:groupid/requirements/:id',
   storeroom :'/projects/:id/storeroom',
   chatroom :'/projects/:id/chatroom',
   settings :'/projects/:id/settings',
   feature :'/feature',
   accessdenied: '/accessdenied',
};

export default routes;
