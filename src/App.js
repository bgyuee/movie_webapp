import React, { useEffect, useState } from 'react';
import "styles/App.scss";
import { authService } from 'fbase';
import AppRouter from 'Router';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if(user) {
        setIsLoggedIn(user);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  return (
    <div className="app">
      <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />
    </div>
  );
}

export default App;
