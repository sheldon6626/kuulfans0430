import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { Loader2, Mail, CheckCircle, Clock } from 'lucide-react';

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

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
         <h1 className="text-3xl font-bold">Contact Inquiries</h1>
         <p className="text-gray-500 mt-2">Manage customer messages and quoting requests.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
         {inquiries.length === 0 ? (
           <div className="p-10 text-center text-gray-500">
             <Mail className="w-12 h-12 mx-auto mb-3 text-gray-300" />
             No inquiries yet.
           </div>
         ) : (
           <div className="divide-y divide-gray-100">
             {inquiries.map((inq) => (
               <div 
                 key={inq.id} 
                 className={`p-6 hover:bg-gray-50 transition-colors ${inq.status === 'new' ? 'bg-blue-50/50' : ''}`}
                 onClick={() => markAsRead(inq.id, inq.status)}
               >
                 <div className="flex justify-between items-start mb-2">
                   <div className="flex gap-4 items-center">
                     <h3 className="font-bold text-lg">{inq.name}</h3>
                     <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${inq.status === 'new' ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-600'}`}>
                       {inq.status === 'new' ? 'New' : 'Read'}
                     </span>
                   </div>
                   <div className="text-sm text-gray-500 flex items-center gap-1">
                     <Clock className="w-4 h-4" />
                     {inq.createdAt ? inq.createdAt.toLocaleString() : 'Just now'}
                   </div>
                 </div>
                 <div className="flex gap-4 text-sm text-gray-600 mb-4">
                   <a href={`mailto:${inq.email}`} className="text-primary hover:underline">{inq.email}</a>
                   {inq.phone && <span>• {inq.phone}</span>}
                   {inq.company && <span>• {inq.company}</span>}
                 </div>
                 <div className="bg-white border border-gray-100 rounded-xl p-4 text-gray-700 whitespace-pre-wrap">
                   {inq.message}
                 </div>
               </div>
             ))}
           </div>
         )}
      </div>
    </div>
  );
}
