import React, { useEffect, useState } from 'react';

function useDebounce(value, delay) { //0.5초딜레이를 주는 훅함수
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => { //딜레이시간이 지나고 setTimeout이 딱 한번 실행된다
      setDebounceValue(value);
    }, delay); //0.5초 동안 더이상 입력이 안되면 setDebounceValue(value); 실행해라

    return () => { //위에께 실행되기 직전에 실행된다
      clearTimeout(handler); //handler함수를 끝낸다 새로운 value값이 들어오면 기존에 있던 settimeout을 지워준다 즉 0.5초 되기전에 글자가 입력이 계속되면 setDebounceValue(value);가 실행되지못하고 0.5초가 지날때까지 기다려야 setDebounceValue(value);가 실행된다
    }

  }, [value, delay]);

  

  return debounceValue;
}

export default useDebounce;