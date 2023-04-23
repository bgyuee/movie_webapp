import axios from '../api/axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from 'fbase';
import "../styles/Searchpage.scss";
import useDebounce from 'hooks/useDebounce';
import MovieModal from 'components/MovieModal';
import { GrCircleInformation } from "react-icons/gr";
import { FaPlay, FaPlus  } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import styled from 'styled-components';

function Searchpage({userObj}) {
  const userUid = userObj.uid;

  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [ModalOpen, setModalOpen] = useState(false);
  const [wishList, setWishList] = useState(false);
  const [likeList, setLikeList] = useState(false);
  const [likeTotal, setLikeTotal] = useState(0);
  const [vidoeplay, setVideoplay] = useState([]);
  console.log('selectedMovie ->', selectedMovie);

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  }
  // console.log('useLocation()->', useLocation());

  let queryParams = useQuery();

  const searchTerm = queryParams.get("q");
  const debounceSerarchTerm = useDebounce(searchTerm, 500); //여기서 훅함수 호출

  useEffect(() => {
    if(debounceSerarchTerm) {
      fetchSearchMovie(debounceSerarchTerm);
    }
  }, [debounceSerarchTerm])

  const fetchSearchMovie = async () => {
    try {
      const request = await axios.get(`/search/movie?include_adult=false&query=${debounceSerarchTerm}`);
      setSearchResults(request.data.results);
    } catch (error) {
      console.log('error -> ', error);
    }
  }

  const fetchvidoeMovie = async (movieId) => {
    const videomovie = await axios.get(`/movie/${movieId}`,
     {params : {append_to_response: "videos"}});
    setSelectedMovie(videomovie.data);
  }

  const handleClick = async (movieId) => {
    fetchvidoeMovie(movieId);
    setModalOpen(true);
  };
  const onMouseOver = (index, movieId) => () => {
    isMovieDibbed(userUid, movieId);
    isLikeUser(userUid, movieId);
    fetchvidoeMovie(movieId);

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
        const docRef = await addDoc(collection(db, `Likes/${movieId}/${userUid}`), {
          userid: userUid
        });
        setLikeList(true);
      }catch(e) {
        console.error(e);
      }
    }
  }

  // movie에 해당 유저가 있는지 확인
  const isLikeUser = async (userUid, movieId) => {
    const movieRef = collection(db, `Likes/${movieId}/${userUid}`);
    const q = query(movieRef, where(`userid`, `==`, `${userUid}`));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      setLikeList(true);
      setLikeTotal(querySnapshot.size);
    } else {
      setLikeList(false);
      setLikeTotal(0);
    }

    return !querySnapshot.empty;
  };
  // Like삭제
  const deleteLike = async (userUid, movieId) => {
    const movieRef = collection(db, `Likes/${movieId}/${userUid}`);
    const q = query(movieRef, where(`userid`, `==`, `${userUid}`));
    const querySnapshot = await getDocs(q);

    if(!querySnapshot.empty) {
      querySnapshot.forEach(user => {
        deleteDoc(doc(db, `Likes/${movieId}/${userUid}`, user.id));
        setLikeList(false);
      });
    }
  }

 /*-----------------------------------------------//좋아요 -------------------------------------------------------*/

  const renderSearchResults = () => {
    return searchResults.length > 0 ? (
      <section className='search-container'>
        {searchResults.map((movie, index) => {
          if(movie.backdrop_path !== null && movie.media_type !== "person"){

            const movieImageUrl ="https://image.tmdb.org/t/p/w500/" + movie.backdrop_path;

            return(

              <div className='movie' key={movie.id} 
              onMouseOver={onMouseOver(index, movie.id)} onMouseLeave={onMouseLeave(index)} >
                <div className='movie__colum-poster'>
                  {!vidoeplay[index] ? (
                    <img src={movieImageUrl} alt={movie.title} className='movie__poster' />
                  ) : (
                    movie[index]?.videos?.results?.[0]?.key ? (
                      <Iframe 
                      src={`https://www.youtube.com/embed/${movie?.videos?.results?.[0]?.key}?controls=0&autoplay=1&mute=1&playlist=${movie?.videos?.results?.[0]?.key}`}
                      />
                    ):(
                      <img src={movieImageUrl} alt={movie.title} className='movie__poster' />
                    )
                  )}
                  <div className='movie_information'>
                    <div className='movie_icon'>
                    <div className='movie_active'>
                      <span className='trailer_play info_icon' title='영화재생'><FaPlay /></span>
                      <span className={`WishList info_icon ${wishList && "icon_checked"}`} title='찜하기' onClick={() => Dib(userUid, movie.id)}><FaPlus /></span>
                      <span className={`like info_icon ${likeList && "icon_checked"}`} title='좋아요' onClick={() => Like(userUid, movie.id)}><FcLike /><strong>+{likeTotal}</strong></span>
                    </div>
                    <span className='information_more info_icon' title='상세정보' onClick={() => handleClick(movie)}>
                      <GrCircleInformation 
                        onClick={() => handleClick(movie.id, movie.genres)}
                      />
                    </span>
                  </div>
                  <span className='movieinfo_genre'>{movie.genres}</span>
                </div>
                </div>
              </div>
            )
          }
        })}
        {ModalOpen && (
          <MovieModal {...selectedMovie} movievideos={selectedMovie} setModalOpen={setModalOpen} />
        )}
      </section>
    ) : (
      <section className='no-results'>
        <div className='no-results__text'>
          <p>
            찾고자하는 검색어 "{searchTerm}"에 맞는 영화가 없습니다.
          </p>
        </div>
      </section>
    );
  }

  return renderSearchResults();
}

const Iframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`

export default Searchpage;
