import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Save, Loader2, Globe, CheckCircle2, Search, FileCode2, Zap } from 'lucide-react';

export default function SeoSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const [seoConfig, setSeoConfig] = useState({
    defaultTitle: 'Kuul Fans | 大型工业风扇与降温解决方案',
    defaultDescription: '我们提供卓越的 HVLS 工业吊扇、环保空调及工业通风降温系统，致力于改善工厂和仓储环境。',
    keywords: 'HVLS Fans, Air Coolers, Industrial Cooling, Kuul Fans, 工业吊扇, 环保空调',
    robotsTxt: 'User-agent: *\nAllow: /\n\nSitemap: https://www.kuulfans.com/sitemap.xml',
    googleVerification: '',
    bingVerification: '',
    yandexVerification: '',
    baiduVerification: '',
    sitemapImage: true,
    sitemapPost: true,
    sitemapPage: true
  });

  const [submittingSitemap, setSubmittingSitemap] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const seoDoc = await getDoc(doc(db, 'settings', 'seo_default'));
        if (seoDoc.exists()) {
           const data = seoDoc.data().value;
           setSeoConfig(prev => ({...prev, ...JSON.parse(data)}));
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
      await setDoc(doc(db, 'settings', 'seo_default'), {
        key: 'seo_default',
        value: JSON.stringify(seoConfig),
        updatedAt: serverTimestamp()
      });
      
      setMessage('全局 SEO及检测设置已成功保存！');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'settings');
      setMessage('保存设置时发生错误，请重试。');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleSitemapSubmit = async () => {
    setSubmittingSitemap(true);
    try {
      const dbUrl = window.location.origin;
      const res = await fetch(`${dbUrl}/api/sitemap/generate`, { method: 'POST' });
      if (!res.ok) throw new Error('生成失败');
      alert('Sitemap 生成并提交指令已发送至各大搜索引擎。处理通常需要 24-48 小时。');
    } catch (e) {
      alert('Sitemap 生成失败或是未在服务端配置。此功能仅在线上生效。');
    } finally {
      setSubmittingSitemap(false);
    }
  };

  const handleChange = (key: string, value: any) => {
    setSeoConfig(prev => ({ ...prev, [key]: value }));
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-6 mb-2">
         <div>
             <h1 className="text-2xl font-bold text-gray-900">SEO 增强与地图配置</h1>
             <p className="text-sm text-gray-500 mt-1">管理 Meta Tags、搜索引擎所有权绑定、Robots 协议与站点地图</p>
         </div>
         <button 
           onClick={handleSave} 
           disabled={saving}
           className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.4)] disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
         >
           {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
           保存 SEO 参数
         </button>
      </div>
      
      {message && (
        <div className={`p-4 justify-start rounded-lg text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${message.includes('错误') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
          <CheckCircle2 className="w-5 h-5" />
          {message}
        </div>
      )}

      {/* Meta Tags */}
      <section className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/30">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/50">
                <Globe className="w-5 h-5" />
             </div>
             <div>
                <h2 className="text-lg font-bold text-gray-900">SEO Meta 默认信息</h2>
                <p className="text-xs text-gray-500 mt-0.5">当具体页面无独立设置时默认生效的标题与描述</p>
             </div>
          </div>
        </div>
        
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">网站标题 (Meta Title)</label>
            <input 
              value={seoConfig.defaultTitle}
              onChange={(e) => handleChange('defaultTitle', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 outline-none text-sm" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">描述文本 (Meta Description)</label>
            <textarea 
              value={seoConfig.defaultDescription}
              onChange={(e) => handleChange('defaultDescription', e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 outline-none text-sm resize-y" 
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">核心关键词 (Meta Keywords)</label>
            <input 
              value={seoConfig.keywords}
              onChange={(e) => handleChange('keywords', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 outline-none text-sm" 
              placeholder="用英文逗号分隔"
            />
          </div>
        </div>
      </section>

      {/* Search Engine Bindings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50 bg-gray-50/30">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-lg bg-blue-50 text-primary flex items-center justify-center border border-blue-100/50">
                  <Search className="w-5 h-5" />
               </div>
               <div>
                  <h2 className="text-lg font-bold text-gray-900">各大搜索引擎绑定验证</h2>
                  <p className="text-xs text-gray-500 mt-0.5">站点所有权认证代码 (填入 HTML &lt;head&gt; 中的 Content)</p>
               </div>
            </div>
          </div>
          <div className="p-6 space-y-5 flex-1">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1.5">Google Site Verification</label>
               <input 
                 value={seoConfig.googleVerification}
                 onChange={e => handleChange('googleVerification', e.target.value)}
                 className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-mono" 
                 placeholder="例如: _XyZ123ABC_..."
               />
               <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline mt-1.5 inline-block">前往 Google Search Console</a>
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1.5">Bing Site Verification</label>
               <input 
                 value={seoConfig.bingVerification}
                 onChange={e => handleChange('bingVerification', e.target.value)}
                 className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-mono" 
                 placeholder="例如: 8A1B2C3D..."
               />
               <a href="https://www.bing.com/webmasters" target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline mt-1.5 inline-block">前往 Bing Webmaster</a>
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1.5">Yandex Site Verification</label>
               <input 
                 value={seoConfig.yandexVerification}
                 onChange={e => handleChange('yandexVerification', e.target.value)}
                 className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-mono" 
                 placeholder="例如: 123456abcdef..."
               />
               <a href="https://webmaster.yandex.com/" target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline mt-1.5 inline-block">前往 Yandex Webmaster</a>
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1.5">Baidu Site Verification</label>
               <input 
                 value={seoConfig.baiduVerification}
                 onChange={e => handleChange('baiduVerification', e.target.value)}
                 className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-mono" 
                 placeholder="例如: xxxxxxx..."
               />
               <a href="https://ziyuan.baidu.com/" target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline mt-1.5 inline-block">前往 Baidu 搜索资源平台</a>
             </div>
          </div>
        </section>

        {/* Robots.txt */}
        <section className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50 bg-gray-50/30">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center border border-gray-200">
                  <FileCode2 className="w-5 h-5" />
               </div>
               <div>
                  <h2 className="text-lg font-bold text-gray-900">Robots.txt 文件修改</h2>
                  <p className="text-xs text-gray-500 mt-0.5">控制搜索引擎蜘蛛的抓取规则与白名单</p>
               </div>
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col">
             <textarea 
                value={seoConfig.robotsTxt}
                onChange={e => handleChange('robotsTxt', e.target.value)}
                className="w-full flex-1 min-h-[160px] px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-mono bg-gray-50/50" 
             />
             <p className="text-xs text-gray-400 mt-2">只有当您了解规则时才建议修改，不恰当的规则会导致网站无法被收录。</p>
          </div>
        </section>
      </div>

      {/* Sitemaps */}
      <section className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center border border-orange-100/50">
                <Zap className="w-5 h-5" />
             </div>
             <div>
                <h2 className="text-lg font-bold text-gray-900">网站地图 (Sitemap)</h2>
                <p className="text-xs text-gray-500 mt-0.5">配置需要生成的地图类型并向搜索引擎推送</p>
             </div>
          </div>
          
          <button 
             onClick={handleSitemapSubmit}
             disabled={submittingSitemap}
             className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
          >
             {submittingSitemap ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
             生成 Sitemap 并一键提交
          </button>
        </div>
        
        <div className="p-6">
           <div className="flex items-center gap-8 mb-4">
             <label className="flex items-center gap-2 cursor-pointer group">
               <input 
                 type="checkbox" 
                 checked={seoConfig.sitemapImage} 
                 onChange={e => handleChange('sitemapImage', e.target.checked)}
                 className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer"
               />
               <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">生成 Image 地图</span>
             </label>
             <label className="flex items-center gap-2 cursor-pointer group">
               <input 
                 type="checkbox" 
                 checked={seoConfig.sitemapPost} 
                 onChange={e => handleChange('sitemapPost', e.target.checked)}
                 className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer"
               />
               <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">生成 Post 博客地图</span>
             </label>
             <label className="flex items-center gap-2 cursor-pointer group">
               <input 
                 type="checkbox" 
                 checked={seoConfig.sitemapPage} 
                 onChange={e => handleChange('sitemapPage', e.target.checked)}
                 className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer"
               />
               <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">生成 Page 页面地图</span>
             </label>
           </div>
           
           <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 mt-6">
              <h4 className="text-sm font-bold text-gray-900 mb-1">您的主 Sitemap 索引地址：</h4>
              <p className="text-sm text-primary font-mono select-all">https://www.kuulfans.com/sitemap.xml</p>
           </div>
        </div>
      </section>
    </div>
  );
}
