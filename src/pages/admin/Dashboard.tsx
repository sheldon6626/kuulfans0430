import { Package, MessageSquare, FileText, TrendingUp, Users } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 relative overflow-hidden group">
           <div className="relative z-10">
             <h3 className="text-gray-500 font-medium text-sm mb-2 flex items-center gap-2">
               <Package className="w-4 h-4" /> 总产品数
             </h3>
             <div className="text-4xl font-bold text-gray-900">12</div>
             <p className="text-xs text-green-500 mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> 较上月新增 2 个</p>
           </div>
           <div className="absolute right-0 bottom-0 w-24 h-24 bg-primary/5 rounded-tl-full -mr-4 -mb-4 transition-transform group-hover:scale-110"></div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 relative overflow-hidden group">
           <div className="relative z-10">
             <h3 className="text-gray-500 font-medium text-sm mb-2 flex items-center gap-2">
               <MessageSquare className="w-4 h-4" /> 总询盘数
             </h3>
             <div className="text-4xl font-bold text-gray-900">48</div>
             <p className="text-xs text-green-500 mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> 本周新增 5 条</p>
           </div>
           <div className="absolute right-0 bottom-0 w-24 h-24 bg-secondary/5 rounded-tl-full -mr-4 -mb-4 transition-transform group-hover:scale-110"></div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 relative overflow-hidden group">
           <div className="relative z-10">
             <h3 className="text-gray-500 font-medium text-sm mb-2 flex items-center gap-2">
               <FileText className="w-4 h-4" /> 已发布文章
             </h3>
             <div className="text-4xl font-bold text-gray-900">15</div>
             <p className="text-xs text-gray-400 mt-2">最新发布于 2 天前</p>
           </div>
           <div className="absolute right-0 bottom-0 w-24 h-24 bg-purple-500/5 rounded-tl-full -mr-4 -mb-4 transition-transform group-hover:scale-110"></div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 relative overflow-hidden group">
           <div className="relative z-10">
             <h3 className="text-gray-500 font-medium text-sm mb-2 flex items-center gap-2">
               <Users className="w-4 h-4" /> 注册用户
             </h3>
             <div className="text-4xl font-bold text-gray-900">3</div>
             <p className="text-xs text-gray-400 mt-2">管理员和编辑</p>
           </div>
           <div className="absolute right-0 bottom-0 w-24 h-24 bg-orange-500/5 rounded-tl-full -mr-4 -mb-4 transition-transform group-hover:scale-110"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
         <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">最新系统动态</h3>
            <div className="space-y-4">
               <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center mt-1 flex-shrink-0">
                     <Package className="w-4 h-4" />
                  </div>
                  <div>
                     <p className="text-sm font-medium text-gray-900">新增了一款产品</p>
                     <p className="text-xs text-gray-500">管理员在 2 小时前添加了 "HVLS Fan Pro Max"</p>
                  </div>
               </div>
               <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center mt-1 flex-shrink-0">
                     <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                     <p className="text-sm font-medium text-gray-900">收到新的询盘留言</p>
                     <p className="text-xs text-gray-500">来自 John Doe (Apple Inc.) - 5 小时前</p>
                  </div>
               </div>
            </div>
         </div>
         <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-6 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">流量统计模块建设中</h3>
            <p className="text-sm text-gray-500 max-w-sm">即将接入 Google Analytics 4 (GA4) 数据，您可以在此处直接查看网站 SEO 表现、访问量和跳转率等关键数据。</p>
            <button className="mt-6 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
               了解更多
            </button>
         </div>
      </div>
    </div>
  );
}
