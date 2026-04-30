import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { Loader2, Mail, CheckCircle, Clock, Building2, Phone } from 'lucide-react';

export default function Inquiries() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      setInquiries(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'inquiries');
    });

    return () => unsubscribe();
  }, []);

  const markAsRead = async (id: string, currentStatus: string) => {
    if (currentStatus === 'read') return;
    try {
      await updateDoc(doc(db, 'inquiries', id), {
        status: 'read'
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `inquiries/${id}`);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;

  return (
    <div className="max-w-6xl space-y-6">
      <div className="border-b border-gray-200 pb-6 mb-2">
         <h1 className="text-2xl font-bold text-gray-900">表单询盘管理</h1>
         <p className="text-sm text-gray-500 mt-1">管理并回复客户在网站上提交的留言和报价请求。</p>
      </div>

      <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden">
         {inquiries.length === 0 ? (
           <div className="p-16 text-center">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <Mail className="w-8 h-8 text-gray-300" />
             </div>
             <p className="text-gray-500 font-medium">暂无未读的询盘留言。</p>
             <p className="text-sm text-gray-400 mt-1">当有客户提交表单时，信息会显示在这里。</p>
           </div>
         ) : (
           <div className="divide-y divide-gray-100">
             {inquiries.map((inq) => (
               <div 
                 key={inq.id} 
                 className={`p-6 transition-colors group cursor-pointer ${inq.status === 'new' ? 'bg-blue-50/40 hover:bg-blue-50/70' : 'bg-white hover:bg-gray-50/80'}`}
                 onClick={() => markAsRead(inq.id, inq.status)}
               >
                 <div className="flex justify-between items-start mb-3">
                   <div className="flex gap-3 items-center">
                     <h3 className={`text-lg font-bold ${inq.status === 'new' ? 'text-gray-900' : 'text-gray-700'}`}>{inq.name}</h3>
                     <span className={`px-2 py-0.5 text-[11px] rounded flex items-center gap-1 border font-medium ${inq.status === 'new' ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20 animate-pulse' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                       {inq.status === 'new' ? '未读 新消息' : <><CheckCircle className="w-3 h-3" /> 已读</>}
                     </span>
                   </div>
                   <div className="text-xs text-gray-400 flex items-center gap-1.5 font-medium">
                     <Clock className="w-3.5 h-3.5" />
                     {inq.createdAt ? inq.createdAt.toLocaleDateString() + ' ' + inq.createdAt.toLocaleTimeString() : '刚刚'}
                   </div>
                 </div>
                 
                 <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600 mb-4 bg-white/50 inline-flex p-2.5 rounded-lg border border-gray-100/50">
                   <a href={`mailto:${inq.email}`} className="text-primary hover:text-secondary flex items-center gap-1.5 font-medium transition-colors" target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                     <Mail className="w-4 h-4 text-gray-400" /> {inq.email}
                   </a>
                   {inq.phone && (
                     <span className="flex items-center gap-1.5 font-medium">
                       <Phone className="w-4 h-4 text-gray-400" /> {inq.phone}
                     </span>
                   )}
                   {inq.company && (
                     <span className="flex items-center gap-1.5 font-medium">
                       <Building2 className="w-4 h-4 text-gray-400" /> {inq.company}
                     </span>
                   )}
                 </div>
                 
                 <div className={`border rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap transition-colors ${inq.status === 'new' ? 'bg-white border-blue-100 text-gray-800' : 'bg-gray-50/50 border-gray-100 text-gray-600'}`}>
                   {inq.message}
                 </div>
                 
                 {inq.status === 'new' && (
                    <div className="mt-3 flex justify-end">
                      <span className="text-xs font-medium text-primary bg-blue-50 px-3 py-1 rounded inline-block opacity-0 group-hover:opacity-100 transition-opacity">点击标记为已读</span>
                    </div>
                 )}
               </div>
             ))}
           </div>
         )}
      </div>
    </div>
  );
}
