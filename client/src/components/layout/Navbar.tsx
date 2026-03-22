'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/store/useStore';
import {
  FiSearch, FiHeart, FiUser, FiLogOut, FiMenu, FiX, FiSun, FiMoon,
  FiBell, FiSettings, FiShield
} from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout, theme, toggleTheme, lang, setLang, t } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    toast.success('Déconnecté');
  };

  const navLinks = [
    { href: '/category/anime', label: t('nav', 'anime') },
    { href: '/category/manga', label: t('nav', 'manga') },
    { href: '/category/jeux', label: t('nav', 'games') },
    { href: '/category/culture', label: t('nav', 'culture') },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#2a2a2a] shadow-2xl' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-orange-500 rounded-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <FaFire className="text-white text-sm" />
              </div>
              <span className="font-display font-bold text-xl tracking-wider text-white">
                OTAKU<span className="text-orange-500">NEWS</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    pathname === link.href
                      ? 'text-orange-500 bg-orange-500/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"
              >
                <FiSearch size={18} />
              </button>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"
              >
                {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>

              {/* Language */}
              <button
                onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
                className="px-2 py-1 text-xs font-bold text-gray-400 hover:text-orange-500 border border-[#2a2a2a] hover:border-orange-500 rounded transition-colors"
              >
                {lang.toUpperCase()}
              </button>

              {user ? (
                <>
                  {/* Favorites */}
                  <Link href="/favorites" className="p-2 text-gray-400 hover:text-orange-500 hover:bg-white/5 rounded-md transition-colors">
                    <FiHeart size={18} />
                  </Link>

                  {/* User menu */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 p-1 rounded-full hover:bg-white/5 transition-colors"
                    >
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full object-cover border-2 border-orange-500/50" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-orange-500/20 border-2 border-orange-500/50 flex items-center justify-center">
                          <span className="text-orange-500 text-sm font-bold">{user.username[0].toUpperCase()}</span>
                        </div>
                      )}
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-2xl py-1 animate-fade-in">
                        <div className="px-4 py-3 border-b border-[#2a2a2a]">
                          <p className="text-white font-semibold text-sm">{user.username}</p>
                          <p className="text-gray-500 text-xs">{user.email}</p>
                        </div>
                        <Link href="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                          <FiUser size={16} /> {t('nav', 'profile')}
                        </Link>
                        <Link href="/favorites" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                          <FiHeart size={16} /> {t('nav', 'favorites')}
                        </Link>
                        {user.role === 'admin' && (
                          <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-orange-500 hover:bg-orange-500/10 transition-colors">
                            <FiShield size={16} /> {t('nav', 'admin')}
                          </Link>
                        )}
                        <div className="border-t border-[#2a2a2a] mt-1">
                          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
                            <FiLogOut size={16} /> {t('nav', 'logout')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/auth/login" className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors">
                    {t('nav', 'login')}
                  </Link>
                  <Link href="/auth/register" className="px-3 py-1.5 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium">
                    {t('nav', 'register')}
                  </Link>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-400 hover:text-white">
                {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-[#111] border-t border-[#2a2a2a] py-4 px-4 space-y-1 animate-fade-in">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="block px-3 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-md">
                {link.label}
              </Link>
            ))}
            {!user ? (
              <div className="pt-2 border-t border-[#2a2a2a] flex gap-2">
                <Link href="/auth/login" className="flex-1 text-center py-2 text-sm text-gray-400 border border-[#2a2a2a] rounded-lg hover:text-white">
                  {t('nav', 'login')}
                </Link>
                <Link href="/auth/register" className="flex-1 text-center py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                  {t('nav', 'register')}
                </Link>
              </div>
            ) : (
              <div className="pt-2 border-t border-[#2a2a2a]">
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-md">
                  {t('nav', 'logout')}
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4" onClick={() => setSearchOpen(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSearch} className="flex items-center gap-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-4 py-3 shadow-2xl">
              <FiSearch className="text-orange-500 text-xl shrink-0" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search', 'placeholder')}
                className="flex-1 bg-transparent text-white placeholder-gray-500 text-lg outline-none"
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="text-gray-500 hover:text-white">
                <FiX size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
