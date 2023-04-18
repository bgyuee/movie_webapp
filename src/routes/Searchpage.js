import axios from '../api/axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import "../styles/Searchpage.scss";
import useDebounce from 'hooks/useDebounce';
import MovieModal from 'components/MovieModal';
import { AxiosError } from 'axios';

function Searchpage() {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [ModalOpen, setModalOpen] = useState(false);
  const [movievideos, setMovievideos]  = useState("");

  console.log('selectedMovie ->', selectedMovie);
  
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  }
  // console.log('useLocation()->', useLocation());

  let query = useQuery();

  const searchTerm = query.get("q");
  const debounceSerarchTerm = useDebounce(searchTerm, 500); //여기서 훅함수 호출

  useEffect(() => {
    if(debounceSerarchTerm) {
      fetchSearchMovie(debounceSerarchTerm);
    }
  }, [debounceSerarchTerm])

  const fetchSearchMovie = async () => {
    try {
      const request = await axios.get(`/search/movie?include_adult=false&query=${debounceSerarchTerm}`);
      // console.log(`request ->`, request);
      setSearchResults(request.data.results);
    } catch (error) {
      console.log('error -> ', error);
    }
  }

  const handleMovieClick = async (movie) => {
    const {data: movieDetail} = await axios.get(`/movie/${movie.id}`, {params : {append_to_response: "videos"}});
    setSelectedMovie(movie);
    setMovievideos(movieDetail.videos); //비디오데이터
    setModalOpen(true);
  };

  const renderSearchResults = () => {
    return searchResults.length > 0 ? (
      <section className='search-container'>
        {searchResults.map(movie => {
          if(movie.backdrop_path !== null && movie.media_type !== "person"){
            const movieImageUrl ="https://image.tmdb.org/t/p/w500/" + movie.backdrop_path;
            return(
              <div className='movie' key={movie.id} >
                <div className='movie__colum-poster' onClick={() => handleMovieClick(movie)}>
                  <img src={movieImageUrl} alt={movie.title} className='movie__poster' />
                </div>
              </div>
            )
          }
        })}
        {ModalOpen && (
          <MovieModal {...selectedMovie} setModalOpen={setModalOpen} />
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

export default Searchpage;
