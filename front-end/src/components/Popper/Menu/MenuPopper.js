import Tippy from "@tippyjs/react/headless";
import classNames from 'classnames/bind';
import { useState } from "react";
import  PopperWrapper  from "../PopperWrapper";
import styles from './Menu.module.scss';
import MenuItem from './MenuPopperItem'

const cx = classNames.bind(styles);

const defaultFn = () => {};

 function MenuPopper({children , items=[]}, onChange = defaultFn) {
    const [history, setHistory] = useState([{ data: items }]);
    const current = history[history.length - 1];

    const renderItems = () => {
        return current.data.map((item, index) => {
            const isParent = !!item.children;
            const logout = !!item.logout;
            return (
                <MenuItem key={index} data={item}  
                onClick={() => {
                    if (isParent) {
                       setHistory((prev) => [...prev, item.children]);
                    } else if (logout){
                        localStorage.removeItem("user");
                    }
                    else  {
                       onChange(item);
                    }
                 }}/>
            )
        })
    }
    
    const renderResult = (attrs) => (
        <div className={cx('menu-list')} tabIndex="-1" {...attrs}>
            <PopperWrapper className={cx('menu-popper')}>
                <div className={cx('menu-body')}>{renderItems()}</div>
            </PopperWrapper>
        </div>
    );

    return ( 
        <Tippy
        delay={[0, 700]}
        offset={[5, 10]}
        // hideOnClick={hideOnClick}
        interactive
        placement="bottom-end"
        render={renderResult}
        // onHide={handleResetMenu}
     >
        {children}
     </Tippy>
     );
}

export default MenuPopper;