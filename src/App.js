import Banner from "components/Banner";
import Nav from "components/Nav";
import Row from "components/Row";
import Footer from "components/Footer";
import "styles/App.css";
import requests from "api/requests";

function App() {
  return (
    <div className="app">
      <Nav />
      <Banner />
      <Row title="NETFLIX ORIGINALS" id="NO" fetchUrl={requests.fetchNetflixOriginals} isLargeRow />
      <Row title="Trending Now" id="Tn" fetchUrl={requests.fetchTrending} />
      <Row title="Top Rated" id="TR" fetchUrl={requests.fetchTopRated} />
      <Row title="Animation Movie" id="AM" fetchUrl={requests.fetchAnimationMovies} />
      <Row title="Family Movie" id="FM" fetchUrl={requests.fetchFamilyMovies} />
      <Row title="Adventure Movie" id="DM" fetchUrl={requests.fetchAdventureMovies} />
      <Row title="Science Movie" id="SM" fetchUrl={requests.fetchScienceFictionMovies} />
      <Row title="Action Movie" id="CM" fetchUrl={requests.fetchAction} />
      <Footer />
    </div>
  );
}

export default App;
