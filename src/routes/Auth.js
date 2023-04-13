import React, { useState } from 'react';

function Auth() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState('true'); // true:회원가입, false:로그인
  const [error, setError] = useState('');


  return (
    <div className='auth_wrap'>
      <h2>{newAccount ? "Sign up" : "Login"}</h2>
      {error && <div className='error'>{error}</div>}
      <div className='auth_content'>
        <form>
          <input className='auth_email' name='email' type='email' placeholder='이메일'></input>
          <input className='auth_password' name='password' type='password'></input>
        </form>
      </div>
    </div>
  )
}

export default Auth;