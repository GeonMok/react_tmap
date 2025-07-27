// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom"; // 1. Routes와 Route를 import
import Header from "./components/Header";
import MainPage from "./pages/MainPage"; // 2. 페이지 컴포넌트 import
import Practice from "./pages/Practice";

function App() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-grow max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 w-full">
        {/* 3. Routes로 경로에 따른 렌더링 영역을 지정합니다. */}
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/practice" element={<Practice />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
