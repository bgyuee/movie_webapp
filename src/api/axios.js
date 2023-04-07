import axios from "axios";

const instance = axios.create({
  baseURL : "https://api.themoviedb.org/3", //api키 3까지만 복붙 이부분이 계속 반복되는 부분
  params : { //주소에서 ?다음에 api_key=5f205ab9f5ad9bd81fe4653c6f21c0fa 이부분이 params
    api_key: process.env.REACT_APP_MOVIE_DB_API_KEY,
    language:"ko-KR", //en-US parms안에 language라는 속성이 있다
  }
})

export default instance;