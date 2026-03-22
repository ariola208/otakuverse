'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, t } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Connexion réussie !');
      router.push('/');
    } catch (err: any) {
      toast.error(err.message || 'Erreur de connexion');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-[#0a0a0a]">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <FaFire className="text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-white">OTAKU<span className="text-orange-500">NEWS</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-white">{t('auth', 'login_title')}</h1>
          <p className="text-gray-500 text-sm mt-1">Bon retour parmi nous !</p>
        </div>

        <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-8 shadow-2xl">
          {/* Demo credentials */}
          <div className="mb-6 p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
            <p className="text-orange-500 text-xs font-medium mb-1">🔑 Comptes de démonstration :</p>
            <p className="text-gray-400 text-xs">Admin: admin@otakunews.com / admin123</p>
            <p className="text-gray-400 text-xs">User: user@otakunews.com / user123</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">{t('auth', 'email')}</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white placeholder-gray-600 rounded-xl pl-10 pr-4 py-2.5 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">{t('auth', 'password')}</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white placeholder-gray-600 rounded-xl pl-10 pr-10 py-2.5 text-sm"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors orange-glow"
            >
              {isLoading ? 'Connexion...' : t('auth', 'login_btn')}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            {t('auth', 'no_account')}{' '}
            <Link href="/auth/register" className="text-orange-500 hover:text-orange-400 font-medium">
              {t('auth', 'register_btn')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
