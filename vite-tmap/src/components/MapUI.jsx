// src/components/MapUI.jsx
import React from "react";

function MapUI({ mapInstance }) {
  // 줌 인 함수
  const zoomIn = () => {
    mapInstance?.zoomIn();
  };

  // 줌 아웃 함수
  const zoomOut = () => {
    mapInstance?.zoomOut();
  };

  // mapInstance가 아직 로드되지 않았으면 아무것도 렌더링하지 않음
  if (!mapInstance) {
    return null;
  }

  return (
    // 'absolute'를 이용해 지도 위에 띄웁니다.
    // top-4, right-4로 우측 상단에 위치시킵니다.
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
      <button
        onClick={zoomIn}
        className="w-10 h-10 bg-white rounded-lg shadow-lg text-2xl font-bold text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center"
        aria-label="Zoom In"
      >
        +
      </button>
      <button
        onClick={zoomOut}
        className="w-10 h-10 bg-white rounded-lg shadow-lg text-2xl center font-bold text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center"
        aria-label="Zoom Out"
      >
        -
      </button>
    </div>
  );
}

export default MapUI;
