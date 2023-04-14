import React from 'react';
import { Outlet, Route, Routes } from "react-router-dom";
import Nav from "components/Nav";
import Footer from "components/Footer";
import Mainpage from "routes/Mainpage";
import Searchpage from "routes/Searchpage";
import Auth from 'routes/Auth';
import Mypage from 'routes/Mypage';

function AppRouter({isLoggedIn, userObj}) {

  const Layout = () => { //함수형 컴포넌트로 선언해준다
    return(
      <div>
        <Nav />
        <Outlet /> {/* 리액트돔안에 Outlet이라는 함수가 있다 /이자리에 (메인,디테일 서치,)즉, 자식요소의 경로를 랜더링할수 있다 Layout이 자식라우트들을 감싸고 부모요소들중 oulet요소를 넣으면 그자리에 레이아웃으로 감싼 자식요소들을 넣을수있다 */} 
        <Footer />
      </div>
    )
  }

  return (
    <>
      <Routes>
        {isLoggedIn ? (
          <Route path="/" element={<Layout />}>
            <Route index path="" element={<Mainpage />} /> {/* index => localhost:3000/ 즉 path ="/"이거랑 같다 부모의 주소를 그대로 가져온다 */}
            <Route path="search" element={<Searchpage />} />  {/* localhost:3000/search  부모주소기준/search */}
            <Route path='mypage' element={<Mypage userObj = {userObj} />} />
          </Route>
          ) : (
            <Route path='/' element={<Auth />} />
          )}
        </Routes>
    </>
  )
}

export default AppRouter;