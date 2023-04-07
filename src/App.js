import Banner from "components/Banner";
import Nav from "components/Nav";
import Row from "components/Row";
import Footer from "components/Footer";
import "styles/App.css";

function App() {
  return (
    <div className="app">
      <Nav />
      <Banner />
      <Row />
      <Footer />
    </div>
  );
}

export default App;
