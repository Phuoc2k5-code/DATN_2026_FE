import {Outlet, Navigate} from "react-router-dom";
import Header from "./Header";
import Banner from "./Banner";
import SidebarRight from "./SidebarRight";
import ChatBot from '../../components/ChatBotAI';
import Footer from "./Footer";

export default function Layout() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role; 

  // 2. CHỐT CHẶN: Định nghĩa các role KHÔNG ĐƯỢC PHÉP vào đây
  const bannedRoles = ["admin", "employer"];

  if (token && bannedRoles.includes(userRole)) {
    const redirectPath = userRole === "admin" ? "/admin/dashboard" : "/employer/dashboard";
    return <Navigate to={redirectPath} replace />;
  }
  return (
    <div className="w-full min-h-screen bg-[#FFFDF9] font-sans text-slate-800 antialiased pb-12">
      {/* 1. HEADER */}
      <Header />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        <div className="flex gap-5 items-start">
          <Outlet />
          {/* THANH CÔNG CỤ BÊN PHẢI (FLOATING DOCK) */}
          {/* <SidebarRight /> */}
        </div>
        {/* <ChatBot /> */}
      </div>
      {/* 4. FOOTER */}
      <Footer />
    </div>
  )
}