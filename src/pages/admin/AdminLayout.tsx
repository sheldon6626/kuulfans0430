import { useEffect, useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { auth } from '../../lib/firebase';
import { LayoutDashboard, Package, FileText, Users, Settings, LogOut, Loader2, MessageSquare, Fan, DownloadCloud, Bot, Globe } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';

export default function AdminLayout() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { name: '仪表盘', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: '产品中心', path: '/admin/products', icon: <Package className="w-5 h-5" /> },
    { name: '博客中心', path: '/admin/posts', icon: <FileText className="w-5 h-5" /> },
    { name: '表单询盘', path: '/admin/inquiries', icon: <MessageSquare className="w-5 h-5" /> },
    { name: '文件中心', path: '/admin/downloads', icon: <DownloadCloud className="w-5 h-5" /> },
    { name: 'AI 内容助手', path: '/admin/ai', icon: <Bot className="w-5 h-5" /> },
    { name: '用户管理', path: '/admin/users', icon: <Users className="w-5 h-5" /> },
    { name: '全局 SEO', path: '/admin/seo', icon: <Globe className="w-5 h-5" /> },
    { name: '系统设置', path: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div className="min-h-screen flex bg-[#f4f7f6] text-gray-800 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col shadow-sm z-10">
        <div className="h-20 flex items-center px-6 border-b border-gray-100">
           <Fan className="w-8 h-8 text-primary mr-3" />
           <span className="font-serif font-bold text-xl text-gray-900 tracking-wide">Kuul Fans</span>
        </div>
        <div className="px-6 py-4">
           <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">管理后台</p>
           <nav className="space-y-1.5">
             {navItems.map((item) => {
               const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
               return (
                 <Link
                   key={item.name}
                   to={item.path}
                   className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm ${isActive ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-gray-600 hover:bg-blue-50 hover:text-primary'}`}
                 >
                   {item.icon}
                   {item.name}
                 </Link>
               )
             })}
           </nav>
        </div>
        <div className="mt-auto p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3 px-2 py-2 mb-3 bg-white rounded-lg border border-gray-100 shadow-sm">
            <div className="w-9 h-9 rounded-md bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-bold text-sm shadow-inner">
              {user.email?.[0].toUpperCase()}
            </div>
            <div className="text-xs overflow-hidden text-ellipsis w-full">
              <p className="font-medium text-gray-900 truncate">管理员</p>
              <p className="text-gray-500 truncate" title={user.email}>{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex justify-center items-center gap-2 px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-medium text-sm border border-transparent hover:border-red-100"
          >
            <LogOut className="w-4 h-4" />
            退出登录
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
         <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-0">
            <h2 className="text-xl font-semibold text-gray-800">
               {navItems.find(item => location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path)))?.name || '管理后台'}
            </h2>
            <Link 
              to="/" 
              target="_blank" 
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors font-medium text-sm border border-emerald-200 shadow-sm"
            >
              <Globe className="w-4 h-4" />
              查看前台网站
            </Link>
         </header>
         <div className="flex-1 overflow-y-auto p-8">
           <div className="max-w-7xl mx-auto">
             <Outlet />
           </div>
         </div>
      </main>
    </div>
  );
}
