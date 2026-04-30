import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Save, Loader2, Bot, Globe, CheckCircle2 } from 'lucide-react';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const [aiConfig, setAiConfig] = useState({
    baseUrl: '',
    apiKey: '',
    model: ''
  });
  
  const [seoConfig, setSeoConfig] = useState({
    defaultTitle: 'Kuul Fans | 大型工业风扇与降温解决方案',
    defaultDescription: '我们提供卓越的 HVLS 工业吊扇、环保空调及工业通风降温系统，致力于改善工厂和仓储环境。',
    keywords: 'HVLS Fans, Air Coolers, Industrial Cooling, Kuul Fans, 工业吊扇, 环保空调'
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const aiDoc = await getDoc(doc(db, 'settings', 'ai_proxy'));
        if (aiDoc.exists()) {
           const data = aiDoc.data().value;
           setAiConfig(JSON.parse(data));
        }
        
        const seoDoc = await getDoc(doc(db, 'settings', 'seo_default'));
        if (seoDoc.exists()) {
           const data = seoDoc.data().value;
           setSeoConfig(JSON.parse(data));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await setDoc(doc(db, 'settings', 'ai_proxy'), {
        key: 'ai_proxy',
        value: JSON.stringify(aiConfig),
        updatedAt: serverTimestamp()
      });
      
      await setDoc(doc(db, 'settings', 'seo_default'), {
        key: 'seo_default',
        value: JSON.stringify(seoConfig),
        updatedAt: serverTimestamp()
      });
      
      setMessage('设置已成功保存！');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'settings');
      setMessage('保存设置时发生错误，请重试。');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-6 mb-2">
         <div>
             <h1 className="text-2xl font-bold text-gray-900">系统与 SEO 设置</h1>
             <p className="text-sm text-gray-500 mt-1">管理网站全局配置及 AI 大模型集成选项</p>
         </div>
         <button 
           onClick={handleSave} 
           disabled={saving}
           className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.4)] disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
         >
           {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
           保存全部设置
         </button>
      </div>
      
      {message && (
        <div className={`p-4 justify-start rounded-lg text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${message.includes('错误') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
          <CheckCircle2 className="w-5 h-5" />
          {message}
        </div>
      )}

      {/* AI Proxy Settings */}
      <section className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/30">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-blue-50 text-primary flex items-center justify-center">
                <Bot className="w-5 h-5" />
             </div>
             <div>
                <h2 className="text-lg font-bold text-gray-900">AI 大模型中转配置</h2>
                <p className="text-xs text-gray-500 mt-0.5">配置兼容 OpenAI 格式的第三方 AI 接口，用于网站 SEO 内容自动生成与多语言智能翻译。</p>
             </div>
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">接口地址 (Base URL)</label>
            <input 
              value={aiConfig.baseUrl}
              onChange={(e) => setAiConfig({...aiConfig, baseUrl: e.target.value})}
              placeholder="例如: https://api.openai.com 或您的自定义中转地址"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none text-sm" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">API 密钥 (API Key)</label>
            <input 
              type="password"
              value={aiConfig.apiKey}
              onChange={(e) => setAiConfig({...aiConfig, apiKey: e.target.value})}
              placeholder="sk-..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none text-sm font-mono" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">默认模型名称 (Model)</label>
            <input 
              value={aiConfig.model}
              onChange={(e) => setAiConfig({...aiConfig, model: e.target.value})}
              placeholder="例如: gpt-3.5-turbo 或 gpt-4o"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none text-sm font-mono" 
            />
          </div>
        </div>
      </section>

      {/* Global SEO Settings */}
      <section className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/30">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Globe className="w-5 h-5" />
             </div>
             <div>
                <h2 className="text-lg font-bold text-gray-900">全局 SEO 配置</h2>
                <p className="text-xs text-gray-500 mt-0.5">管理全站默认的 Title、Description 和 Meta 关键词，对搜索引擎机器人友好优化。</p>
             </div>
          </div>
        </div>
        
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">默认网站标题 (Meta Title)</label>
            <input 
              value={seoConfig.defaultTitle}
              onChange={(e) => setSeoConfig({...seoConfig, defaultTitle: e.target.value})}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none text-sm" 
            />
            <p className="text-xs text-gray-400 mt-1.5">建议包含品牌名和主要业务线，例如 "Kuul Fans | 工业降温解决方案"</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">默认描述文本 (Meta Description)</label>
            <textarea 
              value={seoConfig.defaultDescription}
              onChange={(e) => setSeoConfig({...seoConfig, defaultDescription: e.target.value})}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none text-sm resize-y" 
            ></textarea>
            <p className="text-xs text-gray-400 mt-1.5">精简描述公司提供的核心价值与服务，建议字数控制在 150-160 字符以内。</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">核心关键词 (Meta Keywords)</label>
            <input 
              value={seoConfig.keywords}
              onChange={(e) => setSeoConfig({...seoConfig, keywords: e.target.value})}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none text-sm" 
              placeholder="用英文逗号分隔"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
