'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useStore } from '@/store/useStore';
import ArticleCard from '@/components/news/ArticleCard';
import { ArticleSkeleton } from '@/components/ui/Skeletons';
import { FiSearch, FiX } from 'react-icons/fi';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useStore();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [inputValue, setInputValue] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState('');
  const [articles, setArticles] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchResults = useCallback(async (q: string, cat: string) => {
    if (!q.trim()) { setArticles([]); setTotal(0); return; }
    setLoading(true);
    try {
      const { data } = await api.get(`/search?q=${encodeURIComponent(q)}&category=${cat}`);
      setArticles(data.articles);
      setTotal(data.total);
    } catch { } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchResults(query, category);
  }, [query, category]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(inputValue);
    router.push(`/search?q=${encodeURIComponent(inputValue)}`);
  };

  const categories = ['', 'anime', 'manga', 'jeux', 'culture'];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="font-display text-3xl font-bold text-white mb-8">{t('search', 'title')}</h1>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t('search', 'placeholder')}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white placeholder-gray-600 rounded-xl pl-11 pr-4 py-3 text-sm"
            />
            {inputValue && (
              <button type="button" onClick={() => { setInputValue(''); setQuery(''); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                <FiX size={16} />
              </button>
            )}
          </div>
          <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl font-medium text-sm transition-colors">
            Rechercher
          </button>
        </form>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === cat ? 'bg-orange-500 text-white' : 'bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 hover:text-white'
              }`}
            >
              {cat ? t('categories', cat) : t('search', 'all')}
            </button>
          ))}
        </div>

        {/* Results */}
        {query && (
          <p className="text-gray-500 text-sm mb-6">
            {loading ? t('common', 'loading') : `${total} ${t('search', 'results')} pour "${query}"`}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {loading
            ? [...Array(8)].map((_, i) => <ArticleSkeleton key={i} />)
            : articles.map((article) => <ArticleCard key={article._id} article={article} />)
          }
        </div>

        {!loading && query && articles.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg">{t('search', 'no_results')}</p>
            <p className="text-gray-600 text-sm mt-2">Essayez avec d'autres mots-clés</p>
          </div>
        )}

        {!query && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg">Commencez votre recherche</p>
          </div>
        )}
      </div>
    </div>
  );
}
