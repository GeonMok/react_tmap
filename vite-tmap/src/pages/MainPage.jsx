// src/pages/MainPage.jsx (setTimeout 적용 최종 버전)

import React, { useState, useCallback, useEffect, useRef } from "react";
import TMap from "../components/TMap";
import MapUI from "../components/MapUI";

function MainPage() {
  const [mapInstance, setMapInstance] = useState(null);
  const [mapStatus, setMapStatus] = useState("loading");
  const polygonsRef = useRef([]);

  const handleMapLoad = useCallback((map, status) => {
    setMapInstance(map);
    setMapStatus(status);
  }, []);

  useEffect(() => {
    // 맵 인스턴스가 준비되었을 때만 실행
    if (!mapInstance || mapStatus !== "success") {
      return;
    }

    const drawPolygons = async () => {
      // 이전에 그려진 폴리곤이 있다면 모두 삭제
      polygonsRef.current.forEach((p) => p.setMap(null));
      polygonsRef.current = [];

      try {
        const response = await fetch("/seoul_districts.geojson");
        const geojson = await response.json();
        const polygons = [];

        geojson.features.forEach((feature) => {
          const coordinates = feature.geometry.coordinates;
          const path = coordinates[0].map(
            (coord) => new window.Tmapv3.LatLng(coord[1], coord[0])
          );

          const polygon = new window.Tmapv3.Polygon({
            paths: path,
            fillColor: "#0284C7",
            fillOpacity: 0.2,
            strokeColor: "#0EA5E9",
            strokeWeight: 2,
            map: mapInstance,
          });
          polygons.push(polygon);
        });

        polygonsRef.current = polygons;
      } catch (error) {
        console.error("GeoJSON 데이터 처리 중 오류 발생:", error);
      }
    };

    // 지도 인스턴스가 생성된 후, 브라우저가 잠시 멈춤(breathing room)을 가질 수 있도록
    // setTimeout으로 아주 짧은 지연(0.1초) 후에 폴리곤을 그립니다.
    const timerId = setTimeout(drawPolygons, 90);

    // 컴포넌트가 사라질 때 예약된 타이머를 반드시 정리해줍니다 (메모리 누수 방지).
    return () => {
      clearTimeout(timerId);
    };
  }, [mapInstance, mapStatus]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="relative w-full max-w-6xl h-[50vh] md:h-[70vh] flex-grow rounded-2xl shadow-2xl overflow-hidden">
        <TMap onMapLoad={handleMapLoad} />
        <MapUI mapInstance={mapInstance} />

        {mapStatus !== "success" && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-20">
            {mapStatus === "loading" && (
              <div className="text-lg font-semibold text-slate-600">
                지도 로딩 중...
              </div>
            )}
            {mapStatus === "error" && (
              <div className="text-center text-red-600">
                <p className="font-bold text-lg">지도 로딩 실패</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MainPage;
