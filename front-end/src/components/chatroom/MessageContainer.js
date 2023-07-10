import { useEffect, useRef } from 'react';

const MessageContainer = ({ messages }) => {
    const messageRef = useRef();

    useEffect(() => {
        if (messageRef && messageRef.current) {
            const { scrollHeight, clientHeight } = messageRef.current;
            messageRef.current.scrollTo({ left: 0, top: scrollHeight - clientHeight, behavior: 'smooth' });
        }
    }, [messages]);

    return <div ref={messageRef} className='bg-slate-50 h-[800px] overflow-auto rounded-md mb-2'>
        {messages.map((m, index) =>
            <div key={index} className='text-left text-lg l'>
                <div className='font-2xl my-2 mr-2 text-indigo-600'>{m.user}</div>
                <div className='text-sm font-thin bg-slate-200 rounded-lg mr-6 p-2'>{m.message}</div>
            </div>
        )}
    </div>
}

export default MessageContainer;