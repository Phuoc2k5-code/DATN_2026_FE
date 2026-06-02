export default function Header() {
  return (
    <header className="border-b border-orange-100 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 font-black text-white text-lg">V</div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            VIECLAM<span className="text-blue-600 font-extrabold">PRO</span>
          </span>
        </div>

        <nav className="hidden items-center gap-6 md:flex text-sm font-medium text-slate-600">
          <a href="#discover" className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1">Trong nhà</a>
          <a href="#find-jobs" className="hover:text-blue-600 transition-colors">Tìm việc</a>
          <a href="#news" className="hover:text-blue-600 transition-colors">Tin nhắn</a>
          <a href="#companies" className="hover:text-blue-600 transition-colors">Công ty</a>
          <a href="#ai-assistant" className="hover:text-blue-600 transition-colors text-indigo-600 font-semibold">Trợ lý số UC</a>
        </nav>

        <div className="flex items-center gap-2.5">
          <button className="rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50">Đăng ký</button>
          <button className="rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700">Đăng nhập</button>
        </div>
      </div>
    </header>
  )
}