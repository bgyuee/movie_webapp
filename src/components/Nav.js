import { authService } from 'fbase';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "styles/Nav.scss";
import netflex from "../images/NETFLEX.png";

function Nav() {

const [show,setShow] = useState(false);
const [searchValue, setSearchValue] = useState("");
const navigate = useNavigate(); //특정주소로 가겠다

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

const onChange = (e) => {
  setSearchValue(e.target.value);
  if(e.target.value === ""){
    navigate('/');
  }else {
    navigate(`/search?q=${e.target.value}`); //q는 query(질문)
  } 
}



// onClick={() => {window.location.reload()}} 누룰때마다 새로고침이 되게한다
  return (
    <nav className={`nav ${show && "nav__black"}`}>
      <img src={netflex} alt='Netflex logo' className='nav__logo' 
       onClick={() => {window.location.href = "/movie_webapp/"}} />

      <input type='search' placeholder='영화를 검색해주세요' className='nav__input' 
        onChange={onChange} value={searchValue} />

      <img className='nav__avatar' src='https://occ-0-4796-988.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABbme8JMz4rEKFJhtzpOKWFJ_6qX-0y5wwWyYvBhWS0VKFLa289dZ5zvRBggmFVWVPL2AAYE8xevD4jjLZjWumNo.png?r=a41' alt='User'
       onClick={() => navigate('mypage')} />
    </nav>
  )
}

export default Nav;