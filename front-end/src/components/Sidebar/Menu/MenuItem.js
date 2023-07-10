import { NavLink } from 'react-router-dom';
import styles from './Menu.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function MenuItem({ title, to, icon, image }) {
   return (
      <NavLink to={to} className={(nav) => cx('menu-item', { active: nav.isActive })}>
         {image && (<img className={cx('image')} src={image} alt="" ></img>)}
         <span className={cx('icon')}> {icon}</span>
         <span className={cx('title')}>{title}</span>
      </NavLink>
   );
}

export default MenuItem;
