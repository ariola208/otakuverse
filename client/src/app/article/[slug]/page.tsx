'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { useStore } from '@/store/useStore';
import ArticleCard from '@/components/news/ArticleCard';
import { ArticlePageSkeleton } from '@/components/ui/Skeletons';
import { FiHeart, FiThumbsUp, FiThumbsDown, FiShare2, FiEye, FiMessageCircle, FiTrash2, FiBookmark } from 'react-icons/fi';
import { formatDistanceToNow, format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import toast from 'react-hot-toast';

export default function ArticlePage() {
  const { slug } = useParams();
  const { user, favorites, toggleFavorite, lang, t } = useStore();
  const [article, setArticle] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const locale = lang === 'fr' ? fr : enUS;
  const isFav = article && favorites.includes(article._id);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const [articleRes, commentsRes] = await Promise.all([
          api.get(`/articles/${slug}`),
          api.get(`/comments/${slug}`).catch(() => ({ data: { comments: [] } })),
        ]);
        const a = articleRes.data.article;
        setArticle(a);
        setRelated(articleRes.data.related || []);
        setLikes(a.likes?.length || 0);
        setDislikes(a.dislikes?.length || 0);
        setLiked(user ? a.likes?.includes(user._id) : false);
        setDisliked(user ? a.dislikes?.includes(user._id) : false);
        setComments(commentsRes.data.comments || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  const handleLike = async () => {
    if (!user) { toast.error('Connectez-vous'); return; }
    try {
      const { data } = await api.post(`/articles/${article._id}/like`);
      setLikes(data.likes); setDislikes(data.dislikes); setLiked(data.liked); setDisliked(false);
    } catch { toast.error('Erreur'); }
  };

  const handleDislike = async () => {
    if (!user) { toast.error('Connectez-vous'); return; }
    try {
      const { data } = await api.post(`/articles/${article._id}/dislike`);
      setLikes(data.likes); setDislikes(data.dislikes); setDisliked(data.disliked); setLiked(false);
    } catch { toast.error('Erreur'); }
  };

  const handleFav = async () => {
    if (!user) { toast.error('Connectez-vous'); return; }
    try {
      await toggleFavorite(article._id);
      toast.success(isFav ? 'Retiré des favoris' : 'Ajouté aux favoris');
    } catch { toast.error('Erreur'); }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Lien copié !');
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error('Connectez-vous'); return; }
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await api.post('/comments', { articleId: article._id, content: commentText });
      setComments([data.comment, ...comments]);
      setCommentText('');
      toast.success('Commentaire publié');
    } catch { toast.error('Erreur'); }
    setSubmitting(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
      toast.success('Commentaire supprimé');
    } catch { toast.error('Erreur'); }
  };

  if (loading) return (
    <div className="pt-16">
      <ArticlePageSkeleton />
    </div>
  );

  if (!article) return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Article introuvable</h2>
        <Link href="/" className="text-orange-500 hover:underline">Retour à l'accueil</Link>
      </div>
    </div>
  );

  const categoryColors: Record<string, string> = {
    anime: 'badge-anime', manga: 'badge-manga', jeux: 'badge-jeux', culture: 'badge-culture',
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero image */}
      <div className="relative h-72 md:h-[500px] overflow-hidden">
        <Image src={article.image || '/placeholder.jpg'} alt={article.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="bg-[#111] rounded-2xl border border-[#2a2a2a] overflow-hidden">
              <div className="p-6 md:p-8">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${categoryColors[article.category] || ''}`}>
                    {t('categories', article.category)}
                  </span>
                  {article.featured && (
                    <span className="bg-orange-500/20 text-orange-500 text-xs px-2 py-1 rounded-full border border-orange-500/30">⭐ Featured</span>
                  )}
                  <span className="text-gray-500 text-xs flex items-center gap-1">
                    <FiEye size={12} /> {article.views?.toLocaleString()} vues
                  </span>
                </div>

                <h1 className="font-display text-2xl md:text-4xl font-bold text-white leading-tight mb-4">
                  {article.title}
                </h1>

                {/* Author */}
                <div className="flex items-center gap-3 pb-6 border-b border-[#2a2a2a]">
                  {article.author?.avatar ? (
                    <img src={article.author.avatar} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-orange-500/30" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center border-2 border-orange-500/30">
                      <span className="text-orange-500 font-bold">{article.author?.username?.[0]}</span>
                    </div>
                  )}
                  <div>
                    <p className="text-white text-sm font-semibold">{article.author?.username}</p>
                    <p className="text-gray-500 text-xs">{format(new Date(article.createdAt), 'dd MMMM yyyy', { locale })}</p>
                  </div>
                </div>

                {/* Content */}
                <div
                  className="article-content py-6"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* Tags */}
                {article.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-[#2a2a2a]">
                    {article.tags.map((tag: string) => (
                      <Link key={tag} href={`/search?q=${tag}`} className="text-xs bg-[#2a2a2a] hover:bg-orange-500/20 hover:text-orange-500 text-gray-400 px-3 py-1 rounded-full transition-colors">
                        #{tag}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-[#2a2a2a] mt-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${liked ? 'bg-green-500/20 text-green-500 border border-green-500/30' : 'bg-[#2a2a2a] text-gray-400 hover:bg-green-500/20 hover:text-green-500 border border-transparent'}`}
                  >
                    <FiThumbsUp size={16} /> {likes}
                  </button>
                  <button
                    onClick={handleDislike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${disliked ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-[#2a2a2a] text-gray-400 hover:bg-red-500/20 hover:text-red-500 border border-transparent'}`}
                  >
                    <FiThumbsDown size={16} /> {dislikes}
                  </button>
                  <button
                    onClick={handleFav}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isFav ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30' : 'bg-[#2a2a2a] text-gray-400 hover:bg-orange-500/20 hover:text-orange-500 border border-transparent'}`}
                  >
                    <FiBookmark size={16} /> {isFav ? 'Sauvegardé' : 'Sauvegarder'}
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-gray-400 hover:text-white rounded-xl text-sm font-medium transition-all border border-transparent"
                  >
                    <FiShare2 size={16} /> Partager
                  </button>
                </div>
              </div>

              {/* Comments */}
              <div className="border-t border-[#2a2a2a] p-6 md:p-8">
                <h3 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <FiMessageCircle className="text-orange-500" /> {t('article', 'comments')} ({comments.length})
                </h3>

                {/* Comment form */}
                {user ? (
                  <form onSubmit={handleComment} className="mb-6">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder={t('article', 'comment_placeholder')}
                      rows={3}
                      className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="submit"
                        disabled={submitting || !commentText.trim()}
                        className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors"
                      >
                        {submitting ? '...' : t('article', 'post_comment')}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="mb-6 p-4 bg-[#2a2a2a] rounded-xl text-center">
                    <p className="text-gray-400 text-sm">
                      <Link href="/auth/login" className="text-orange-500 hover:underline">{t('article', 'login_to_comment')}</Link>
                    </p>
                  </div>
                )}

                {/* Comments list */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment._id} className="flex gap-3 group">
                      {comment.author?.avatar ? (
                        <img src={comment.author.avatar} alt="" className="w-8 h-8 rounded-full flex-shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-orange-500/20 flex-shrink-0 flex items-center justify-center">
                          <span className="text-orange-500 text-xs font-bold">{comment.author?.username?.[0]}</span>
                        </div>
                      )}
                      <div className="flex-1 bg-[#2a2a2a] rounded-xl px-4 py-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white text-sm font-semibold">{comment.author?.username}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 text-xs">
                              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale })}
                            </span>
                            {(user?._id === comment.author?._id || user?.role === 'admin') && (
                              <button onClick={() => handleDeleteComment(comment._id)} className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 transition-all">
                                <FiTrash2 size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-4">Soyez le premier à commenter !</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related articles */}
            {related.length > 0 && (
              <div className="bg-[#111] rounded-2xl border border-[#2a2a2a] p-5">
                <h3 className="font-display text-lg font-bold text-white mb-4">{t('article', 'related')}</h3>
                <div className="space-y-4">
                  {related.map((a) => (
                    <ArticleCard key={a._id} article={a} variant="compact" />
                  ))}
                </div>
              </div>
            )}

            {/* Author info */}
            {article.author && (
              <div className="bg-[#111] rounded-2xl border border-[#2a2a2a] p-5">
                <h3 className="font-display text-lg font-bold text-white mb-4">À propos de l'auteur</h3>
                <div className="flex items-center gap-3">
                  {article.author.avatar ? (
                    <img src={article.author.avatar} alt="" className="w-12 h-12 rounded-full border-2 border-orange-500/30" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center border-2 border-orange-500/30">
                      <span className="text-orange-500 font-bold text-lg">{article.author.username?.[0]}</span>
                    </div>
                  )}
                  <div>
                    <p className="text-white font-semibold">{article.author.username}</p>
                    {article.author.bio && <p className="text-gray-500 text-xs mt-1">{article.author.bio}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
