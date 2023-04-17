import axios from 'api/axios';
import React, { useEffect, useState } from 'react';
import MovieModal from 'components/MovieModal';
import "styles/Row.scss";
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { GrCircleInformation } from "react-icons/gr";
import { FcLike } from "react-icons/fc";
import { FaPlay, FaPlus  } from "react-icons/fa";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

function Row({title, id, fetchUrl}) {
  const [movies, setMovies] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [movieSelected, setMovieSelected] = useState({}); //비어있는 object(객체)
  const [movievideos, setMovievideos]  = useState("");
  // console.log('movieSelected ->', movieSelected);
  // console.log('movies ->', movies);
  console.log(title);
  

  useEffect(() => {
    fetchMovieData();
  },[fetchUrl]); //componentDid update역활을 해준다

  const fetchMovieData = async () => {
   const request = await axios.get(fetchUrl);
  //  console.log(request);
   setMovies(request.data.results);
  }

  const handleClick = async (movie) => {
    const {data: movievideos} = await axios.get(`/movie/${movie.id}`, {params : {append_to_response: "videos"}});
    setMovieSelected(movie);
    setMovievideos(movievideos.videos); //영화데이터
    setModalOpen(true);
  }

  return (
    <section className='row' key={id}>
      <h2>
      {(() => {
      switch(title) {
        case "NETFLIX ORIGINALS":
          return "오리지널";
        case "Trending Now":
          return "지금 뜨는 콘텐츠";
        case "Top Rated":
          return "인기 콘텐츠";
        case "Animation Movie":
          return "애니메이션";
        case "Family Movie":
          return "가족";
        case "Adventure Movie":
          return "모험"
        case "Science Movie":
          return "과학";
        case "Action Movie":
          return "액션";
        default:
          return title;
      }
    })()}
      </h2>
      <Swiper
       modules={[Navigation, Pagination, Scrollbar, A11y]}
       navigation // arrow 버튼 사용 유무
      //  pagination={{ clickable: true }} //페이지 버튼 보이게 할지 (동그라미)
       loop={true} //무한롤링
       breakpoints={{ //각각의 해상도에따라서 몇개가 보이게 할거냐
        1378:{
          slidesPerView: 5, // 한번에 보이는 슬라이드 개수
          slidesPerGroup: 5 // 몇개씩 슬라이드 할지
        },
        998:{
          slidesPerView: 4, 
          slidesPerGroup: 4 
        },
        625: {
          slidesPerView: 3, 
          slidesPerGroup: 3 
        },
        0: {
          slidesPerView: 2, 
          slidesPerGroup: 2 
        }}}
      >
          <div id={id} className='row__posters'>
            {movies.map((movie) => (
              <SwiperSlide key={movie.id} className='movie_slide'>
              <img
                onClick={() => handleClick(movie)}
                className={`row__poster`}
                src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`} //큰이미지:작은이미지
                loading='lazy'
                alt={movie.title || movie.name || movie.original_name}
              />
              <div className='movie_information'>
                <span className='trailer_play'><FaPlay /></span>
                <span className='WishList'><FaPlus /></span>
                <span className='like'><FcLike /></span>
                <span className='information_more'><GrCircleInformation /></span>
              </div>
              </SwiperSlide>
            ))}
          </div>
      </Swiper>

      {modalOpen && (
        <MovieModal {...movieSelected} setModalOpen={setModalOpen}/> //객체를 내보낼때 스프레디연산자를 사용하면 movie안에 있는 개체의 속성들을 다 내보내줄수 있다.
      )}
    </section>
  )
}

export default Row