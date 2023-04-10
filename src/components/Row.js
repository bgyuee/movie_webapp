import axios from 'api/axios';
import React, { useEffect, useState } from 'react';
import "styles/Row.css";

function Row({isLargeRow, title, id, fetchUrl}) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetchMovieData();
  },[fetchUrl]); //componentDid update역활을 해준다

  const fetchMovieData = async () => {
   const request = await axios.get(fetchUrl);
   console.log(request);
   setMovies(request.data.results);
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
    </section>
  )
}

export default Row