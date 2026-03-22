'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import api from '@/lib/api';
import { FiUser, FiMail, FiEdit2, FiSave, FiX, FiLock, FiCalendar, FiShield } from 'react-icons/fi';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateProfile, logout, t } = useStore();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [form, setForm] = useState({ username: user?.username || '', bio: user?.bio || '', avatar: user?.avatar || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Accès restreint</h2>
          <p className="text-gray-400 mb-4">Connectez-vous pour voir votre profil</p>
          <Link href="/auth/login" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl font-medium transition-colors">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile(form);
      setEditing(false);
      toast.success('Profil mis à jour !');
    } catch { toast.error('Erreur lors de la mise à jour'); }
    setSaving(false);
  };

  const handleChangePw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) { toast.error('Les mots de passe ne correspondent pas'); return; }
    if (pwForm.newPassword.length < 6) { toast.error('Mot de passe trop court'); return; }
    try {
      await api.put('/auth/password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Mot de passe modifié !');
      setChangingPw(false);
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    toast.success('Déconnecté');
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-orange-500 rounded-full" />
          <h1 className="font-display text-3xl font-bold text-white">{t('profile', 'title')}</h1>
        </div>

        {/* Profile card */}
        <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl overflow-hidden mb-6">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-orange-900/40 via-orange-700/20 to-transparent" />

          <div className="px-6 pb-6">
            <div className="flex items-end gap-4 -mt-12 mb-4">
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-20 h-20 rounded-full border-4 border-[#111] object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-full border-4 border-[#111] bg-orange-500/20 flex items-center justify-center">
                  <span className="text-orange-500 font-bold text-3xl">{user.username[0].toUpperCase()}</span>
                </div>
              )}
              <div className="flex-1 pb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">{user.username}</h2>
                  {user.role === 'admin' && (
                    <span className="flex items-center gap-1 text-xs bg-orange-500/20 text-orange-500 border border-orange-500/30 px-2 py-0.5 rounded-full">
                      <FiShield size={10} /> Admin
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-sm">{user.email}</p>
              </div>
              {!editing && (
                <button onClick={() => setEditing(true)} className="flex items-center gap-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-gray-300 px-4 py-2 rounded-xl text-sm transition-colors">
                  <FiEdit2 size={14} /> {t('profile', 'edit')}
                </button>
              )}
            </div>

            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Nom d'utilisateur</label>
                  <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white rounded-xl px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">{t('profile', 'bio')}</label>
                  <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white rounded-xl px-4 py-2.5 text-sm resize-none"
                    placeholder="Parlez de vous..." />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">URL Avatar</label>
                  <input value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white rounded-xl px-4 py-2.5 text-sm"
                    placeholder="https://..." />
                </div>
                <div className="flex gap-3">
                  <button onClick={handleSaveProfile} disabled={saving}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors">
                    <FiSave size={14} /> {saving ? 'Sauvegarde...' : t('profile', 'save')}
                  </button>
                  <button onClick={() => setEditing(false)}
                    className="flex items-center gap-2 bg-[#2a2a2a] text-gray-400 px-5 py-2 rounded-xl text-sm transition-colors">
                    <FiX size={14} /> {t('profile', 'cancel')}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {user.bio && <p className="text-gray-400 text-sm mb-3">{user.bio}</p>}
                <p className="text-gray-600 text-xs flex items-center gap-1">
                  <FiCalendar size={12} /> {t('profile', 'member_since')} {format(new Date((user as any).createdAt || Date.now()), 'MMMM yyyy', { locale: fr })}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Change password */}
        <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <FiLock className="text-orange-500" /> {t('profile', 'change_password')}
            </h3>
            {!changingPw && (
              <button onClick={() => setChangingPw(true)} className="text-sm text-orange-500 hover:text-orange-400">
                Modifier
              </button>
            )}
          </div>

          {changingPw ? (
            <form onSubmit={handleChangePw} className="space-y-3">
              <input type="password" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                placeholder={t('profile', 'current_password')} required
                className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white rounded-xl px-4 py-2.5 text-sm placeholder-gray-600" />
              <input type="password" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                placeholder={t('profile', 'new_password')} required
                className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white rounded-xl px-4 py-2.5 text-sm placeholder-gray-600" />
              <input type="password" value={pwForm.confirm} onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                placeholder="Confirmer le nouveau mot de passe" required
                className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white rounded-xl px-4 py-2.5 text-sm placeholder-gray-600" />
              <div className="flex gap-3">
                <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors">
                  Modifier
                </button>
                <button type="button" onClick={() => setChangingPw(false)} className="bg-[#2a2a2a] text-gray-400 px-5 py-2 rounded-xl text-sm transition-colors">
                  Annuler
                </button>
              </div>
            </form>
          ) : (
            <p className="text-gray-600 text-sm">••••••••••••</p>
          )}
        </div>

        {/* Actions */}
        <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6">
          <h3 className="font-display text-lg font-bold text-white mb-4">Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/favorites" className="flex items-center gap-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-gray-300 px-4 py-2 rounded-xl text-sm transition-colors">
              Mes Favoris
            </Link>
            {user.role === 'admin' && (
              <Link href="/admin" className="flex items-center gap-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/30 px-4 py-2 rounded-xl text-sm transition-colors">
                <FiShield size={14} /> Panneau Admin
              </Link>
            )}
            <button onClick={handleLogout} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 px-4 py-2 rounded-xl text-sm transition-colors">
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
