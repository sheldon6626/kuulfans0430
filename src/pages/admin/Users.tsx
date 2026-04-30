import { Users as UsersIcon, ShieldAlert, Key } from 'lucide-react';

export default function Users() {
  return (
    <div className="max-w-6xl space-y-6">
      <div className="border-b border-gray-200 pb-6 mb-2">
         <h1 className="text-2xl font-bold text-gray-900">用户权限管理</h1>
         <p className="text-sm text-gray-500 mt-1">管理可以访问此管理后台的成员和权限配置。</p>
      </div>

      <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden min-h-[400px] flex flex-col items-center justify-center text-center p-10 relative">
         {/* Background decoration */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-50/50 rounded-full blur-3xl -z-10"></div>
         
         <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6 border border-orange-100/50 z-10">
           <ShieldAlert className="w-10 h-10 text-orange-400" />
         </div>
         <h2 className="text-xl font-bold text-gray-900 mb-2 z-10">需要多重身份验证</h2>
         <p className="text-gray-500 max-w-md text-sm leading-relaxed mb-8 z-10">
           目前您使用的是基础管理权限。为了网站数据安全，只有超级管理员 (Super Admin) 可以添加或移除其他后台成员。若需开通此功能，请前往 Firebase 控制台配置自定义 Claims。
         </p>
         
         <a href="https://firebase.google.com/docs/auth/admin/custom-claims" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-md z-10 text-sm">
            <Key className="w-4 h-4" /> 查看配置指南
         </a>
      </div>
    </div>
  );
}
