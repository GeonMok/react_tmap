// src/App.jsx
import React, { useState, useCallback } from "react";
import TMap from "@/components/TMap";
import MapControls from "@/components/MapControls";
import MapUI from "@/components/MapUI";

function Practice() {
  const [mapInstance, setMapInstance] = useState(null);
  const [mapStatus, setMapStatus] = useState("loading");

  const handleMapLoad = useCallback((map, status) => {
    setMapInstance(map);
    setMapStatus(status);
  }, []);

  return (
    // 전체 페이지 스타일
    <div className="min-h-screen bg-slate-100 flex flex-col items-center p-4 sm:p-6 md:p-8 font-sans">
      <h1 className="my-6 py-2 text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
        Tmap API in React
      </h1>

      {/* 지도와 오버레이 래퍼 */}
      <div className="relative w-full max-w-4xl h-[50vh] md:h-[60vh] rounded-2xl shadow-2xl overflow-hidden">
        {/* 지도 로드 */}
        <TMap onMapLoad={handleMapLoad} />
        {/* 지도 확대, 축소 버튼 */}
        <MapUI mapInstance={mapInstance} />

        {/* 로딩 및 에러 메시지 오버레이 */}
        {mapStatus !== "success" && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
            {mapStatus === "loading" && (
              <div className="text-lg font-semibold text-slate-600">
                지도 로딩 중...
              </div>
            )}
            {mapStatus === "error" && (
              <div className="text-center text-red-600">
                <p className="font-bold text-lg">지도 로딩 실패</p>
                <p className="text-sm mt-2">
                  API 키와 스크립트 로딩을 확인해주세요.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 지도 컨트롤러 */}
      <MapControls mapInstance={mapInstance} />
    </div>
  );
}

export default Practice;
