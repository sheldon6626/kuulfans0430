import { FileText, Loader2, Sparkles, Plus } from 'lucide-react';

export default function Posts() {
  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-6 mb-2">
         <div>
            <h1 className="text-2xl font-bold text-gray-900">博客与资讯</h1>
            <p className="text-sm text-gray-500 mt-1">管理网站的博客文章、企业新闻及行业资讯。</p>
         </div>
         <button 
           className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.4)] hover:-translate-y-0.5 opacity-50 cursor-not-allowed"
           disabled
         >
           <Plus className="w-5 h-5" /> 发布新文章
         </button>
      </div>

      <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden min-h-[400px] flex flex-col items-center justify-center text-center p-10">
         <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-6 border border-purple-100/50">
           <FileText className="w-10 h-10 text-purple-400" />
         </div>
         <h2 className="text-xl font-bold text-gray-900 mb-2">博客系统正在建设中...</h2>
         <p className="text-gray-500 max-w-md text-sm leading-relaxed mb-8">
           我们正在为您打造一个全新的 SEO 优化博客系统，未来它将支持一键排版、富文本编辑，甚至可以通过 <span className="font-semibold text-primary inline-flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> AI 大模型</span> 自动生成高质量的行业资讯，帮助您轻松获客！
         </p>
         
         <div className="flex gap-4">
            <div className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-400 bg-gray-50/50">预计下周可用</div>
         </div>
      </div>
    </div>
  );
}
