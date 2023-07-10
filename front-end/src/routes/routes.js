import config from '../config'
// Pages
import Home from '../pages/Home/Home';
import { Login } from '../pages/Login/Login';
import { Register } from '../pages/Register/Register';
import ForgotPassword from '../pages/ForgotPassword/ForgotPassword'
import { ResetPassword } from '../pages/ResetPassword/ResetPassword';
import { VerifyAccount } from '../pages/VerifyAccount/VerifyAccount';
import MyTask from '../pages/MyTask/MyTask'
import Projects from '../pages/Projects/Project';
import Requirements from '../pages/Projects/Requirements/Requirements';
import ProjectLayout from '../layouts/ProjectLayout/ProjectLayout';
import StoreRoom from '../pages/Projects/StoreRoom/StoreRoom'
import SettingProjects from '../pages/Projects/SettingsProject/SettingsProject'
import Notfound from '../pages/Notfound/Notfound';
import RequirementsItem from '../pages/Projects/Requirements/RequirementsItem/RequirementsItem';
import AccessDenied from '../pages/AccessDenied/AccessDenied';
import ChatRoom from '../pages/Projects/ChatRoom/ChatRoom';
import Feature from '../pages/Feature/Feature';

// Public routes
const publicRoutes = [
   { path: config.routes.home, component: Home },
   { path: config.routes.notfound, component: Notfound,layout:null },
   { path: config.routes.mytask, component: MyTask },
   { path: config.routes.chatroom, component: ChatRoom },
   { path: config.routes.projects, component: Projects },
   { path: config.routes.requirementsitem, component: RequirementsItem },
   { path: config.routes.accessdenied, component: AccessDenied ,layout: null},
   { path: config.routes.feature, component: Feature ,layout: null},
   { path: config.routes.login, component: Login ,layout: null},
   { path: config.routes.signup, component: Register ,layout: null},
   { path: config.routes.forgotpassword, component: ForgotPassword ,layout: null},
   { path: config.routes.resetpassword, component: ResetPassword ,layout: null},
   { path: config.routes.verifyaccount, component: VerifyAccount ,layout: null},
   { path: config.routes.requirements, component: Requirements ,layout: ProjectLayout},
   { path: config.routes.storeroom, component:StoreRoom  ,layout: ProjectLayout},
   { path: config.routes.settings, component: SettingProjects ,layout: ProjectLayout},
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
