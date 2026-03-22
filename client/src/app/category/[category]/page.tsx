'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { useStore } from '@/store/useStore';
import ArticleCard from '@/components/news/ArticleCard';
import { ArticleSkeleton } from '@/components/ui/Skeletons';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const categoryEmojis: Record<string, string> = { anime: '🎌', manga: '📚', jeux: '🎮', culture: '⛩️' };
const categoryGradients: Record<string, string> = {
  anime: 'from-red-900/40', manga: 'from-purple-900/40', jeux: 'from-green-900/40', culture: 'from-orange-900/40',
};

export default function CategoryPage() {
  const { category } = useParams();
  const { t } = useStore();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 12;

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/articles?category=${category}&page=${page}&limit=${LIMIT}`);
        setArticles(data.articles);
        setTotalPages(data.pages);
        setTotal(data.total);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchArticles();
  }, [category, page]);

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <div className={`bg-gradient-to-b ${categoryGradients[category as string] || 'from-gray-900/40'} to-transparent py-16`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-6xl mb-4">{categoryEmojis[category as string] || '📰'}</div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-2">
            {t('categories', category as string)}
          </h1>
          <p className="text-gray-400">{total} articles disponibles</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {loading
            ? [...Array(12)].map((_, i) => <ArticleSkeleton key={i} />)
            : articles.map((article) => <ArticleCard key={article._id} article={article} />)
          }
        </div>

        {!loading && articles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Aucun article dans cette catégorie</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-gray-400 hover:text-white disabled:opacity-40 transition-colors"
            >
              <FiChevronLeft />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                  page === i + 1 ? 'bg-orange-500 text-white' : 'bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 hover:text-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-gray-400 hover:text-white disabled:opacity-40 transition-colors"
            >
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
