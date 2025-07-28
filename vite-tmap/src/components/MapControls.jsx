// src/components/MapControls.jsx
import React, { useState, useRef } from "react";
import Button from "./Button";

import {
  ArrowsPointingOutIcon,
  BuildingOffice2Icon,
  MapPinIcon,
  UserCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

function MapControls({ mapInstance }) {
  const [result, setResult] = useState("");
  const markersRef = useRef([]); // 1. 마커들을 저장할 ref 생성
  const spotLocations = useRef([
    { title: "티맵모빌리티", coords: [37.5652045, 126.98702028] },
    { title: "SKT타워", coords: [37.566369, 126.984895] },
    { title: "경찰서", coords: [37.563709, 126.989577] },
    { title: "호텔", coords: [37.565138, 126.983655] },
    { title: "병원", coords: [37.565128, 126.98883] },
  ]);

  // 지도 영역 확인 함수
  const showMarkers = () => {
    if (!mapInstance) {
      setResult("지도가 로딩되지 않았습니다.");
      return;
    }

    markersRef.current.forEach((marker) => {
      marker.setMap(null); // 마커를 지도에서 제거
    });
    markersRef.current = []; // 마커 배열 비우기

    for (const spot of spotLocations.current) {
      const title = spot.title;
      addMarker(spot.coords, window.Tmapv3.asset.Icon.get("b_m_a"), title);
    }

    setResult(`마커들을 생성했습니다.`);
  };

  const showScreenSize = () => {
    if (!mapInstance) {
      setResult("지도가 로딩되지 않았습니다.");
      return;
    }
    const screenSize = mapInstance.screenSize();
    setResult(
      `화면 사이즈(width/height): ${screenSize.width()}/${screenSize.height()}`
    );
  };

  const addMarker = (coords, iconUrl = false, labelText = false) => {
    const markerOptions = {
      position: new window.Tmapv3.LatLng(coords[0], coords[1]), // 마커의 위치
      map: mapInstance, // 마커를 표시할 지도 객체
      //      offset: new window.Tmapv3.Point(-12, -38), // 아이콘의 중심점 오프셋
    };

    // 2. iconUrl이 있으면 옵션에 추가합니다.
    if (iconUrl) {
      markerOptions.icon = iconUrl;
    }

    // 3. labelText가 있으면 옵션에 추가합니다.
    if (labelText) {
      markerOptions.label = labelText;
    }
    const marker = new window.Tmapv3.Marker(markerOptions);

    markersRef.current.push(marker); // 2. 생성된 마커를 ref 배열에 추가
  };

  const moveCurrentLocation = () => {
    if (!mapInstance) {
      setResult("지도가 로딩되지 않았습니다.");
      return;
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const currentPos = new window.Tmapv3.LatLng(lat, lon);

          // 지도를 현재 위치로 이동
          mapInstance.setCenter(currentPos);
          mapInstance.setZoom(17); // 줌 레벨을 조금 더 가깝게 조정

          addMarker([lat, lon]);
          setResult("현재 위치로 이동했습니다.");
        },
        (error) => {
          console.log(error);
          setResult("현재 위치로 이동 실패!");
        }
      );
    } else {
      setResult("이 브라우저에서는 Geolocation이 지원되지 않습니다.");
    }
  };
  // 모든 마커를 지우는 함수
  const clearAllMarkers = () => {
    markersRef.current.forEach((marker) => {
      marker.setMap(null); // 마커를 지도에서 제거
    });
    markersRef.current = []; // 마커 배열 비우기
    setResult("모든 마커를 삭제했습니다.");
  };

  return (
    <div className="w-full max-w-4xl bg-white/70 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-lg mt-8 space-y-4">
      <div className="grid grid-cols-5 gap-2 md:gap-4">
        {/* 버튼들 */}
        <Button onClick={showMarkers} title="다중 마커 생성">
          <MapPinIcon className="w-6 h-6" />
        </Button>
        {/* 앞으로 추가될 버튼들 */}
        <Button onClick={showScreenSize}>화면 사이즈 확인</Button>
        <Button onClick={moveCurrentLocation}>현재 위치 마커 생성</Button>
        <Button
          onClick={clearAllMarkers}
          className="!bg-pink-400 hover:!bg-red-600"
        >
          마커 모두 삭제
        </Button>
      </div>

      {/* 결과 표시 영역 */}
      {result && (
        <div className="mt-4 p-4 bg-slate-100 rounded-lg text-slate-700 font-mono text-sm break-words">
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}

export default MapControls;
