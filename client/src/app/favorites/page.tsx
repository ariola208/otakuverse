'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import api from '@/lib/api';
import ArticleCard from '@/components/news/ArticleCard';
import { ArticleSkeleton } from '@/components/ui/Skeletons';
import { FiHeart } from 'react-icons/fi';

export default function FavoritesPage() {
  const { user, t } = useStore();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) { setLoading(false); return; }
      try {
        const { data } = await api.get('/auth/me');
        setArticles(data.user?.favorites || []);
      } catch { } finally { setLoading(false); }
    };
    fetchFavorites();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <FiHeart className="mx-auto text-orange-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-white mb-2">Accès restreint</h2>
          <p className="text-gray-400 mb-4">Connectez-vous pour voir vos favoris</p>
          <Link href="/auth/login" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl font-medium transition-colors">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-orange-500 rounded-full" />
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-2">
            <FiHeart className="text-orange-500" /> {t('favorites', 'title')}
          </h1>
          {!loading && <span className="text-gray-500 text-sm">({articles.length} articles)</span>}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => <ArticleSkeleton key={i} />)}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-24">
            <FiHeart className="mx-auto text-gray-700 mb-4" size={56} />
            <p className="text-gray-400 text-lg mb-4">{t('favorites', 'empty')}</p>
            <Link href="/" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
              {t('favorites', 'go_home')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {articles.map((article: any) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
