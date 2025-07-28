import React, { useState, useCallback, useEffect, useRef } from "react";
import TMap from "../components/TMap";
import MapUI from "../components/MapUI";

const TmapSearch = () => {
  // 상태 관리
  const markersRef = useRef([]); // 마커 배열
  const [searchResults, setSearchResults] = useState([]); // 검색 결과 목록
  const [searchKeyword, setSearchKeyword] = useState("서울시"); // 검색 키워드

  // 지도 컨테이너에 대한 ref
  const [mapInstance, setMapInstance] = useState(null);
  const [mapStatus, setMapStatus] = useState("loading");

  const handleMapLoad = useCallback((map, status) => {
    setMapInstance(map);
    setMapStatus(status);
  }, []);
  /*
  useEffect = () => {
    // 맵 인스턴스가 준비되었을 때만 실행
    if (!mapInstance || mapStatus !== "success") {
      return;
    }
  };
*/
  // 검색 버튼 클릭 핸들러
  const handleSearch = async () => {
    if (!mapInstance) return;

    const tmapApiKey = import.meta.env.VITE_TMAP_APP_KEY;
    try {
      const response = await fetch(
        `https://apis.openapi.sk.com/tmap/pois?version=1&format=json&searchKeyword=${searchKeyword}&resCoordType=EPSG3857&reqCoordType=WGS84GEO&count=10`,
        {
          method: "GET",
          headers: { appKey: tmapApiKey },
        }
      );

      if (!response.ok) throw new Error("API 호출에 실패했습니다.");

      const data = await response.json();
      const pois = data.searchPoiInfo.pois.poi;
      console.log(data);
      // 이전 마커 제거
      markersRef.current.forEach((marker) => {
        marker.setMap(null); // 마커를 지도에서 제거
      });
      markersRef.current = []; // 마커 배열 비우기

      setSearchResults(pois);

      if (pois.length > 0) {
        const bounds = new window.Tmapv3.LatLngBounds();

        pois.forEach((poi, index) => {
          const { noorLat, noorLon, name } = poi;
          const point = new window.Tmapv3.Point(noorLon, noorLat);
          const projection =
            new window.Tmapv3.Projection.convertEPSG3857ToWGS84GEO(point);
          const markerPosition = new window.Tmapv3.LatLng(
            projection._lat,
            projection._lng
          );

          const marker = new window.Tmapv3.Marker({
            position: markerPosition,
            icon: window.Tmapv3.asset.Icon.get(`b_m_${index}`),
            //            icon: `https://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_${index}.png`,
            //      iconSize: new window.Tmapv2.Size(24, 38),
            title: name,
            map: mapInstance,
          });

          markersRef.current.push(marker);
          bounds.extend(markerPosition);
        });

        mapInstance.panToBounds(bounds);
        //   mapInstance.zoomOut();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen p-4 gap-4 bg-gray-50">
      {/* 상단 검색바 */}
      <div className="flex w-full items-center gap-2 p-4 bg-white rounded-lg shadow flex-shrink-0">
        <input
          type="text"
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="장소를 검색하세요"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
        >
          검색
        </button>
      </div>

      {/* 메인 컨텐츠 (결과 목록 + 지도) */}
      <div className="flex flex-col md:flex-row flex-grow gap-4 overflow-hidden">
        {/* 검색 결과 목록 */}
        <div className="w-full md:w-[360px] lg:w-[420px] flex-shrink-0 p-4 bg-white rounded-lg shadow overflow-y-auto">
          <h2 className="text-lg font-bold mb-3 border-b pb-2">검색 결과</h2>
          <ul>
            {searchResults.length > 0 ? (
              searchResults.map((result, index) => (
                <li
                  key={result.pkey}
                  className="p-2 border-b hover:bg-gray-100 flex items-center gap-3"
                >
                  <img
                    src={window.Tmapv3.asset.Icon.get(`b_m_${index}`)}
                    alt={`${result.name} 위치 마커`}
                    className="w-4 h-6"
                  />
                  <span>{result.name}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-500 p-2">검색 결과가 없습니다.</li>
            )}
          </ul>
        </div>

        {/* 지도 */}
        <div className="w-full h-full rounded-2xl shadow-2xl overflow-hidden">
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
    </div>
  );
};

export default TmapSearch;
