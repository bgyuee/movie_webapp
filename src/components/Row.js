import axios from 'api/axios';
import React, { useEffect, useState } from 'react';
import MovieModal from 'components/MovieModal';
import "styles/Row.scss";

import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

function Row({isLargeRow, title, id, fetchUrl}) {
  const [movies, setMovies] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [movieSelected, setMovieSelected] = useState({}); //비어있는 object(객체)
  console.log('movieSelected ->', movieSelected);
  console.log('movies ->', movies);

  useEffect(() => {
    fetchMovieData();
  },[fetchUrl]); //componentDid update역활을 해준다

  const fetchMovieData = async () => {
   const request = await axios.get(fetchUrl);
   console.log(request);
   setMovies(request.data.results);
  }

  const handleClick = (movie) => {
    console.log('movie->',movie);
    setModalOpen(true);
    setMovieSelected(movie);
  }

  return (
    <section className='row' key={id}>
      <h2>{title}</h2>
      <Swiper
       modules={[Navigation, Pagination, Scrollbar, A11y]}
       navigation // arrow 버튼 사용 유무
      //  pagination={{ clickable: true }} //페이지 버튼 보이게 할지 (동그라미)
       loop={true} //무한롤링
       breakpoints={{ //각각의 해상도에따라서 몇개가 보이게 할거냐
        1378:{
          slidesPerView: 6, // 한번에 보이는 슬라이드 개수
          slidesPerGroup: 6 // 몇개씩 슬라이드 할지
        },
        998:{
          slidesPerView: 5, 
          slidesPerGroup: 5 
        },
        625: {
          slidesPerView: 4, 
          slidesPerGroup: 4 
        },
        0: {
          slidesPerView: 3, 
          slidesPerGroup: 3 
        }}}
      >
          <div id={id} className='row__posters'>
            {movies.map((movie) => (
              <SwiperSlide>
              <img
                key={movie.id}
                onClick={() => handleClick(movie)}
                className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                src={`https://image.tmdb.org/t/p/original/${isLargeRow ? movie.poster_path : movie.backdrop_path}`} //큰이미지:작은이미지
                loading='lazy'
                alt={movie.title || movie.name || movie.original_name}
              />
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