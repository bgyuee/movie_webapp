import { authService } from 'fbase';
import { GithubAuthProvider, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import React, { useState } from 'react';
import 'styles/auth.scss';

function Auth() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState('true'); // true:회원가입, false:로그인
  const [error, setError] = useState('');

  const onChange = e => {
    const name = e.target.name;
    const value = e.target.value;

    if(name === 'email') setEmail(value);
    if(name === 'password') setPassword(value);
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    try{
      let data;
      if(newAccount) { //회원가입
        data = await createUserWithEmailAndPassword(authService, email, password);
      }else { //로그인
        data = await signInWithEmailAndPassword(authService, email, password);
      }
      console.log('회원정보', data);
    } catch (error) {
        console.log(error.message);
        setError(error.message);
    }
  }

  const onSocialClick = async (e) => {
    const name = e.target.name;
    let provider;
    if(name === 'google') provider = new GoogleAuthProvider();
    if(name === 'github') provider = new GithubAuthProvider();

    const data = await signInWithPopup(authService, provider);
  }

  return (
    <div className='auth_wrap'>
      <h2>{newAccount ? "Sign up" : "Login"}</h2>
      {error && <div className='error'>{error}</div>}
      <div className='auth_content'>
        <form onSubmit={onSubmit}>
          <input className='auth_email' name='email' type='email' placeholder='이메일' required
            value={email} onChange={onChange} />
          <input className='auth_passwword' name='password' type='password' placeholder='비밀번호' required
            value={password} onChange={onChange}/>
          <input className='auth_submit' type='submit' value={newAccount ? "회원가입":"로그인"} />
        </form>
        <span className='auth_convert' onClick={() => setNewAccount(prev => !prev)}>
          {newAccount ? "로그인" : "회원가입"}
        </span>
        <div className='auth_another'>
          <button className='auth_google' name='google' onClick={onSocialClick}>Google</button>
          <button className='auth_github' name='github' onClick={onSocialClick}>Github</button>
        </div>
      </div>
    </div>
  )
}

export default Auth;