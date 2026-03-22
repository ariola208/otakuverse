'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, t } = useStore();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Les mots de passe ne correspondent pas'); return; }
    if (form.password.length < 6) { toast.error('Mot de passe trop court (min 6 caractères)'); return; }
    try {
      await register(form.username, form.email, form.password);
      toast.success('Compte créé avec succès !');
      router.push('/');
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'inscription');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-[#0a0a0a]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <FaFire className="text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-white">OTAKU<span className="text-orange-500">NEWS</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-white">{t('auth', 'register_title')}</h1>
          <p className="text-gray-500 text-sm mt-1">Rejoignez la communauté otaku !</p>
        </div>

        <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">{t('auth', 'username')}</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input name="username" type="text" value={form.username} onChange={handleChange} placeholder="NarutoFan99" required minLength={3}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white placeholder-gray-600 rounded-xl pl-10 pr-4 py-2.5 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">{t('auth', 'email')}</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="votre@email.com" required
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white placeholder-gray-600 rounded-xl pl-10 pr-4 py-2.5 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">{t('auth', 'password')}</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input name="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="••••••••" required
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white placeholder-gray-600 rounded-xl pl-10 pr-10 py-2.5 text-sm" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">{t('auth', 'confirm_password')}</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input name="confirm" type={showPw ? 'text' : 'password'} value={form.confirm} onChange={handleChange} placeholder="••••••••" required
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white placeholder-gray-600 rounded-xl pl-10 pr-4 py-2.5 text-sm" />
              </div>
            </div>
            <button type="submit" disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors mt-2 orange-glow">
              {isLoading ? 'Création...' : t('auth', 'register_btn')}
            </button>
          </form>
          <p className="text-center text-gray-500 text-sm mt-6">
            {t('auth', 'have_account')}{' '}
            <Link href="/auth/login" className="text-orange-500 hover:text-orange-400 font-medium">{t('auth', 'login_btn')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
