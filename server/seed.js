const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

module.exports = async function seed() {
  try {
    const User = require('./models/User');
    const Article = require('./models/Article');
    const Comment = require('./models/Comment');

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@otakunews.com' });
    let admin;
    if (!adminExists) {
      admin = await User.create({
        username: 'OtakuAdmin',
        email: 'admin@otakunews.com',
        password: 'admin123',
        role: 'admin',
        bio: 'Administrateur de Otaku News',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
      });
    } else {
      admin = adminExists;
    }

    // Create regular user
    const userExists = await User.findOne({ email: 'user@otakunews.com' });
    let user;
    if (!userExists) {
      user = await User.create({
        username: 'NarutoFan',
        email: 'user@otakunews.com',
        password: 'user123',
        role: 'user',
        bio: 'Fan de manga et anime depuis 2005',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=naruto'
      });
    } else {
      user = userExists;
    }

    const articles = [
      {
        title: 'Jujutsu Kaisen Saison 3 : Date de sortie confirmée et nouvelles révélations',
        slug: 'jujutsu-kaisen-saison-3-date-sortie-' + Date.now(),
        excerpt: 'MAPPA a enfin confirmé la date de sortie de la très attendue saison 3 de Jujutsu Kaisen. Les fans du monde entier retiennent leur souffle alors que les détails sur l\'arc Culling Game sont révélés.',
        content: `<h2>La Saison 3 de Jujutsu Kaisen est Officielle</h2>
<p>MAPPA a officiellement annoncé que la saison 3 de Jujutsu Kaisen adaptera l'arc "Culling Game", l'un des arcs les plus intenses et spectaculaires du manga de Gege Akutami.</p>

<h2>Un Arc Épique</h2>
<p>Le Culling Game est considéré par de nombreux fans comme le tournant majeur de l'histoire. Yuji Itadori, accompagné de ses alliés, devra participer à un jeu de mort orchestré par Kenjaku, l'antagoniste principal de la série.</p>

<blockquote>
<p>"Nous voulons capturer toute la puissance et l'intensité du manga dans chaque épisode," a déclaré le directeur de MAPPA lors de l'annonce.</p>
</blockquote>

<h2>Nouvelles Techniques et Personnages</h2>
<p>Cette saison introduira de nombreux nouveaux personnages aux pouvoirs uniques, ainsi que des évolutions majeures pour Megumi Fushiguro et Nobara Kugisaki. Les fans peuvent s'attendre à des combats encore plus impressionnants que dans les saisons précédentes.</p>

<h2>La Production</h2>
<p>MAPPA, déjà connue pour son travail exceptionnel sur Attack on Titan: The Final Season, promet une qualité d'animation encore supérieure. L'équipe a notamment mentionné l'utilisation de nouvelles technologies pour les séquences de combat.</p>

<h2>Conclusion</h2>
<p>La communauté Jujutsu Kaisen est en effervescence. Cette nouvelle saison s'annonce comme l'une des plus spectaculaires de l'histoire de l'anime. Restez connectés sur Otaku News pour toutes les dernières actualités !</p>`,
        image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80',
        category: 'anime',
        tags: ['jujutsu kaisen', 'mappa', 'saison 3', 'anime 2024'],
        featured: true,
        status: 'published',
        views: 8420,
        author: admin._id
      },
      {
        title: 'Demon Slayer : L\'arc Hashira Training dévoile ses secrets',
        slug: 'demon-slayer-hashira-training-arc-' + (Date.now() + 1),
        excerpt: 'Le nouvel arc de Demon Slayer plonge Tanjiro dans un entraînement intense sous la supervision des Piliers. Ufotable promet des scènes d\'action à couper le souffle.',
        content: `<h2>L'Arc Hashira Training : Un Nouveau Défi pour Tanjiro</h2>
<p>L'arc Hashira Training de Demon Slayer représente un moment crucial dans le développement de Tanjiro Kamado et de ses compagnons. Sous la supervision des puissants Piliers du Corps des Chasseurs de Démons, nos héros vont pousser leurs limites à l'extrême.</p>

<h2>Ufotable à la Hauteur</h2>
<p>Le studio Ufotable, célèbre pour ses animations spectaculaires, s'est une fois de plus surpassé. Les techniques de respiration sont rendues de façon absolument époustouflante, avec des effets visuels qui semblent sortir directement des pages du manga d'Koyoharu Gotouge.</p>

<h2>Les Piliers au Premier Plan</h2>
<p>Cet arc nous donne enfin l'opportunité de mieux connaître les Piliers. Gyomei Himejima, le Pilier de la Pierre, apparaît comme l'un des personnages les plus impressionnants de tout l'univers Demon Slayer. Sa force brute combinée à sa compassion en font un personnage inoubliable.</p>

<h2>Une Préparation pour le Combat Final</h2>
<p>Cet arc est essentiellement une préparation pour l'affrontement ultime contre Muzan Kibutsuji et ses démons. La tension monte progressivement, et les fans du manga savent que les révélations à venir seront bouleversantes.</p>

<h2>Réception du Public</h2>
<p>L'accueil de cet arc a été extraordinaire. Les épisodes accumulent des millions de vues en quelques heures seulement, confirmant que Demon Slayer reste l'une des franchises anime les plus populaires du monde.</p>`,
        image: 'https://images.unsplash.com/photo-1601513445506-2ab0d4fb4229?w=800&q=80',
        category: 'anime',
        tags: ['demon slayer', 'kimetsu no yaiba', 'hashira', 'ufotable'],
        featured: true,
        status: 'published',
        views: 6280,
        author: admin._id
      },
      {
        title: 'Attack on Titan : 10 ans après, l\'héritage d\'une œuvre générationnelle',
        slug: 'attack-on-titan-10-ans-heritage-' + (Date.now() + 2),
        excerpt: 'Dix ans après ses débuts, Attack on Titan continue de fasciner et de diviser. Retour sur une série qui a redéfini les codes du manga d\'action.',
        content: `<h2>Une Décennie d'Attack on Titan</h2>
<p>Il y a dix ans, Hajime Isayama publiait le premier chapitre d'Attack on Titan dans le magazine Bessatsu Shōnen Magazine. Personne ne pouvait imaginer à quel point cette œuvre allait révolutionner le monde du manga et de l'anime.</p>

<h2>La Révolution du Shonen</h2>
<p>Attack on Titan a brisé tous les codes établis. Là où le shonen traditionnel protège ses personnages principaux et offre des fins heureuses, Isayama n'a pas hésité à tuer des personnages aimés du public, à retourner des situations en faveur des antagonistes, et à proposer une narrative moralement complexe.</p>

<h2>L'Impact de MAPPA sur la Saison Finale</h2>
<p>La reprise du flambeau par MAPPA pour la saison finale a provoqué des débats passionnés au sein de la communauté. Malgré les controverses initiales sur l'animation CGI, le studio a su livrer des épisodes mémorables, notamment l'épisode "The Rumbling" qui reste l'un des moments les plus discutés de l'histoire de l'anime.</p>

<h2>La Fin Controversée</h2>
<p>La conclusion d'Attack on Titan a été l'une des plus débattues de l'histoire du manga. Si certains ont été déçus par les choix narratifs d'Isayama, d'autres ont salué l'ambition et le courage de sa vision. Quoi qu'il en soit, cette fin a généré des discussions philosophiques profondes sur la liberté, le sacrifice, et la nature humaine.</p>

<h2>L'Héritage Durable</h2>
<p>Aujourd'hui, Attack on Titan figure dans le panthéon des grandes œuvres du manga aux côtés de Dragon Ball, One Piece, et Naruto. Son influence se retrouve dans de nombreuses œuvres contemporaines qui ont cherché à reproduire sa profondeur narrative et son courage thématique.</p>`,
        image: 'https://images.unsplash.com/photo-1612178991541-b48cc8e92a4d?w=800&q=80',
        category: 'manga',
        tags: ['attack on titan', 'shingeki no kyojin', 'isayama', 'mappa'],
        featured: true,
        status: 'published',
        views: 12350,
        author: admin._id
      },
      {
        title: 'Naruto : Le manga culte fête ses 25 ans avec des annonces explosives',
        slug: 'naruto-25-ans-anniversaire-annonces-' + (Date.now() + 3),
        excerpt: 'Le ninja de Konoha célèbre un quart de siècle d\'existence. Masashi Kishimoto et Pierrot préparent des surprises exceptionnelles pour marquer cet anniversaire historique.',
        content: `<h2>25 Ans de Naruto : Un Monument du Manga</h2>
<p>En 1999, Masashi Kishimoto présentait au monde un jeune ninja blond aux rêves impossibles : Naruto Uzumaki. Vingt-cinq ans plus tard, cette série reste l'une des plus aimées et influentes de l'histoire du manga.</p>

<h2>Les Annonces de l'Anniversaire</h2>
<p>Pour célébrer ce quart de siècle, Pierrot et Shueisha ont préparé un programme exceptionnel. Un nouveau film d'animation est en développement, promettant de revisiter certains moments clés de l'histoire originale avec une qualité d'animation moderne.</p>

<h2>Kishimoto Revient</h2>
<p>Masashi Kishimoto a accordé une interview rare dans laquelle il évoque ses sentiments mitigés sur certains aspects de l'histoire originale et son désir de corriger certaines choses via Boruto: Naruto Next Generations.</p>

<h2>L'Impact Culturel</h2>
<p>Naruto a transcendé le simple divertissement pour devenir un phénomène culturel mondial. Ses thèmes sur la persévérance, l'amitié, et la rédemption ont touché des millions de personnes à travers le monde. La phrase "Je n'abandonnerai jamais" est devenue un véritable mantra pour toute une génération.</p>

<h2>Boruto et l'Avenir</h2>
<p>Avec Boruto: Two Blue Vortex, la franchise Naruto continue de se développer. Si les débuts de Boruto ont été mitigés, la nouvelle direction narrative insufflée par les récents développements a regagné l'enthousiasme d'une partie de la fanbase.</p>`,
        image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80',
        category: 'manga',
        tags: ['naruto', 'kishimoto', 'anniversaire', '25 ans', 'konoha'],
        featured: false,
        status: 'published',
        views: 9870,
        author: admin._id
      },
      {
        title: 'One Piece : L\'arc Egghead Island révolutionne la saga',
        slug: 'one-piece-egghead-island-revolution-' + (Date.now() + 4),
        excerpt: 'Eiichiro Oda continue de surprendre avec un arc futuriste qui repousse les limites de l\'imagination. L\'île d\'Egghead révèle des secrets fondamentaux sur l\'histoire du monde de One Piece.',
        content: `<h2>Egghead Island : Le Futur de One Piece</h2>
<p>L'arc Egghead Island marque un tournant majeur dans la saga One Piece d'Eiichiro Oda. Cette île futuriste, résidence du Dr. Vegapunk, le plus grand génie scientifique du monde, offre aux lecteurs une plongée fascinante dans la technologie avancée du monde de One Piece.</p>

<h2>Vegapunk et ses Satellites</h2>
<p>La révélation du vrai visage de Vegapunk et de ses satellites (les différentes versions de lui-même) a été l'une des surprises les plus délicieuses de cet arc. Chaque satellite incarne un aspect différent de la personnalité de Vegapunk.</p>

<h2>Des Révélations Capitales</h2>
<p>Cet arc a révélé des informations cruciales sur l'histoire du Siècle Vide, les Fruits du Démon, et la nature des Poneglyphes. Ces révélations changent fondamentalement notre compréhension de l'univers de One Piece et ouvrent la voie à la conclusion de la saga.</p>

<h2>L'Animation de Toei</h2>
<p>Toei Animation a considérablement amélioré sa qualité d'animation pour adapter cet arc. Les combats, notamment celui impliquant Luffy, sont rendus avec une fluidité et un dynamisme remarquables.</p>

<h2>Vers la Fin</h2>
<p>Avec ces révélations, Oda semble clairement accélérer vers la conclusion de son œuvre magistrale. La communauté One Piece est en ébullition, et chaque chapitre devient un événement en soi.</p>`,
        image: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=800&q=80',
        category: 'manga',
        tags: ['one piece', 'oda', 'egghead', 'vegapunk'],
        featured: false,
        status: 'published',
        views: 7650,
        author: admin._id
      },
      {
        title: 'Dragon Ball Daima : Goku en version mini fait son grand retour',
        slug: 'dragon-ball-daima-goku-mini-retour-' + (Date.now() + 5),
        excerpt: 'La nouvelle série Dragon Ball Daima créée par Akira Toriyama avant sa disparition est enfin disponible. Une aventure touchante et nostalgique qui rend hommage au père du manga.',
        content: `<h2>Dragon Ball Daima : L'Ultime Cadeau de Toriyama</h2>
<p>Dragon Ball Daima prend une signification particulière depuis la disparition tragique d'Akira Toriyama en mars 2024. Cette série, qu'il avait personnellement développée, constitue son dernier cadeau aux fans du monde entier.</p>

<h2>Le Concept Original</h2>
<p>L'idée de miniaturiser Goku et ses amis permettait à Toriyama de revenir à une certaine légèreté et à un style d'aventure plus proche du Dragon Ball original que de Dragon Ball Super. Cette approche rafraîchissante a été saluée par de nombreux fans.</p>

<h2>Un Hommage à l'Aventure</h2>
<p>Daima se déroule dans le Demon Realm, un univers encore inexploré, offrant aux créateurs la liberté de développer de nouveaux personnages et environnements. La série combine parfaitement l'humour caractéristique de Toriyama avec des moments d'action authentiques.</p>

<h2>La Réception du Public</h2>
<p>L'accueil de Dragon Ball Daima a été globalement positif. Si certains regrettaient l'absence des formes Super Saiyan classiques dans ce contexte, la majorité des fans ont apprécié ce retour aux sources aventureuses de la franchise.</p>`,
        image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&q=80',
        category: 'anime',
        tags: ['dragon ball', 'daima', 'toriyama', 'goku', 'nostalgique'],
        featured: false,
        status: 'published',
        views: 5430,
        author: admin._id
      },
      {
        title: 'Elden Ring : L\'extension Shadow of the Erdtree dépasse toutes les attentes',
        slug: 'elden-ring-shadow-erdtree-extension-' + (Date.now() + 6),
        excerpt: 'FromSoftware frappe fort avec Shadow of the Erdtree, une extension monumentale qui redéfinit ce que peut être un DLC. Les fans de souls-like sont en extase.',
        content: `<h2>Shadow of the Erdtree : Une Extension Légendaire</h2>
<p>Shadow of the Erdtree, l'extension d'Elden Ring développée par FromSoftware, s'est imposée comme l'une des meilleures extensions de jeu vidéo de tous les temps. Avec plus de 40 heures de contenu dans la Shadowlands, l'extension justifie amplement son prix.</p>

<h2>Un Nouveau Monde à Explorer</h2>
<p>La Shadowlands offre un design de niveau absolument remarquable. FromSoftware a su créer un environnement qui se démarque clairement du jeu de base tout en restant cohérent avec l'univers d'Elden Ring. Les paysages sombres et mélancoliques contrastent magnifiquement avec la beauté étrange de ce monde d'ombre.</p>

<h2>Messmer l'Empaleur</h2>
<p>Le nouveau boss principal, Messmer l'Empaleur, est unanimement considéré comme l'un des meilleurs antagonistes jamais créés par FromSoftware. Son design, ses mouvements et son histoire en font un personnage véritablement mémorable.</p>

<h2>Difficulté et Polémique</h2>
<p>L'extension a suscité des débats sur sa difficulté extrême. Certains joueurs ont trouvé certains boss infranchissables sans le nouveau système de Scadutree Fragments, ce qui a alimenté des discussions animées dans la communauté.</p>

<h2>Un Succès Commercial et Critique</h2>
<p>Shadow of the Erdtree a reçu des notes parfaites de nombreux médias spécialisés et s'est vendu à des millions d'exemplaires en quelques jours. Un triomphe total pour FromSoftware.</p>`,
        image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80',
        category: 'jeux',
        tags: ['elden ring', 'fromsoftware', 'shadow of the erdtree', 'souls-like', 'DLC'],
        featured: true,
        status: 'published',
        views: 11200,
        author: admin._id
      },
      {
        title: 'Le Festival Matsuri : Guide complet pour les festivals japonais d\'été',
        slug: 'festival-matsuri-guide-complet-ete-' + (Date.now() + 7),
        excerpt: 'Les festivals Matsuri sont au cœur de la culture japonaise. Découvrez les traditions, les tenues et les incontournables de ces célébrations estivales magiques.',
        content: `<h2>Les Matsuri : L'Âme du Japon</h2>
<p>Les Matsuri (祭り) sont bien plus que de simples fêtes. Ils représentent le cœur pulsant de la culture japonaise, un moment où les communautés se rassemblent pour honorer les divinités, célébrer les saisons, et perpétuer des traditions millénaires.</p>

<h2>Les Grands Festivals de l'Été</h2>
<p>L'été japonais est la saison des grands Matsuri. Le Gion Matsuri de Kyoto, qui remonte au IXe siècle, est l'un des plus spectaculaires. Pendant tout le mois de juillet, la ville s'anime avec des processions de chars extraordinaires (Yamaboko) décorés de tapisseries précieuses.</p>

<h2>Le Yukata et les Tenues Traditionnelles</h2>
<p>Pour assister à un Matsuri, le Yukata (version estivale légère du Kimono) est la tenue de rigueur. Les couleurs vives, les motifs floraux et les accessoires traditionnels comme le Obi font du Yukata un vêtement à la fois pratique et élégant.</p>

<h2>La Gastronomie des Festivals</h2>
<p>Les étals de nourriture (Yatai) sont indissociables des Matsuri. Takoyaki (boulettes de pieuvre), Yakisoba (nouilles sautées), Karaage (poulet frit japonais), et les incontournables Kakigōri (glaces pilées parfumées) rythment ces célébrations gourmandes.</p>

<h2>Les Feux d'Artifice</h2>
<p>Les Hanabi Taikai (festivals de feux d'artifice) sont les moments les plus attendus des festivals d'été japonais. Le Sumida River Fireworks Festival à Tokyo attire chaque année plus d'un million de spectateurs.</p>`,
        image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
        category: 'culture',
        tags: ['matsuri', 'culture japonaise', 'festival', 'japon', 'traditions'],
        featured: false,
        status: 'published',
        views: 4320,
        author: admin._id
      },
      {
        title: 'Hunter x Hunter : Togashi reprend la plume, les fans en délire',
        slug: 'hunter-x-hunter-togashi-reprise-' + (Date.now() + 8),
        excerpt: 'Yoshihiro Togashi a surpris le monde du manga en annonçant une reprise de Hunter x Hunter. Après des années de hiatus, le manga légendaire revient avec de nouveaux chapitres.',
        content: `<h2>Le Retour Miraculeux de Hunter x Hunter</h2>
<p>Dans l'univers du manga, peu d'événements peuvent générer autant d'excitation qu'une reprise de Hunter x Hunter. Yoshihiro Togashi, malgré des problèmes de santé persistants, a su trouver le moyen de continuer son œuvre magistrale.</p>

<h2>Un Hiatus Légendaire</h2>
<p>Hunter x Hunter est tristement célèbre pour ses hiatus à répétition. Les fans avaient développé des mèmes et des blagues sur la régularité (ou l'irrégularité) de publication, mais ce retour prouve que Togashi n'a jamais abandonné son univers.</p>

<h2>L'Arc de la Monarchie des Fourmis Chimères</h2>
<p>Considéré par beaucoup comme l'un des meilleurs arcs de l'histoire du manga, l'arc des Fourmis Chimères avait démontré l'incroyable capacité de Togashi à construire des personnages complexes et à aborder des thèmes philosophiques profonds dans un cadre d'action.</p>

<h2>Le Système Nen et son Génie</h2>
<p>Le Nen, le système de pouvoirs de Hunter x Hunter, reste l'un des plus élaborés et cohérents du genre. Sa profondeur permettait à Togashi de créer des combats tactiques et intellectuels plutôt que de simples affrontements de puissance brute.</p>

<h2>L'Espoir pour la Suite</h2>
<p>Les fans espèrent maintenant que Togashi pourra conclure les arcs en suspens, notamment la quête de Gon et le développement de Killua. L'avenir de Hunter x Hunter semble enfin s'éclaircir.</p>`,
        image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&q=80',
        category: 'manga',
        tags: ['hunter x hunter', 'togashi', 'hiatus', 'reprise'],
        featured: false,
        status: 'published',
        views: 8910,
        author: admin._id
      },
      {
        title: 'Cyberpunk : Edgerunners - Comment l\'anime a sauvé le jeu vidéo',
        slug: 'cyberpunk-edgerunners-anime-sauve-jeu-' + (Date.now() + 9),
        excerpt: 'L\'anime Cyberpunk : Edgerunners de Studio Trigger a réalisé l\'impossible : redonner vie à un jeu qui semblait condamné. Une étude de cas fascinante sur les synergies entre jeu vidéo et anime.',
        content: `<h2>Le Miracle Edgerunners</h2>
<p>Cyberpunk : Edgerunners représente l'une des histoires les plus fascinantes de la relation entre l'industrie du jeu vidéo et celle de l'animation japonaise. Un anime de 10 épisodes a réussi à ressusciter un jeu qui avait eu l'un des lancements les plus chaotiques de l'histoire.</p>

<h2>Studio Trigger au Sommet</h2>
<p>Studio Trigger, déjà célèbre pour Kill la Kill et Gurren Lagann, a livré avec Edgerunners l'une de ses œuvres les plus matures et emotionnellement résonnantes. L'animation est époustouflante, le rythme parfait, et les personnages immédiatement attachants.</p>

<h2>David Martinez : Un Héros Mémorable</h2>
<p>David Martinez est rapidement devenu l'un des protagonistes anime les plus aimés de l'année. Son histoire de chute et de désespoir, empreinte d'une mélancolie profonde, a touché des millions de spectateurs bien au-delà de la fanbase de Cyberpunk 2077.</p>

<h2>L'Impact sur les Ventes</h2>
<p>Après la sortie d'Edgerunners, Cyberpunk 2077 a connu un pic de ventes extraordinaire. CD Projekt Red a vu son jeu retrouver une popularité inattendue, et la mise à jour 2.0 qui a suivi a definitivamente réhabilité le titre.</p>

<h2>Une Leçon pour l'Industrie</h2>
<p>L'histoire d'Edgerunners démontre le pouvoir d'un anime de qualité pour revitaliser une franchise. Elle illustre également comment une adaptation bien réalisée peut transcender son matériau source et toucher un public bien plus large.</p>`,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        category: 'jeux',
        tags: ['cyberpunk', 'edgerunners', 'studio trigger', 'anime', 'jeu vidéo'],
        featured: false,
        status: 'published',
        views: 6780,
        author: admin._id
      },
      {
        title: 'Ramen : L\'art culinaire qui a conquis le monde entier',
        slug: 'ramen-art-culinaire-conquis-monde-' + (Date.now() + 10),
        excerpt: 'Du simple repas de travailleurs japonais au plat gourmet internationalement reconnu, l\'histoire du ramen est aussi riche et complexe que ses bouillons. Plongée dans la culture du ramen.',
        content: `<h2>Le Ramen : Bien Plus qu'un Simple Plat</h2>
<p>Le ramen (ラーメン) est devenu l'ambassadeur culinaire du Japon dans le monde entier. Cette soupe de nouilles, apparemment simple, cache en réalité une complexité et un savoir-faire qui lui ont valu une reconnaissance internationale extraordinaire.</p>

<h2>Les Quatre Grandes Écoles</h2>
<p>Le monde du ramen se divise en quatre grandes traditions régionales : le Shoyu (sauce soja) de Tokyo, le Shio (sel) d'Hakodate, le Miso de Sapporo, et le Tonkotsu (os de porc) de Hakata. Chaque style reflète les ingrédients et les préférences de sa région d'origine.</p>

<h2>L'Obsession Japonaise</h2>
<p>Au Japon, le ramen est bien plus qu'un simple repas. C'est une passion nationale. Des restaurants spécialisés (ramen-ya) peuvent avoir des files d'attente de plusieurs heures. Des musées entiers sont dédiés à l'histoire du ramen. Des compétitions annuelles rassemblent les meilleurs chefs du pays.</p>

<h2>La Conquête Mondiale</h2>
<p>Dans les années 2010, le ramen a commencé sa conquête du monde occidental. Des chefs comme Ivan Orkin à New York ou Sun Noodle au niveau international ont contribué à faire reconnaître le ramen comme une cuisine gastronomique méritant attention et respect.</p>

<h2>L'Influence de l'Anime</h2>
<p>Il est impossible de parler de la popularité mondiale du ramen sans mentionner l'influence de l'anime et du manga. Des scènes emblématiques de personnages dégustant un bol fumant ont rendu le ramen désirable et mystérieux pour des millions de fans à travers le monde.</p>`,
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80',
        category: 'culture',
        tags: ['ramen', 'culture japonaise', 'gastronomie', 'cuisine japonaise'],
        featured: false,
        status: 'published',
        views: 3560,
        author: admin._id
      },
      {
        title: 'Spy x Family Saison 2 : Anya charme à nouveau les spectateurs',
        slug: 'spy-x-family-saison-2-anya-' + (Date.now() + 11),
        excerpt: 'La famille Forger est de retour pour une deuxième saison tout aussi délicieuse. Anya, Loid et Yor continuent de faire fondre les cœurs dans de nouvelles aventures hilarantes.',
        content: `<h2>Spy x Family : Le Retour de la Famille Parfaite</h2>
<p>Spy x Family, l'œuvre de Tatsuya Endo adaptée par CloverWorks et Wit Studio, revient pour une deuxième saison qui confirme tout le bien qu'on pensait de cette franchise exceptionnelle.</p>

<h2>Anya, le Phénomène Mondial</h2>
<p>Anya Forger est devenue l'un des personnages les plus aimés de l'anime moderne. Ses expressions faciales exagérées, sa façon de garder le secret de ses pouvoirs télépathe, et sa relation touchante avec ses "parents" adoptifs en font un personnage irrésistible.</p>

<h2>L'Équilibre Parfait</h2>
<p>Ce qui fait la force de Spy x Family, c'est son équilibre remarquable entre comédie, action, et émotions. L'anime parvient à être simultanément drôle, touchant, et parfois palpitant, sans jamais sacrifier un aspect pour un autre.</p>

<h2>Loid et Yor : Un Couple Atypique</h2>
<p>La relation entre Loid Forger (l'espion Twilight) et Yor Briar (l'assassine) continue d'évoluer de façon délicieuse. Leurs maladresses respectives face aux conventions du mariage et de la parentalité constituent la source principale de l'humour de la série.</p>

<h2>L'Arc de la Croisière</h2>
<p>La saison 2 introduit un arc de croisière particulièrement dynamique qui permet à tous les personnages de briller dans de nouvelles situations. Les fans du manga attendaient avec impatience cette adaptation.</p>`,
        image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80',
        category: 'anime',
        tags: ['spy x family', 'anya', 'cloverworks', 'wit studio', 'comédie'],
        featured: false,
        status: 'published',
        views: 5890,
        author: admin._id
      }
    ];

    for (const articleData of articles) {
      const exists = await Article.findOne({ title: articleData.title });
      if (!exists) {
        await Article.create(articleData);
      }
    }

    // Add comments
    const allArticles = await Article.find().limit(5);
    const commentTexts = [
      "Excellent article, merci pour ces informations !",
      "J'attendais cet article depuis longtemps, très complet !",
      "Super analyse, j'ai appris beaucoup de choses.",
      "Vraiment intéressant ! Hâte de voir la suite.",
      "Merci pour ce contenu de qualité, Otaku News est le meilleur !"
    ];

    for (const article of allArticles) {
      const existingComments = await Comment.countDocuments({ article: article._id });
      if (existingComments === 0) {
        await Comment.create({
          article: article._id,
          author: user._id,
          content: commentTexts[Math.floor(Math.random() * commentTexts.length)]
        });
      }
    }

    console.log('✅ Database seeded successfully!');
    console.log('👤 Admin: admin@otakunews.com / admin123');
    console.log('👤 User: user@otakunews.com / user123');
  } catch (err) {
    console.error('Seed error:', err.message);
  }
};
