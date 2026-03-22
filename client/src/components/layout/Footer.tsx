'use client';
import Link from 'next/link';
import { FaFire, FaTwitter, FaDiscord, FaInstagram, FaYoutube } from 'react-icons/fa';
import { useStore } from '@/store/useStore';

export default function Footer() {
  const { t } = useStore();
  return (
    <footer className="bg-[#111] border-t border-[#2a2a2a] mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-sm flex items-center justify-center">
                <FaFire className="text-white text-sm" />
              </div>
              <span className="font-display font-bold text-xl text-white">OTAKU<span className="text-orange-500">NEWS</span></span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              L'actualité Otaku en temps réel. Anime, Manga, Jeux vidéo et Culture japonaise.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {[FaTwitter, FaDiscord, FaInstagram, FaYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 bg-[#2a2a2a] hover:bg-orange-500 rounded-md flex items-center justify-center text-gray-400 hover:text-white transition-all">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 font-display text-lg">Catégories</h4>
            <ul className="space-y-2">
              {[['anime', '/category/anime'], ['manga', '/category/manga'], ['jeux', '/category/jeux'], ['culture', '/category/culture']].map(([cat, href]) => (
                <li key={cat}>
                  <Link href={href} className="text-gray-500 hover:text-orange-500 text-sm transition-colors capitalize">{t('categories', cat)}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 font-display text-lg">Navigation</h4>
            <ul className="space-y-2">
              {[['Accueil', '/'], ['Recherche', '/search'], ['Favoris', '/favorites'], ['Profil', '/profile']].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-gray-500 hover:text-orange-500 text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 font-display text-lg">Newsletter</h4>
            <p className="text-gray-500 text-sm mb-3">Recevez les dernières news otaku directement dans votre boîte mail.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="votre@email.com"
                className="flex-1 bg-[#2a2a2a] border border-[#3a3a3a] text-white placeholder-gray-600 rounded-lg px-3 py-2 text-sm"
              />
              <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                OK
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-[#2a2a2a] mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">© 2024 OtakuNews. Tous droits réservés.</p>
          <p className="text-gray-600 text-sm">Fait avec ❤️ pour la communauté otaku</p>
        </div>
      </div>
    </footer>
  );
}
