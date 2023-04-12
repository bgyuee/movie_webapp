import React, { useEffect } from 'react';

function useOnClickOutside(ref, handler) {
  useEffect(() => {
    console.log('ref ->', ref); //ref.current는 div.class 모달창

    const listener = (event) => {
      if(!ref.current || ref.current.contains(event.target)) { //div.class모달창이 null이면 || 타겟이 되는애가 모달창안에 포함이 되어잇으면
        // 모달창이 안 닫히는 경우
        return; //함수를 끝내라
      }
      // 모달창이 닫히는 경우 (event) => {setModalOpen(false)}
      handler(event); //아니면은 이함수를 실행해라
    }
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
  }, [ref, handler]);
}

export default useOnClickOutside;
