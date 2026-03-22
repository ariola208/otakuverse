# 🔥 Otaku News — Plateforme de News Otaku

Site de news complet dédié à l'Anime, Manga, Jeux vidéo et Culture japonaise.

---

## 🚀 Lancement Rapide

### Prérequis
- Node.js 18+
- pnpm (`npm install -g pnpm`)
- MongoDB (local ou [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) — GRATUIT)

### Installation & Démarrage

```bash
# 1. Installer les dépendances
pnpm install

# 2. Lancer le projet (frontend + backend simultanément)
pnpm dev
```

Le site sera accessible sur **http://localhost:3000**  
L'API sera disponible sur **http://localhost:5000**

---

## 🔧 Configuration MongoDB

### Option 1 : MongoDB Local
Installez MongoDB localement. Le `.env` du serveur utilise déjà `mongodb://localhost:27017/otaku-news`.

### Option 2 : MongoDB Atlas (Cloud — Recommandé)
1. Créez un compte sur [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un cluster gratuit
3. Copiez l'URI de connexion
4. Modifiez `server/.env` :
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/otaku-news
```

> **Note :** Sans MongoDB, le serveur démarre mais les données ne seront pas persistées.

---

## 👤 Comptes de démonstration

| Rôle  | Email                    | Mot de passe |
|-------|--------------------------|--------------|
| Admin | admin@otakunews.com      | admin123     |
| User  | user@otakunews.com       | user123      |

*Ces comptes sont créés automatiquement au premier lancement.*

---

## 📁 Structure du Projet

```
otaku-news/
├── client/                    # Next.js 14 App Router
│   └── src/
│       ├── app/
│       │   ├── page.tsx           # Accueil
│       │   ├── article/[slug]/    # Article
│       │   ├── category/[cat]/    # Catégorie
│       │   ├── search/            # Recherche
│       │   ├── favorites/         # Favoris
│       │   ├── profile/           # Profil
│       │   ├── auth/              # Login / Register
│       │   └── admin/             # Dashboard Admin
│       ├── components/
│       │   ├── layout/            # Navbar, Footer, Providers
│       │   ├── news/              # ArticleCard
│       │   └── ui/                # Skeletons
│       ├── store/                 # Zustand (auth, theme, i18n)
│       ├── i18n/                  # Traductions FR/EN
│       └── lib/                   # Axios instance
│
└── server/                    # Node.js + Express
    ├── models/                # User, Article, Comment
    ├── routes/                # auth, articles, users, comments, search
    ├── middleware/            # JWT auth middleware
    ├── seed.js                # Données de démonstration
    └── index.js               # Point d'entrée
```

---

## 🌟 Fonctionnalités

### 📰 Contenu
- Articles avec HTML riche, images, tags, catégories
- 12 articles de démonstration (Naruto, JJK, AoT, Demon Slayer...)
- Featured articles en hero dynamique
- Articles similaires

### 🔐 Authentification
- Inscription / Connexion JWT
- Protection des routes
- Hash bcrypt
- Profil utilisateur éditable

### 💬 Interaction
- Like / Dislike sur articles
- Commentaires (CRUD)
- Système de favoris persistants
- Partage d'articles

### 🎨 Design
- Thème sombre (noir + orange) — style Netflix/news premium
- Hero slider automatique
- Animations fluides
- Responsive parfait
- Dark/Light mode

### 🌍 Multilingue
- Français / Anglais
- Switch de langue en temps réel
- Traduction complète du site

### 👑 Admin Panel
- Dashboard avec statistiques
- CRUD articles complet (créer, modifier, supprimer)
- Gestion des utilisateurs + changement de rôle
- Top articles par vues

---

## 🔌 API Endpoints

```
POST   /api/auth/register          Inscription
POST   /api/auth/login             Connexion
GET    /api/auth/me                Profil courant
PUT    /api/auth/profile           Modifier profil
PUT    /api/auth/password          Changer mot de passe

GET    /api/articles               Liste articles (filtres: category, featured, page)
GET    /api/articles/:slug         Article + related
POST   /api/articles               Créer (admin)
PUT    /api/articles/:id           Modifier (admin)
DELETE /api/articles/:id           Supprimer (admin)
POST   /api/articles/:id/like      Like
POST   /api/articles/:id/dislike   Dislike
POST   /api/articles/:id/favorite  Favori toggle

GET    /api/comments/:articleId    Commentaires
POST   /api/comments               Ajouter commentaire
DELETE /api/comments/:id           Supprimer commentaire

GET    /api/search?q=&category=    Recherche full-text
GET    /api/categories             Stats catégories

GET    /api/users                  Liste users (admin)
PUT    /api/users/:id/role         Changer rôle (admin)
DELETE /api/users/:id              Supprimer user (admin)
GET    /api/users/stats            Statistiques (admin)
```

---

## 🛠️ Scripts disponibles

```bash
pnpm dev          # Lancer frontend + backend
pnpm build        # Build de production
pnpm start        # Lancer en production
```

---

Fait avec ❤️ pour la communauté otaku 🎌
