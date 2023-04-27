import Usermovie from 'components/Usermovie';
import { authService, db, storage } from 'fbase';
import { updateProfile } from 'firebase/auth';
import { collection, doc, getDocs } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadString } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPen, FaImage ,FaCheck } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import styled from 'styled-components';

function Mypage({userObj, setUserprofileImg, setUsername}) {
  // console.log(userObj);
  
  const [attachment, setAttachment] = useState(userObj.photoURL);
  const {displayName, photoURL, uid} = userObj;
  const [nickname, setNickname] = useState(displayName);
  const [modalOpen, setModalOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [porfileImgfix, setProfileImgfix] = useState(false);

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
      setUsername(nickname);

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
      setUserprofileImg(attachmentUrl);
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
              <span className='profileImg_fix fix_icon' title='수정하기' onClick={() => setProfileImgfix(prev => !prev)}><FaPen /></span>
            ) : (
                <div className='profileImg_option'>
                  <label htmlFor='profileImg_add' className='profileImg_add fix_icon' title='이미지첨부'><FaImage /></label>
                  <span className='fix_icon' onClick={Imgadd} title='수정하기'><FaCheck /></span>
                  {photoURL !== "" && <label htmlFor='profileImg_del' className='profileImg_del fix_icon' onClick={Imgdel} title='삭제하기'><AiFillDelete /></label>}
                </div>
            )}
          </div>
          <form className='information_fix' onSubmit={onSubmit}>
            <p className='nickname'>{displayName}</p>
            <input className='nicknamefix' type='text' name='nickname' placeholder={nickname}
              onChange={onChange} />
            <input id='profileImg_add' className='blind' type='file' accept='image/*'
              onChange={onFilechange} />
            <input className='nicknameSubmit' type='submit' value="확인" />
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
    width: 320px;
    margin-bottom: 30px;

    .profileImg{
      position: relative;
      .profile_image{
      width: 120px;
      height: 120px;
      background-position: center center;
      background-size: cover;
    }
      .fix_icon {
          color: #fff;
          opacity: 0.9;
          cursor: pointer;
          &:hover{opacity: 1;transform: scale(1.2)}
            &.profileImg_fix{
              position: absolute;
              bottom: -5px;
              right: -5px;
              font-size: 20px;
              color: #FFA500;
            }
          }
      .profileImg_option{
        display: flex;
        justify-content: space-between;
      }
      
    }
      
      .information_fix{
        position: relative;
        .nickname{
          margin-bottom: 5px;
          font-size: 20px;
          color: #fff;
        }
        .nicknamefix{
          padding-top: 8px;
          padding-left: 10px;
          height: 20px;
          border-radius: 6px;
          border: none;
          box-sizing: border-box;
          &::placeholder{font-size:20px;line-height: 25px;}
          &:focus{outline: none;}
        }
        .nicknameSubmit{
          position: absolute;
          top: 29%;
          right: 0;
          font-size: 14px;
          background: #FFA500;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
      }

  }
`;


export default Mypage;