import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Save, Loader2, Bot, Globe } from 'lucide-react';

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
    defaultTitle: 'Kuul Fans | Industrial Cooling Solutions',
    defaultDescription: 'Premium HVLS fans and evaporative cooling systems for industrial needs.',
    keywords: 'HVLS Fans, Air Coolers, Industrial Cooling, Kuul Fans'
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
      
      setMessage('Settings saved successfully.');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'settings');
      setMessage('Error saving settings.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-10"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-8">
         <h1 className="text-3xl font-bold">Settings & Configuration</h1>
         <button 
           onClick={handleSave} 
           disabled={saving}
           className="bg-primary hover:bg-secondary text-white px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70"
         >
           {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
           Save Changes
         </button>
      </div>
      
      {message && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 text-green-700 font-medium">
          {message}
        </div>
      )}

      <div className="space-y-8">
        {/* AI Proxy Settings */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
             <div className="w-10 h-10 rounded-full bg-blue-50 text-secondary flex items-center justify-center">
                <Bot className="w-6 h-6" />
             </div>
             <div>
                <h2 className="text-xl font-bold">AI Model Proxy Configurations</h2>
                <p className="text-sm text-gray-500">Configure your custom 3rd-party proxy AI models (OpenAI-compatible) for SEO content generation and translations.</p>
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Base URL (API Endpoint)</label>
              <input 
                value={aiConfig.baseUrl}
                onChange={(e) => setAiConfig({...aiConfig, baseUrl: e.target.value})}
                placeholder="https://api.openai.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
              <input 
                type="password"
                value={aiConfig.apiKey}
                onChange={(e) => setAiConfig({...aiConfig, apiKey: e.target.value})}
                placeholder="sk-..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Model Name</label>
              <input 
                value={aiConfig.model}
                onChange={(e) => setAiConfig({...aiConfig, model: e.target.value})}
                placeholder="gpt-4"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" 
              />
            </div>
          </div>
        </section>

        {/* Global SEO Settings */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
             <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                <Globe className="w-6 h-6" />
             </div>
             <div>
                <h2 className="text-xl font-bold">Global SEO Configuration</h2>
                <p className="text-sm text-gray-500">Default meta tags applied globally across the site.</p>
             </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Meta Title</label>
              <input 
                value={seoConfig.defaultTitle}
                onChange={(e) => setSeoConfig({...seoConfig, defaultTitle: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Meta Description</label>
              <textarea 
                value={seoConfig.defaultDescription}
                onChange={(e) => setSeoConfig({...seoConfig, defaultDescription: e.target.value})}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" 
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meta Keywords</label>
              <input 
                value={seoConfig.keywords}
                onChange={(e) => setSeoConfig({...seoConfig, keywords: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" 
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
