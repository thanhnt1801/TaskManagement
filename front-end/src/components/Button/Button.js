import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './Button.module.scss';

const cx = classNames.bind(styles);

//...passProp để thêm những thuộc tính new tab cho nút
function Button({
   to,
   href,
   primary = false,
   outline = false,
   small = false,
   large = false,
   text = false,
   disabled = false,
   rounded = false,
   children,
   className,
   leftIcon,
   rightIcon,
   onClick,
   ...passProp
}) {
   let Comp = 'button';
   //props nội bộ
   const props = {
      onClick,
      ...passProp,
   };

   if (disabled) {
      delete props.onClick;
   }

   //   Set điều kiện thẻ link ngoài web hay trong web
   if (to) {
      props.to = to;
      Comp = Link;
   } else {
      props.href = href;
      Comp = 'a';
   }

   const classes = cx('wrapper', {
      //className lấy làm key
      [className]: className,
      primary,
      outline,
      small,
      large,
      rounded,
      text,
      disabled,
   });

   return (
      <Comp className={classes} {...props}>
         {leftIcon && <span className={cx('icon')}>{leftIcon}</span>}
         <span className={cx('title')}>{children}</span>
         {rightIcon && <span className={cx('icon')}>{rightIcon}</span>}
      </Comp>
   );
}

//Cách advanced
//    if (disabled) {
//       Object.keys(props).forEach((key) => {
//           if (key.startsWith('on') && typeof props[key] === 'function') {
//               delete props[key];
//           }
//       });
//   }

Button.propTypes = {
   to: PropTypes.string,
   href: PropTypes.string,
   primary: PropTypes.bool,
   outline: PropTypes.bool,
   small: PropTypes.bool,
   large: PropTypes.bool,
   text: PropTypes.bool,
   disabled: PropTypes.bool,
   rounded: PropTypes.string,
   children: PropTypes.node.isRequired,
   className: PropTypes.string,
   leftIcon: PropTypes.node,
   rightIcon: PropTypes.node,
   onClick: PropTypes.func,
};
export default Button;
