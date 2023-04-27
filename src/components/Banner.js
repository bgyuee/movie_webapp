import React, { useEffect, useState } from 'react'
import axios from 'api/axios';  //api폴더안에있는 axios를 사용하겠다
import requests from 'api/requests';
import "styles/Banner.scss";
import styled from 'styled-components'; //styled conponent적용
import MovieModal from './MovieModal';

function Banner() {

  const [movie, setMovie] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const [ModalOpen, setModalOpen] = useState(false);
  // console.log(movie);
  useEffect(() => { //api가져오는건 항상 useEffect시점이다 //useEffect안에 async사용할수 없어서 함수로 넣어준다
    fetchData();
  }, []);

  const fetchData = async () => {
    //현재 상영중인 영화 정보를 가져오기(20개 영화)
    const request = await axios.get(requests.fetchNowPlaying); //기존에 axios로 했을대는 주소를 한꺼번에 했는데 이번에는 직접 axsio를 만들어서 baseurl이랑  params안에 api키까지 다 지정해놓고, requests라는 파일을 만들어 안에 상세한 주소까지넣어서 주소를 안치고 쉽게 받아올수있다
    // console.log('request --->',request);

    // 20 개 영화중에서 영화 하나의 ID를 랜덤하게 가져오기
    const movieId = request.data.results[
      Math.floor(Math.random() * request.data.results.length +0) //0 ~ 19인덱스번호의 데이터들이 있는데 이중에서 하나를 랜덤으로 선택해 거기에서의 id값을 뽑아낸다
    ].id;
    // console.log(movieId);

    // 특정 영화의 더 상세한 정보를 가져오기(videos 비디오 정보도 포함)
    // https://api.themoviedb.org/3/movie/157336?api_key={api_key}&append_to_response=videos
    const {
      data:
      movieDetail
    } = await axios.get(`/movie/${movieId}`, {  // 앞에정보가져오고 두에 ,붙이면 조건으로 params로 상세정보를 가져올수 있다, 문서에 들어가서 movie 항목을 보면 각각의 정보를 가져올때 쓰는 문장들이 있다
      params : {append_to_response: "videos"} //movieId를 가져올때, 해당 영화 정보에 관련된 비디오정보를 추가적으로 가져와라고 설정
    });
      setMovie(movieDetail);
      // console.log(`movieDetail ->>`, movieDetail);
  }

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str; //str?.length > n : str의 글자수가 100보다 클경우에 //? 되면되고 안되면 안되고 에러가 안뜸
                                                                // 100글자보다 크면 string에서 0번인덱스부터 99번인덱스까지 나오게하고 뒤에는 "..."을 붙여라 100자보다 작으면 그냥 써라
  }

  if(!isClicked){
    
    return (
      // https://image.tmdb.org/t/p/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg
      <header className='banner'
      style={{
        backgroundImage:`url("https://image.tmdb.org/t/p/original/${movie.backdrop_path}")`,
        backgroundPosition:"top center",
        backgroundSize:"cover"}}>
        <div className='banner__contents'>
          <h1 className='banner__title'>
            {movie.title || movie.name || movie.original_name}
            {/* null병합연산자: null이다 undefined값이 나오면 바로뒤에값을 실행해라 */}
          </h1>
          <div className='banner__buttons'>
            <button className='banner__button play' onClick={() => setIsClicked(true)}>
              재생
            </button>
            <button className='banner__button info' onClick={() => setModalOpen(true)}>
              영화 정보
            </button>
          </div>
          <p className='banner__description'>
            {truncate(movie.overview, 100)}
          </p>
        </div>
        <div className='banner__fadeBottom'></div>
        {ModalOpen&& <MovieModal {...movie} movievideos={movie} setModalOpen={setModalOpen}/>}
      </header>
    )
    } else{
      return (
        <Container>
          <HomeContainer>
            <Iframe
            src={`https://www.youtube.com/embed/${movie.videos.results[0]?.key}
            ?controls=0&autoplay=1&mute=1&playlist=${movie.videos.results[0]?.key}`} //?(optional 연산자):undefine이라는 데이터값을 넣어준다
            width='640'
            height='360'
            frmaeborder="0"
            allow="autoplay; fullscreen; ">
            </Iframe>
          </HomeContainer>
        </Container>
      )
    }
}

const Container = styled.div` 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
`;
//div로 만든다
//``안에 css를 넣는다

const HomeContainer = styled.div`
  width:100%;
  height:100%;
`;

const Iframe = styled.iframe`
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.65;
  border: none;
  &::after{
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

export default Banner;