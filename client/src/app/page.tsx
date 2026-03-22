'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import api from '@/lib/api';
import ArticleCard from '@/components/news/ArticleCard';
import { ArticleSkeleton, FeaturedSkeleton } from '@/components/ui/Skeletons';
import { FiArrowRight, FiTrendingUp, FiStar, FiZap } from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';

export default function HomePage() {
  const { t } = useStore();
  const [featured, setFeatured] = useState<any[]>([]);
  const [latest, setLatest] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, latestRes] = await Promise.all([
          api.get('/articles?featured=true&limit=5'),
          api.get('/articles?limit=12'),
        ]);
        setFeatured(featuredRes.data.articles || []);
        setLatest(latestRes.data.articles || []);
        setTrending(latestRes.data.articles?.slice(0, 5).sort((a: any, b: any) => b.views - a.views) || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auto-rotate hero
  useEffect(() => {
    if (featured.length === 0) return;
    const interval = setInterval(() => {
      setHeroIndex((i) => (i + 1) % featured.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featured.length]);

  const hero = featured[heroIndex];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen max-h-[700px] overflow-hidden">
        {loading || !hero ? (
          <div className="h-full skeleton" />
        ) : (
          <>
            <div className="absolute inset-0 transition-all duration-1000">
              <img src={hero.image} alt={hero.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
            </div>

            <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-center pt-16">
              <div className="max-w-2xl animate-slide-up">
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex items-center gap-1 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                    <FaFire size={10} /> FEATURED
                  </span>
                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                    hero.category === 'anime' ? 'badge-anime' : hero.category === 'manga' ? 'badge-manga' : hero.category === 'jeux' ? 'badge-jeux' : 'badge-culture'
                  }`}>
                    {t('categories', hero.category)}
                  </span>
                </div>

                <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
                  {hero.title}
                </h1>
                <p className="text-gray-300 text-lg mb-6 line-clamp-3">{hero.excerpt}</p>

                <div className="flex items-center gap-4">
                  <Link href={`/article/${hero.slug}`} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all orange-glow">
                    {t('home', 'read_more')} <FiArrowRight />
                  </Link>
                  <span className="text-gray-400 text-sm">{hero.views?.toLocaleString()} {t('home', 'views')}</span>
                </div>
              </div>

              {/* Hero dots */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {featured.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setHeroIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${i === heroIndex ? 'w-8 bg-orange-500' : 'w-2 bg-gray-600'}`}
                  />
                ))}
              </div>

              {/* Hero thumbnails */}
              <div className="absolute right-4 bottom-16 hidden xl:flex flex-col gap-2">
                {featured.slice(0, 4).map((a, i) => (
                  <button
                    key={a._id}
                    onClick={() => setHeroIndex(i)}
                    className={`flex items-center gap-2 p-2 rounded-lg transition-all ${i === heroIndex ? 'bg-orange-500/20 border border-orange-500/50' : 'bg-black/40 hover:bg-black/60'}`}
                  >
                    <img src={a.image} alt="" className="w-10 h-8 rounded object-cover" />
                    <span className="text-xs text-white max-w-[120px] line-clamp-1">{a.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* Latest articles */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-orange-500 rounded-full" />
              <h2 className="font-display text-2xl font-bold text-white">{t('home', 'latest')}</h2>
            </div>
            <Link href="/search" className="flex items-center gap-1 text-orange-500 hover:text-orange-400 text-sm font-medium transition-colors">
              {t('home', 'see_all')} <FiArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {loading
              ? [...Array(8)].map((_, i) => <ArticleSkeleton key={i} />)
              : latest.map((article) => <ArticleCard key={article._id} article={article} />)
            }
          </div>
        </section>

        {/* Categories grid */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-orange-500 rounded-full" />
            <h2 className="font-display text-2xl font-bold text-white">Parcourir par catégorie</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { key: 'anime', color: 'from-red-900/80 to-red-600/20', emoji: '🎌', href: '/category/anime' },
              { key: 'manga', color: 'from-purple-900/80 to-purple-600/20', emoji: '📚', href: '/category/manga' },
              { key: 'jeux', color: 'from-green-900/80 to-green-600/20', emoji: '🎮', href: '/category/jeux' },
              { key: 'culture', color: 'from-orange-900/80 to-orange-600/20', emoji: '⛩️', href: '/category/culture' },
            ].map(({ key, color, emoji, href }) => (
              <Link key={key} href={href} className={`group relative rounded-xl overflow-hidden bg-gradient-to-br ${color} border border-[#2a2a2a] hover:border-orange-500/50 p-6 text-center card-hover`}>
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{emoji}</div>
                <h3 className="font-display text-lg font-bold text-white">{t('categories', key)}</h3>
                <p className="text-gray-400 text-xs mt-1">Voir les articles</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-orange-500 rounded-full" />
            <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
              <FiTrendingUp className="text-orange-500" /> {t('home', 'trending')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {loading
              ? [...Array(5)].map((_, i) => (
                  <div key={i} className="h-40 skeleton rounded-xl" />
                ))
              : trending.map((article, i) => (
                  <Link key={article._id} href={`/article/${article.slug}`} className="group relative rounded-xl overflow-hidden h-40 block card-hover">
                    <img src={article.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <span className="text-orange-500 font-display font-bold text-2xl opacity-50">#{i + 1}</span>
                      <p className="text-white text-xs font-medium line-clamp-2 leading-tight">{article.title}</p>
                    </div>
                  </Link>
                ))
            }
          </div>
        </section>
      </div>
    </div>
  );
}
