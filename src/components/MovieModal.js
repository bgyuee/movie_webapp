import React from 'react';
import "styles/MovieModal.css";

function MovieModal({setModalOpen, backdrop_path, overview, release_date, first_air_date, title, name, vote_average}) {
  return (
    <div className='presentation'>
      <div className='wrapper-modal'>
        <div className='modal'>
          <span className='modal-close' onClick={() => setModalOpen(false)}>X</span>
          <img className='modal_poster-img' alt={title ? title : name} src={`https://image.tmdb.org/t/p/original/${backdrop_path}`} />
          <div className='modal_content'>
            <p className='modal_details'>
              <span className='modal__user_perc'>100% for you</span> {"  "}
              {release_date ? release_date : first_air_date}
            </p>
            <h2 className='modal__title'>{title ? title :name}</h2>
            <p className='modal__details'> 평점: {vote_average}</p>
            <p className='modal__overview'>{overview}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieModal