import React from 'react';
import { X, Building2, Briefcase, Calendar, DollarSign, MapPin, Layers, ShieldCheck, FileText, Globe, Key, AlertTriangle, CheckCircle } from 'lucide-react';

export default function AdminViolationDetailModal({ isOpen, onClose, type, data, onApprove, onReject }) {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER MODAL */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            {type === 'job' ? (
              <Briefcase size={20} className="text-blue-600 shrink-0" />
            ) : (
              <Building2 size={20} className="text-purple-600 shrink-0" />
            )}
            <h2 className="text-lg font-bold text-slate-800">
              {type === 'job' ? 'Kiểm tra nội dung Tin Tuyển Dụng bị báo cáo' : 'Kiểm tra thông tin Doanh Nghiệp bị báo cáo'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* NỘI DUNG CHI TIẾT (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm leading-relaxed">
          
          {/* ----- GIAO DIỆN XEM TIN TUYỂN DỤNG ----- */}
          {type === 'job' && (
            <>
              {/* Thông tin cơ bản */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{data.title}</h3>
                  <p className="text-slate-600 flex items-center gap-1.5 mb-1.5"><Building2 size={15} /> Công ty: <span className="font-medium text-slate-800">{data.company?.company_name || 'N/A'}</span></p>
                  <p className="text-slate-600 flex items-center gap-1.5 mb-1.5"><Layers size={15} /> Danh mục: <span className="font-medium text-slate-800">{data.category?.name || 'N/A'}</span></p>
                  <p className="text-slate-600 flex items-center gap-1.5"><Key size={15} /> Cấp bậc: <span className="font-medium text-slate-800">{data.level}</span></p>
                </div>
                <div className="space-y-1.5 md:border-l md:border-slate-200 md:pl-4">
                  <p className="text-slate-600 flex items-center gap-1.5">
                    <DollarSign size={15} /> Mức lương: 
                    <span className="font-bold text-emerald-600 ml-1">
                      {data.is_negotiable ? 'Thỏa thuận' : `${data.salary_min?.toLocaleString()} - ${data.salary_max?.toLocaleString()} VND`}
                    </span>
                  </p>
                  <p className="text-slate-600 flex items-center gap-1.5"><MapPin size={15} /> Khu vực: <span className="font-medium text-slate-800">{data.location}</span></p>
                  <p className="text-slate-600 flex items-center gap-1.5"><Calendar size={15} /> Ngày hết hạn: <span className="font-medium text-amber-600">{new Date(data.expired_at).toLocaleDateString('vi-VN')}</span></p>
                </div>
              </div>

              {/* Yêu cầu kỹ năng Tags */}
              {data.skills?.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5"><ShieldCheck size={16} /> Kỹ năng yêu cầu:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {data.skills.map(skill => (
                      <span key={skill.id} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-md">{skill.name}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Văn bản mô tả */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-slate-800 mb-1">Mô tả công việc:</h4>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 whitespace-pre-line break-words text-slate-600">{data.description}</div>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-1">Yêu cầu ứng viên:</h4>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 whitespace-pre-line break-words text-slate-600">{data.requirements}</div>
                </div>
                {data.benefits && (
                  <div>
                    <h4 className="font-bold text-slate-800 mb-1">Quyền lợi được hưởng:</h4>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 whitespace-pre-line break-words text-slate-600">{data.benefits}</div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ----- GIAO DIỆN XEM CHI TIẾT DOANH NGHIỆP ----- */}
          {type === 'company' && (
            <>
              {/* Header Profile Doanh nghiệp */}
              <div className="flex gap-4 p-4 bg-purple-50/40 border border-purple-100/50 rounded-xl items-start">
                {data.logo_url ? (
                  <img src={data.logo_url} alt="Logo" className="w-16 h-16 rounded-lg object-cover border border-slate-200 bg-white shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0"><Building2 size={28} /></div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5 w-full">
                  <div className="col-span-1 md:col-span-2">
                    <h3 className="text-base font-bold text-slate-900">{data.company_name}</h3>
                  </div>
                  <p className="text-slate-600 flex items-center gap-1.5"><FileText size={15} /> MST: <span className="font-mono font-bold text-slate-800">{data.tax_code || 'Chưa cập nhật'}</span></p>
                  <p className="text-slate-600 flex items-center gap-1.5"><Globe size={15} /> Website: {data.website_url ? <a href={data.website_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-medium">{data.website_url}</a> : <span className="text-slate-400">N/A</span>}</p>
                  <p className="text-slate-600">Ngành nghề: <span className="font-medium text-slate-800">{data.industry || 'N/A'}</span></p>
                  <p className="text-slate-600">Quy mô: <span className="font-medium text-slate-800">{data.size ? `${data.size} nhân sự` : 'N/A'}</span> ({data.founded_year ? `Năm TL: ${data.founded_year}` : ''})</p>
                  <div className="col-span-1 md:col-span-2 text-slate-600 flex items-start gap-1.5"><MapPin size={15} className="mt-0.5 shrink-0" /> Địa chỉ: <span className="font-medium text-slate-800">{data.address}</span></div>
                </div>
              </div>

              {/* Hồ sơ Pháp lý / Giấy phép */}
              <div>
                <h4 className="font-bold text-slate-800 mb-1.5 flex items-center gap-1.5"><FileText size={16} className="text-red-500" /> Giấy phép kinh doanh:</h4>
                {data.business_license ? (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-mono truncate max-w-[70%]">{data.business_license}</span>
                    <a href={data.business_license} target="_blank" rel="noreferrer" className="px-3 py-1 bg-slate-200 text-slate-700 font-medium text-xs rounded hover:bg-slate-300 transition-colors shrink-0">Xem trực tiếp</a>
                  </div>
                ) : (
                  <p className="text-xs text-rose-500 font-medium bg-rose-50 border border-rose-100 p-2.5 rounded-lg">Doanh nghiệp chưa tải lên tệp đính kèm Giấy phép đăng ký kinh doanh!</p>
                )}
              </div>

              {/* Mô tả doanh nghiệp */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-slate-800 mb-1">Giới thiệu công ty:</h4>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 whitespace-pre-line break-words text-slate-600">{data.description || 'Chưa cập nhật.'}</div>
                </div>
                {data.benefits && (
                  <div>
                    <h4 className="font-bold text-slate-800 mb-1">Chế độ phúc lợi:</h4>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 whitespace-pre-line break-words text-slate-600">{data.benefits}</div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* BOTTOM PANEL ACTION BUTTONS */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="text-xs text-slate-400">ID đối tượng: #{data.id}</div>
          <div className="flex items-center gap-3">
            {/* NÚT BÁC BỎ BÁO CÁO (REJECT REPORT) */}
            <button 
              type="button" 
              onClick={onReject} 
              className="px-4 py-2 bg-slate-200 text-slate-700 font-bold text-xs rounded-lg hover:bg-slate-300 transition-colors flex items-center gap-1.5"
            >
              <CheckCircle size={14} /> Bác bỏ báo cáo
            </button>
            
            {/* NÚT KỶ LUẬT ĐỐI TƯỢNG (DISCIPLINE TARGET) */}
            <button 
              type="button" 
              onClick={onApprove} 
              className="px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-lg hover:bg-rose-700 shadow-md shadow-rose-600/10 transition-all flex items-center gap-1.5"
            >
              <AlertTriangle size={14} /> Kỷ luật vi phạm
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}