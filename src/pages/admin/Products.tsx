import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { Loader2, Plus, Edit, Trash2, Box, Info, Save } from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'HVLS Fans',
    description: '',
    specifications: '',
    imageUrl: '',
    seoTitle: '',
    seoDescription: ''
  });

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing && currentId) {
        await updateDoc(doc(db, 'products', currentId), {
           ...formData,
           updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'products'), {
           ...formData,
           createdAt: serverTimestamp(),
           updatedAt: serverTimestamp(),
           createdBy: 'admin' // In real app use auth.currentUser.uid
        });
      }
      setIsEditing(false);
      resetForm();
    } catch (err) {
      handleFirestoreError(err, isEditing ? OperationType.UPDATE : OperationType.CREATE, 'products');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', category: 'HVLS Fans', description: '', specifications: '', imageUrl: '', seoTitle: '', seoDescription: ''
    });
    setCurrentId(null);
  }

  const handleEdit = (prod: any) => {
    setFormData({
       name: prod.name || '',
       category: prod.category || 'HVLS Fans',
       description: prod.description || '',
       specifications: prod.specifications || '',
       imageUrl: prod.imageUrl || '',
       seoTitle: prod.seoTitle || '',
       seoDescription: prod.seoDescription || ''
    });
    setCurrentId(prod.id);
    setIsEditing(true);
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('您确定要永久删除此产品吗？此操作无法撤销。')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
    }
  }

  if (loading && !isEditing) return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-6 mb-2">
         <div>
            <h1 className="text-2xl font-bold text-gray-900">产品中心</h1>
            <p className="text-sm text-gray-500 mt-1">管理网站展示的产品目录及 SEO 信息。</p>
         </div>
         {!isEditing && (
           <button 
             onClick={() => { resetForm(); setIsEditing(true); }}
             className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.4)] hover:-translate-y-0.5"
           >
             <Plus className="w-5 h-5" /> 发布新产品
           </button>
         )}
      </div>

      {isEditing ? (
        <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden">
           <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
             <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
               <Box className="w-5 h-5 text-primary" />
               {currentId ? '编辑产品信息' : '添加新产品'}
             </h2>
             <button type="button" onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">取消</button>
           </div>
           
           <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* Basic Info */}
              <div className="space-y-6">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                  1. 基础信息
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1.5">产品名称 (Product Name) <span className="text-red-500">*</span></label>
                     <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="例如：7.3m 大型工业吊扇" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none text-sm" />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1.5">产品分类 (Category) <span className="text-red-500">*</span></label>
                     <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none bg-white text-sm">
                       <option value="HVLS Fans">大型工业吊扇 (HVLS Fans)</option>
                       <option value="Evaporative Air Coolers">环保空调/冷风机 (Evaporative Air Coolers)</option>
                       <option value="Evaporative Cooling Pads">水帘/湿帘 (Evaporative Cooling Pads)</option>
                       <option value="Exhaust Fans">负压风机/排风扇 (Exhaust Fans)</option>
                       <option value="Portable Air Coolers">移动环保空调 (Portable Air Coolers)</option>
                       <option value="Commercial Ceiling Fans">商业吊扇 (Commercial Ceiling Fans)</option>
                     </select>
                  </div>
                </div>
                
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1.5">产品描述 (Description)</label>
                   <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="输入详细的产品介绍..." className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none text-sm resize-y" />
                </div>
                
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1.5">主图链接 (Image URL)</label>
                   <input value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://..." className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none text-sm font-mono" />
                   {formData.imageUrl && (
                     <div className="mt-3 relative w-32 h-32 rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                       <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                     </div>
                   )}
                </div>
              </div>

              {/* SEO Config */}
              <div className="space-y-6 pt-6 border-t border-gray-100">
                 <div className="flex items-start justify-between">
                   <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm mb-1">
                     2. SEO 独立配置 
                   </h3>
                   <div className="text-xs text-gray-400 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded"><Info className="w-3.5 h-3.5" /> 留空则使用全局配置</div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50/30 p-5 rounded-xl border border-blue-50">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1.5">SEO 独立标题</label>
                     <input value={formData.seoTitle} onChange={e => setFormData({...formData, seoTitle: e.target.value})} placeholder="例如: 优质 HVLS 大型工业吊扇 - 厂家直销" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none text-sm" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1.5">SEO 独立描述</label>
                     <input value={formData.seoDescription} onChange={e => setFormData({...formData, seoDescription: e.target.value})} placeholder="包含关键词的产品短述..." className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none text-sm" />
                   </div>
                 </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                 <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors text-sm">取消返回</button>
                 <button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-[0_2px_10px_-3px_rgba(6,81,237,0.4)] disabled:opacity-70 flex items-center gap-2 text-sm">
                   {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 保存产品发布
                 </button>
              </div>
           </form>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden">
           <div className="overflow-x-auto">
             <table className="min-w-full divide-y divide-gray-200">
               <thead className="bg-gray-50/50">
                 <tr>
                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-widest">产品信息</th>
                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-widest">所属分类</th>
                   <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-widest">操作</th>
                 </tr>
               </thead>
               <tbody className="bg-white divide-y divide-gray-100">
                 {products.length === 0 ? (
                   <tr>
                     <td colSpan={3} className="px-6 py-16 text-center">
                       <Box className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                       <div className="text-gray-500 font-medium">暂无产品记录</div>
                       <div className="text-gray-400 text-sm mt-1">请在上方点击「发布新产品」开始添加。</div>
                     </td>
                   </tr>
                 ) : (
                   products.map(prod => (
                     <tr key={prod.id} className="hover:bg-blue-50/30 transition-colors">
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="flex items-center gap-4">
                           {prod.imageUrl ? (
                             <img src={prod.imageUrl} className="w-14 h-14 rounded-lg object-cover border border-gray-100 shadow-sm" alt="" />
                           ) : (
                             <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center text-gray-300">
                               <Box className="w-6 h-6" />
                             </div>
                           )}
                           <div>
                             <div className="text-sm font-bold text-gray-900">{prod.name}</div>
                             {prod.seoTitle ? (
                               <div className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 inline-block mt-1.5">SEO 已配置</div>
                             ) : (
                               <div className="text-[11px] font-medium text-gray-400 mt-1.5">默认 SEO</div>
                             )}
                           </div>
                         </div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                           {prod.category}
                         </span>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                         <button onClick={() => handleEdit(prod)} className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors" title="编辑"><Edit className="w-4 h-4" /></button>
                         <button onClick={() => handleDelete(prod.id)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors ml-1" title="删除"><Trash2 className="w-4 h-4" /></button>
                       </td>
                     </tr>
                   ))
                 )}
               </tbody>
             </table>
           </div>
        </div>
      )}
    </div>
  );
}
