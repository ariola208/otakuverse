'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import api from '@/lib/api';
import { FiHome, FiFileText, FiUsers, FiBarChart2, FiPlus, FiEdit2, FiTrash2, FiEye, FiX, FiSave, FiShield } from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';
import toast from 'react-hot-toast';

type Tab = 'stats' | 'articles' | 'users' | 'new';

export default function AdminPage() {
  const { user, t } = useStore();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('stats');
  const [stats, setStats] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [articleForm, setArticleForm] = useState({
    title: '', excerpt: '', content: '', image: '', category: 'anime', tags: '', featured: false, status: 'published'
  });

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    if (user.role !== 'admin') { router.push('/'); toast.error('Accès refusé'); return; }
    fetchAll();
  }, [user]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, articlesRes, usersRes] = await Promise.all([
        api.get('/users/stats'),
        api.get('/articles?limit=50&status='),
        api.get('/users'),
      ]);
      setStats(statsRes.data);
      setArticles(articlesRes.data.articles || []);
      setUsers(usersRes.data.users || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleSaveArticle = async () => {
    try {
      const payload = { ...articleForm, tags: articleForm.tags.split(',').map((t: string) => t.trim()).filter(Boolean) };
      if (editingArticle) {
        await api.put(`/articles/${editingArticle._id}`, payload);
        toast.success('Article modifié !');
      } else {
        await api.post('/articles', payload);
        toast.success('Article créé !');
      }
      setTab('articles');
      setEditingArticle(null);
      resetForm();
      fetchAll();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur');
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Supprimer cet article ?')) return;
    try {
      await api.delete(`/articles/${id}`);
      setArticles(articles.filter(a => a._id !== id));
      toast.success('Article supprimé');
    } catch { toast.error('Erreur'); }
  };

  const handleEditArticle = (article: any) => {
    setEditingArticle(article);
    setArticleForm({
      title: article.title, excerpt: article.excerpt, content: article.content,
      image: article.image, category: article.category,
      tags: article.tags?.join(', ') || '', featured: article.featured, status: article.status,
    });
    setTab('new');
  };

  const handleChangeRole = async (userId: string, role: string) => {
    try {
      await api.put(`/users/${userId}/role`, { role });
      setUsers(users.map(u => u._id === userId ? { ...u, role } : u));
      toast.success('Rôle mis à jour');
    } catch { toast.error('Erreur'); }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    try {
      await api.delete(`/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
      toast.success('Utilisateur supprimé');
    } catch { toast.error('Erreur'); }
  };

  const resetForm = () => setArticleForm({ title: '', excerpt: '', content: '', image: '', category: 'anime', tags: '', featured: false, status: 'published' });

  if (!user || user.role !== 'admin') return null;

  const tabs = [
    { id: 'stats', label: t('admin', 'stats'), icon: FiBarChart2 },
    { id: 'articles', label: t('admin', 'articles'), icon: FiFileText },
    { id: 'users', label: t('admin', 'users'), icon: FiUsers },
    { id: 'new', label: editingArticle ? t('admin', 'edit') : t('admin', 'new_article'), icon: FiPlus },
  ];

  return (
    <div className="min-h-screen pt-16 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <FiShield className="text-white" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-white">{t('admin', 'dashboard')}</h1>
              <p className="text-gray-500 text-sm">Bienvenue, {user.username}</p>
            </div>
          </div>
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <FiHome size={14} /> Voir le site
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setTab(id as Tab); if (id !== 'new') { setEditingArticle(null); resetForm(); } }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                tab === id ? 'bg-orange-500 text-white' : 'bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 hover:text-white'
              }`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* Stats Tab */}
        {tab === 'stats' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: t('admin', 'total_articles'), value: stats?.stats?.articles, icon: FiFileText, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { label: t('admin', 'total_users'), value: stats?.stats?.users, icon: FiUsers, color: 'text-green-400', bg: 'bg-green-500/10' },
                { label: t('admin', 'total_comments'), value: stats?.stats?.comments, icon: FiBarChart2, color: 'text-purple-400', bg: 'bg-purple-500/10' },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400 text-sm">{label}</span>
                    <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                      <Icon className={color} size={18} />
                    </div>
                  </div>
                  <p className={`font-display text-4xl font-bold ${color}`}>{value ?? '—'}</p>
                </div>
              ))}
            </div>

            {/* Top articles */}
            <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6">
              <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FaFire className="text-orange-500" /> {t('admin', 'top_articles')}
              </h3>
              <div className="space-y-3">
                {stats?.topArticles?.map((a: any, i: number) => (
                  <div key={a._id} className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-xl">
                    <span className="font-display text-2xl font-bold text-orange-500/40 w-8 text-center">#{i+1}</span>
                    {a.image && <img src={a.image} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium line-clamp-1">{a.title}</p>
                      <p className="text-gray-500 text-xs">{a.views?.toLocaleString()} vues</p>
                    </div>
                    <Link href={`/article/${a.slug}`} className="text-orange-500 hover:text-orange-400">
                      <FiEye size={14} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Articles Tab */}
        {tab === 'articles' && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold text-white">{articles.length} articles</h2>
              <button onClick={() => { setTab('new'); setEditingArticle(null); resetForm(); }}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                <FiPlus size={14} /> {t('admin', 'new_article')}
              </button>
            </div>

            <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#2a2a2a]">
                      {['Image', 'Titre', 'Catégorie', 'Statut', 'Vues', 'Actions'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map((a) => (
                      <tr key={a._id} className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors">
                        <td className="px-4 py-3">
                          <img src={a.image} alt="" className="w-12 h-9 rounded-lg object-cover" />
                        </td>
                        <td className="px-4 py-3 max-w-xs">
                          <p className="text-white text-sm font-medium line-clamp-1">{a.title}</p>
                          <p className="text-gray-600 text-xs">{a.author?.username}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            a.category === 'anime' ? 'badge-anime' : a.category === 'manga' ? 'badge-manga' : a.category === 'jeux' ? 'badge-jeux' : 'badge-culture'
                          }`}>{a.category}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${a.status === 'published' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                            {a.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-sm">{a.views?.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Link href={`/article/${a.slug}`} className="p-1.5 bg-[#2a2a2a] hover:bg-blue-500/20 hover:text-blue-400 text-gray-400 rounded-lg transition-colors">
                              <FiEye size={13} />
                            </Link>
                            <button onClick={() => handleEditArticle(a)} className="p-1.5 bg-[#2a2a2a] hover:bg-orange-500/20 hover:text-orange-400 text-gray-400 rounded-lg transition-colors">
                              <FiEdit2 size={13} />
                            </button>
                            <button onClick={() => handleDeleteArticle(a._id)} className="p-1.5 bg-[#2a2a2a] hover:bg-red-500/20 hover:text-red-400 text-gray-400 rounded-lg transition-colors">
                              <FiTrash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div className="animate-fade-in">
            <h2 className="font-display text-xl font-bold text-white mb-4">{users.length} utilisateurs</h2>
            <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#2a2a2a]">
                      {['Avatar', 'Utilisateur', 'Email', 'Rôle', 'Actions'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors">
                        <td className="px-4 py-3">
                          {u.avatar ? <img src={u.avatar} alt="" className="w-8 h-8 rounded-full" /> : (
                            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                              <span className="text-orange-500 text-xs font-bold">{u.username?.[0]}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-white text-sm font-medium">{u.username}</td>
                        <td className="px-4 py-3 text-gray-400 text-sm">{u.email}</td>
                        <td className="px-4 py-3">
                          <select
                            value={u.role}
                            onChange={(e) => handleChangeRole(u._id, e.target.value)}
                            className="bg-[#2a2a2a] border border-[#3a3a3a] text-white text-xs rounded-lg px-2 py-1"
                          >
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleDeleteUser(u._id)} className="p-1.5 bg-[#2a2a2a] hover:bg-red-500/20 hover:text-red-400 text-gray-400 rounded-lg transition-colors">
                            <FiTrash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* New/Edit Article Tab */}
        {tab === 'new' && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="font-display text-xl font-bold text-white">
                {editingArticle ? `Modifier: ${editingArticle.title.slice(0, 40)}...` : t('admin', 'new_article')}
              </h2>
              {editingArticle && (
                <button onClick={() => { setEditingArticle(null); resetForm(); setTab('articles'); }}
                  className="p-1 text-gray-500 hover:text-white">
                  <FiX size={16} />
                </button>
              )}
            </div>

            <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-1.5">{t('admin', 'title')} *</label>
                  <input value={articleForm.title} onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white rounded-xl px-4 py-2.5 text-sm"
                    placeholder="Titre de l'article" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-1.5">Résumé *</label>
                  <textarea value={articleForm.excerpt} onChange={(e) => setArticleForm({ ...articleForm, excerpt: e.target.value })} rows={3}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white rounded-xl px-4 py-2.5 text-sm resize-none"
                    placeholder="Résumé de l'article (max 500 caractères)" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-1.5">{t('admin', 'content')} * (HTML supporté)</label>
                  <textarea value={articleForm.content} onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })} rows={12}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white rounded-xl px-4 py-2.5 text-sm resize-none font-mono text-xs"
                    placeholder="<h2>Titre</h2><p>Contenu de l'article...</p>" />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">{t('admin', 'image')}</label>
                  <input value={articleForm.image} onChange={(e) => setArticleForm({ ...articleForm, image: e.target.value })}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white rounded-xl px-4 py-2.5 text-sm"
                    placeholder="https://images.unsplash.com/..." />
                  {articleForm.image && <img src={articleForm.image} alt="" className="mt-2 w-full h-32 object-cover rounded-xl" onError={(e) => (e.currentTarget.style.display = 'none')} />}
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">{t('admin', 'category')} *</label>
                  <select value={articleForm.category} onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white rounded-xl px-4 py-2.5 text-sm">
                    <option value="anime">Anime</option>
                    <option value="manga">Manga</option>
                    <option value="jeux">Jeux vidéo</option>
                    <option value="culture">Culture japonaise</option>
                  </select>

                  <label className="block text-sm text-gray-400 mb-1.5 mt-3">{t('admin', 'status')}</label>
                  <select value={articleForm.status} onChange={(e) => setArticleForm({ ...articleForm, status: e.target.value })}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white rounded-xl px-4 py-2.5 text-sm">
                    <option value="published">{t('admin', 'published')}</option>
                    <option value="draft">{t('admin', 'draft')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">{t('admin', 'tags')} (séparés par virgule)</label>
                  <input value={articleForm.tags} onChange={(e) => setArticleForm({ ...articleForm, tags: e.target.value })}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white rounded-xl px-4 py-2.5 text-sm"
                    placeholder="naruto, anime, action" />
                </div>

                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={articleForm.featured} onChange={(e) => setArticleForm({ ...articleForm, featured: e.target.checked })} className="sr-only peer" />
                    <div className="w-10 h-5 bg-[#3a3a3a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                  <span className="text-sm text-gray-400">{t('admin', 'featured')}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2 border-t border-[#2a2a2a]">
                <button onClick={handleSaveArticle}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-colors">
                  <FiSave size={14} /> {editingArticle ? 'Mettre à jour' : 'Publier'}
                </button>
                <button onClick={() => { setTab('articles'); setEditingArticle(null); resetForm(); }}
                  className="bg-[#2a2a2a] text-gray-400 hover:text-white px-6 py-2.5 rounded-xl text-sm transition-colors">
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
