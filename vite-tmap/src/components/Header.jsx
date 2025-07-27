// src/components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 왼쪽: 로고 및 메뉴 */}
          <div className="flex items-center space-x-10">
            <Link to="/" className="text-2xl font-bold text-gray-800">
              Findust
            </Link>
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-500">
              <Link to="/practice" className="hover:text-gray-900">
                티맵 연습
              </Link>
              <a href="#" className="hover:text-gray-900">
                목록
              </a>
              <a href="#" className="hover:text-gray-900">
                랭킹
              </a>
              <a href="#" className="flex items-center hover:text-gray-900">
                마이페이지
                <ChevronDownIcon className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
          {/* 오른쪽: 버튼 */}
          <div className="flex items-center space-x-4">
            <button className="text-sm font-medium text-blue-600 border border-blue-600 rounded-md px-4 py-2 hover:bg-blue-50">
              Log Out
            </button>
            <button className="text-sm font-medium text-white bg-blue-600 rounded-md px-4 py-2 hover:bg-blue-700">
              Start Free Trial
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
