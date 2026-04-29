/**
 * Portfolio content data
 * Edit this file to update all website content without touching HTML structure.
 */
window.portfolioData = {
    navigation: {
        brandName: 'François Eoche',
        links: [
            {label: 'Experience', href: '#experience'},
            {label: 'Diplomas', href: '#diplomas'},
            {label: 'Projects', href: '#projects'},
            {label: 'Talks', href: '#talks'},
            {label: 'Extras', href: '#extras'},
            {label: 'Contact', href: '#contact'},
        ]
    },

    hero: {
        avatar: 'assets/avatar.webp',
        avatarAlt: 'Photo of François Eoche',
        name: 'François Eoche',
        role: 'Web Cabinetmaker',
        descriptions: [
            "Hi! I'm François, I'm based in Rennes, France, with over a decade of experience crafting web interfaces across a wide range of companies and project types.",
            'Passionate about styling, accessibility and user experience, ',
            'I hold a Masters degree in Computer Science with a focus on interface ergonomics and ICT',
            'Browse through my work, side projects and activities — and feel free to get in touch!'
        ]
    },

    experience: [
        {
            date: 'Since March 2023',
            title: 'Design System Product Owner',
            company: {name: 'OVHcloud', url: 'https://www.ovhcloud.com/'},
            missions: [
                'Set of brand and design best practices and UI components',
                'Component standards, priorities and roadmap definition',
                'Brand, design, PUs and engineering bridging',
            ]
        },
        {
            date: 'Since October 2024',
            title: 'Web accessibility representative',
            company: {name: 'OVHcloud', url: 'https://www.ovhcloud.com/'},
            missions: [
                'Company-wide strategy definition for web accessibility',
                'Internal RGAA audits',
                'Support and training',
            ]
        },
        {
            date: 'October 2019 - March 2023',
            title: 'IT Technical Leader',
            company: {name: 'OVHcloud', url: 'https://www.ovhcloud.com/'},
            missions: [
                'Order funnel front-end architecture',
                'Run tasks and support',
                'OVHcloud Design System team foundation'
            ]
        },
        {
            date: 'September 2017 - October 2019',
            title: 'Software Engineer',
            company: {name: 'OVHcloud', url: 'https://www.ovhcloud.com/'},
            missions: [
                'Order funnel front-end building and maintenance',
                'Improved performance and cross-browser compatibility',
                'Run tasks and support',
            ]
        },
        {
            date: 'September 2014 - August 2017',
            title: 'Research Engineer',
            company: {name: 'Niji', url: 'https://www.niji.fr/'},
            missions: [
                'Web and hybrid web applications integration',
                'Corrective and evolutionary maintenance',
                'Front-end technological development monitoring'
            ]
        },
        {
            date: 'February 2014 - August 2014',
            title: 'End-of-studies Internship',
            company: {name: 'Niji', url: 'https://www.niji.fr/'},
            missions: [
                'Joined existing teams on web and mobile projects',
                'HTML/CSS/JS integration tasks handling',
                'Corrective maintenance on live products'
            ]
        },
        {
            date: 'May 2013 - August 2013',
            title: 'First year of Masters Internship',
            company: {name: 'Ville de Rennes', url: 'https://metropole.rennes.fr/'},
            missions: [
                '<abbr title="Extract Transform Load">ETL</abbr> of remote raw data into library databases',
                'Added rich media support to documentary records',
                'Contributed to IT helpdesk operations'
            ]
        }
    ],

    diplomas: [
        {
            title: 'Masters degree',
            date: '2014',
            place: {name: 'ISTIC – University of Rennes 1', url: 'https://istic.univ-rennes.fr/'},
            details: [
                'With "Good" distinction',
                'Special emphasis on interface ergonomics and ICT'
            ]
        },
        {
            title: '<a class="cv-item_link" href="https://www.certification-cles.fr" target="_blank" rel="noopener noreferrer"><abbr title="Certificat de compétences en Langues de l\'Enseignement Supérieur">CLES</abbr></a> - Level 2',
            date: '2014',
            place: {name: 'ISTIC – University of Rennes 1', url: 'https://istic.univ-rennes.fr/'},
            details: [
                'Academic equivalent of the TOEIC test',
                '~785+ TOEIC points'
            ]
        }
    ],

    projects: [
        {
            title: 'OVHcloud Design System',
            date: 'Since July 2021',
            description: 'OVHcloud Design System is a collection of reusable components, designed to be used mostly in the OVHcloud platform',
            url: 'https://www.ovh.com/fr/order/dedicated'
        },
        {
            title: 'OVHcloud Order funnel',
            date: 'January 2018 - June 2021',
            description: 'Responsive website for customer ordering OVHcloud\'s services',
            url: 'https://www.ovh.com/fr/order/dedicated'
        },
        {
            title: 'OVHcloud Customer space',
            date: 'September 2017 - January 2018',
            description: 'Responsive website for customer management with OVH\'s services',
            url: 'https://www.ovhtelecom.fr/manager/index.html#/'
        },
        {
            title: 'RegionsJob',
            date: 'August 2017 - January 2017',
            description: 'Hybrid app on iOS/Android for job listing/job searching',
            url: 'https://www.regionsjob.com/'
        },
        {
            title: 'CableVision - Optimum',
            date: 'January 2016 - November 2015',
            description: 'Responsive website presenting TV, mobile pre-paid and Internet services of the american company',
            url: 'https://www.optimum.com/'
        },
        {
            title: 'Aon - Aon Auto',
            date: 'November 2015 - October 2015',
            description: 'Hybrid app on iOS/Android for insurance handling on vehicule fleets',
            url: 'https://www.aonassurances.com/Particuliers/Assurance/Gamme_auto/Auto_classique'
        },
        {
            title: 'Virgin Mobile - eBoutique',
            date: 'October 2015 - May 2015',
            description: 'eShop presenting phone, mobile pre-paid and Internet services with order funnel',
            url: 'https://virginmobile.fr'
        },
        {
            title: 'ERDF - A mes côtés',
            date: 'May 2015 - March 2015',
            description: 'Hybrid app for iOS, Android and Windows Phone displaying access to self-diagnostic in case of power outage, risk prevention and contact infos',
            url: 'https://itunes.apple.com/fr/app/a-mes-cotes/id885458976'
        },
        {
            title: 'Natixis - Rouler Serein',
            date: 'April 2015 - December 2014',
            description: 'Hybrid app for iOS and Android suggesting insurance simulation, insurance claim and customer service for customer vehicles',
            url: 'https://itunes.apple.com/fr/app/rouler-serein/id547607719'
        },
        {
            title: 'Edelia - Main website',
            date: 'Since November 2014',
            description: 'Responsive website displaying Edelia professional offers for energy',
            url: 'https://www.edelia.fr'
        },
        {
            title: 'Bouygues Telecom - B.tv',
            date: 'October 2014 - September 2014',
            description: 'Chromecast app linked to the BBox (Bouygues Telecom) in order to display compatible TV channels/replays',
            url: 'https://www.services.bouyguestelecom.fr/television/services-tv/b-tv'
        },
        {
            title: 'Femmes de Bretagne',
            date: 'October 2014 - July 2014',
            description: 'Social network creation project for women entrepreneurs in Brittany',
            url: 'https://femmesdebretagne.fr'
        },
        {
            title: 'Banque Populaire',
            subtitle: 'Showcase mobile site',
            date: 'September 2014 - March 2014',
            description: 'Responsive mobile website presenting Banque Populaire offers — related to the desktop website',
            url: 'https://www.banquepopulaire.fr'
        },/*
        {
            title: 'Bibliothèque de Rennes Métropole',
            subtitle: 'Encore catalog',
            date: 'Since July 2013',
            description: 'Enhancement of documentary notes into the web catalog of Rennes Métropole libraries <a href="https://opac.si.leschampslibres.fr" target="_blank">(Encore)</a> thanks to enriched content coming from <a href="https://www.babelio.com" target="_blank">Babelio</a> database',
            url: 'https://opac.si.leschampslibres.fr/'
        },
        {
            title: 'Master 2',
            subtitle: 'Android app : OuSuij',
            date: 'November 2013 - August 2013',
            description: 'Creation of an Android app/game based on Google Maps and Google Street View APIs (vaguely similar to <a href="https://geoguessr.com" target="_blank">GeoGuessr</a> game)'
        },
        {
            title: 'Master 1 dissertation',
            subtitle: 'Touchscreens',
            date: 'May 2014 - December 2013',
            description: 'Presentation of a report summarizing the numerous usages around new tech in touchscreen scale'
        },
        {
            title: 'Master 1',
            subtitle: '&lt;IMG++&gt; project',
            date: 'April 2013 - August 2012',
            description: 'Creation of a special HTML5-compatible tag that can handle "enhanced" pictures (HDR format, panoramas, 3D, etc.)'
        }*/
    ],

    talks: [
        {
            title: '<q>Comment une mauvaise UX a sauvé mon voyage</q>',
            date: 'May 2024',
            event: {name: 'RennesJS', url: 'https://rennesjs.org'},
            description: 'Story telling about how universal form user experience is key (in French)',
            link: {url: 'https://slides.com/feoche/mauvaise-ux-sauve-voyage', label: 'View Slides'}
        },
        {
            title: '<q>Les bookmarklets, c\'est chouette !</q>',
            date: 'March 2024',
            event: {name: 'RennesJS', url: 'https://rennesjs.org'},
            description: 'Conference on usage of bookmarklets to speed up front-end development (in French)',
            link: {url: 'https://slides.com/feoche/les-bookmarklets-c-est-chouette', label: 'View Slides'}
        },
        {
            title: '<q>Un Design System pour les techs, c\'est possible ?</q>',
            date: 'February 2023',
            event: {name: 'Very Tech Trip', url: 'https://events.ovhcloud.com/fr/very-tech-trip-2023-20230202/'},
            description: 'Conference about how to kickstart a company Design System in a technical environment (in French)',
            link: {url: 'https://youtu.be/fYk4cr-u3g0', label: 'Watch on YouTube'}
        },
        {
            title: '<q>PRANK, il fait un bot Twitter, ça tourne mal.</q>',
            date: 'December 2017',
            event: {name: 'RennesJS', url: 'https://rennesjs.org'},
            description: 'Conference on how to create a Twitter bot using NodeJS twitter package',
            link: {url: 'https://slides.com/feoche/digital-bot-twitter', label: 'View Slides'}
        },
        {
            title: '<q>Ionic - The Hybrid Theory</q>',
            date: 'November 2015',
            event: {name: 'RennesJS', url: 'https://rennesjs.org'},
            description: 'Experience feedback about hybrid mobile development with Ionic in 2015 (in French)',
            link: {url: 'https://slides.com/feoche/ionic-the-hybrid-theory', label: 'View Slides'}
        }
    ],

    extras: [
        {
            title: 'RennesJS',
            url: 'https://rennesjs.org',
            subtitle: 'Meetup organizer',
            date: 'Since July 2017',
            details: [
                'Meetup organization',
                'In touch with <a href="https://lafrenchtech-rennes.fr" target="_blank" rel="noopener noreferrer">French Tech</a>'
            ]
        },
        {
            title: 'CSScade',
            url: 'https://csscade.fr',
            subtitle: 'In board',
            date: 'Since November 2021',
            details: [
                'Community construction',
                'Meetup organization',
            ]
        },
        {
            title: 'Indie Collective',
            url: 'https://indieco.xyz',
            subtitle: 'Founder',
            date: 'Since March 2017',
            details: [
                'Game Jams organizer',
                '<a href="https://stunfest.com/" target="_blank" rel="noopener noreferrer">Stunfest</a> indie staff',
            ]
        },
        {
            title: 'SpeedRennes',
            url: 'https://speedrennes.com',
            subtitle: 'Founder',
            date: 'Since December 2016',
            details: [
                'Speedrun commentary',
                'Conferences host'
            ]
        }
    ],

    contact: {
        intro: "I'm always interested in hearing about new opportunities and exciting projects.<br/>Feel free to reach out!",
        methods: [
            {label: 'LinkedIn', url: 'https://www.linkedin.com/in/francois-eoche'},
            {label: 'Mail', url: 'mailto:francoiseoche at gmail dot com'},
            {label: 'Twitter', url: 'https://x.com/francoiseoche'},
            {label: 'GitHub', url: 'https://github.com/feoche'},
            {label: 'Codepen', url: 'https://codepen.io/feoche'}
        ]
    },

    footer: {
        text: '&copy; 2026 François Eoche&emsp;•&emsp;RGAA score : partially accessible'
    }
};
