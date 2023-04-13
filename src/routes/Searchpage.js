import axios from '../api/axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../styles/Searchpage.css";
import useDebounce from 'hooks/useDebounce';
import MovieModal from 'components/MovieModal';

function Searchpage() {
  const [searchResults, setSearchResults] = useState([]); //영화를 배열로 받아오겠다
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const useQuery = () => {
    return new URLSearchParams(useLocation().search); //URLSearchParams이거를 사용하면 객체를 가져올수있다 useLocation 객체안에 search속성을 가져오겠다
  }
  console.log('useLocation()->', useLocation());

  let query = useQuery(); // ?q=spiderman

  const searchTerm = query.get("q"); //q에 해당되는 값을 가져와라
  const debounceSerarchTerm = useDebounce(searchTerm, 500); //0.5초

  useEffect(() => {
    if(debounceSerarchTerm) {
      fetchSearchMovie(debounceSerarchTerm);
    }
  }, [debounceSerarchTerm]) //검색이 바뀔때마다 실행해라

  const fetchSearchMovie = async () => {
    try {
      const request = await axios.get(`/search/movie?include_adult=false&query=${debounceSerarchTerm}`); //axios안에 api키가 있음 //query검색할 질문이뭐냐 //debounceSerarchTerm호출하겠다
      // https://api.themoviedb.org/3/search/&query=
      console.log(`request ->`, request);
      setSearchResults(request.data.results);
    } catch (error) {
      console.log('error -> ', error);
    }
  }

  const renderSearchResults = () => {
    return searchResults.length > 0 ? ( //검색결과 o
      <section className='search-container'>
        {searchResults.map(movie => {
          if(movie.backdrop_path !== null && movie.media_type !== "person"){
            const movieImageUrl ="https://image.tmdb.org/t/p/w500/" + movie.backdrop_path;
            return(
              <div className='movie' key={movie.id} >
                {!modalOpen ? (
                   <div className='movie__colum-poster' onClick={() => setModalOpen(true)}>
                   <img src={movieImageUrl} alt={movie.title} className='movie__poster' /> {/*여기다가 평점, 다른정보들도 넣기*/ }
                 </div>
                ):(
                  <MovieModal {...movie} setModalOpen={setModalOpen} key={movie.id} />
                )}
              </div>
            )
          }
        })}
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

  return renderSearchResults(); //함수안에 true값이나 false값을 내보내주겠다
}

export default Searchpage;