import { NavLink, useParams } from "react-router-dom";
import styles from './ProjectMenu.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function ProjectItem({title, to, icon,props}) {
   const {id} = useParams();
   return (
      <NavLink to={to} props={id} className={(nav) => cx('project-item', { active: nav.isActive })}>
                        <div className="flex flex-row items-center justify-center">
                        <span className={cx('icon')}> {icon}</span>
                        </div>
         <span className={cx('title')}>{title}</span>
      </NavLink>
   );
}

export default ProjectItem;
