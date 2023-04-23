import React, { useState } from 'react';
import axios from 'api/axios';
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
import styled from 'styled-components';
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from 'fbase';

function UserRow({movies, title, userUid}) {

  // const [genres] = movies;

  const [wishList, setWishList] = useState(false);
  const [vidoeplay, setVideoplay] = useState([]);
  const [movieSelected, setMovieSelected] = useState("");
  const [selectgenre, setSelectgenre] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [movieindex, setMovieindex] = useState("");

  /*---------------------------------------------- 찜하기 -------------------------------------------------------*/
  // 해당 무비상세정보를 클릭했을때 토글처럼 추가 or 삭제기능
  const Dib = async (userUid, movieId) => {
    const isDibbed = await isMovieDibbed(userUid, movieId);

    if(isDibbed) {
      await deleteMovie(userUid, movieId);
    }else {
      try {
        const docRef = await addDoc(collection(db, `Dibs/${userUid}/movies`), {
          movies: movieId
        });
        setWishList(true);
      } catch(e) {
        console.error(e);
      }
    }
  }

  // 해당 movieId가 있는지 확인
  const isMovieDibbed = async (userUid, movieId) => {
    const movieRef = collection(db, `Dibs/${userUid}/movies`);
    const q = query(movieRef, where(`movies`, `==`, movieId));
    const querySnapshot = await getDocs(q);
    // console.log('querySnapshot =>', querySnapshot);

    (!querySnapshot.empty? (setWishList(true)):(setWishList(false)));

    return !querySnapshot.empty;
  };

  const deleteMovie = async (userUid, movieId) => {
    const movieRef = collection(db, `Dibs/${userUid}/movies`);
    const q = query(movieRef, where(`movies`, `==`, movieId));
    const querySnapshot = await getDocs(q);

    if(!querySnapshot.empty) {
      querySnapshot.forEach(movie => {
        deleteDoc(doc(db, `Dibs/${userUid}/movies`, movie.id));
        setWishList(false);
      });
    }else {
      console.log('삭제할 영화가 없습니다.');
    }
  }
 /*---------------------------------------------- //찜하기 -------------------------------------------------------*/


 const handleClick = (movie, genre, index) => {
  setMovieSelected(movie);
  setSelectgenre(genre);
  setMovieindex(index);
  setModalOpen(true);
}

  const onMouseOver = (index, moiveId) => () => {
    isMovieDibbed(userUid, moiveId);

    setVideoplay((prevState) => {
      const newState = [...prevState];
      newState[index] = true;
      return newState;
    });
  };
  
  const onMouseLeave = (index) => () => {
    setVideoplay((prevState) => {
      const newState = [...prevState];
      newState[index] = false;
      return newState;
    });
  };

  return (
    <section className='row userRow'>
      <h2>{title}</h2>
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
          <div className='row__posters'>
            {movies.map((movie, index) => (
              <SwiperSlide key={movie.id} className='movie_slide' 
              onMouseOver={onMouseOver(index, movie.id)} onMouseLeave={onMouseLeave(index)}>
              {!vidoeplay[index] ? (
                 <img
                 className={`row__poster`}
                 src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`} //큰이미지:작은이미지
                 loading='lazy'
                 alt={movie.title || movie.name || movie.original_name}
               />
              ):(
                 movies[index]?.videos?.results?.[0]?.key ? (
                  <Iframe 
                  src={`https://www.youtube.com/embed/${movies[index]?.videos?.results?.[0]?.key}?controls=0&autoplay=1&mute=1&playlist=${movies[index]?.videos?.results?.[0]?.key}`}
                  />
                ):(
                  <img
                  className={`row__poster`}
                  src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`} //큰이미지:작은이미지
                  loading='lazy'
                  alt={movie.title || movie.name || movie.original_name}
                />
                )
              )}
              <div className='movie_information'>
                <div className='movie_icon'>
                  <div className='movie_active'>
                    <span className='trailer_play info_icon' title='영화재생'><FaPlay /></span>
                    <span className={`WishList info_icon ${wishList && "icon_checked"}`} title='찜하기' onClick={() => Dib(userUid, movie.id)}><FaPlus /></span>
                    <span className='like info_icon' title='좋아요'><FcLike /></span>
                  </div>
                  <span className='information_more info_icon' title='상세정보'>
                    <GrCircleInformation 
                      onClick={() => handleClick(movie, movie.genres, index)}
                    />
                  </span>
                </div>
                <span className='movieinfo_genre'>{movie.genres.name}</span>
              </div>
              </SwiperSlide>
            ))}
          </div>
      </Swiper>

      {modalOpen && (
        <MovieModal 
          {...movieSelected} //객체를 내보낼때 스프레디연산자를 사용하면 movie안에 있는 개체의 속성들을 다 내보내줄수 있다.
          setModalOpen={setModalOpen} 
          selectgenre={selectgenre} 
          movievideos={movies}  
          movieindex={movieindex}
        /> 
      )}
    </section>
  )
}

const Iframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`

export default UserRow