import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';

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
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
    }
  }

  if (loading && !isEditing) return <div className="flex justify-center p-10"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-8">
         <h1 className="text-3xl font-bold">Products Manager</h1>
         {!isEditing && (
           <button 
             onClick={() => { resetForm(); setIsEditing(true); }}
             className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm"
           >
             <Plus className="w-5 h-5" /> Add Product
           </button>
         )}
      </div>

      {isEditing ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
           <h2 className="text-xl font-bold mb-6">{currentId ? 'Edit Product' : 'Add New Product'}</h2>
           <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                   <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                   <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none bg-white">
                     <option>HVLS Fans</option>
                     <option>Evaporative Air Coolers</option>
                     <option>Evaporative Cooling Pads</option>
                     <option>Exhaust Fans</option>
                     <option>Portable Air Coolers</option>
                     <option>Commercial Ceiling Fans</option>
                   </select>
                </div>
              </div>
              
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                 <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" />
              </div>
              
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                 <input value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://..." className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" />
              </div>

              <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                 <h3 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">SEO Configuration</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">SEO Title</label>
                     <input value={formData.seoTitle} onChange={e => setFormData({...formData, seoTitle: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">SEO Description</label>
                     <input value={formData.seoDescription} onChange={e => setFormData({...formData, seoDescription: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" />
                   </div>
                 </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-100">
                 <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
                 <button type="submit" disabled={loading} className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-xl font-medium transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2">
                   {loading && <Loader2 className="w-4 h-4 animate-spin" />} Save Product
                 </button>
              </div>
           </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
           <table className="min-w-full divide-y divide-gray-200">
             <thead className="bg-gray-50">
               <tr>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
               </tr>
             </thead>
             <tbody className="bg-white divide-y divide-gray-200">
               {products.length === 0 ? (
                 <tr>
                   <td colSpan={3} className="px-6 py-10 text-center text-gray-500">No products found. Add one above.</td>
                 </tr>
               ) : (
                 products.map(prod => (
                   <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                     <td className="px-6 py-4 whitespace-nowrap">
                       <div className="flex items-center gap-4">
                         {prod.imageUrl ? (
                           <img src={prod.imageUrl} className="w-12 h-12 rounded-lg object-cover" alt="" />
                         ) : (
                           <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
                         )}
                         <div>
                           <div className="text-sm font-medium text-gray-900">{prod.name}</div>
                           {prod.seoTitle && <div className="text-xs text-green-600 border border-green-200 bg-green-50 px-1.5 rounded inline-block mt-1">SEO Active</div>}
                         </div>
                       </div>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                       {prod.category}
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                       <button onClick={() => handleEdit(prod)} className="text-primary hover:text-secondary p-2 inline-block"><Edit className="w-5 h-5" /></button>
                       <button onClick={() => handleDelete(prod.id)} className="text-red-500 hover:text-red-700 p-2 inline-block ml-2"><Trash2 className="w-5 h-5" /></button>
                     </td>
                   </tr>
                 ))
               )}
             </tbody>
           </table>
        </div>
      )}
    </div>
  );
}
