import React, { useState, useCallback, useEffect, useRef } from "react";
import TMap from "../components/TMap";
import MapUI from "../components/MapUI";

const Routing_ped = () => {
  // 지도 컨테이너에 대한 ref
  const [mapInstance, setMapInstance] = useState(null);
  const [mapStatus, setMapStatus] = useState("loading");
  const [startPoint, setStartPoint] = useState(
    new window.Tmapv3.LatLng(37.553756, 126.925356)
  );
  const [endPoint, setEndPoint] = useState(
    new window.Tmapv3.LatLng(37.554034, 126.975598)
  );

  const handleMapLoad = useCallback((map, status) => {
    setMapInstance(map);
    setMapStatus(status);
  }, []);
  //경로안내
  const onComplete = useCallback(
    (responseData) => {
      console.log("경로 응답: ", responseData);

      if (!mapInstance) {
        console.log("no map instance!");
        return;
      }

      const jsonObject = new window.Tmapv3.extension.GeoJSON();
      const jsonForm = jsonObject.read(responseData);

      jsonObject.drawRoute(mapInstance, jsonForm, {
        strokeColor: "#0EA5E9", // 라인 색상
        strokeWeight: 5, // 라인 굵기
      });

      // ⭐️ 출발지 마커를 생성합니다.
      const startMarker = new window.Tmapv3.Marker({
        position: startPoint,
        icon: window.Tmapv3.asset.Icon.get(`b_s_simple`),
        map: mapInstance,
      });

      // ⭐️ 도착지 마커를 생성합니다.
      const endMarker = new window.Tmapv3.Marker({
        position: endPoint,
        icon: window.Tmapv3.asset.Icon.get(`arrival`),
        map: mapInstance,
      });

      //      console.log("JsonForm: ", jsonForm);

      // 1. 경로의 모든 좌표를 포함하는 LatLngBounds 객체 생성
      const bounds = new window.Tmapv3.LatLngBounds();
      jsonForm.forEach((feature) => {
        feature.geometry.forEach((coord) => {
          bounds.extend(new window.Tmapv3.LatLng(coord.y, coord.x));
        });
      });

      // 2. fitBounds 함수로 지도 viewport 조절
      mapInstance.fitBounds(bounds, 100);
    },
    [mapInstance]
  );

  //데이터 로드중 실행하는 함수입니다.
  function onProgress() {
    console.log("경로 탐색 중");
  }
  //데이터 로드 중 에러가 발생시 실행하는 함수입니다.
  function onError() {
    alert("onError");
  }

  //경로안내 요청 함수
  const getRP = async () => {
    // 1. 요청 URL 및 파라미터 설정
    const TMAP_API_KEY = import.meta.env.VITE_TMAP_APP_KEY; // 🚨 본인의 TMap API 키로 교체해야 합니다.
    const start = new window.Tmapv3.LatLng(37.553756, 126.925356);
    const end = new window.Tmapv3.LatLng(37.554034, 126.975598);
    const passList = "126.9376,37.554936"; // 에어코리아 신촌로 측정소

    const params = new URLSearchParams({
      version: 1,
      appKey: TMAP_API_KEY,
      startX: start.longitude(),
      startY: start.latitude(),
      endX: end.longitude(),
      endY: end.latitude(),
      startName: "출발",
      endName: "도착",
      reqCoordType: "WGS84GEO",
      resCoordType: "WGS84GEO",
      searchOption: 0, // 0, 4, 30 만 가능
      passList: passList,
    });

    /*    const url = `https://apis.openapi.sk.com/tmap/routes/pedestrian?${params.toString()}`;*/
    // 2. URL은 파라미터 없이 엔드포인트만 사용합니다.
    const url = "https://apis.openapi.sk.com/tmap/routes/pedestrian";

    try {
      // 2. onProgress 콜백을 직접 호출
      onProgress();

      // 3. fetch를 사용하여 API 요청
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // TMap API가 요구하는 헤더
        },
        body: params, // 본문에 파라미터 전달
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }
      const data = await response.json();

      // 4. onComplete 콜백에 결과 전달
      onComplete(data);
    } catch (error) {
      console.error("경로 요청 실패:", error);
      onError();
    }
  };

  return (
    <div className="flex flex-col w-full h-screen p-4 gap-4 bg-gray-50">
      {/* 상단 검색바 */}
      <div className="flex w-full items-center gap-2 p-4 bg-white rounded-lg shadow flex-shrink-0">
        <button
          className="bg-[#3eb199] hover:bg-[#91e692] rounded-lg text-gray-100 font-extrabold p-2.5 flex items-center justify-center"
          onClick={getRP}
        >
          정적 경로탐색
        </button>
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
  );
};

export default Routing_ped;
