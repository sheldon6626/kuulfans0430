import { useState } from 'react';
import { Save, Loader2, CheckCircle2, Sliders } from 'lucide-react';

export default function Settings() {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      // placeholder for system settings save logic
      await new Promise(res => setTimeout(res, 800));
      setMessage('系统设置已成功保存！');
    } catch (err) {
      setMessage('保存设置时发生错误，请重试。');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-6 mb-2">
         <div>
             <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>
             <p className="text-sm text-gray-500 mt-1">管理网站基本配置和全局参数</p>
         </div>
         <button 
           onClick={handleSave} 
           disabled={saving}
           className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.4)] disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
         >
           {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
           保存系统设置
         </button>
      </div>
      
      {message && (
        <div className={`p-4 justify-start rounded-lg text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${message.includes('错误') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
          <CheckCircle2 className="w-5 h-5" />
          {message}
        </div>
      )}

      {/* General Settings */}
      <section className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/30">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-gray-50 text-gray-700 flex items-center justify-center border border-gray-200">
                <Sliders className="w-5 h-5" />
             </div>
             <div>
                <h2 className="text-lg font-bold text-gray-900">基础配置</h2>
                <p className="text-xs text-gray-500 mt-0.5">网站名称、Logo、联系信息等基础数据</p>
             </div>
          </div>
        </div>
        
        <div className="p-6 space-y-5">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">网站名称 (Site Name)</label>
                <input 
                  defaultValue="Kuul Fans"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">官方邮箱 (Contact Email)</label>
                <input 
                  defaultValue="info@kuulfans.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none text-sm" 
                />
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
