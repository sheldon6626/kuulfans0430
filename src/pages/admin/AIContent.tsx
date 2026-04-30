import { useState, useEffect } from 'react';
import { db, auth, handleFirestoreError, OperationType } from '../../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Bot, Save, Loader2, Image as ImageIcon, Type, FileText, RefreshCw, Send, CheckCircle2, DownloadCloud } from 'lucide-react';

export default function AIContent() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [globalConfig, setGlobalConfig] = useState({
    baseUrl: '',
    apiKey: '',
    model: ''
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const aiDoc = await getDoc(doc(db, 'settings', 'ai_proxy'));
        if (aiDoc.exists()) {
           const data = aiDoc.data().value;
           setGlobalConfig(JSON.parse(data));
        }
        
        if (auth.currentUser) {
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          if ((userDoc.exists() && userDoc.data().role === 'admin') || auth.currentUser.email === 'barberagil46@gmail.com') {
            setIsAdmin(true);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSaveConfig = async () => {
    setSaving(true);
    setMessage('');
    try {
      await setDoc(doc(db, 'settings', 'ai_proxy'), {
        key: 'ai_proxy',
        value: JSON.stringify(globalConfig),
        updatedAt: serverTimestamp()
      });
      setMessage('大模型配置已保存！');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'settings');
      setMessage('保存配置失败。');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const AIAssistantCard = ({ title, icon: Icon, defaultPrompt, type, isAdmin }: { title: string, icon: React.ElementType, defaultPrompt: string, type: 'image' | 'text', isAdmin: boolean }) => {
    const [model, setModel] = useState('');
    const [instruction, setInstruction] = useState(defaultPrompt);
    const [userInstruction, setUserInstruction] = useState('');
    const [output, setOutput] = useState('');
    const [generating, setGenerating] = useState(false);

    const handleGenerate = async () => {
      setGenerating(true);
      const combinedPrompt = `System: ${instruction}\nUser: ${userInstruction}`;
      // Mock generation API call
      setTimeout(() => {
        if (type === 'image') {
          setOutput(`【图片占位URL】https://example.com/generated-image.jpg\n(注：此为演示环境前端模拟生成)`);
        } else {
          setOutput(`这里是 AI 自动生成的内容。\n大模型执行指令已接收：\n提示词：${instruction}\n用户指令：${userInstruction}\n\n【段落一】这是生成的精美占位文本，展现 AI 内容生成能力...\n(注：此为演示环境前端模拟生成)`);
        }
        setGenerating(false);
      }, 1500);
    };

    return (
      <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.08)] border border-gray-100 flex flex-col overflow-hidden">
         <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Icon className="w-5 h-5 text-primary" /> {title}
            </h3>
            <div className="flex items-center gap-2">
               <span className="text-xs text-gray-400">模型:</span>
               <input 
                 value={model}
                 onChange={e => setModel(e.target.value)}
                 placeholder={globalConfig.model || "继承默认配置"}
                 className="text-xs px-2 py-1.5 rounded border border-gray-200 outline-none focus:border-primary w-32 bg-white"
               />
            </div>
         </div>
         
         <div className="p-6 flex-1 flex flex-col gap-5">
            {isAdmin && (
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">提示词</label>
                  <textarea 
                    value={instruction}
                    onChange={e => setInstruction(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none text-sm resize-none bg-gray-50/50 hover:bg-white" 
                    placeholder="输入具体的系统提示词..."
                  />
               </div>
            )}
            
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1.5">用户指令</label>
               <textarea 
                 value={userInstruction}
                 onChange={e => setUserInstruction(e.target.value)}
                 rows={3}
                 className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none text-sm resize-none bg-white font-medium" 
                 placeholder="输入您具体要生成的内容要求，例如：请为新款超大吊扇编写宣传文案..."
               />
            </div>
            
            <button 
              onClick={handleGenerate}
              disabled={generating || (!userInstruction && !instruction)}
              className="w-full flex justify-center items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {generating ? '正在运行...' : '立即运行'}
            </button>
            
            <div className="flex-1 min-h-[160px] flex flex-col relative border-t border-gray-100 pt-5">
               <label className="block text-sm font-medium text-gray-700 mb-2 border-l-2 border-primary pl-2">生成结果对话框</label>
               <textarea 
                 value={output}
                 onChange={e => setOutput(e.target.value)}
                 className="flex-1 w-full p-4 rounded-lg border border-gray-200 focus:border-primary outline-none text-sm resize-none bg-gray-50/30 font-mono text-gray-700 leading-relaxed"
                 placeholder="AI 返回的内容将显示在这里..."
               />
            </div>
         </div>
         
         <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex gap-3">
            <button disabled={!output} className="flex-1 flex justify-center items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
               <FileText className="w-4 h-4" /> 加到博客
            </button>
            {type === 'image' && (
              <button disabled={!output} className="flex-1 flex justify-center items-center gap-2 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                 <DownloadCloud className="w-4 h-4" /> 存至文件中心
              </button>
            )}
         </div>
      </div>
    );
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="border-b border-gray-200 pb-6 mb-2">
         <h1 className="text-2xl font-bold text-gray-900">AI 内容助手</h1>
         <p className="text-sm text-gray-500 mt-1">配置 AI 大模型 API 并一键生成各种网站营销物料</p>
      </div>

      {/* Configuration Header */}
      <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-6 flex flex-col md:flex-row gap-6 relative">
         <div className="w-12 h-12 rounded-lg bg-blue-50 text-primary flex items-center justify-center flex-shrink-0">
            <Bot className="w-6 h-6" />
         </div>
         
         <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
               <label className="block text-xs font-medium text-gray-500 mb-1">接口地址 (Base URL)</label>
               <input 
                 value={globalConfig.baseUrl}
                 onChange={e => setGlobalConfig({...globalConfig, baseUrl: e.target.value})}
                 className="w-full px-3 py-2 rounded border border-gray-200 outline-none focus:border-primary text-sm"
                 placeholder="https://api.openai.com/v1"
               />
            </div>
            <div>
               <label className="block text-xs font-medium text-gray-500 mb-1">默认全局大模型名称</label>
               <input 
                 value={globalConfig.model}
                 onChange={e => setGlobalConfig({...globalConfig, model: e.target.value})}
                 className="w-full px-3 py-2 rounded border border-gray-200 outline-none focus:border-primary text-sm font-mono"
                 placeholder="gpt-3.5-turbo / gpt-4o"
               />
            </div>
            <div className="md:col-span-2">
               <label className="block text-xs font-medium text-gray-500 mb-1">API 密钥 (API Key)</label>
               <input 
                 type="password"
                 value={globalConfig.apiKey}
                 onChange={e => setGlobalConfig({...globalConfig, apiKey: e.target.value})}
                 className="w-full px-3 py-2 rounded border border-gray-200 outline-none focus:border-primary text-sm font-mono"
                 placeholder="sk-..."
               />
            </div>
         </div>
         
         <div className="flex flex-col items-end justify-end">
            <button 
              onClick={handleSaveConfig}
              disabled={saving}
              className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded shadow-sm flex items-center gap-2 text-sm font-medium transition-colors disabled:opacity-70 h-full w-full md:w-auto"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              保存配置
            </button>
            {message && <span className="absolute -bottom-6 right-0 text-xs text-green-600 font-medium flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {message}</span>}
         </div>
      </div>

      {/* Grid of AI Assistants */}
      <div className="flex flex-col gap-6">
         <AIAssistantCard 
           title="生成图片" 
           icon={ImageIcon} 
           type="image"
           isAdmin={isAdmin}
           defaultPrompt="生成一张大型工业风扇在汽车制造厂车间中旋转的逼真照片，要求工业风、光影对比强烈。"
         />
         <AIAssistantCard 
           title="生成标题" 
           icon={Type} 
           type="text"
           isAdmin={isAdmin}
           defaultPrompt="请为我的网站生成 10 个关于 '工业厂房降温设备采购指南' 的 SEO 友好的博客标题。"
         />
         <AIAssistantCard 
           title="生成博客" 
           icon={FileText} 
           type="text"
           isAdmin={isAdmin}
           defaultPrompt="请以专家的口吻写一篇 800 字的文章，介绍 HVLS 工业风扇相比于传统空调的省电优势，包含小标题。"
         />
         <AIAssistantCard 
           title="博客改写" 
           icon={RefreshCw} 
           type="text"
           isAdmin={isAdmin}
           defaultPrompt="请将以下段落改写并润色，使其语气更吸引人，便于在社交媒体上阅读传播..."
         />
      </div>
    </div>
  );
}
