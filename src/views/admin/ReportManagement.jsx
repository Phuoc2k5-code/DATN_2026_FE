import React, { useState } from 'react';

export default function ReportManagement() {
  const initialReports = [
    {
      id: 'RP001',
      reporter: 'Nguyễn Văn A',
      targetName: 'Tuyển dụng Kế toán trưởng',
      targetType: 'Tin tuyển dụng',
      reason: 'Thu phí ứng viên trái phép',
      date: '06/06/2026',
      status: 'pending',
    },
    {
      id: 'RP002',
      reporter: 'Trần Thị B',
      targetName: 'Công ty Đa cấp TNHH XYZ',
      targetType: 'Doanh nghiệp',
      reason: 'Tin tuyển dụng lừa đảo',
      date: '05/06/2026',
      status: 'pending',
    },
    {
      id: 'RP003',
      reporter: 'Lê Văn C',
      targetName: 'Tuyển Dev lương 100 củ',
      targetType: 'Tin tuyển dụng',
      reason: 'Thông tin sai sự thật',
      date: '04/06/2026',
      status: 'resolved',
    },
    {
      id: 'RP004',
      reporter: 'Hoàng Thị D',
      targetName: 'Công ty ABC',
      targetType: 'Doanh nghiệp',
      reason: 'Phân biệt đối xử',
      date: '02/06/2026',
      status: 'dismissed',
    }
  ];

  const [reports, setReports] = useState(initialReports);
  const [filter, setFilter] = useState('all');

  const handleReject = (id) => {
    if(window.confirm('Bạn có chắc chắn muốn bác bỏ báo cáo này?')) {
      setReports(reports.map(report => 
        report.id === id ? { ...report, status: 'dismissed' } : report
      ));
    }
  };

  const handleDiscipline = (id) => {
    if(window.confirm('Tiến hành kỷ luật (Khóa tài khoản/Xóa bài)?')) {
      setReports(reports.map(report => 
        report.id === id ? { ...report, status: 'resolved' } : report
      ));
    }
  };

  const filteredReports = reports.filter(report => 
    filter === 'all' ? true : report.status === filter
  );

  // Badge được làm dịu màu lại, viền mỏng
  const renderStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">Chờ xử lý</span>;
      case 'resolved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Đã kỷ luật</span>;
      case 'dismissed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">Đã bác bỏ</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Báo cáo vi phạm</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý và kiểm duyệt các phản ánh từ người dùng.</p>
        </div>
        
        {/* Pills Filter - Nhìn hiện đại hơn */}
        <div className="inline-flex bg-slate-200/50 p-1 rounded-lg">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${filter === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Tất cả
          </button>
          <button 
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${filter === 'pending' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Cần xử lý
          </button>
        </div>
      </div>

      {/* Table Container - Bo góc, đổ bóng mượt */}
      <div className="bg-white ring-1 ring-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-widest">
                <th className="px-6 py-4 font-semibold">Người báo cáo</th>
                <th className="px-6 py-4 font-semibold">Đối tượng vi phạm</th>
                <th className="px-6 py-4 font-semibold">Lý do</th>
                <th className="px-6 py-4 font-semibold">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-900">{report.reporter}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">{report.targetName}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{report.targetType}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-red-600/80 font-medium">{report.reason}</span>
                  </td>
                  <td className="px-6 py-4">
                    {renderStatusBadge(report.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {report.status === 'pending' ? (
                      <div className="flex justify-end items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleReject(report.id)}
                          className="text-slate-400 hover:text-slate-700 font-medium transition-colors"
                          title="Bác bỏ"
                        >
                          Bỏ qua
                        </button>
                        <button 
                          onClick={() => handleDiscipline(report.id)}
                          className="text-red-600 hover:text-red-800 font-semibold transition-colors"
                          title="Kỷ luật"
                        >
                          Kỷ luật
                        </button>
                      </div>
                    ) : (
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                        Chi tiết
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    <svg className="mx-auto h-12 w-12 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    Không có dữ liệu báo cáo nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
};