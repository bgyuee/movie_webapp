import axios from '../api/axios';
import { db } from 'fbase';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

function Usermovie({userObj}) {
  const {uid} = userObj

  const [userwishList, setUserwishList] = useState("");
  const [wishListmovie, setWishListmovie] = useState([]);
  console.log('wishListmovie ->', wishListmovie);

    /* --------------------------------------------------------영화불러오기----------------------------------------------------------------------- */
  // 찜목록
  useEffect(() => {
    isMovieDibbed();
  }, [userObj])
  
  const isMovieDibbed = async () => {
    const movieRef = collection(db, `Dibs/${uid}/movies`);
    const querySnapshot = await getDocs(movieRef);
    const movies = [];

    querySnapshot.forEach((movie) => {
      movies.push(movie.data().movies);
    });
    setUserwishList(movies);
  }

// 해당 영화 불러오기
const fetchVideos = async () => {
  try {
    console.log("userwishList:", userwishList);
    const movieListPromises = userwishList.map(async (movie) => {
      // 영화 ID가 유효한지 확인
      if (movie && typeof movie === "number") {
        try {
          return await axios.get(`/movie/${movie}`, {
            params: { append_to_response: "videos" },
          });
        } catch (error) {
          console.error(`Error fetching movie with ID ${movie}:`, error);
          return null;
        }
      } else {
        return null;
      }
    });
    console.log('movieListPromises ->', movieListPromises);

    // movieListPromises를 기다리고 각 해결된 프라미스에서 data를 추출
    const movieListResponses = await Promise.all(movieListPromises);
    const movieList = movieListResponses
      .filter((response) => response !== null) // 영화 ID가 유효하지 않은 경우 필터링
      .map((response) => response.data);

    // 추출된 데이터를 setWishListmovie에 설정
    setWishListmovie(movieList);
  } catch (error) {
    console.error(error);
  }
};


useEffect(() => {
  if (userwishList.length > 0) {
    fetchVideos();
  }
}, [userwishList]);
  
  /* ---------------------------------------------------------//영화불러오기----------------------------------------------------------------------- */




  return (
    <MovieContent>
      <h3>내가 찜한 영화</h3>
      <div className='content_wishList'>
        {/* <Iframe src={`https://www.youtube.com/embed/${movievideos[index]?.videos?.results?.[0]?.key}?controls=0&autoplay=1&mute=1&playlist=${movievideos[index]?.videos?.results?.[0]?.key}`}/> */}
      </div>
      <h3>내가 좋아하는 영화</h3>
      <div className='content_like'></div>
    </MovieContent>
  )
}



const MovieContent = styled.div`
  h3{color:#fff;}
  .content_wishList{
    width: 100%;
  }
  .content_like{ }
    `
  

const Iframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`
export default Usermovie