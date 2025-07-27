// src/components/TMap.jsx
import React, { useEffect, useRef } from "react";

function TMap({ onMapLoad }) {
  const mapContainer = useRef(null);

  useEffect(() => {
    let mapInstance = null; // useEffect 스코프 내에서 맵 인스턴스 관리
    let loadTimeout = null;

    const initMap = () => {
      if (mapContainer.current && !mapInstance) {
        try {
          mapInstance = new window.Tmapv3.Map(mapContainer.current, {
            center: new window.Tmapv3.LatLng(37.5652045, 126.98702028),
            width: "100%",
            height: "100%",
            zoom: 14,
          });
          // 맵 로드가 성공하면 부모 컴포넌트로 맵 인스턴스를 전달
          onMapLoad(mapInstance, "success");
          console.log("지도 생성 성공!");
        } catch (e) {
          console.error("지도 생성 중 에러 발생:", e);
          onMapLoad(null, "error");
        }
      }
    };

    const checkTmapReady = () => {
      if (window.Tmapv3 && window.Tmapv3.Map) {
        initMap();
        clearTimeout(loadTimeout); // 준비되면 타임아웃 해제
      } else {
        setTimeout(checkTmapReady, 100);
      }
    };

    loadTimeout = setTimeout(() => {
      onMapLoad(null, "error");
      console.error("TMap 로딩 시간 초과.");
    }, 5000);

    checkTmapReady();

    return () => {
      clearTimeout(loadTimeout);
      if (mapInstance) {
        mapInstance.destroy();
      }
    };
  }, [onMapLoad]);

  return <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />;
}

export default TMap;
