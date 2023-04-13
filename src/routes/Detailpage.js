import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from '../api/axios';

function Detailpage() {

  const [movie, setMovie] = useState({});
  let {movieId} = useParams(); //주소창에 params값을 가져온다 /54684 이값 //파람값이 :movieId이거임 //params는 특정 매개변수값을 추출할때 씀
  console.log('useParams()->', useParams());
  console.log('movieID ->', movieId);

  useEffect(() => {
    fetchdata();
  }, [movieId]);

  const fetchdata = async () => {
    // https://api.themoviedb.org/3/movie/{movie_id}?api_key=<<api_key>>&language=en-US
    try {
      const request = await axios.get(`/movie/${movieId}`); //post는 개인정보(회원가입)를 가져올때 쓰는거임
      console.log('request ->', request);

      setMovie(request.data);
    } catch (error) {
      console.log('error ->', error);
    }
  }
 
  if(!movie) return <div>...loading</div>

  return (
    <section>
      <img className='modal__poster-img'
        src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
        alt={movie.title || movie.name || movie.original_name}
        // 각종정보 추가하기
       />
    </section>
  )
}

export default Detailpage;