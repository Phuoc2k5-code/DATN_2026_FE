import React from "react";
export default function Footer() {
  return (
    <footer className="mt-auto pt-8 pb-2 border-t border-slate-200/60">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-medium text-slate-400">
          
          {/* Bên trái: Copyright & Tên hệ thống */}
          <div className="flex items-center gap-1.5 text-slate-500">
            <span>© {new Date().getFullYear()}</span>
            <span className="font-bold text-blue-600">VieclamPro</span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden sm:inline">Hệ thống quản trị trung tâm (CMS)</span>
          </div>

          {/* Bên phải: Links & Version */}
          <div className="flex items-center gap-4 sm:gap-6">
            <a 
              href="#support" 
              className="hover:text-blue-600 transition-colors cursor-pointer"
              onClick={(e) => { e.preventDefault(); alert("Liên hệ hỗ trợ kỹ thuật: support@vieclampro.com"); }}
            >
              Hỗ trợ kỹ thuật
            </a>
            <a 
              href="#terms" 
              className="hover:text-blue-600 transition-colors cursor-pointer"
              onClick={(e) => { e.preventDefault(); alert("Hệ thống tuân thủ quy định bảo mật dữ liệu."); }}
            >
              Điều khoản CMS
            </a>
            <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold text-[10px] tracking-wider border border-slate-200/60">
              v2.4.0-Stable
            </span>
          </div>

        </div>
      </footer>
  )
}