import React, { useEffect, useState } from 'react';
import "styles/App.scss";
import { authService } from 'fbase';
import AppRouter from 'Router';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
  const [userObj, setUserObj] = useState(null);
  const [init, setInit] = useState(false);

  const displayName = userObj ? userObj.displayName : null;
  const [username, setUsername] = useState(displayName);

  const photoURL = userObj? userObj.photoURL : null;
  const [userprofileImg, setUserprofileImg] = useState(photoURL);
  // console.log(userprofileImg);
  // console.log(userObj);

  const [appHeight, setAppHeight] = useState(false);
  

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if(user) {
        setIsLoggedIn(user);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, [userprofileImg, username]);

  return (
    <>
    {init ? (
      <div className="app">
       <AppRouter 
        isLoggedIn={isLoggedIn} 
        userObj={userObj} 
        userprofileImg={userprofileImg}
        setUserprofileImg={setUserprofileImg}
        setUsername={setUsername}
        />
     </div>
    ):(
      "로딩중..."
    )}
    </>
   
  );
}

export default App;
