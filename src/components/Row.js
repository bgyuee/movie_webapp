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
import styled from 'styled-components';
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from 'fbase';

function Row({title, id, fetchUrl, userUid, istv}) {
  const [movies, setMovies] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [movieSelected, setMovieSelected] = useState("");
  const [movievideos, setMovievideos]  = useState(""); //비디오데이터까지 있는 영화데이터
  const [rowgenres, setRowgenres] = useState([]);
  const [selectgenre, setSelectgenre] = useState("");
  const [vidoeplay, setVideoplay] = useState([]);
  const [movieindex, setMovieindex] = useState("");
  const [wishList, setWishList] = useState(false);
  const [likeList, setLikeList] = useState(false);
  const [likeTotal, setLikeTotal] = useState(0);
  
  useEffect(() => {
    fetchMovieData();
  },[fetchUrl]); //componentDid update역활을 해준다

  useEffect(() => {
    if (movies.length > 0) {
      fetchGenre();
      fetchVideos();
    }
  }, [movies]);


  const fetchMovieData = async () => {
    const request = await axios.get(fetchUrl);

    setMovies(request.data.results);
  }

  const fetchGenre = async () => {
    try {
      const request = await axios.get(`/genre/movie/list`);
      const genres = request.data.genres;
      const rowGenres = movies.map(movie => (
        movie.genre_ids.map(id => {
          const genre = genres.find(g => g.id === id);
          return genre ? genre.name : null;
        })
      ));
      setRowgenres(rowGenres);
    }catch (error) {
      console.log('error -> ', error);
    }
  }

  const fetchVideos = async () => {
    try {
      const videoRequests = movies.map((movie) => {
        const url = istv ? `/tv/${movie.id}` : `/movie/${movie.id}`;
        return axios.get(url, {
          params: { append_to_response: "videos" },
        });
      });

      const videoResponses = await Promise.all(videoRequests);
      const movieVideos = videoResponses.map((response) => response.data);
      setMovievideos(movieVideos);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = (movie, genre, index) => {
    setMovieSelected(movie);
    setSelectgenre(genre);
    setMovieindex(index);
    setModalOpen(true);
  }

  const onMouseOver = (index, movieId) => () => {
    isMovieDibbed(userUid, movieId);
    isLikeUser(userUid, movieId);
    getLikesCount(movieId);

    setVideoplay((prevState) => {
      const newState = [...prevState];
      newState[index] = true;
      return newState;
    });
  };
  
  const onMouseLeave = (index) => () => {
    setLikeTotal(0);
    setVideoplay((prevState) => {
      const newState = [...prevState];
      newState[index] = false;
      return newState;
    });
  };
  
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
    }
  }
 /*---------------------------------------------- //찜하기 -------------------------------------------------------*/
 /*-----------------------------------------------좋아요 -------------------------------------------------------*/
  const Like = async (userUid, movieId) => {
    const isLiked = await isLikeUser(userUid, movieId);

    if(isLiked) {
      await deleteLike(userUid, movieId);
    }else {
      try {
        const docRef = await addDoc(collection(db, `Likes/${movieId}/userUid`), {
          userid: userUid
        });
        setLikeList(true);
      }catch(e) {
        console.error(e);
      }
    }
  }
  // movieId에 해당하는 문서 수를 가져오는 함수
  const getLikesCount = async (movieId) => {
    const likesRef = collection(db, `Likes/${movieId}/userUid`);
    const querySnapshot = await getDocs(likesRef);
    
    setLikeTotal(querySnapshot.size);
};

  // movie에 해당 유저가 있는지 확인
  const isLikeUser = async (userUid, movieId) => {
    const movieRef = collection(db, `Likes/${movieId}/userUid`);
    const q = query(movieRef, where(`userid`, `==`, `${userUid}`));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      setLikeList(true);
    } else {
      setLikeList(false);
      setLikeTotal(0);
    }

    return !querySnapshot.empty;
  };
  // Like삭제
  const deleteLike = async (userUid, movieId) => {
    const movieRef = collection(db, `Likes/${movieId}/userUid`);
    const q = query(movieRef, where(`userid`, `==`, `${userUid}`));
    const querySnapshot = await getDocs(q);

    if(!querySnapshot.empty) {
      querySnapshot.forEach(user => {
        deleteDoc(doc(db, `Likes/${movieId}/userUid`, user.id));
        setLikeList(false);
      });
    }
  }

 /*-----------------------------------------------//좋아요 -------------------------------------------------------*/

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
                 movievideos[index]?.videos?.results?.[0]?.key ? (
                  <Iframe 
                  src={`https://www.youtube.com/embed/${movievideos[index]?.videos?.results?.[0]?.key}?controls=0&autoplay=1&mute=1&playlist=${movievideos[index]?.videos?.results?.[0]?.key}`}
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
                    <span className={`like info_icon ${likeList && "icon_checked"}`} title='좋아요' onClick={() => Like(userUid, movie.id)}><FcLike /><strong>+{likeTotal}</strong></span>
                  </div>
                  <span className='information_more info_icon' title='상세정보'>
                    <GrCircleInformation 
                      onClick={() => handleClick(movie, rowgenres[index], index)}
                    />
                  </span>
                </div>
                <span className='movie_title'>{movie.title ? movie.title :movie.name}</span>
                <span className='movieinfo_genre'>{rowgenres[index]}</span>
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
          movievideos={movievideos}  
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
export default Row;