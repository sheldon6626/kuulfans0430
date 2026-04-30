import { useState } from 'react';
import { auth, db } from '../../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Fan, ShieldCheck, Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';

export default function Login() {
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/admin');
    } catch (err: any) {
      if (err.code === 'auth/unauthorized-domain') {
         setError('当前域名未授权！请前往 Firebase 控制台 -> Authentication -> Settings -> Authorized domains 添加此域名。');
      } else {
         setError(err.message);
      }
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    try {
      if (mode === 'login') {
         await signInWithEmailAndPassword(auth, email, password);
      } else {
         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
         await setDoc(doc(db, 'users', userCredential.user.uid), {
             email: email,
             role: 'admin',
             createdAt: new Date()
         });
      }
      navigate('/admin');
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('未在 Firebase Console 中开启 邮箱/密码 登录支持。请先前往提供方设置开启。');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('邮箱或密码不正确！');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('该邮箱已被注册，请直接登录。');
      } else {
        setError(err.message);
      }
    }
  };

  const setupDefaultUser = () => {
    setEmail('kuulfans@kuulfans.com');
    setPassword('password123');
    setMode('register');
    setError('已填入默认用户"kuulfans"的账号信息。请前往 Firebase Console 确认已开启【邮箱密码】登录提供商后，点击下方注册。');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f7f6] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>

      <div className="max-w-md w-full space-y-6 bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative z-10 flex flex-col items-center">
        <div className="text-center w-full">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center rounded-2xl mb-6 shadow-lg shadow-primary/20">
            <Fan className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">管理后台</h2>
          <p className="mt-2 text-sm text-gray-500 font-medium">登录以管理 Kuul Fans 数据</p>
        </div>
        
        {error && (
          <div className="bg-red-50/80 border border-red-100 text-red-600 p-4 rounded-xl text-sm w-full leading-relaxed flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="w-full space-y-4 pt-2">
           <div>
             <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Mail className="h-5 w-5 text-gray-400" />
               </div>
               <input 
                 type="email" 
                 required
                 value={email}
                 onChange={e => setEmail(e.target.value)}
                 className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                 placeholder="邮箱地址"
               />
             </div>
           </div>
           
           <div>
             <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Lock className="h-5 w-5 text-gray-400" />
               </div>
               <input 
                 type="password" 
                 required
                 value={password}
                 onChange={e => setPassword(e.target.value)}
                 className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                 placeholder="密码"
               />
             </div>
           </div>

           <button
             type="submit"
             className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-md shadow-primary/20 text-sm font-semibold text-white bg-primary hover:bg-primary/90 focus:outline-none transition-all hover:-translate-y-0.5"
           >
             {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
             {mode === 'login' ? '账号密码登录' : '注册新账号'}
           </button>
           
           <div className="flex justify-between items-center text-sm">
              <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-secondary hover:underline font-medium">
                {mode === 'login' ? '没有账号？去注册' : '已有账号？去登录'}
              </button>
              <button type="button" onClick={setupDefaultUser} className="text-gray-400 hover:text-gray-600 underline">
                点我生成 "kuulfans"
              </button>
           </div>
        </form>

        <div className="w-full py-2 flex items-center justify-between">
           <span className="w-1/5 border-b border-gray-200"></span>
           <span className="text-xs text-gray-400 uppercase font-medium">第三方登录</span>
           <span className="w-1/5 border-b border-gray-200"></span>
        </div>

        <div className="w-full">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex justify-center items-center gap-3 py-3 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-all hover:-translate-y-0.5 shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
            使用 Google 账号安全登录
          </button>
        </div>
      </div>
    </div>
  );
}
