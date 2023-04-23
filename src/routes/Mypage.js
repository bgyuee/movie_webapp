import Usermovie from 'components/Usermovie';
import { authService, db, storage } from 'fbase';
import { updateProfile } from 'firebase/auth';
import { collection, doc, getDocs } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

function Mypage({userObj}) {
// console.log(userObj);
  const {displayName, photoURL, uid} = userObj
  const [nickname, setNickname] = useState(displayName);
  const [attachment, setAttachment] = useState(photoURL);
  

  const navigate = useNavigate();

  const onLogOutClick = () => {
    const ok = window.confirm("로그아웃 하시겠습니까?");
    if (ok) {
      authService.signOut();
      navigate('/');
    }
  }
  const onChange = e => {
    const value = e.target.value;
    const name = e.target.name;
    console.log(e);

    if(name === 'nickname') setNickname(value);
  }

  const onFilechange = e => {
    
    const {target:{files}} = e;
    const theFile = files[0];

    const reader = new FileReader();
    reader.onloadend = (finisheEvent) => {
      // console.log('finisheEvent ->', finisheEvent);
      const {currentTarget:{result}} = finisheEvent;

      setAttachment(result);
    }
    reader.readAsDataURL(theFile);
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      let attachmentUrl = "";
      if(attachment !== photoURL) {
        const storageRef = ref(storage, `profileImg/${uid}`);
        const response = await uploadString(storageRef, attachment, 'data_url');
        attachmentUrl = await getDownloadURL(ref(storage, response.ref));
      }
      await updateProfile(userObj, {
        displayName: nickname,
        photoURL: attachmentUrl || photoURL
      });
      
    } catch(e) {
      console.log(e);
    }
  }

  

  return (
    
    <MypageContainer>
      <MypageTitle>마이페이지</MypageTitle>
      <span className='logout' onClick={onLogOutClick}>로그아웃</span>
      <MypageContent>
        <div className='profie_information'>
          <div className='profileImg'>
            <div className='profile_image' style={{backgroundImage:`url(${attachment})`}} />
            <label htmlFor='profileImg_add' className='profileImg_add'>이미지 추가</label>
          </div>
          <form className='information_fix' onSubmit={onSubmit}>
            <input type='text' name='nickname' placeholder={nickname}  
              onChange={onChange}/>
            <input id='profileImg_add' className='blind' type='file' accept='image/*'
              onChange={onFilechange} />
            <input type='submit' value="수정하기" />
          </form>
        </div>
        <Usermovie userObj={userObj}/>
      </MypageContent>
    </MypageContainer>
  )
}

const MypageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 800px;
    .logout{
      z-index: 10;
      position: fixed;
      top: 18px;
      right: 80px;
      color: #fff;
      cursor: pointer;
    }
`;
const MypageTitle = styled.h2`
  z-index: 10;
  position: fixed;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 37px;
  font-weight: 900;
  color: #fff;
  background-color: #111;
`;

const MypageContent = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 0;
  left: 50%;
  transform: translate(-50%);
  width: 100%;
  text-align: center;

  

  .profie_information{
    display: flex;
    justify-content: space-between;
    margin-top: 100px !important;
    margin: 0 auto;
    width: 380px;
    margin-bottom: 30px;

    .profileImg{
      .profile_image{
      width: 120px;
      height: 120px;
      background-position: center center;
      background-size: cover;
    }
      .profileImg_add{
        color: #fff;
        cursor: pointer;
      }
    }
      
      .information_fix{
      }

  }
`;


export default Mypage;