import Banner from "components/Banner";
import Nav from "components/Nav";
import Row from "components/Row";
import Footer from "components/Footer";
import "styles/App.css";
import requests from "api/requests";
import { Outlet, Route, Routes } from "react-router-dom";
import Mainpage from "routes/Mainpage";
import Detailpage from "routes/Detailpage";
import Searchpage from "routes/Searchpage";

function App() {

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
    <div className="app">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index path="" element={<Mainpage />} /> {/* index => localhost:3000/ 즉 path ="/"이거랑 같다 부모의 주소를 그대로 가져온다 */}
          <Route path=":mobieId" element={<Detailpage />} /> {/*localhost:3000/863  부모주소기준/863*/}
          <Route path="search" element={<Searchpage />} />  {/* localhost:3000/search  부모주소기준/search */}
        </Route>
      </Routes>

      {/* <Nav />
      <Banner />
      <Row title="NETFLIX ORIGINALS" id="NO" fetchUrl={requests.fetchNetflixOriginals} isLargeRow />
      <Row title="Trending Now" id="Tn" fetchUrl={requests.fetchTrending} />
      <Row title="Top Rated" id="TR" fetchUrl={requests.fetchTopRated} />
      <Row title="Animation Movie" id="AM" fetchUrl={requests.fetchAnimationMovies} />
      <Row title="Family Movie" id="FM" fetchUrl={requests.fetchFamilyMovies} />
      <Row title="Adventure Movie" id="DM" fetchUrl={requests.fetchAdventureMovies} />
      <Row title="Science Movie" id="SM" fetchUrl={requests.fetchScienceFictionMovies} />
      <Row title="Action Movie" id="CM" fetchUrl={requests.fetchAction} />
      <Footer /> */}
    </div>
  );
}

export default App;
