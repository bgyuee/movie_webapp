import axios from 'api/axios';
import React, { useEffect, useState } from 'react';
import MovieModal from 'components/MovieModal';
import "styles/Row.css";

function Row({isLargeRow, title, id, fetchUrl}) {
  const [movies, setMovies] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [movieSelected, setMovieSelected] = useState({}); //비어있는 object(객체)

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
    <section className='row'>
      <h2>{title}</h2>
      <div className='slider'>
        <div className='slider__arrow left'>
          <span className='arrow'
           onClick={() => { document.getElementById(id).scrollLeft -= (window.innerWidth - 80); }} //arrow띠 width가 80이기 때문에 -80
           >
            {"<"}
          </span>
        </div>
        <div id={id} className='row__posters'>
          {movies.map((movie) => (
            <img
              key={movie.id}
              onClick={() => handleClick(movie)}
              className={`row__poster ${isLargeRow && "row__posterLarge"}`}
              src={`https://image.tmdb.org/t/p/original/${isLargeRow ? movie.poster_path : movie.backdrop_path}`} //큰이미지:작은이미지
              loading='lazy'
              alt={movie.title || movie.name || movie.original_name}
             />
          ))}
        </div>
        <div className='slider__arrow right'>
          <span className='arrow'
          onClick={() => { document.getElementById(id).scrollLeft += (window.innerWidth - 80); }}
          >
            {">"}
          </span>
        </div>
      </div>

      {modalOpen && (
        <MovieModal {...movieSelected} setModalOpen={setModalOpen}/> //객체를 내보낼때 스프레디연산자를 사용하면 movie안에 있는 개체의 속성들을 다 내보내줄수 있다.
      )}
    </section>
  )
}

export default Row