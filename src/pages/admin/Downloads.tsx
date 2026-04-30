import { useState, useEffect, useRef } from 'react';
import { db, storage, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, addDoc, serverTimestamp, getDocs, where } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { Loader2, DownloadCloud, UploadCloud, File as FileIcon, Trash2, Copy, CheckCircle2, FileType, Image as ImageIcon, X } from 'lucide-react';

export default function Downloads() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const [showSlugModal, setShowSlugModal] = useState(false);
  const [slugInput, setSlugInput] = useState('');
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setPendingFiles(selectedFiles);
      setSlugInput('');
      setShowSlugModal(true);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSlugSubmit = () => {
     setShowSlugModal(false);
     processFiles(pendingFiles, slugInput.trim());
  };

  const processFiles = async (filesToProcess: File[], slugBase: string) => {
    setUploading(true);
    let sequenceCounter = 1;

    for (const file of filesToProcess) {
      try {
        let finalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        const extension = file.name.split('.').pop();
        
        if (slugBase) {
           const paddedIndex = String(sequenceCounter).padStart(3, '0');
           finalName = `${slugBase.toLowerCase()}-${paddedIndex}`;
           sequenceCounter++;
        }

        let uniqueName = finalName;
        let counter = 1;
        while (true) {
          const checkQ = query(collection(db, 'downloads'), where('name', '==', uniqueName));
          const snap = await getDocs(checkQ);
          if (snap.empty) break;
          uniqueName = `${finalName}-${String(counter).padStart(4, '0')}`;
          counter++;
        }
        finalName = uniqueName;

        let webpBlob: Blob | null = null;
        
        if (file.type.startsWith('image/') && file.type !== 'image/svg+xml' && file.type !== 'image/webp') {
           webpBlob = await new Promise<Blob | null>((resolve) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                  const img = new Image();
                  img.onload = () => {
                      const canvas = document.createElement('canvas');
                      canvas.width = img.width;
                      canvas.height = img.height;
                      const ctx = canvas.getContext('2d');
                      ctx?.drawImage(img, 0, 0);
                      canvas.toBlob((blob) => resolve(blob), 'image/webp', 0.85);
                  };
                  img.onerror = () => resolve(null);
                  img.src = e.target?.result as string;
              };
              reader.onerror = () => resolve(null);
              reader.readAsDataURL(file);
           });
        }

        const originalRef = ref(storage, `downloads/original_${Date.now()}_${finalName}.${extension}`);
        const uploadTask = await uploadBytesResumable(originalRef, file);
        const downloadUrlOriginal = await getDownloadURL(uploadTask.ref);
        const storagePathOrignal = uploadTask.ref.fullPath;
        
        let finalWebpUrl = downloadUrlOriginal;
        let webpStoragePath = storagePathOrignal;

        if (webpBlob) {
            const webpRef = ref(storage, `downloads/webp_${Date.now()}_${finalName}.webp`);
            const webpTask = await uploadBytesResumable(webpRef, webpBlob);
            finalWebpUrl = await getDownloadURL(webpTask.ref);
            webpStoragePath = webpTask.ref.fullPath;
        }

        await addDoc(collection(db, 'downloads'), {
           name: finalName,
           originalName: file.name,
           url: downloadUrlOriginal,
           webpUrl: finalWebpUrl,
           storagePath: storagePathOrignal,
           webpStoragePath: webpStoragePath !== storagePathOrignal ? webpStoragePath : null,
           size: file.size,
           type: file.type,
           alt: finalName,
           createdAt: serverTimestamp()
        });
      } catch (err: any) {
        alert(`上传失败 [${file.name}]：` + err.message);
      }
    }

    setUploading(false);
  };

  const handleDelete = async (file: any) => {
    if (!window.confirm(`确定要删除文件 "${file.name}" 吗？此操作不可恢复。`)) return;
    try {
      if (file.storagePath) {
         try { await deleteObject(ref(storage, file.storagePath)); } catch (e) { console.warn(e); }
      }
      if (file.webpStoragePath) {
         try { await deleteObject(ref(storage, file.webpStoragePath)); } catch (e) { console.warn(e); }
      }
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
             <h1 className="text-2xl font-bold text-gray-900">文件中心</h1>
             <p className="text-sm text-gray-500 mt-1">集中管理您的所有媒体文件，图片维持原图上传并自动提供 WebP 加速访问。</p>
         </div>
         
         <div>
            <input 
               type="file" 
               multiple
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
                  <div 
                    key={file.id} 
                    onDoubleClick={() => window.open(file.url, '_blank')}
                    className="group relative border border-gray-200 rounded-lg overflow-hidden bg-gray-50 hover:border-primary transition-colors focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 select-none"
                  >
                    {/* Thumbnail */}
                    <div className="w-full h-24 flex items-center justify-center bg-gray-100 border-b border-gray-100 overflow-hidden relative">
                       {file.type?.startsWith('image/') ? (
                         <img 
                           src={file.webpUrl || file.url} 
                           alt={file.alt || file.name} 
                           loading="lazy"
                           srcSet={`${file.webpUrl || file.url} 480w, ${file.webpUrl || file.url} 800w`}
                           sizes="(max-width: 600px) 480px, 800px"
                           className="w-full h-full object-cover" 
                         />
                       ) : (
                         <FileType className="w-10 h-10 text-gray-300" />
                       )}
                       
                       {/* Hover Actions */}
                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); copyToClipboard(file.url, file.id); }}
                            className="p-1.5 bg-white rounded-md text-gray-700 hover:text-primary transition-colors"
                            title="复制链接"
                          >
                            {copiedId === file.id ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); window.open(file.url, '_blank'); }}
                            className="p-1.5 bg-white rounded-md text-gray-700 hover:text-primary transition-colors"
                            title="新窗口打开"
                          >
                            <DownloadCloud className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(file); }}
                            className="p-1.5 bg-white rounded-md text-gray-700 hover:text-red-600 transition-colors"
                            title="永久删除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                    
                    {/* File Info */}
                    <div className="p-2 cursor-default">
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

      {showSlugModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
              <button onClick={() => setShowSlugModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
              <h3 className="text-xl font-bold text-gray-900 mb-2">文件重命名</h3>
              <p className="text-sm text-gray-500 mb-4">为优化搜索引擎排名和规范管理，您可以输入页面 Slug (关键词中划线分隔) 来自动按顺序重命名它们，例如："hvls-ceiling-fans"</p>
              
              <input 
                value={slugInput}
                onChange={e => setSlugInput(e.target.value)}
                placeholder="在此输入 Slug，留空则默认"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all mb-4 text-sm"
              />
              
              <div className="flex justify-end gap-3 mt-6">
                 <button onClick={() => setShowSlugModal(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">取消</button>
                 <button onClick={handleSlugSubmit} className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors shadow-sm">确定上传</button>
              </div>
            </div>
         </div>
      )}
    </div>
  );
}
