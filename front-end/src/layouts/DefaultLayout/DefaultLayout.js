import Sidebar from '../../components/Sidebar/Sidebar';
import './DefaultLayout.css';

function DefaultLayout({ children }) {
   return (
      // <div>
      //    <div className="flex ">
      //       <Sidebar />
      //       <div className='content'>{children}</div>
      //    </div>
      // </div>
      <div className="grid grid-rows-3 grid-flow-col">
      <div className="row-span-3 col-span-3">
         <Sidebar />
      </div>
      <div className="row-span-2 col-span-2 ">{children}</div>
   </div>
         
   );
}

export default DefaultLayout;
