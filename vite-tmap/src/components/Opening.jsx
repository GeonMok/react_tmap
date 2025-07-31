import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';

// Opening 컴포넌트는 애니메이션 종료를 알리는 onFinished 함수를 props로 받습니다.
function Opening({ onFinished }) {
  // isOpening: 애니메이션 시작 여부를 관리하는 상태
  const [isOpening, setIsOpening] = useState(false);

  // isOpening 상태가 true로 변경되면 애니메이션이 시작됩니다.
  // 애니메이션 시간(1초)이 지난 후, onFinished 함수를 호출하여
  // App.jsx에게 애니메이션이 끝났음을 알립니다.
  useEffect(() => {
    if (!isOpening) return;

    const timer = setTimeout(() => {
      onFinished();
    }, 1000); // transition duration과 일치해야 합니다.

    // 컴포넌트가 사라질 때 타이머를 정리합니다.
    return () => clearTimeout(timer);
  }, [isOpening, onFinished]);

  // 클릭 시 isOpening 상태를 true로 바꿔 애니메이션을 트리거합니다.
  const handleOpen = () => {
    setIsOpening(true);
  };

  return (
    // 전체 화면을 덮는 컨테이너입니다. 클릭 이벤트를 감지합니다.
    // z-50: 다른 요소들보다 위에 보이도록 z-index를 높게 설정합니다.
    <div
      className="fixed inset-0 z-50 cursor-pointer overflow-hidden bg-gray-300"
      onClick={handleOpen}
    >
      {/* 상단(왼쪽 위) 삼각형 부분 */}
      <div
        className={`absolute inset-0 bg-white flex items-center justify-center transition-transform duration-1000 ease-in-out ${
          isOpening ? '-translate-y-full' : 'translate-y-0'
        }`}
        // clip-path를 이용해 대각선으로 요소를 자릅니다.
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 44.9%, 0 54.9%)' }}
      >
        <div className='relative w-full h-full'>
        {/* Findust 로고와 텍스트를 여기에 배치합니다. */}
        <div className="absolute top-21/48 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-5">
            <h1 className="text-6xl font-bold text-green-600">
                Findust <span className="text-3xl">💎</span>
            </h1>
            <p className="text-gray-500 mt-2">미세먼지 예측 서비스를 사용해보세요</p>
        </div>
        <Link
          to="/login" // 나중에 만들 로그인 페이지 경로
          onClick={(e) => e.stopPropagation()} // 클릭 시 애니메이션이 실행되지 않도록 이벤트 전파를 막습니다.
          className="absolute top-6 right-8 text-lg font-semibold text-gray-600 hover:text-green-600"
        >
          Sign in
        </Link>
        </div>
      </div>
      
      {/* 하단(오른쪽 아래) 삼각형 부분 */}
      <div
        className={`absolute inset-0 bg-white transition-transform duration-1000 ease-in-out ${
          isOpening ? 'translate-y-full' : 'translate-y-0'
        }`}
        style={{ clipPath: 'polygon(0 55.1%, 100% 45.1%, 100% 100%, 0% 100%)' }}
      ></div>
    </div>
  );
}

export default Opening;