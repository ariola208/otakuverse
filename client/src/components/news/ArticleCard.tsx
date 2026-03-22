'use client';
import Link from 'next/link';
import Image from 'next/image';
import { FiHeart, FiEye, FiClock } from 'react-icons/fi';
import { useStore } from '@/store/useStore';
import { formatDistanceToNow } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: string;
  tags: string[];
  author: { username: string; avatar: string };
  views: number;
  likes: string[];
  createdAt: string;
  featured?: boolean;
}

interface Props { article: Article; variant?: 'default' | 'featured' | 'compact'; }

export default function ArticleCard({ article, variant = 'default' }: Props) {
  const { user, favorites, toggleFavorite, lang, t } = useStore();
  const isFav = favorites.includes(article._id);
  const locale = lang === 'fr' ? fr : enUS;

  const handleFav = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { toast.error('Connectez-vous pour ajouter aux favoris'); return; }
    try {
      await toggleFavorite(article._id);
      toast.success(isFav ? 'Retiré des favoris' : 'Ajouté aux favoris');
    } catch { toast.error('Erreur'); }
  };

  const categoryColors: Record<string, string> = {
    anime: 'badge-anime', manga: 'badge-manga', jeux: 'badge-jeux', culture: 'badge-culture',
  };

  if (variant === 'compact') {
    return (
      <Link href={`/article/${article.slug}`} className="flex gap-3 group">
        <div className="relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
          <Image src={article.image || '/placeholder.jpg'} alt={article.title} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
        </div>
        <div className="flex-1 min-w-0">
          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${categoryColors[article.category] || ''}`}>
            {t('categories', article.category)}
          </span>
          <h4 className="text-sm text-white font-medium mt-0.5 line-clamp-2 group-hover:text-orange-500 transition-colors">
            {article.title}
          </h4>
          <p className="text-xs text-gray-600 mt-0.5">
            {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true, locale })}
          </p>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link href={`/article/${article.slug}`} className="group relative block rounded-2xl overflow-hidden card-hover">
        <div className="relative h-96 w-full">
          <Image src={article.image || '/placeholder.jpg'} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 img-overlay" />
          {article.featured && (
            <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
              ⭐ FEATURED
            </div>
          )}
          <button onClick={handleFav} className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-orange-500/80 transition-all">
            <FiHeart className={`text-sm ${isFav ? 'fill-orange-500 text-orange-500' : 'text-white'}`} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${categoryColors[article.category] || ''}`}>
              {t('categories', article.category)}
            </span>
            <h2 className="text-white text-2xl font-display font-bold mt-2 mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors">
              {article.title}
            </h2>
            <p className="text-gray-300 text-sm line-clamp-2 mb-3">{article.excerpt}</p>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1"><FiEye /> {article.views.toLocaleString()} {t('home', 'views')}</span>
              <span className="flex items-center gap-1"><FiHeart /> {article.likes?.length || 0}</span>
              <span>{t('home', 'by')} <span className="text-orange-500">{article.author?.username}</span></span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="group bg-[#1a1a1a] rounded-xl overflow-hidden border border-[#2a2a2a] hover:border-orange-500/30 card-hover">
      <Link href={`/article/${article.slug}`}>
        <div className="relative h-48 overflow-hidden">
          <Image
            src={article.image || '/placeholder.jpg'}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent opacity-60" />
          <span className={`absolute top-3 left-3 text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[article.category] || ''}`}>
            {t('categories', article.category)}
          </span>
          <button onClick={handleFav} className="absolute top-3 right-3 p-1.5 bg-black/50 backdrop-blur-sm rounded-full hover:bg-orange-500/80 transition-all">
            <FiHeart className={`text-xs ${isFav ? 'fill-orange-500 text-orange-500' : 'text-white'}`} />
          </button>
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/article/${article.slug}`}>
          <h3 className="text-white font-semibold text-sm leading-tight mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors font-display">
            {article.title}
          </h3>
        </Link>
        <p className="text-gray-500 text-xs line-clamp-2 mb-3">{article.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-1">
            {article.author?.avatar ? (
              <img src={article.author.avatar} alt="" className="w-4 h-4 rounded-full" />
            ) : (
              <div className="w-4 h-4 rounded-full bg-orange-500/20 flex items-center justify-center">
                <span className="text-orange-500 text-[8px]">{article.author?.username?.[0]}</span>
              </div>
            )}
            <span className="text-gray-500">{article.author?.username}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-0.5"><FiEye size={10} /> {article.views}</span>
            <span>{formatDistanceToNow(new Date(article.createdAt), { addSuffix: true, locale })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
