/**
 * Données de contenu du portfolio (français)
 * Modifiez ce fichier pour mettre à jour tout le contenu du site sans toucher à la structure HTML.
 */
window.portfolioData = {
    labels: {
        since: 'Depuis',
        at: 'à',
        viewProject: 'Voir le projet',
        newTab: ' (ouvre un nouvel onglet)'
    },

    navigation: {
        brandName: 'François Eoche',
        links: [
            {label: 'Emplois', href: '#experience'},
            {label: 'Formation', href: '#diplomas'},
            {label: 'Projets', href: '#projects'},
            {label: 'Conférences', href: '#talks'},
            {label: 'Bonus', href: '#extras'},
            {label: 'Contact', href: '#contact'},
        ]
    },

    hero: {
        avatar: 'assets/avatar.webp',
        avatarAlt: 'Photo de François Eoche',
        name: 'François Eoche',
        role: 'Ébéniste du Web',
        descriptions: [
            "Bonjour ! Je m'appelle François, je vis à Rennes, en France, avec plus de dix ans d'expérience dans la création d'interfaces web pour une grande variété d'entreprises et de types de projets.",
            "Passionné par le style, l'accessibilité et l'expérience utilisateur, ",
            "je suis titulaire d'un Master en informatique spécialisé en ergonomie des interfaces et TIC",
            'Parcourez mes travaux, projets personnels et activités — et n\'hésitez pas à me contacter !'
        ]
    },

    experience: [
        {
            startDate: 'Mars 2023',
            title: 'Design System Product Owner',
            company: {name: 'OVHcloud', url: 'https://www.ovhcloud.com/'},
            missions: [
                'Ensemble de bonnes pratiques de marque et de design, et composants UI',
                'Définition des composants, des priorités et de la roadmap',
            ]
        },
        {
            startDate: 'Octobre 2024',
            title: 'Référent accessibilité numérique',
            company: {name: 'OVHcloud', url: 'https://www.ovhcloud.com/'},
            missions: [
                'Définition de la stratégie d\'entreprise autour de l\'accessibilité web',
                'Audits RGAA, support et formations internes'
            ]
        },
        {
            startDate: 'Octobre 2019',
            endDate: 'Mars 2023',
            title: 'IT Technical Leader',
            company: {name: 'OVHcloud', url: 'https://www.ovhcloud.com/'},
            missions: [
                'Architecture front-end du tunnel de commande',
                'Revue de code & mentorat'
            ]
        },
        {
            startDate: 'Septembre 2017',
            endDate: 'Octobre 2019',
            title: 'Software Engineer',
            company: {name: 'OVHcloud', url: 'https://www.ovhcloud.com/'},
            missions: [
                'Amélioration et maintenance du front-end de l\'espace client',
                'Amélioration des performances et de la compatibilité multi-navigateurs'
            ]
        },
        {
            startDate: 'Septembre 2014',
            endDate: 'Août 2017',
            title: 'Ingénieur d\'études',
            company: {name: 'Niji', url: 'https://www.niji.fr/'},
            missions: [
                'Intégration d\'applications web et web hybrides',
                'Maintenance corrective et évolutive'
            ]
        },
        {
            startDate: 'Février 2014',
            endDate: 'Août 2014',
            title: 'Stage de fin d\'études',
            company: {name: 'Niji', url: 'https://www.niji.fr/'},
            missions: [
                'Prise en charge de tâches d\'intégration HTML/CSS/JS',
                'Maintenance corrective sur des produits en production'
            ]
        },
        {
            startDate: 'Mai 2013',
            endDate: 'Août 2013',
            title: 'Stage de première année de Master',
            company: {name: 'Ville de Rennes', url: 'https://metropole.rennes.fr/'},
            missions: [
                '<abbr title="Extract Transform Load">ETL</abbr> de données brutes distantes vers les bases de données des bibliothèques',
                'Ajout de la prise en charge de contenus multimédia aux notices documentaires'
            ]
        }
    ],

    diplomas: [
        {
            title: 'Certification Professional Scrum Master I (PSM I)',
            date: '2026',
            place: {name: 'Rhapsodies Conseil', url: 'https://www.rhapsodiesconseil.fr/'},
            details: [
                'Maîtrise de Scrum et de son application au développement logiciel'
            ]
        },
        {
            title: 'Certification accessibilité numérique',
            date: '2023',
            place: {name: 'Access 42', url: 'https://access42.net/'},
            details: [
                '« Développer des sites web accessibles et conformes au RGAA »'
            ]
        },
        {
            title: 'Master',
            date: '2014',
            place: {name: 'ISTIC – Université de Rennes 1', url: 'https://istic.univ-rennes.fr/'},
            details: [
                'Spécialité « ergonomie des interfaces et TIC »'
            ]
        },
        {
            title: '<a class="cv-item_link" href="https://www.certification-cles.fr" target="_blank" rel="noopener noreferrer"><abbr title="Certificat de compétences en Langues de l\'Enseignement Supérieur">CLES</abbr></a> - Niveau 2',
            date: '2014',
            place: {name: 'ISTIC – Université de Rennes 1', url: 'https://istic.univ-rennes.fr/'},
            details: [
                'Équivalent académique du test TOEIC'
            ]
        }
    ],

    projects: [
        {
            title: 'OVHcloud Design System',
            startDate: 'Juillet 2021',
            description: 'Utilisé sur plus de 200 applications OVHcloud par plus de 20 équipes',
            url: 'https://www.ovh.com/fr/order/dedicated'
        },
        {
            title: 'Tunnel de commande OVHcloud',
            startDate: 'Janvier 2018',
            endDate: 'Juin 2021',
            description: 'Refonte UI du parcours de commande, augmentant l\'adhérence client de 25 %',
            url: 'https://www.ovh.com/fr/order/dedicated'
        },
        {
            title: 'Espace client OVHcloud',
            startDate: 'Septembre 2017',
            endDate: 'Janvier 2018',
            description: 'Tableau de bord pour les clients utilisant produits et services OVHcloud',
            url: 'https://www.ovhtelecom.fr/manager/index.html#/'
        },
        {
            title: 'RegionsJob',
            startDate: 'Janvier 2017',
            endDate: 'Août 2017',
            description: 'Application hybride iOS/Android de recherche d\'emploi',
            url: 'https://www.regionsjob.com/'
        },
        {
            title: 'CableVision - Optimum',
            startDate: 'Novembre 2015',
            endDate: 'Janvier 2016',
            description: 'Tunnel de commande pour TV, mobile prépayé et services Internet',
            url: 'https://www.optimum.com/'
        },
        {
            title: 'Aon - Aon Auto',
            startDate: 'Octobre 2015',
            endDate: 'Novembre 2015',
            description: 'Application hybride iOS/Android de gestion d\'assurance sur des flottes de véhicules',
            url: 'https://www.aonassurances.com/Particuliers/Assurance/Gamme_auto/Auto_classique'
        },
        {
            title: 'Virgin Mobile - eBoutique',
            startDate: 'Mai 2015',
            endDate: 'Octobre 2015',
            description: 'Boutique en ligne présentant téléphones, forfaits mobiles prépayés et services Internet avec tunnel de commande',
            url: 'https://virginmobile.fr'
        },
        {
            title: 'ERDF - À mes côtés',
            startDate: 'Mars 2015',
            endDate: 'Mai 2015',
            description: 'Application hybride iOS, Android et Windows Phone offrant un accès à l\'auto-diagnostic en cas de coupure de courant, à la prévention des risques et aux coordonnées de contact',
            url: 'https://itunes.apple.com/fr/app/a-mes-cotes/id885458976'
        },
        {
            title: 'Natixis - Rouler Serein',
            startDate: 'Décembre 2014',
            endDate: 'Avril 2015',
            description: 'Application hybride iOS et Android proposant simulation d\'assurance, déclaration de sinistre et service client pour les véhicules des clients',
            url: 'https://itunes.apple.com/fr/app/rouler-serein/id547607719'
        },
        {
            title: 'Edelia - Site principal',
            startDate: 'Novembre 2014',
            endDate: 'Décembre 2014',
            description: 'Site web responsive présentant les offres professionnelles d\'Edelia en matière d\'énergie',
            url: 'https://www.edelia.fr'
        },
        {
            title: 'Bouygues Telecom - B.tv',
            startDate: 'Septembre 2014',
            endDate: 'Octobre 2014',
            description: 'Application Chromecast reliée à la BBox (Bouygues Telecom) afin d\'afficher les chaînes TV et replays compatibles',
            url: 'https://www.services.bouyguestelecom.fr/television/services-tv/b-tv'
        },
        {
            title: 'Femmes de Bretagne',
            startDate: 'Juillet 2014',
            endDate: 'Juillet 2014',
            description: 'Projet de création d\'un réseau social pour les femmes entrepreneuses en Bretagne',
            url: 'https://femmesdebretagne.fr'
        },
        {
            title: 'Banque Populaire',
            subtitle: 'Site mobile vitrine',
            startDate: 'Mars 2014',
            endDate: 'Septembre 2014',
            description: 'Site mobile responsive présentant les offres de la Banque Populaire — lié au site web desktop',
            url: 'https://www.banquepopulaire.fr'
        }
    ],

    talks: [
        {
            title: '<q>Comment une mauvaise UX a sauvé mon voyage</q>',
            date: 'Mai 2024',
            event: {name: 'RennesJS', url: 'https://rennesjs.org'},
            description: 'Récit sur l\'importance universelle de l\'expérience utilisateur des formulaires',
            link: {url: 'https://slides.com/feoche/mauvaise-ux-sauve-voyage', label: 'Voir les slides'}
        },
        {
            title: '<q>Les bookmarklets, c\'est chouette !</q>',
            date: 'Mars 2024',
            event: {name: 'RennesJS', url: 'https://rennesjs.org'},
            description: 'Conférence sur l\'utilisation des bookmarklets pour accélérer le développement front-end',
            link: {url: 'https://slides.com/feoche/les-bookmarklets-c-est-chouette', label: 'Voir les slides'}
        },
        {
            title: '<q>Un Design System pour les techs, c\'est possible ?</q>',
            date: 'Février 2023',
            event: {name: 'Very Tech Trip', url: 'https://events.ovhcloud.com/fr/very-tech-trip-2023-20230202/'},
            description: 'Conférence sur la manière de lancer un Design System d\'entreprise dans un environnement technique',
            link: {url: 'https://youtu.be/fYk4cr-u3g0', label: 'Voir sur YouTube'}
        },
        {
            title: '<q>PRANK, il fait un bot Twitter, ça tourne mal.</q>',
            date: 'Décembre 2017',
            event: {name: 'RennesJS', url: 'https://rennesjs.org'},
            description: 'Conférence sur la création d\'un bot Twitter avec le package twitter de NodeJS',
            link: {url: 'https://slides.com/feoche/digital-bot-twitter', label: 'Voir les slides'}
        },
        {
            title: '<q>Ionic - The Hybrid Theory</q>',
            date: 'Novembre 2015',
            event: {name: 'RennesJS', url: 'https://rennesjs.org'},
            description: 'Retour d\'expérience sur le développement mobile hybride avec Ionic en 2015',
            link: {url: 'https://slides.com/feoche/ionic-the-hybrid-theory', label: 'Voir les slides'}
        }
    ],

    extras: [
        {
            title: 'RennesJS',
            url: 'https://rennesjs.org',
            subtitle: 'Orga. de meetups',
            date: 'Depuis juillet 2017',
            details: [
                'Organisation de meetups',
                'En lien avec la <a href="https://lafrenchtech-rennes.fr" target="_blank" rel="noopener noreferrer">French Tech</a>'
            ]
        },
        {
            title: 'CSScade',
            url: 'https://csscade.fr',
            subtitle: 'Membre du bureau',
            date: 'Depuis novembre 2021',
            details: [
                'Construction de la communauté',
            ]
        },
        {
            title: 'Indie Collective',
            url: 'https://indieco.xyz',
            subtitle: 'Fondateur',
            date: 'Depuis mars 2017',
            details: [
                'Orga. de Game Jams',
                'Staff indé du <a href="https://stunfest.com/" target="_blank" rel="noopener noreferrer">Stunfest</a>',
            ]
        },
        {
            title: 'SpeedRennes',
            url: 'https://speedrennes.com',
            subtitle: 'Fondateur',
            date: 'Depuis décembre 2016',
            details: [
                'Commentaire de speedrun',
                'Animation de conférences'
            ]
        }
    ],

    contact: {
        intro: "Je suis toujours intéressé par des projets stimulants et de nouvelles opportunités.<br/>N'hésitez pas à me contacter !",
        methods: [
            {label: 'LinkedIn', url: 'https://www.linkedin.com/in/francois-eoche'},
            {label: 'Mail', url: 'mailto:francoiseoche at gmail dot com'},
            {label: 'Twitter', url: 'https://x.com/francoiseoche'},
            {label: 'GitHub', url: 'https://github.com/feoche'},
            {label: 'Codepen', url: 'https://codepen.io/feoche'}
        ]
    },

    footer: {
        text: '&copy; 2026 François Eoche&emsp;•&emsp;Score RGAA : partiellement accessible'
    }
};
