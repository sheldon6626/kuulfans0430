import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Save, Loader2, CheckCircle2, Sliders, Palette, Type, Image as ImageIcon } from 'lucide-react';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const [sysConfig, setSysConfig] = useState({
    siteName: 'Kuul Fans',
    contactEmail: 'info@kuulfans.com',
    primaryColor: '#0651ED',
    secondaryColor: '#FF6B00',
    logoUrl: '',
    logoScrollUrl: '',
    faviconUrl: '',
    logoWidth: '150',
    fontFamily: 'Inter',
    fontSizeH1: '32',
    fontSizeH2: '24',
    fontSizeBody: '16',
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const sysDoc = await getDoc(doc(db, 'settings', 'system_config'));
        if (sysDoc.exists()) {
           const data = sysDoc.data().value;
           setSysConfig(prevState => ({ ...prevState, ...JSON.parse(data) }));
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
      await setDoc(doc(db, 'settings', 'system_config'), {
        key: 'system_config',
        value: JSON.stringify(sysConfig),
        updatedAt: serverTimestamp()
      });
      setMessage('系统设置已成功保存！');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'settings');
      setMessage('保存设置时发生错误，请重试。');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSysConfig(prev => ({ ...prev, [key]: value }));
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-6 mb-2">
         <div>
             <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>
             <p className="text-sm text-gray-500 mt-1">管理网站基本配置、视觉品牌、和字体参数</p>
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

      {/* Visual Settings: Colors & Logos */}
      <section className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/30">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center border border-orange-100/50">
                <Palette className="w-5 h-5" />
             </div>
             <div>
                <h2 className="text-lg font-bold text-gray-900">品牌视觉</h2>
                <p className="text-xs text-gray-500 mt-0.5">网站主色、副色及各种状态下的 LOGO 配置</p>
             </div>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">网站主色 (Primary Color)</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={sysConfig.primaryColor} onChange={e => handleChange('primaryColor', e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0 p-0" />
                  <input type="text" value={sysConfig.primaryColor} onChange={e => handleChange('primaryColor', e.target.value)} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 outline-none uppercase font-mono text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">网站副色 (Secondary Color)</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={sysConfig.secondaryColor} onChange={e => handleChange('secondaryColor', e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0 p-0" />
                  <input type="text" value={sysConfig.secondaryColor} onChange={e => handleChange('secondaryColor', e.target.value)} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 outline-none uppercase font-mono text-sm" />
                </div>
              </div>
           </div>

           <hr className="border-gray-100" />

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><ImageIcon className="w-4 h-4 text-gray-400"/> 固定 LOGO URL (透明底)</label>
                <input value={sysConfig.logoUrl} onChange={e => handleChange('logoUrl', e.target.value)} placeholder="如果不填，将使用系统默认配置。您可从下载中心复制图片URL填入" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><ImageIcon className="w-4 h-4 text-gray-400"/> 滚动 LOGO URL (当深色导航变为浅色背景时)</label>
                <input value={sysConfig.logoScrollUrl} onChange={e => handleChange('logoScrollUrl', e.target.value)} placeholder="留空则复用上方Logo" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">网站图标 Favicon URL</label>
                <input value={sysConfig.faviconUrl} onChange={e => handleChange('faviconUrl', e.target.value)} placeholder="建议 32x32，如 https://..." className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">LOGO 固定宽度 (px)</label>
                <input type="number" value={sysConfig.logoWidth} onChange={e => handleChange('logoWidth', e.target.value)} placeholder="150" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none text-sm" />
              </div>
           </div>
        </div>
      </section>

      {/* Typography settings */}
      <section className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/30">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center border border-indigo-100/50">
                <Type className="w-5 h-5" />
             </div>
             <div>
                <h2 className="text-lg font-bold text-gray-900">排版与字体</h2>
                <p className="text-xs text-gray-500 mt-0.5">全站的字体名称以及各个区块的基础字体大小设置</p>
             </div>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">全局字体名称 (Font Family)</label>
                <select value={sysConfig.fontFamily} onChange={e => handleChange('fontFamily', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none text-sm bg-white">
                  <option value="Inter">Inter (现代极简无衬线)</option>
                  <option value="Space Grotesk">Space Grotesk (科技感设计)</option>
                  <option value="Playfair Display">Playfair Display (经典优雅衬线)</option>
                  <option value="system-ui">系统默认 (加载最快)</option>
                </select>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">H1 标题大小 (px)</label>
                <input type="number" value={sysConfig.fontSizeH1} onChange={e => handleChange('fontSizeH1', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">H2 副标题大小 (px)</label>
                <input type="number" value={sysConfig.fontSizeH2} onChange={e => handleChange('fontSizeH2', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">正文基础大小 (px)</label>
                <input type="number" value={sysConfig.fontSizeBody} onChange={e => handleChange('fontSizeBody', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none text-sm" />
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
