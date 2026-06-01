import React, { useState } from 'react';
import { 
  MapPin, Briefcase, ChevronDown, Star, Search,
  Calendar, MessageSquare, Bookmark, Bell, Settings, 
  User, DollarSign, Sparkles
} from 'lucide-react';
import Header from '../party/header';
import Banner from '../party/banner';
import SidebarRight from '../party/sidebar_right';
import SidebarLeft from '../party/sidebar_left';

import Job from '../component/Job';
import JobDetail from './JobDetail';

export default function Homepage() {
  const jobs = [
    { id: 1, title: 'Software Engineer', company: 'Google', location: 'Quận 1, TP. HCM', salary: '25-35 Tr', tags: ['React', 'NodeJS'], logoBg: 'bg-blue-600' },
    { id: 2, title: 'Marketing Manager', company: 'Xiaomi', location: 'Quận 3, TP. HCM', salary: '18-25 Tr', tags: ['SEO', 'Content'], logoBg: 'bg-orange-500' },
    { id: 3, title: 'UX Designer', company: 'VNG Group', location: 'Thủ Đức, TP. HCM', salary: '15-22 Tr', tags: ['Figma', 'UI/UX'], logoBg: 'bg-purple-600' },
    { id: 4, title: 'Frontend Developer', company: 'FPT Software', location: 'Quận 9, TP. HCM', salary: '14-20 Tr', tags: ['ReactJS', 'Tailwind'], logoBg: 'bg-orange-600' },
    { id: 5, title: 'Mobile App Developer', company: 'Viettel', location: 'Hà Nội', salary: '20-30 Tr', tags: ['Flutter', 'Dart'], logoBg: 'bg-red-600' },
    { id: 6, title: 'Data Analyst', company: 'Techcombank', location: 'Quận 1, TP. HCM', salary: '16-24 Tr', tags: ['Python', 'SQL'], logoBg: 'bg-slate-800' },
  ];

  return (
    <div className="w-full min-h-screen bg-[#FFFDF9] font-sans text-slate-800 antialiased pb-12">
      {/* 1. HEADER */}
      <Header />
      
      {/* CONTAINER TỔNG TẤT CẢ NỘI DUNG */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        
        {/* 2. BANNER */}
        <Banner />
        
        {/* 3. KHU VỰC CHIA CỘT PHÍA DƯỚI BANNER */}
        <div className="flex gap-5 items-start">          
          {/* BỘ LỌC BÊN TRÁI (ĐÃ THU NHỎ SIÊU GỌN - WIDTH 210PX) */}
          <SidebarLeft />
          {/* HIỂN THỊ VIỆC LÀM PHÍA GIỮA */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Việc tìm nổi bật</h2>
              <span className="text-[11px] text-blue-600 font-semibold cursor-pointer hover:underline">Xem tất cả</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {jobs.map((job) => (
                <Job key={job.id} job={job}/>
              ))}
            </div>
          </div>
          {/* THANH CÔNG CỤ BÊN PHẢI (FLOATING DOCK) */}
            <SidebarRight />
        </div>
      </div>
    </div>
  );
}