import requests from 'api/requests';
import Banner from 'components/Banner';
import Row from 'components/Row';
import React from 'react';

function Mainpage({uid}) {
  // console.log('uid -> ', uid);
  return (
    <div>
      <Banner />
      <Row title="NETFLIX ORIGINALS" id="NO" fetchUrl={requests.fetchNetflixOriginals} userUid={uid} istv />
      <Row title="Trending Now" id="Tn" fetchUrl={requests.fetchTrending} userUid={uid} />
      <Row title="Top Rated" id="TR" fetchUrl={requests.fetchTopRated} userUid={uid}/>
      <Row title="Animation Movie" id="AM" fetchUrl={requests.fetchAnimationMovies} userUid={uid} />
      <Row title="Family Movie" id="FM" fetchUrl={requests.fetchFamilyMovies} userUid={uid} />
      <Row title="Adventure Movie" id="DM" fetchUrl={requests.fetchAdventureMovies} userUid={uid} />
      <Row title="Science Movie" id="SM" fetchUrl={requests.fetchScienceFictionMovies} userUid={uid} />
      <Row title="Action Movie" id="CM" fetchUrl={requests.fetchAction} userUid={uid} />
    </div>
  )
}

export default Mainpage