import React, { useEffect, useState } from 'react'
import axios from 'api/axios';  //api폴더안에있는 axios를 사용하겠다
import requests from 'api/requests';
import "styles/Banner.css";

function Banner() {

  const [movie, setMovie] = useState([]);

  useEffect(() => { //api가져오는건 항상 useEffect시점이다
    fetchData();
  }, []);

  const fetchData = async () => {
    //현재 상영중인 영화 정보를 가져오기(20개 영화)
    const response = await axios.get(requests.fetchNowPlaying); //기존에 axios로 했을대는 주소를 한꺼번에 했는데 이번에는 직접 axsio를 만들어서 baseurl이랑  params안에 api키까지 다 지정해놓고, requests라는 파일을 만들어 안에 상세한 주소까지넣어서 주소를 안치고 쉽게 받아올수있다
    console.log(response);

    // 20 개 영화중에서 영화 하나의 ID를 랜덤하게 가져오기
    const movieId = response.data.results[
      Math.floor(Math.random() * response.data.results.length +0) //0 ~ 19
    ].id;
    console.log(movieId);

    // 특정 영화의 더 상세한 정보를 가져오기(videos 비디오 정보도 포함)
    // https://api.themoviedb.org/3/movie/157336?api_key={api_key}&append_to_response=videos
    const {
      data:
      movieDetail
    } = await axios.get(`/movie/${movieId}`, {  // 앞에정보가져오고 두에 ,붙이면 조건으로 params로 상세정보를 가져올수 있다
      params : {append_to_response: "videos"}
    });
      console.log(`movieDetail ->>`, movieDetail);
      setMovie(movieDetail);
  }

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str; //str?.length > n : str의 글자수가 100보다 클경우에 //? 되면되고 안되면 안되고 에러가 안뜸
  }


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
        <p className='banner__description'>
          {truncate(movie.overview, 100)}
        </p>
      </div>
    </header>
  )
}

export default Banner;