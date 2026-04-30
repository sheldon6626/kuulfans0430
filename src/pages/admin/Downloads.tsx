import { useState, useEffect, useRef } from 'react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, addDoc, serverTimestamp, getDocs, where } from 'firebase/firestore';
import { Loader2, DownloadCloud, UploadCloud, File as FileIcon, Trash2, Copy, CheckCircle2, FileType, Image as ImageIcon } from 'lucide-react';

export default function Downloads() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = query(collection(db, 'downloads'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setFiles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'downloads');
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Limit to 800KB for Firestore base64 storage
      if (file.size > 800 * 1024) {
        alert('由于存储限制，请上传小于 800KB 的文件。');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      setUploading(true);

      try {
        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        
        let finalName = nameWithoutExt;
        let counter = 1;
        while (true) {
          const checkQ = query(collection(db, 'downloads'), where('name', '==', finalName));
          const snap = await getDocs(checkQ);
          if (snap.empty) break;
          finalName = `${nameWithoutExt}-${String(counter).padStart(4, '0')}`;
          counter++;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
          const base64Data = event.target?.result as string;
          
          await addDoc(collection(db, 'downloads'), {
            name: finalName,
            originalName: file.name,
            url: base64Data, // Save base64 directly to simulate storage
            size: file.size,
            type: file.type,
            createdAt: serverTimestamp()
          });
          
          setUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        };
        reader.onerror = () => {
          alert('读取文件失败');
          setUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        };
        reader.readAsDataURL(file);

      } catch (err: any) {
        alert('上传发生错误：' + err.message);
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (file: any) => {
    if (!window.confirm(`确定要删除文件 "${file.name}" 吗？此操作不可恢复。`)) return;
    try {
      await deleteDoc(doc(db, 'downloads', file.id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'downloads');
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-6 mb-2">
         <div>
             <h1 className="text-2xl font-bold text-gray-900">媒体库</h1>
             <p className="text-sm text-gray-500 mt-1">集中管理您的所有媒体文件，类似 WordPress 媒体中心。</p>
         </div>
         
         <div>
            <input 
               type="file" 
               ref={fileInputRef} 
               onChange={handleFileChange} 
               className="hidden" 
            />
            <button 
              onClick={handleUploadClick}
              disabled={uploading}
              className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm shadow-primary/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
              {uploading ? '正在处理...' : '上传新媒体'}
            </button>
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-6 min-h-[500px]">
         {files.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <ImageIcon className="w-16 h-16 text-gray-200 mb-4" />
              <p className="text-gray-500 font-medium">没有找到媒体文件</p>
              <p className="text-sm text-gray-400 mt-1">点击右上角"上传新媒体"添加文件</p>
            </div>
         ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 auto-rows-[150px]">
               {files.map(file => (
                  <div key={file.id} className="group relative border border-gray-200 rounded-lg overflow-hidden bg-gray-50 hover:border-primary transition-colors focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
                    {/* Thumbnail */}
                    <div className="w-full h-24 flex items-center justify-center bg-white border-b border-gray-100 overflow-hidden relative">
                       {file.type?.startsWith('image/') ? (
                         <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                       ) : (
                         <FileType className="w-10 h-10 text-gray-300" />
                       )}
                       
                       {/* Hover Actions */}
                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button 
                            onClick={() => copyToClipboard(file.url, file.id)}
                            className="p-1.5 bg-white rounded-md text-gray-700 hover:text-primary transition-colors"
                            title="复制链接"
                          >
                            {copiedId === file.id ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <button 
                            onClick={() => window.open(file.url, '_blank')}
                            className="p-1.5 bg-white rounded-md text-gray-700 hover:text-primary transition-colors"
                            title="新窗口打开"
                          >
                            <DownloadCloud className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(file)}
                            className="p-1.5 bg-white rounded-md text-gray-700 hover:text-red-600 transition-colors"
                            title="永久删除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                    
                    {/* File Info */}
                    <div className="p-2">
                       <p className="text-xs font-medium text-gray-900 truncate" title={file.originalName || file.name}>
                         {file.originalName || file.name}
                       </p>
                       <p className="text-[10px] text-gray-500 mt-1 uppercase">
                         {file.type ? file.type.split('/')[1] : 'FILE'} · {(file.size / 1024).toFixed(0)} KB
                       </p>
                    </div>
                  </div>
               ))}
            </div>
         )}
      </div>
    </div>
  );
}
