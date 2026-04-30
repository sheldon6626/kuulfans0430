import { useState, useEffect } from 'react';
import { db, storage, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, addDoc, serverTimestamp, getDocs, where } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { Loader2, DownloadCloud, UploadCloud, File, Trash2, Copy, Check, FileType, CheckCircle2 } from 'lucide-react';

export default function Downloads() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Auto fill name without extension
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      setFileName(nameWithoutExt);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !fileName) return;

    setUploading(true);
    setProgress(0);

    try {
      // 1. Determine unique name
      let finalName = fileName;
      let counter = 1;
      while (true) {
        const checkQ = query(collection(db, 'downloads'), where('name', '==', finalName));
        const snap = await getDocs(checkQ);
        if (snap.empty) break;
        finalName = `${fileName}-${String(counter).padStart(4, '0')}`;
        counter++;
      }

      // 2. Upload to Storage
      const storageRef = ref(storage, `downloads/${finalName}_${Date.now()}`);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(p);
        },
        (error) => {
          console.error('Upload Error:', error);
          alert('上传失败：' + error.message);
          setUploading(false);
        },
        async () => {
          // 3. Get URL and Save to Firestore
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          
          await addDoc(collection(db, 'downloads'), {
            name: finalName,
            originalName: fileName,
            url: downloadUrl,
            storagePath: uploadTask.snapshot.ref.fullPath,
            size: selectedFile.size,
            type: selectedFile.type,
            createdAt: serverTimestamp()
          });

          setSelectedFile(null);
          setFileName('');
          setUploading(false);
          setProgress(0);
        }
      );
    } catch (err: any) {
      alert('上传发生错误：' + err.message);
      setUploading(false);
    }
  };

  const handleDelete = async (file: any) => {
    if (!window.confirm(`确定要删除文件 "${file.name}" 吗？此操作不可恢复。`)) return;
    try {
      if (file.storagePath) {
        const fileRef = ref(storage, file.storagePath);
        await deleteObject(fileRef).catch(e => console.warn('Storage deletion failed', e));
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
    <div className="max-w-6xl space-y-6">
      <div className="border-b border-gray-200 pb-6 mb-2">
         <h1 className="text-2xl font-bold text-gray-900">下载中心</h1>
         <p className="text-sm text-gray-500 mt-1">集中管理网站所有的文件（图片、视频、PDF、文档等）。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-6 sticky top-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-primary" />
              上传新文件
            </h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">选择文件</label>
                <input 
                  type="file" 
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">文件显示名称</label>
                <input 
                  required
                  value={fileName}
                  onChange={e => setFileName(e.target.value)}
                  placeholder="请输入文件名称"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none text-sm" 
                />
                <p className="text-xs text-gray-400 mt-1">如果名称重复，将自动添加 -0001 后缀。</p>
              </div>

              {uploading && (
                 <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4 overflow-hidden">
                   <div className="bg-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                 </div>
              )}

              <button 
                type="submit" 
                disabled={uploading || !selectedFile || !fileName}
                className="w-full bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-sm"
              >
                {uploading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> 上传中 {Math.round(progress)}%</>
                ) : (
                  <><UploadCloud className="w-4 h-4" /> 开始上传</>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Files List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
               <h2 className="font-semibold text-gray-900">全部文件 ({files.length})</h2>
            </div>
            
            {files.length === 0 ? (
              <div className="p-16 text-center">
                <File className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <div className="text-gray-500 font-medium">暂无文件记录</div>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {files.map(file => (
                  <div key={file.id} className="p-4 hover:bg-blue-50/20 transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-4 overflow-hidden">
                       <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-primary flex-shrink-0">
                          {file.type?.startsWith('image/') ? (
                            <img src={file.url} alt="" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <FileType className="w-5 h-5" />
                          )}
                       </div>
                       <div className="min-w-0">
                          <p className="font-medium text-sm text-gray-900 truncate pr-4" title={file.name}>{file.name}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                             <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                             <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                             <span>{file.createdAt?.toDate().toLocaleDateString()}</span>
                          </div>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-2 pl-2">
                       <button 
                         onClick={() => copyToClipboard(file.url, file.id)}
                         className="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors border border-transparent shadow-sm hover:border-blue-100"
                         title="复制文件链接"
                       >
                         {copiedId === file.id ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                       </button>
                       <button 
                         onClick={() => window.open(file.url, '_blank')}
                         className="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors border border-transparent shadow-sm hover:border-blue-100"
                         title="在新标签页打开"
                       >
                         <DownloadCloud className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={() => handleDelete(file)}
                         className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent shadow-sm hover:border-red-100"
                         title="删除文件"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
