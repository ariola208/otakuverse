export const translations = {
  fr: {
    nav: {
      home: 'Accueil', anime: 'Anime', manga: 'Manga', games: 'Jeux', culture: 'Culture',
      search: 'Rechercher', favorites: 'Favoris', profile: 'Profil', admin: 'Admin',
      login: 'Connexion', register: "S'inscrire", logout: 'Déconnexion',
    },
    home: {
      hero_title: 'L\'actualité Otaku', hero_subtitle: 'Anime, Manga, Jeux & Culture japonaise',
      featured: 'À la une', latest: 'Dernières nouvelles', trending: 'Tendances',
      read_more: 'Lire la suite', see_all: 'Voir tout', views: 'vues', by: 'par',
    },
    article: {
      related: 'Articles similaires', comments: 'Commentaires', add_comment: 'Ajouter un commentaire',
      like: 'J\'aime', dislike: 'Je n\'aime pas', favorite: 'Favoris', share: 'Partager',
      comment_placeholder: 'Votre commentaire...', post_comment: 'Publier',
      login_to_comment: 'Connectez-vous pour commenter', min_read: 'min de lecture',
    },
    auth: {
      login_title: 'Connexion', register_title: 'Inscription',
      email: 'Email', password: 'Mot de passe', username: 'Nom d\'utilisateur',
      confirm_password: 'Confirmer le mot de passe', login_btn: 'Se connecter',
      register_btn: 'S\'inscrire', no_account: 'Pas de compte ?', have_account: 'Déjà un compte ?',
      forgot_password: 'Mot de passe oublié ?',
    },
    profile: {
      title: 'Mon Profil', edit: 'Modifier', save: 'Sauvegarder', cancel: 'Annuler',
      bio: 'Bio', favorites: 'Mes Favoris', change_password: 'Changer le mot de passe',
      current_password: 'Mot de passe actuel', new_password: 'Nouveau mot de passe',
      member_since: 'Membre depuis',
    },
    search: {
      title: 'Recherche', placeholder: 'Rechercher articles, manga, anime...', results: 'résultats',
      no_results: 'Aucun résultat trouvé', filters: 'Filtres', all: 'Tous',
    },
    admin: {
      dashboard: 'Dashboard', articles: 'Articles', users: 'Utilisateurs', stats: 'Statistiques',
      new_article: 'Nouvel article', edit: 'Modifier', delete: 'Supprimer',
      title: 'Titre', content: 'Contenu', category: 'Catégorie', tags: 'Tags',
      image: 'Image URL', featured: 'À la une', status: 'Statut', published: 'Publié',
      draft: 'Brouillon', save: 'Sauvegarder', total_articles: 'Total articles',
      total_users: 'Total utilisateurs', total_comments: 'Total commentaires',
      top_articles: 'Articles populaires',
    },
    favorites: {
      title: 'Mes Favoris', empty: 'Vous n\'avez pas encore de favoris.', go_home: 'Découvrir des articles',
    },
    categories: { anime: 'Anime', manga: 'Manga', jeux: 'Jeux vidéo', culture: 'Culture japonaise' },
    common: { loading: 'Chargement...', error: 'Erreur', close: 'Fermer', back: 'Retour', page: 'Page' },
  },
  en: {
    nav: {
      home: 'Home', anime: 'Anime', manga: 'Manga', games: 'Games', culture: 'Culture',
      search: 'Search', favorites: 'Favorites', profile: 'Profile', admin: 'Admin',
      login: 'Login', register: 'Sign up', logout: 'Logout',
    },
    home: {
      hero_title: 'Otaku News', hero_subtitle: 'Anime, Manga, Games & Japanese Culture',
      featured: 'Featured', latest: 'Latest News', trending: 'Trending',
      read_more: 'Read more', see_all: 'See all', views: 'views', by: 'by',
    },
    article: {
      related: 'Related Articles', comments: 'Comments', add_comment: 'Add a comment',
      like: 'Like', dislike: 'Dislike', favorite: 'Favorite', share: 'Share',
      comment_placeholder: 'Your comment...', post_comment: 'Post',
      login_to_comment: 'Login to comment', min_read: 'min read',
    },
    auth: {
      login_title: 'Login', register_title: 'Sign Up',
      email: 'Email', password: 'Password', username: 'Username',
      confirm_password: 'Confirm Password', login_btn: 'Sign in',
      register_btn: 'Sign up', no_account: 'No account?', have_account: 'Already have an account?',
      forgot_password: 'Forgot password?',
    },
    profile: {
      title: 'My Profile', edit: 'Edit', save: 'Save', cancel: 'Cancel',
      bio: 'Bio', favorites: 'My Favorites', change_password: 'Change Password',
      current_password: 'Current Password', new_password: 'New Password',
      member_since: 'Member since',
    },
    search: {
      title: 'Search', placeholder: 'Search articles, manga, anime...', results: 'results',
      no_results: 'No results found', filters: 'Filters', all: 'All',
    },
    admin: {
      dashboard: 'Dashboard', articles: 'Articles', users: 'Users', stats: 'Statistics',
      new_article: 'New Article', edit: 'Edit', delete: 'Delete',
      title: 'Title', content: 'Content', category: 'Category', tags: 'Tags',
      image: 'Image URL', featured: 'Featured', status: 'Status', published: 'Published',
      draft: 'Draft', save: 'Save', total_articles: 'Total Articles',
      total_users: 'Total Users', total_comments: 'Total Comments',
      top_articles: 'Top Articles',
    },
    favorites: {
      title: 'My Favorites', empty: 'You have no favorites yet.', go_home: 'Discover articles',
    },
    categories: { anime: 'Anime', manga: 'Manga', jeux: 'Video Games', culture: 'Japanese Culture' },
    common: { loading: 'Loading...', error: 'Error', close: 'Close', back: 'Back', page: 'Page' },
  },
};

export type Lang = 'fr' | 'en';
export type Translations = typeof translations.fr;
