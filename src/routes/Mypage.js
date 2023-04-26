import Usermovie from 'components/Usermovie';
import { authService, db, storage } from 'fbase';
import { updateProfile } from 'firebase/auth';
import { collection, doc, getDocs } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadString } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

function Mypage({userObj, attachment, setAttachment}) {
  // console.log(userObj);
  
  const {displayName, photoURL, uid} = userObj;
  const [nickname, setNickname] = useState(displayName);
  const [modalOpen, setModalOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [porfileImgfix, setProfileImgfix] = useState(false);
  console.log(porfileImgfix);

  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if(window.scrollY > 50) {
        setShow(true);
      }else {
        setShow(false);
      }
    });
    return () => { //컴포넌트를 사용하지 않을때는 윈도우객체에서 스크롤 이벤트를 지우겠다
      window.removeEventListener("scroll", () => {}); 
    };
  }, []);

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
      await updateProfile(userObj, {
        displayName: nickname
      });

    } catch(e) {
      console.log(e);
    }
  }
  
  const Imgadd = async () => {
    try {
      setProfileImgfix(false);
      let attachmentUrl ="";
      if(attachment !== photoURL) {
        const storageRef = ref(storage, `profileImg/${uid}`);
        const response = await uploadString(storageRef, attachment, 'data_url');
        attachmentUrl = await getDownloadURL(ref(storage, response.ref));
      }
      await updateProfile(userObj, {
        photoURL: attachmentUrl || photoURL
      })
    }catch(e) {
      console.error(e);
    }
  }
  const Imgdel = async () => {
    const ok = window.confirm("삭제하시겠습니까?");
    if(ok) {
      setAttachment("");
      if(attachment !== "") {
        const desertRef = ref(storage, attachment);
        await deleteObject(desertRef);
        await updateProfile(userObj, {
          photoURL: ""
        })
      }
    }
  }

  return (
    
    <MypageContainer>
      {!modalOpen && <MypageTitle className={show && modalOpen && "remove"}>마이페이지</MypageTitle>}
      <span className='logout' onClick={onLogOutClick}>로그아웃</span>
      <MypageContent className={modalOpen && "modalup"}>
        <div className='profie_information'>
          <div className='profileImg'>
            <div className='profile_image' style={attachment ? {backgroundImage:`url(${attachment})`} : {backgroundImage:`url('https://occ-0-4796-988.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABbme8JMz4rEKFJhtzpOKWFJ_6qX-0y5wwWyYvBhWS0VKFLa289dZ5zvRBggmFVWVPL2AAYE8xevD4jjLZjWumNo.png?r=a41')`}} />
            {!porfileImgfix ? (
              <button className='profileImg_fix' onClick={() => setProfileImgfix(prev => !prev)}>이미지수정하기</button>
            ) : (
                <div>
                  <label htmlFor='profileImg_add' className='profileImg_add'>이미지 넣기</label>
                  <button onClick={Imgadd}>이미지 수정완료</button>
                  <button htmlFor='profileImg_del' className='profileImg_del' onClick={Imgdel}>이미지 삭제</button>
                </div>
            )}
          </div>
          <form className='information_fix' onSubmit={onSubmit}>
            <p className='nickname'>{displayName}</p>
            <input className='nicknamefix' type='text' name='nickname' placeholder={nickname}
              onChange={onChange} />
            <input id='profileImg_add' className='blind' type='file' accept='image/*'
              onChange={onFilechange} />
            <input type='submit' value="수정하기" />
          </form>
        </div>
        <Usermovie userObj={userObj} modalOpen={modalOpen} setModalOpen={setModalOpen} />
      </MypageContent>
    </MypageContainer>
  )
}

const MypageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 900px;
    .logout{
      z-index: 10;
      position: fixed;
      top: 18px;
      right: 100px;
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
  &.remove{
    display: none;
  }
`;

const MypageContent = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 0;
  left: 50%;
  transform: translate(-50%);
  height: 100%;
  width: 100%;
  text-align: center;
  &.modalup{
    z-index: 10;
  }

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
        .nickname{
          color: #fff;
        }
      }

  }
`;


export default Mypage;