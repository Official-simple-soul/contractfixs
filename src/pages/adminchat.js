import Link from 'next/link';
import React, { useEffect, useState, useRef } from 'react';
import { BsFillPersonFill } from 'react-icons/bs';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { AiOutlineSend } from 'react-icons/ai';
import { useRouter } from 'next/router';
import EmojiPicker from '@/components/EmojiPicker';

function Adminchat() {
  const [chatArr, setChatArr] = useState([]);
  const [chatInfo, setChatInfo] = useState({
    name: '',
    location: '',
  });
  const [showEmoji, setShowEmoji] = useState(false);
  const router = useRouter();
  const chatContainerRef = useRef(null);
  const [adminChat, setAdminChat] = useState([]);

  useEffect(() => {
    const userChatRef = doc(db, 'user', 'rp1urhbA5qYR9l7KVeXz');

    const unsub = onSnapshot(userChatRef, (doc) => {
      console.log('Current data: ', doc.data());
      setChatInfo({
        name: doc.data().name,
        location: doc.data().location,
      });
    });

    return () => {
      unsub();
    };
  }, []);

  const handleChat = async () => {
    const adminChatRef = doc(db, 'admin', '7yWl2bmcmM42uRPuwS6n');
    await updateDoc(adminChatRef, {
      chat: adminChat,
    });

    setChatArr((prev) => [
      ...prev,
      {
        type: 'admin',
        chat: adminChat,
      },
    ]);

    setAdminChat('');
  };

  useEffect(() => {
    const userChatRef = doc(db, 'user', 'rp1urhbA5qYR9l7KVeXz');

    const unsub = onSnapshot(userChatRef, (doc) => {
      setChatArr((prev) => [
        ...prev,
        {
          type: 'user',
          chat: doc.data().chat,
        },
      ]);
    });

    return () => {
      unsub();
    };
  }, []);

  const handleExit = async () => {
    const adminChatRef = doc(db, 'admin', '7yWl2bmcmM42uRPuwS6n');
    await updateDoc(adminChatRef, {
      chat: '',
    });

    router.push('/coin');
  };

  useEffect(() => {
    const userChatRef = doc(db, 'admin', '7yWl2bmcmM42uRPuwS6n');
    const timer = setTimeout(() => {
      updateDoc(userChatRef, {
        name: '',
        location: '',
        chat: '',
      });
      setSName('');
    }, 15 * 60 * 1000);

    return () => clearTimeout(timer);
  }, [adminChat]);

  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [chatArr]);

  const onEmojiClick = (event) => {
    setAdminChat((prev) => prev + ' ' + event.emoji);
    setShowEmoji(false);
  };
  // console.log(Boolean(auth.currentUser?.uid);
  useEffect(() => {
    if (!auth.currentUser) {
      router.push('/admin');
    }
  }, []);

  return (
    <div className='bg-white h-screen'>
      <ToastContainer />
      <div className='flex fixed w-full items-center justify-between bg-blue-500 px-2 py-3 shadow-md'>
        <div className='flex items-center space-x-2'>
          <div className='text-gray-500 p-2 bg-gray-400 rounded-full'>
            <BsFillPersonFill className='text-3xl' />
          </div>
          <div>
            <h1>How can we help you?</h1>
            <div className='flex items-center space-x-2'>
              <div className='w-2 h-2 bg-green-500 rounded-full'></div>
              <h1 className='text-[10px]'>We reply immediately</h1>
            </div>
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          <h1>{chatInfo.name}</h1>
          <h1 className='p-2 bg-gray-600 rounded' onClick={handleExit}>
            x
          </h1>
        </div>
      </div>
      <div
        className='flex flex-wrap items-center justify-between px-2 space-y-2 py-20 max-h-screen bg-white overflow-scroll'
        ref={chatContainerRef}
      >
        {chatArr.length[0] !== '' &&
          chatArr.map((e, idx) => (
            <div key={idx} className='w-full flex flex-col items-start'>
              <h1
                className={`${
                  e.chat !== '' ? 'px-2 py-1' : ''
                } block text-gray-500 w-auto rounded-md ${
                  e.type === 'user'
                    ? 'text-end ms-auto text-white bg-blue-600 rounded'
                    : 'text-start me-auto bg-blue-200 rounded'
                }`}
              >
                {e.chat}
              </h1>
            </div>
          ))}
      </div>
      <div className='py-2 z-40 bg-white flex items-center border justify-between fixed bottom-0 w-full px-3'>
        <input
          type='text'
          value={adminChat}
          className='outline-none text-gray-600 placeholder:text-gray-500 w-full placeholder:text-[10px]'
          placeholder='Chat'
          onChange={(e) => setAdminChat(e.target.value)}
        />
        <button onClick={() => setShowEmoji(!showEmoji)}>😀</button>
        <AiOutlineSend onClick={handleChat} className='text-gray-400 ml-2' />
      </div>
      <EmojiPicker onEmojiClick={onEmojiClick} showEmoji={showEmoji} />
    </div>
  );
}

export default Adminchat;
