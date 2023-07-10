import Sidebar from '../../components/Sidebar/Sidebar';
import Projects from '../../pages/Projects/Project';
import './ProjectLayout.css';

function ProjectLayout({ children }) {
   return (
      <div className="grid grid-rows-3 grid-flow-col">
         <div className="row-span-3">
            <Sidebar />
         </div>
         <div className="col-span-2 ml-96">
            <Projects />
            <div className="content row-span-2 col-span-2">{children}</div>
         </div>

      
      </div>
   );
}

export default ProjectLayout;
