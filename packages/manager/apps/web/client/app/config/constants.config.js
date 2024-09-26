module.exports = {
  EU: {
    RENEW_URL:
      'https://eu.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
    HOSTING: {
      OFFERS: {
        START_10_M: {
          TYPE_VALUE: 'START_10_M',
          LIST_VALUE: 'START',
        },
      },
      MODULES: {
        DEFAULT_INSTALL_PATH: './www/',
      },
    },
    DOMAIN: {
      domainUnlockRegistry: {
        PT: 'https://registo.dns.pt',
        LT: 'http://www.domreg.lt/public?sp=tradelt',
        LV: 'https://www.nic.lv/en/',
      },
    },
    TOP_GUIDES: {
      domainHosting: [
        {
          title: 'core_top_guide_2_title',
          label: 'TopGuide-Web-2',
          url:
            'https://docs.ovh.com/fr/hosting/premiers-pas-avec-hebergement-web/',
        },
        {
          title: 'core_top_guide_3_title',
          label: 'TopGuide-Web-3',
          url:
            'https://docs.ovh.com/fr/emails/generalites-sur-les-emails-mutualises/',
        },
        {
          title: 'core_top_guide_5_title',
          label: 'TopGuide-Web-5',
          url: 'https://docs.ovh.com/fr/hosting/modules-en-1-clic/',
        },
        {
          title: 'core_top_guide_6_title',
          label: 'TopGuide-Web-6',
          url: 'https://docs.ovh.com/fr/domains/editer-ma-zone-dns/',
        },
        {
          title: 'core_top_guide_7_title',
          label: 'TopGuide-Web-7',
          url: 'https://docs.ovh.com/fr/hosting/erreur-site-non-installe/',
        },
        {
          title: 'core_top_guide_database_title',
          label: 'TopGuide-Web-8',
          url: 'https://docs.ovh.com/fr/hosting/creer-base-de-donnees/',
        },
        {
          title: 'core_top_guide_9_title',
          label: 'TopGuide-Web-9',
          url:
            'https://docs.ovh.com/fr/microsoft-collaborative-solutions/migration-adresse-e-mail-mutualisee-vers-exchange/',
        },
      ],
    },
    URLS: {
      CZ: {
        support: 'http://www.ovh.cz/podpora/',
        guides: {
          home: 'http://prirucky.ovh.cz/',
          all: 'https://docs.ovh.com/cz/cs/',
          hostingPhpConfiguration:
            'https://www.ovh.cz/g1999.hosting_how_to_configure_php_from_your_customer_account',
          hostingPrivateDatabaseDBaaS: {
            beginner: 'https://docs.ovh.com/cz/cs/clouddb/zaciname-s-clouddb/',
            db:
              'https://docs.ovh.com/cz/cs/clouddb/zaciname-s-mysql-a-mariadb/',
            beginPostgre:
              'https://docs.ovh.com/cz/cs/clouddb/zaciname-s-postgresql/',
          },
          emailsCreation: 'https://www.ovh.cz/g1343.qssq',
          wordpress:
            'https://codex.wordpress.org/Getting_Started_with_WordPress',
          prestashop:
            'http://doc.prestashop.com/display/PS16/English+documentation',
          siteOnline:
            'https://www.ovh.cz/g1374.mutualise_mettre_mon_site_en_ligne',
          phpAppendices: 'http://php.net/manual/en/appendices.php',
          works: {
            apache:
              'https://community.ovh.com/t/faq-how-can-i-update-my-website-to-support-apache-2-4/3851',
          },
        },
        dnssec_service: 'http://www.ovh.cz/domeny/sluzba_dnssec.xml',
        domainOrderChange: 'https://www.ovh.cz/cgi-bin/newOrder/order.cgi',
        domainOrderTrade:
          "https://www.ovh.cz/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        changeOwner:
          'https://www.ovh.cz/cgi-bin/procedure/procedureChangeOwner.cgi',
        bulkChangeOwner:
          'https://www.ovh.cz/order/domain/#/legacy/domain/trade/list',
        exchangeOrder: 'https://www.ovh.cz/emails/hosted-exchange-2013/',
        start10mMarket:
          'https://www.ovh.cz/domeny/nabidka_hosting_start10m.xml',
      },
      DE: {
        support: 'http://www.ovh.de/support/',
        support_contact: 'http://www.ovh.de/support/',
        guides: {
          home: 'http://hilfe.ovh.de/',
          all: 'https://docs.ovh.com/de/de/',
          emailsConfiguration:
            'https://www.ovh.de/g1474.allgemeine-informationen-ovh-webhosting-mails',
          autoRenew: 'https://www.ovh.de/g1271.renew',
          emailsCreation: 'https://www.ovh.de/g1343.qssq',
          hostingPhpConfiguration:
            'https://www.ovh.de/g1999.webhosting_so_andern_sie_die_php-version_von_ihrem_kundencenter_aus',
          hostingPrivateDatabase:
            'https://www.ovh.de/g2023.alles_wissenswerte_zum_sql_private_angebot',
          hostingPrivateDatabaseDBaaS: {
            beginner:
              'https://docs.ovh.com/de/clouddb/erste-schritte-mit-clouddb/',
            db:
              'https://docs.ovh.com/de/clouddb/erste-schritte-mit-mysql-und-mariadb/',
            beginPostgre:
              'https://docs.ovh.com/de/clouddb/erste-schritte-mit-postgresql/',
          },
          hostingPrivateDatabaseConfiguration:
            'https://docs.ovh.com/de/hosting/konfigurieren-ihres-datenbank-servers/#mysql-und-mariadb-instanzen',
          wordpress:
            'https://codex.wordpress.org/de:Erste_Schritte_mit_WordPress',
          prestashop:
            'http://doc.prestashop.com/display/PS16/Deutsche+Dokumentation',
          phpAppendices: 'http://php.net/manual/de/appendices.php',
          works: {
            apache:
              'https://community.ovh.com/t/faq-how-can-i-update-my-website-to-support-apache-2-4/3851',
          },
        },
        dnssec_service: 'https://www.ovh.de/domains/dnssec_dienst.xml',
        domainOrderChange: 'https://www.ovh.de/cgi-bin/newOrder/order.cgi',
        changeOwner:
          'https://www.ovh.de/cgi-bin/procedure/procedureChangeOwner.cgi',
        bulkChangeOwner:
          'https://www.ovh.de/order/domain/#/legacy/domain/trade/list',
        domainOrderTrade:
          "https://www.ovh.de/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        exchangeOrder: 'https://www.ovh.de/emails/hosted-exchange/',
        start10mMarket:
          'https://www.ovh.de/domains/angebot_hosting_start10m.xml',
      },
      ES: {
        support: 'http://www.ovh.es/soporte/',
        support_contact: 'http://www.ovh.es/soporte/',
        guides: {
          home: 'http://guias.ovh.es/',
          all: 'https://docs.ovh.com/es/web/',
          emailsConfiguration:
            'https://www.ovh.es/g1474.correo-alojamiento-compartido-ovh',
          emailsCreation: 'https://www.ovh.es/g1343.qssq',
          hostingPhpConfiguration:
            'https://www.ovh.es/g1999.alojamiento_compartido_configurar_la_versión_de_PHP_desde_el_área_de_cliente',
          hostingPrivateDatabase:
            'https://www.ovh.es/g2023.todo_sobre_el_sql_privado',
          hostingPrivateDatabaseDBaaS: {
            beginner: 'https://docs.ovh.com/es/clouddb/empezar-con-clouddb/',
            db: 'https://docs.ovh.com/es/clouddb/empezar-con-mysql-y-mariadb/',
            beginPostgre:
              'https://docs.ovh.com/es/clouddb/empezar-con-postgresql/',
          },
          hostingPrivateDatabaseConfiguration:
            'https://docs.ovh.com/es/hosting/configurar-optimizar-su-servidor-de-base-de-datos/#instancia-mysql-y-mariadb',
          wordpress:
            'https://codex.wordpress.org/es:Getting_Started_with_WordPress',
          prestashop:
            'http://doc.prestashop.com/pages/viewpage.action?pageId=26148899',
          siteOnline:
            'https://www.ovh.es/g1374.web_hosting_publicar_un_sitio_web_en_internet',
          phpAppendices: 'http://php.net/manual/en/appendices.php',
          works: {
            apache:
              'https://community.ovh.com/t/faq-how-can-i-update-my-website-to-support-apache-2-4/3851',
          },
        },
        dnssec_service: 'https://www.ovh.es/dominios/servicio-dnssec.xml',
        domainOrderChange: 'https://www.ovh.es/cgi-bin/newOrder/order.cgi',
        domainOrderTrade:
          "https://www.ovh.es/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        changeOwner:
          'https://www.ovh.es/cgi-bin/procedure/procedureChangeOwner.cgi',
        bulkChangeOwner:
          'https://www.ovh.es/order/domain/#/legacy/domain/trade/list',
        exchangeOrder: 'https://www.ovh.es/emails/hosted-exchange/',
        start10mMarket:
          'https://www.ovh.es/dominios/oferta_hosting_start10m.xml',
      },
      FI: {
        support: 'http://www.ovh-hosting.fi/tuki/',
        support_contact: 'http://www.ovh-hosting.fi/tuki/',
        guides: {
          home: 'http://ohjeet.ovh-hosting.fi/',
          all: 'https://docs.ovh.com/fi/fi/',
          emailsConfiguration:
            'https://www.ovh-hosting.fi/g1474.yleista-ovh-webhotellit-sahkopostit',
          emailsCreation: 'https://www.ovh-hosting.fi/g1343.qssq',
          hostingPrivateDatabase:
            'https://www.ovh-hosting.fi/g2023.kaikki_mita_tarvitsee_tietaa_sql_private_-palvelusta',
          hostingPrivateDatabaseDBaaS: {
            beginner:
              'https://docs.ovh.com/fi/clouddb/clouddb-palvelun-kayton-aloitus/',
            db:
              'https://docs.ovh.com/fi/clouddb/mysql-ja-mariadb-tietokantojen-kayton-aloitus/',
            beginPostgre:
              'https://docs.ovh.com/fi/clouddb/postgresql-tietokantojen-kayton-aloitus/',
          },
          dnsForExternalDomain:
            'https://www.ovh-hosting.fi/g2229.dns-alueen_luominen_ulkopuoliselle_verkkotunnukselle',
          wordpress:
            'https://codex.wordpress.org/Getting_Started_with_WordPress',
          prestashop:
            'http://doc.prestashop.com/display/PS16/English+documentation',
          siteOnline:
            'https://www.ovh-hosting.fi/g1374.webhotellit_kotisivujen_siirto_verkkoon',
          phpAppendices: 'http://php.net/manual/en/appendices.php',
          works: {
            apache:
              'https://community.ovh.com/t/faq-how-can-i-update-my-website-to-support-apache-2-4/3851',
          },
        },
        dnssec_service:
          'http://www.ovh-hosting.fi/verkkotunnukset/dnssec_palvelu.xml',
        domainOrderChange:
          'https://www.ovh-hosting.fi/cgi-bin/newOrder/order.cgi',
        domainOrderTrade:
          "https://www.ovh-hosting.fi/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        changeOwner:
          'https://www.ovh.com/cgi-bin/fi/procedure/procedureChangeOwner.cgi',
        bulkChangeOwner:
          'https://www.ovh-hosting.fi/order/domain/#/legacy/domain/trade/list',
        exchangeOrder:
          'https://www.ovh-hosting.fi/sahkopostit/hosted-exchange/',
        start10mMarket:
          'https://www.ovh-hosting.fi/verkkotunnukset/start10m_webhotelli_tuote.xml',
      },
      FR: {
        support: 'https://www.ovh.com/fr/support/',
        support_contact: 'https://www.ovh.com/fr/support/nous-contacter/',
        guides: {
          home: 'https://docs.ovh.com',
          all: 'https://docs.ovh.com/fr/web/',
          autoRenew:
            'https://www.ovh.com/fr/g1271.guide_dutilisation_du_renouvellement_automatique_ovh',
          hostingCron:
            'https://www.ovh.com/fr/g1990.mutualise_taches_automatisees_cron',
          hostingFtp:
            'https://docs.ovh.com/fr/hosting/connexion-espace-stockage-ftp-hebergement-web/',
          hostingModule: 'https://docs.ovh.com/fr/hosting/modules-en-1-clic/',
          hostingScriptEmail:
            'https://www.ovh.com/fr/g1974.mutualise_suivi_des_emails_automatises',
          hostingStatsLogs:
            'https://www.ovh.com/fr/g1344.mutualise_consulter_les_statistiques_et_les_logs_de_mon_site',
          hostingPhpConfiguration:
            'https://docs.ovh.com/fr/fr/web/hosting/mutualise-configurer-la-version-de-php-depuis-votre-espace-client/',
          hostingPrivateDatabase:
            'https://docs.ovh.com/fr/hosting/premiers-pas-avec-sql-prive/',
          hostingPrivateDatabaseDBaaS: {
            beginner:
              'https://docs.ovh.com/fr/fr/cloud/clouddb/debuter-avec-clouddb/',
            db:
              'https://docs.ovh.com/fr/fr/cloud/clouddb/demarrez-avec-mysql-et-mariadb/',
            beginPostgre:
              'https://docs.ovh.com/fr/fr/cloud/clouddb/demarrez-avec-postgresql/',
          },
          hostingPrivateDatabaseConfiguration:
            'https://docs.ovh.com/fr/hosting/configurer-optimiser-son-serveur-de-base-de-donnees/#instance-mysql-et-mariadb',
          emailsConfiguration: 'https://docs.ovh.com/fr/fr/web/emails/',
          emailsConfigurationAuto: 'https://mail.ovh.net/auto/',
          emailsConfigurationMacMountainLion:
            'https://docs.ovh.com/fr/fr/web/emails/configuration-email-mutu-mail-de-mac/',
          emailsConfigurationMacMavericksAndYosemite:
            'https://docs.ovh.com/fr/fr/web/emails/guide-configuration-mail-de-mac-mavericks-et-yosemite/',
          emailsConfigurationMacElCapitain:
            'https://docs.ovh.com/fr/fr/web/emails/guide-configuration-mail-de-mac-el-capitan/',
          emailsConfigurationOutlook2007:
            'https://docs.ovh.com/fr/fr/web/emails/mail-mutualise-guide-configuration-outlook-2007/',
          emailsConfigurationOutlook2010:
            'https://docs.ovh.com/fr/fr/web/emails/mail-mutualise-guide-configuration-outlook-2010/',
          emailsConfigurationOutlook2013:
            'https://docs.ovh.com/fr/fr/web/emails/mail-mutualise-guide-configuration-outlook-2013/',
          emailsConfigurationOutlook2016:
            'https://docs.ovh.com/fr/fr/web/emails/configuration-outlook-2016/',
          emailsConfigurationIos9:
            'https://docs.ovh.com/fr/fr/web/emails/mail-mutualise-guide-configuration-iphone-ios-91/',
          emailsConfigurationAndroid6:
            'https://docs.ovh.com/fr/fr/web/emails/configuration-android-6/',

          emailsCreation:
            'https://www.ovh.com/fr/g1343.creation-adresse-e-mail',
          emailsMigrateToExchange:
            'https://docs.ovh.com/fr/microsoft-collaborative-solutions/migration-adresse-e-mail-mutualisee-vers-exchange/',
          emailsCreateMailingListGuide:
            'https://www.ovh.com/fr/g1596.mail_mutualise_guide_dutilisation_mailing-list',
          office365:
            'https://help.ovhcloud.com/csm/fr-microsoft-office365-csp1?id=kb_article_view&sysparm_article=KB0053507',
          hostingHackState:
            'https://www.ovh.com/fr/g1392.procedure-fermeture-hack-ovh#reouverture_de_lhebergement_reouverture_suite_passage_en_etat_hack',
          hostingDisabledState:
            'https://www.ovh.com/fr/g1392.procedure-fermeture-hack-ovh#reouverture_de_lhebergement_reouverture_suite_passage_en_etat_desactive',
          additionalDisksGuide:
            'https://www.ovh.com/fr/g2181.Commande_et_utilisation_d_un_disque_additionnel',
          dnsForExternalDomain:
            'https://www.ovh.com/fr/g2229.creer_une_zone_dns_pour_un_domaine_externe',
          wordpress:
            'https://codex.wordpress.org/fr:Premiers_pas_avec_WordPress',
          prestashop:
            'http://doc.prestashop.com/display/PS16/Guide+de+l%27utilisateur',
          siteOnline:
            'https://www.ovh.com/fr/g1374.mutualise_mettre_mon_site_en_ligne',
          domainOwoActivation:
            'https://www.ovh.com/fr/g2137.whois_-_activation_de_owo',
          domainOwnerTransfert:
            'https://docs.ovh.com/fr/domains/changement-proprietaire-domaine/',
          domainEditZone: 'https://docs.ovh.com/fr/domains/editer-ma-zone-dns/',
          domainDnsGettingStarted:
            'https://docs.ovh.com/fr/domains/generalites-serveurs-dns/',
          domainZonecheck:
            'https://docs.ovh.com/fr/domains/zonecheck-de-votre-domaine/',
          domainRedirection:
            'https://docs.ovh.com/fr/domains/redirection-nom-de-domaine/',
          domainDynHost: 'https://docs.ovh.com/fr/domains/utilisation-dynhost/',
          domainGlueRegistry: 'https://docs.ovh.com/fr/domains/glue-registry/',
          domainDsRecord:
            'https://www.ovh.com/fr/g609.securiser_votre_domaine_avec_dnssec',
          domainAddDnsZone:
            'https://www.ovh.com/fr/g2229.creer_une_zone_dns_pour_un_domaine_externe',
          phpAppendices: 'http://php.net/manual/fr/appendices.php',
          works: {
            apache:
              'https://community.ovh.com/t/faq-comment-mettre-a-jour-mon-site-pour-supporter-apache-2-4/3850',
          },
        },
        dnssec_service: 'https://www.ovh.com/fr/domaines/service_dnssec.xml',
        domainOrderChange: 'https://www.ovh.com/fr/cgi-bin/newOrder/order.cgi',
        domainOrderTrade:
          "https://www.ovh.com/fr/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        domainWebmailUrl: 'https://mail.ovh.net/',
        domainOMMUrl: 'https://omm.ovh.net/',
        changeOwner:
          'https://www.ovh.com/cgi-bin/fr/procedure/procedureChangeOwner.cgi',
        bulkChangeOwner:
          'https://www.ovh.com/fr/order/domain/#/legacy/domain/trade/list',
        emailsOrder: 'https://www.ovh.com/emails/',
        exchangeOrder: 'https://www.ovh.com/fr/emails/hosted-exchange/',
        start10mMarket:
          'https://www.ovh.com/fr/domaines/offre_hebergement_start10m.xml',
      },
      GB: {
        support: 'http://www.ovh.co.uk/support/',
        support_contact: 'http://www.ovh.co.uk/support/',
        guides: {
          home: 'http://help.ovh.co.uk/',
          all: 'https://docs.ovh.com/gb/en/',
          emailsConfiguration:
            'https://www.ovh.co.uk/g1474.ovh-mails-general-use',
          autoRenew: 'https://www.ovh.co.uk/g1271.renew',
          emailsCreation: 'https://www.ovh.co.uk/g1343.qssq',
          hostingPhpConfiguration:
            'https://www.ovh.co.uk/g1999.hosting_how_to_configure_php_from_your_customer_account',
          hostingPrivateDatabase:
            'https://www.ovh.co.uk/g2023.what_you_need_to_know_about_private_sql',
          hostingPrivateDatabaseDBaaS: {
            beginner:
              'https://docs.ovh.com/gb/en/clouddb/getting-started-with-clouddb/',
            db:
              'https://docs.ovh.com/gb/en/clouddb/get-started-with-mysql-and-mariadb/',
            beginPostgre:
              'https://docs.ovh.com/gb/en/clouddb/getting-started-with-postgresql/',
          },
          hostingPrivateDatabaseConfiguration:
            'https://docs.ovh.com/gb/en/hosting/configure-optimise-database-server/#mysql-and-mariadb-instances',
          wordpress:
            'https://codex.wordpress.org/Getting_Started_with_WordPress',
          prestashop:
            'http://doc.prestashop.com/display/PS16/English+documentation',
          phpAppendices: 'http://php.net/manual/en/appendices.php',
          works: {
            apache:
              'https://community.ovh.com/t/faq-how-can-i-update-my-website-to-support-apache-2-4/3851',
          },
        },
        dnssec_service: 'https://www.ovh.co.uk/domains/dnssec_service.xml',
        domainOrderChange: 'https://www.ovh.co.uk/cgi-bin/newOrder/order.cgi',
        domainOrderTrade:
          "https://www.ovh.co.uk/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        changeOwner:
          'https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi',
        bulkChangeOwner:
          'https://www.ovh.co.uk/order/domain/#/legacy/domain/trade/list',
        exchangeOrder: 'https://www.ovh.co.uk/emails/hosted-exchange/',
      },
      IE: {
        domainOrderTrade:
          "https://www.ovh.ie/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        bulkChangeOwner:
          'https://www.ovh.ie/order/domain/#/legacy/domain/trade/list',
        guides: {
          hostingPhpConfiguration:
            'https://www.ovh.ie/g1999.hosting_how_to_configure_php_from_your_customer_account',
          works: {
            apache:
              'https://community.ovh.com/t/faq-how-can-i-update-my-website-to-support-apache-2-4/3851',
          },
        },
      },
      IT: {
        support: 'http://www.ovh.it/supporto/',
        support_contact: 'http://www.ovh.it/supporto/',
        guides: {
          home: 'http://guida.ovh.it/',
          all: 'https://docs.ovh.com/it/it/',
          emailsConfiguration:
            'https://www.ovh.it/g1474.info-email-condivise-ovh',
          emailsCreation: 'https://www.ovh.it/g1343.qssq',

          emailsConfigurationMacMountainLion:
            'https://www.ovh.it/g1287.configurazione-mail-macos',
          emailsConfigurationMacMavericksAndYosemite:
            'https://www.ovh.it/g1599.email_condivisa_guida_alla_configurazione_email_per_mac-_mavericks_e_yosemite',
          emailsConfigurationMacElCapitain:
            'https://www.ovh.it/hosting/guides/g1965.servizio_email_guida_alla_configurazione_su_mail_di_mac_-_el_capitan',
          emailsConfigurationOutlook2007:
            'https://www.ovh.it/g1298.servizio_email_guida_alla_configurazione_di_outlook_2007',
          emailsConfigurationOutlook2010:
            'https://www.ovh.it/g1299.servizio_email_guida_alla_configurazione_di_outlook_2010',
          emailsConfigurationOutlook2013:
            'https://www.ovh.it/hosting/guides/g1286.servizio_email_guida_alla_configurazione_di_outlook_2013',
          emailsConfigurationIos9:
            'https://www.ovh.it/g2004.servizio_email_guida_configurazione_iphone_ios_91',
          emailsConfigurationAndroid6:
            'https://www.ovh.it/hosting/guides/g1912.servizio_email_guida_alla_configurazione_di_uno_smartphone_con_51',

          autoRenew:
            'https://www.ovh.it/g1271.imposta_il_rinnovo_automatico_dei_tuoi_servizi_ovh',
          emailsCreateMailingListGuide:
            'https://www.ovh.it/g1596.mail_mutualise_guide_dutilisation_mailing-list',
          hostingPhpConfiguration:
            'https://www.ovh.it/g1999.configura_la_tua_versione_di_php_dal_tuo_Spazio_Cliente_OVH',
          hostingPrivateDatabase:
            'https://www.ovh.it/g2023.tutto_sullsql_privato',
          hostingPrivateDatabaseDBaaS: {
            beginner:
              'https://docs.ovh.com/it/clouddb/come-utilizzare-clouddb/',
            db:
              'https://docs.ovh.com/it/clouddb/come-utilizzare-mysql-e-mariadb/',
            beginPostgre:
              'https://docs.ovh.com/it/clouddb/come-utilizzare-postgresql/',
          },
          hostingPrivateDatabaseConfiguration:
            'https://docs.ovh.com/it/hosting/configurare-ottimizzare-il-tuo-database-server/#istanza-mysql-e-mariadb',
          wordpress:
            'https://codex.wordpress.org/Getting_Started_with_WordPress',
          prestashop:
            'http://doc.prestashop.com/display/PS16/English+documentation',
          siteOnline:
            'https://www.ovh.it/g1374.hosting_condiviso_come_mettere_online_il_tuo_sito',
          phpAppendices: 'http://php.net/manual/en/appendices.php',
          works: {
            apache:
              'https://community.ovh.com/t/faq-how-can-i-update-my-website-to-support-apache-2-4/3851',
          },
        },
        dnssec_service: 'http://www.ovh.it/domini/servizio_dnssec.xml',
        domainOrderChange: 'https://www.ovh.it/cgi-bin/newOrder/order.cgi',
        domainOrderTrade:
          "https://www.ovh.it/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        changeOwner:
          'https://www.ovh.it/cgi-bin/procedure/procedureChangeOwner.cgi',
        bulkChangeOwner:
          'https://www.ovh.it/order/domain/#/legacy/domain/trade/list',
        exchangeOrder: 'https://www.ovh.it/emails/hosted-exchange/',
        start10mMarket:
          'https://www.ovh.it/domini/offerta_hosting_start10m.xml',
      },
      LT: {
        support: 'http://www.ovh.lt/pagalba/',
        support_contact: 'http://www.ovh.lt/pagalba/',
        guides: {
          home: 'http://gidai.ovh.lt/',
          all: 'https://docs.ovh.com/lt/lt/',
          autoRenew: 'https://www.ovh.lt/g1271.renew',
          emailsCreation: 'https://www.ovh.lt/g1343.qssq',
          emailsCreateMailingListGuide:
            'https://www.ovh.lt/g1596.mail_mutualise_guide_dutilisation_mailing-list',
          hostingPhpConfiguration:
            'https://www.ovh.lt/g1999.PHP-versijos-keitimas-kliento-sasajoje',
          hostingPrivateDatabase:
            'https://www.ovh.lt/g2023.viskas_apie_private_sql_paslauga',
          hostingPrivateDatabaseDBaaS: {
            beginner: 'https://docs.ovh.com/lt/clouddb/pradzia-su-clouddb/',
            db: 'https://docs.ovh.com/lt/clouddb/mysql-mariadb-naudojimas/',
            beginPostgre:
              'https://docs.ovh.com/lt/clouddb/postgresql-naudojimas/',
          },
          dnsForExternalDomain:
            'https://www.ovh.lt/g2229.dns_zonos_kurimas_isoriniam_domenui',
          wordpress:
            'https://codex.wordpress.org/Getting_Started_with_WordPress',
          prestashop:
            'http://doc.prestashop.com/display/PS16/English+documentation',
          siteOnline:
            'https://www.ovh.lt/g1374.svetainiu_talpinimas_svetaines_ikelimas_i_interneta',
          phpAppendices: 'http://php.net/manual/en/appendices.php',
          works: {
            apache:
              'https://community.ovh.com/t/faq-how-can-i-update-my-website-to-support-apache-2-4/3851',
          },
        },
        dnssec_service: 'http://www.ovh.lt/domenai/paslauga_dnssec.xml',
        domainOrderChange: 'https://www.ovh.lt/cgi-bin/newOrder/order.cgi',
        domainOrderTrade:
          "https://www.ovh.lt/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        changeOwner:
          'https://www.ovh.com/cgi-bin/lt/procedure/procedureChangeOwner.cgi',
        bulkChangeOwner:
          'https://www.ovh.lt/order/domain/#/legacy/domain/trade/list',
        exchangeOrder: 'https://www.ovh.lt/El_pastas/hosted-exchange/',
        start10mMarket:
          'https://www.ovh.lt/domenai/nemokamas_talpinimas_start10m.xml',
      },
      NL: {
        support: 'http://www.ovh.nl/support/',
        support_contact: 'http://www.ovh.nl/support/',
        guides: {
          home: 'http://gids.ovh.nl/',
          all: 'https://docs.ovh.com/nl/nl/',
          emailsConfiguration:
            'https://www.ovh.nl/g1474.algemene-informatie-ovh-webhosting-emails',
          emailsCreation: 'https://www.ovh.nl/g1343.qssq',
          hostingPrivateDatabaseDBaaS: {
            beginner:
              'https://docs.ovh.com/nl/clouddb/aan-de-slag-met-clouddb/',
            db:
              'https://docs.ovh.com/nl/clouddb/aan-de-slag-met-mysql-en-mariadb/',
            beginPostgre:
              'https://docs.ovh.com/nl/clouddb/aan-de-slag-met-postgresql/',
          },
          prestashop:
            'http://doc.prestashop.com/display/PS16/English+documentation',
          phpAppendices: 'http://php.net/manual/en/appendices.php',
          wordpress:
            'https://codex.wordpress.org/Getting_Started_with_WordPress',
          works: {
            apache:
              'https://community.ovh.com/t/faq-how-can-i-update-my-website-to-support-apache-2-4/3851',
          },
        },
        dnssec_service: 'https://www.ovh.com/fr/domaines/service_dnssec.xml',
        domainOrderChange: 'https://www.ovh.nl/cgi-bin/newOrder/order.cgi',
        domainOrderTrade:
          "https://www.ovh.nl/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        changeOwner:
          'https://www.ovh.nl/cgi-bin/procedure/procedureChangeOwner.cgi',
        bulkChangeOwner:
          'https://www.ovh.nl/order/domain/#/legacy/domain/trade/list',
        exchangeOrder: 'https://www.ovh.nl/emails/hosted-exchange/',
        start10mMarket: 'https://www.ovh.nl/domains/start10m_hosting_offer.xml',
      },
      PL: {
        support: 'https://www.ovh.pl/pomoc/',
        support_contact: 'https://www.ovh.pl/pomoc/',
        guides: {
          home: 'https://www.ovh.pl/community/knowledge/',
          all: 'https://docs.ovh.com/pl/pl/',
          autoRenew: 'https://www.ovh.pl/g1271.renew',
          dnsForExternalDomain:
            'https://www.ovh.pl/g2229.utworzenie_strefy_dns_dla_zewnetrznej_domeny',
          emailsConfiguration:
            'https://www.ovh.pl/g1474.emaile-na-hostingu-www-ovh',
          emailsConfigurationAuto: 'https://www.ovh.pl/mail/',
          emailsConfigurationMacMountainLion:
            'https://docs.ovh.com/pl/emails/konfiguracja-mail-macos/',
          emailsConfigurationMacMavericksAndYosemite:
            'https://docs.ovh.com/pl/emails/konfiguracja-mail-macos/',
          emailsConfigurationMacElCapitain:
            'https://docs.ovh.com/pl/emails/konfiguracja-mail-macos/',
          emailsConfigurationOutlook2007:
            'https://docs.ovh.com/pl/emails/konfiguracja_konta_e-mail_w_programie_outlook_2007/',
          emailsConfigurationOutlook2010:
            'https://docs.ovh.com/pl/emails/konfiguracja_konta_e-mail_w_programie_outlook_2010/',
          emailsConfigurationOutlook2013:
            'https://docs.ovh.com/pl/microsoft-collaborative-solutions/exchange_2013_przewodnik_dotyczacy_korzystania_z_outlook_web_app/',
          emailsConfigurationOutlook2016:
            'https://docs.ovh.com/pl/emails/konfiguracja-outlook-2016/',
          emailsConfigurationIos9:
            'https://docs.ovh.com/pl/emails/hosting_www_konfiguracja_na_iphone_ios_91/',
          emailsConfigurationAndroid6:
            'https://docs.ovh.com/pl/emails/konfiguracja-android/',
          emailsCreation: 'https://www.ovh.pl/g1343.qssq',
          emailsCreateMailingListGuide:
            'https://www.ovh.pl/g1596.mail_mutualise_guide_dutilisation_mailing-list',
          hostingPhpConfiguration:
            'https://www.ovh.pl/g1999.skonfiguruj_wersje_php_w_panelu_klienta',
          hostingPrivateDatabase: 'https://www.ovh.pl/g2023.prywatny_sql',
          hostingPrivateDatabaseDBaaS: {
            beginner:
              'https://docs.ovh.com/pl/clouddb/pierwsze-kroki-z-clouddb/',
            db: 'https://docs.ovh.com/pl/clouddb/mysql-i-mariadb/',
            beginPostgre:
              'https://docs.ovh.com/pl/clouddb/pierwsze-kroki-z-postgresql/',
          },
          hostingPrivateDatabaseConfiguration:
            'https://docs.ovh.com/pl/hosting/konfiguracja-optymalizacja-serwera-bazy-danych/#instancja-mysql-i-mariadb',
          phpAppendices: 'http://php.net/manual/en/appendices.php',
          prestashop:
            'http://doc.prestashop.com/display/PS16/Polska+dokumentacja',
          siteOnline:
            'https://www.ovh.pl/g1374.hosting_www_umieszczenie_strony_w_internecie',
          shhChange:
            'https://www.ovh.pl/g2069.replacing_your_lost_ssh_key_pair',
          wordpress:
            'https://codex.wordpress.org/Getting_Started_with_WordPress',
          works: {
            apache:
              'https://community.ovh.com/t/faq-how-can-i-update-my-website-to-support-apache-2-4/3851',
          },
        },
        dnssec_service: 'https://www.ovh.pl/domeny/usluga_dnssec.xml',
        domainOrderChange: 'https://www.ovh.pl/cgi-bin/newOrder/order.cgi',
        domainOrderTrade:
          "https://www.ovh.pl/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        changeOwner:
          'https://www.ovh.pl/cgi-bin/procedure/procedureChangeOwner.cgi',
        bulkChangeOwner:
          'https://www.ovh.pl/order/domain/#/legacy/domain/trade/list',
        emailsOrder: 'https://www.ovh.pl/emaile/',
        exchangeOrder: 'https://www.ovh.pl/emaile/hosted-exchange/',
        start10mMarket: 'https://www.ovh.pl/domeny/oferta_serwer_start10m.xml',
      },
      PT: {
        support: 'https://www.ovh.pt/suporte/',
        support_contact: 'https://www.ovh.pt/suporte/',
        guides: {
          home: 'http://guias.ovh.pt/',
          all: 'https://docs.ovh.com/pt/pt/',
          autoRenew: 'https://www.ovh.pt/g1271.renew',
          dnsForExternalDomain:
            'https://www.ovh.pt/g2229.criar_uma_zona_dns_para_um_dominio_externo',
          emailsConfiguration:
            'https://www.ovh.pt/g1474.generalidades-mails-partilhados-ovh',
          emailsCreation: 'https://www.ovh.pt/g1343.qssq',
          emailsCreateMailingListGuide:
            'https://www.ovh.pt/g1596.mail_mutualise_guide_dutilisation_mailing-list',
          hostingPhpConfiguration:
            'https://www.ovh.pt/g1999.partilhado_configurar_a_versao_de_php_a_partir_do_seu_espaco_cliente',
          hostingPrivateDatabase:
            'https://www.ovh.pt/g2023.tudo_sobre_sql_privado',
          hostingPrivateDatabaseDBaaS: {
            beginner: 'https://docs.ovh.com/pt/clouddb/comecar-com-clouddb/',
            db: 'https://docs.ovh.com/pt/clouddb/comecar-com-mysql-e-mariadb/',
            beginPostgre:
              'https://docs.ovh.com/pt/clouddb/comecar-com-postgresql/',
          },
          hostingPrivateDatabaseConfiguration:
            'https://docs.ovh.com/pt/hosting/configurar-otimizar-servidor-de-bases-de-dados/#instancia-mysql-e-mariadb',
          phpAppendices: 'http://php.net/manual/en/appendices.php',
          prestashop:
            'http://doc.prestashop.com/display/PS16/English+documentation',
          siteOnline:
            'https://www.ovh.pt/g1374.partilhado_colocar_o_meu_website_online',
          wordpress:
            'https://codex.wordpress.org/pt-br:Novo_no_WordPress_-_Por_Onde_Come%C3%A7ar',
          works: {
            apache:
              'https://community.ovh.com/t/faq-how-can-i-update-my-website-to-support-apache-2-4/3851',
          },
        },
        dnssec_service: 'http://www.ovh.pt/dominios/servico_dnssec.xml',
        domainOrderChange: 'https://www.ovh.pt/cgi-bin/newOrder/order.cgi',
        domainOrderTrade:
          "https://www.ovh.pt/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        changeOwner:
          'https://www.ovh.pt/cgi-bin/procedure/procedureChangeOwner.cgi',
        bulkChangeOwner:
          'https://www.ovh.pt/order/domain/#/legacy/domain/trade/list',
        exchangeOrder: 'https://www.ovh.pt/emails/hosted-exchange-2013/',
        start10mMarket:
          'https://www.ovh.pt/dominios/oferta_alojamento_start10m.xml',
      },
      express_order: {
        CZ: 'https://www.ovh.cz/order/express/',
        DE: 'https://www.ovh.de/order/express/',
        EN: 'https://www.ovh.co.uk/order/express/',
        ES: 'https://www.ovh.es/order/express/',
        FI: 'https://www.ovh-hosting.fi/order/express/',
        FR: 'https://www.ovh.com/fr/order/express/',
        GB: 'https://www.ovh.co.uk/order/express/',
        IE: 'https://www.ovh.ie/order/express/',
        IT: 'https://www.ovh.it/order/express/',
        LT: 'https://www.ovh.lt/order/express/',
        MA: 'https://www.ovh.com/ma/order/express/',
        NL: 'https://www.ovh.nl/order/express/',
        PL: 'https://www.ovh.pl/order/express/',
        PT: 'https://www.ovh.pt/order/express/',
        RU: 'https://www.ovh.ie/order/express/',
        SN: 'https://www.ovh.sn/order/express/',
        TN: 'https://www.ovh.com/tn/order/express/',
      },
      domain_order_options_service: {
        CZ:
          "https://www.ovh.cz/order/domain/#/legacy/domain/hosting/choose?options=~(~(flow~'hosting_existing_service~serviceName~'{serviceName}))&fqdn={domainName}",
        DE:
          "https://www.ovh.de/order/domain/#/legacy/domain/hosting/choose?options=~(~(flow~'hosting_existing_service~serviceName~'{serviceName}))&fqdn={domainName}",
        EN:
          "https://www.ovh.co.uk/order/domain/#/legacy/domain/hosting/choose?options=~(~(flow~'hosting_existing_service~serviceName~'{serviceName}))&fqdn={domainName}",
        ES:
          "https://www.ovh.es/order/domain/#/legacy/domain/hosting/choose?options=~(~(flow~'hosting_existing_service~serviceName~'{serviceName}))&fqdn={domainName}",
        FI:
          "https://www.ovh-hosting.fi/order/domain/#/legacy/domain/hosting/choose?options=~(~(flow~'hosting_existing_service~serviceName~'{serviceName}))&fqdn={domainName}",
        FR:
          "https://www.ovh.com/fr/order/domain/#/legacy/domain/hosting/choose?options=~(~(flow~'hosting_existing_service~serviceName~'{serviceName}))&fqdn={domainName}",
        GB:
          "https://www.ovh.co.uk/order/domain/#/legacy/domain/hosting/choose?options=~(~(flow~'hosting_existing_service~serviceName~'{serviceName}))&fqdn={domainName}",
        IE:
          "https://www.ovh.ie/order/domain/#/legacy/domain/hosting/choose?options=~(~(flow~'hosting_existing_service~serviceName~'{serviceName}))&fqdn={domainName}",
        IT:
          "https://www.ovh.it/order/domain/#/legacy/domain/hosting/choose?options=~(~(flow~'hosting_existing_service~serviceName~'{serviceName}))&fqdn={domainName}",
        LT:
          "https://www.ovh.lt/order/domain/#/legacy/domain/hosting/choose?options=~(~(flow~'hosting_existing_service~serviceName~'{serviceName}))&fqdn={domainName}",
        MA:
          "https://www.ovh.com/ma/order/domain/#/legacy/domain/hosting/choose?options=~(~(flow~'hosting_existing_service~serviceName~'{serviceName}))&fqdn={domainName}",
        NL:
          "https://www.ovh.nl/order/domain/#/legacy/domain/hosting/choose?options=~(~(flow~'hosting_existing_service~serviceName~'{serviceName}))&fqdn={domainName}",
        PL:
          "https://www.ovh.pl/order/domain/#/legacy/domain/hosting/choose?options=~(~(flow~'hosting_existing_service~serviceName~'{serviceName}))&fqdn={domainName}",
        PT:
          "https://www.ovh.pt/order/domain/#/legacy/domain/hosting/choose?options=~(~(flow~'hosting_existing_service~serviceName~'{serviceName}))&fqdn={domainName}",
        RU:
          "https://www.ovh.ie/order/domain/#/legacy/domain/hosting/choose?options=~(~(flow~'hosting_existing_service~serviceName~'{serviceName}))&fqdn={domainName}",
        SN:
          "https://www.ovh.sn/order/domain/#/legacy/domain/hosting/choose?options=~(~(flow~'hosting_existing_service~serviceName~'{serviceName}))&fqdn={domainName}",
        TN:
          "https://www.ovh.com/tn/order/domain/#/legacy/domain/hosting/choose?options=~(~(flow~'hosting_existing_service~serviceName~'{serviceName}))&fqdn={domainName}",
      },
      localseo_order_options_service: {
        FR:
          "https://www.ovh.com/fr/order/domain/#/legacy/domain/hosting/choose?options=~(flow~'hosting_existing_service~serviceName~'{serviceName})",
      },
      localseo_visibility_checker: {
        FR: 'https://www.ovh.com/fr/hebergement-web/referencement-local.xml',
      },
      TOOLS: {
        ZONE_CHECK: 'https://www.zonemaster.net/',
      },
    },
    COMODO: {
      knowledgebase:
        'https://support.comodo.com/index.php?/Knowledgebase/Article/View/702/0/ev-certificate-validation-checklist',
      contactEmail: 'validation@comodo.eu',
      phoneNumber: '+31 88 775 7777',
    },
    SECTIGO: {
      knowledgebase:
        'https://sectigo.com/knowledge-base/detail/EV-Certificate-Validation-Checklist-1527076098137/kA01N000000zFOr',
      contactEmail: 'https://sectigo.com/support-ticket',
    },
    website_url: {
      new_nic: {
        de_DE:
          'https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=DE',
        en_GB:
          'https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=GB',
        es_ES:
          'https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=ES',
        es_US: 'https://ovhcloud.com/auth/signup/',
        fr_CA:
          'https://ca.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=CA',
        fr_FR:
          'https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=FR',
        it_IT:
          'https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=IT',
        lt_LT:
          'https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=LT',
        pl_PL:
          'https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=PL',
        pt_PT:
          'https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=PT',
        fi_FI:
          'https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=FI',
        cs_CZ:
          'https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=CZ',
      },
    },
    flags_options: [
      { value: 256, label: '256 - Zone Signing Key (ZSK)' },
      { value: 257, label: '257 - Key Signing Key (KSK)' },
    ],
    algorithm_options: [
      { value: 3, label: '3 - DSA' },
      { value: 5, label: '5 - RSASHA1' },
      { value: 6, label: '6 - DSA-NSEC3-SHA1' },
      { value: 7, label: '7 - RSASHA1-NSEC3-SHA1' },
      { value: 8, label: '8 - RSASHA256' },
      { value: 10, label: '10 - RSASHA512' },
      { value: 13, label: '13 - ECDSAP256SHA256' },
      { value: 14, label: '14 - ECDSAP384SHA384' },
      { value: 15, label: '15 - ED25519' },
    ],
    ORDER_URL: {
      CZ: 'https://www.ovh.cz/order/express/#/express/review?products=',
      DE: 'https://www.ovh.de/order/express/#/express/review?products=',
      ES: 'https://www.ovh.es/order/express/#/express/review?products=',
      FI: 'https://www.ovh-hosting.fi/order/express/#/express/review?products=',
      FR: 'https://www.ovh.com/fr/order/express/#/express/review?products=',
      GB: 'https://www.ovh.co.uk/order/express/#/express/review?products=',
      IE: 'https://www.ovh.ie/order/express/#/express/review?products=',
      IT: 'https://www.ovh.it/order/express/#/express/review?products=',
      LT: 'https://www.ovh.lt/order/express/#/express/review?products=',
      MA: 'https://www.ovh.ma/order/express/#/express/review?products=',
      NL: 'https://www.ovh.nl/order/express/#/express/review?products=',
      PL: 'https://www.ovh.pl/order/express/#/express/review?products=',
      PT: 'https://www.ovh.pt/order/express/#/express/review?products=',
      SN: 'https://www.ovh.sn/order/express/#/express/review?products=',
      TN: 'https://www.ovh.com/tn/order/express/#/express/review?products=',
    },
  },
  CA: {
    RENEW_URL:
      'https://ca.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
    DOMAIN: {
      domainUnlockRegistry: {},
    },
    HOSTING: {
      OFFERS: {
        START_10_M: {
          TYPE_VALUE: 'START_10_M',
          LIST_VALUE: 'START',
        },
      },
      MODULES: {
        DEFAULT_INSTALL_PATH: './www/',
      },
    },
    URLS: {
      ASIA: {
        support: 'https://www.ovh.com/ca/en/support/',
        guides: {
          home: 'https://docs.ovh.com/asia/en/',
          all: 'https://docs.ovh.com/asia/en/',
          dnsForExternalDomain:
            'https://docs.ovh.com/asia/en/domains/create_a_dns_zone_for_a_domain_which_is_not_registered_at_ovh/',
          hostingPrivateDatabase:
            'https://docs.ovh.com/asia/en/hosting/getting-started-with-private-sql/',
          hostingPrivateDatabaseDBaaS: {
            beginner:
              'https://docs.ovh.com/asia/en/clouddb/getting-started-with-clouddb/',
            db:
              'https://docs.ovh.com/asia/en/clouddb/get-started-with-mysql-and-mariadb/',
            beginPostgre:
              'https://docs.ovh.com/asia/en/clouddb/getting-started-with-postgresql/',
          },
          wordpress:
            'https://codex.wordpress.org/Getting_Started_with_WordPress',
          prestashop:
            'http://doc.prestashop.com/display/PS16/English+documentation',
          phpAppendices: 'http://php.net/manual/en/appendices.php',
          works: {
            apache:
              'https://community.ovh.com/t/faq-how-can-i-update-my-website-to-support-apache-2-4/3851',
          },
        },
        dnssec_service: 'https://www.ovh.com/asia/domains/dnssec_service.xml',
        domainOrderChange: 'https://ca.ovh.com/en/cgi-bin/newOrder/order.cgi',
        domainOrderTrade:
          "https://ca.ovh.com/asia/order/domain/#/legacy/domain/trade/list?options=~~(domain~~'{domain})",
        bulkChangeOwner:
          'https://ca.ovh.com/asia/order/domain/#/legacy/domain/trade/list',
        exchangeOrder: 'https://www.ovh.com/us/emails/hosted-exchange/',
      },
      IN: {
        support: 'https://www.ovh.com/ca/en/support/',
        guides: {
          home: 'https://docs.ovh.com/asia/en/',
          all: 'https://docs.ovh.com/asia/en/',
          dnsForExternalDomain:
            'https://docs.ovh.com/asia/en/domains/create_a_dns_zone_for_a_domain_which_is_not_registered_at_ovh/',
          hostingPrivateDatabase:
            'https://docs.ovh.com/asia/en/hosting/getting-started-with-private-sql/',
          hostingPrivateDatabaseDBaaS: {
            beginner:
              'https://docs.ovh.com/asia/en/clouddb/getting-started-with-clouddb/',
            db:
              'https://docs.ovh.com/asia/en/clouddb/get-started-with-mysql-and-mariadb/',
            beginPostgre:
              'https://docs.ovh.com/asia/en/clouddb/getting-started-with-postgresql/',
          },
          wordpress:
            'https://codex.wordpress.org/Getting_Started_with_WordPress',
          prestashop:
            'http://doc.prestashop.com/display/PS16/English+documentation',
          phpAppendices: 'http://php.net/manual/en/appendices.php',
          works: {
            apache:
              'https://community.ovh.com/t/faq-how-can-i-update-my-website-to-support-apache-2-4/3851',
          },
        },
        dnssec_service: 'https://www.ovh.com/asia/domains/dnssec_service.xml',
        domainOrderChange: 'https://ca.ovh.com/en/cgi-bin/newOrder/order.cgi',
        domainOrderTrade:
          "https://ca.ovh.com/asia/order/domain/#/legacy/domain/trade/list?options=~~(domain~~'{domain})",
        bulkChangeOwner:
          'https://ca.ovh.com/asia/order/domain/#/legacy/domain/trade/list',
        exchangeOrder: 'https://www.ovh.com/us/emails/hosted-exchange/',
      },
      AU: {
        support: 'https://www.ovh.com/ca/en/support/',
        guides: {
          home: 'https://docs.ovh.com/au/en/',
          all: 'https://docs.ovh.com/au/en/',
          dnsForExternalDomain:
            'https://docs.ovh.com/au/en/domains/create_a_dns_zone_for_a_domain_which_is_not_registered_at_ovh/',
          hostingPrivateDatabase:
            'https://docs.ovh.com/au/en/hosting/getting-started-with-private-sql/',
          hostingPrivateDatabaseDBaaS: {
            beginner:
              'https://docs.ovh.com/au/en/clouddb/getting-started-with-clouddb/',
            db:
              'https://docs.ovh.com/au/en/clouddb/get-started-with-mysql-and-mariadb/',
            beginPostgre:
              'https://docs.ovh.com/au/en/clouddb/getting-started-with-postgresql/',
          },
          wordpress:
            'https://codex.wordpress.org/Getting_Started_with_WordPress',
          prestashop:
            'http://doc.prestashop.com/display/PS16/English+documentation',
          phpAppendices: 'http://php.net/manual/en/appendices.php',
          works: {
            apache:
              'https://community.ovh.com/t/faq-how-can-i-update-my-website-to-support-apache-2-4/3851',
          },
        },
        dnssec_service: 'https://www.ovh.com/au/domains/dnssec_service.xml',
        domainOrderChange: 'https://ca.ovh.com/en/cgi-bin/newOrder/order.cgi',
        domainOrderTrade:
          "https://ca.ovh.com/au/order/domain/#/legacy/domain/trade/list?options=~~(domain~~'{domain})",
        bulkChangeOwner:
          'https://ca.ovh.com/au/order/domain/#/legacy/domain/trade/list',
        exchangeOrder: 'https://www.ovh.com/us/emails/hosted-exchange/',
      },
      CA: {
        // eq to en_CA
        support: 'https://www.ovh.com/ca/en/support/',
        guides: {
          home: 'https://docs.ovh.com/ca/en/',
          all: 'https://docs.ovh.com/ca/en/',
          dnsForExternalDomain:
            'https://docs.ovh.com/ca/en/domains/create_a_dns_zone_for_a_domain_which_is_not_registered_at_ovh/',
          hostingPrivateDatabase:
            'https://docs.ovh.com/ca/en/hosting/getting-started-with-private-sql/',
          hostingPrivateDatabaseDBaaS: {
            beginner:
              'https://docs.ovh.com/ca/en/clouddb/getting-started-with-clouddb/',
            db:
              'https://docs.ovh.com/ca/en/clouddb/get-started-with-mysql-and-mariadb/',
            beginPostgre:
              'https://docs.ovh.com/ca/en/clouddb/getting-started-with-postgresql/',
          },
          wordpress:
            'https://codex.wordpress.org/Getting_Started_with_WordPress',
          prestashop:
            'http://doc.prestashop.com/display/PS16/English+documentation',
          phpAppendices: 'http://php.net/manual/en/appendices.php',
          works: {
            apache:
              'https://community.ovh.com/t/faq-how-can-i-update-my-website-to-support-apache-2-4/3851',
          },
        },
        dnssec_service: 'https://www.ovh.com/ca/en/domains/dnssec_service.xml',
        domainOrderChange: 'https://ca.ovh.com/en/cgi-bin/newOrder/order.cgi',
        domainOrderTrade:
          "https://ca.ovh.com/en/order/domain/#/legacy/domain/trade/list?options=~~(domain~~'{domain})",
        bulkChangeOwner:
          'https://ca.ovh.com/en/order/domain/#/legacy/domain/trade/list',
        exchangeOrder: 'https://www.ovh.com/ca/en/emails/hosted-exchange/',
      },
      QC: {
        // eq to fr_CA
        support: 'https://www.ovh.com/ca/fr/support/',
        guides: {
          home: 'https://docs.ovh.com/ca/fr/',
          all: 'https://docs.ovh.com/ca/fr/',
          dnsForExternalDomain:
            'https://docs.ovh.com/ca/fr/domains/creer-une-zone-dns-pour-un-domaine-externe/',
          hostingPrivateDatabase:
            'https://docs.ovh.com/ca/fr/hosting/premiers-pas-avec-sql-prive/',
          hostingPrivateDatabaseDBaaS: {
            beginner:
              'https://docs.ovh.com/ca/fr/cloud/clouddb/debuter-avec-clouddb/',
            db:
              'https://docs.ovh.com/ca/fr/cloud/clouddb/demarrez-avec-mysql-et-mariadb/',
            beginPostgre:
              'https://docs.ovh.com/ca/fr/cloud/clouddb/demarrez-avec-postgresql/',
          },
          wordpress:
            'https://codex.wordpress.org/fr:Premiers_pas_avec_WordPress',
          prestashop:
            'http://doc.prestashop.com/display/PS16/Guide+de+l%27utilisateur',
          phpAppendices: 'http://php.net/manual/fr/appendices.php',
          works: {
            apache:
              'https://community.ovh.com/t/faq-comment-mettre-a-jour-mon-site-pour-supporter-apache-2-4/3850',
          },
        },
        dnssec_service: 'https://www.ovh.com/ca/fr/domaine/service_dnssec.xml',
        domainOrderChange: 'https://ca.ovh.com/fr/cgi-bin/newOrder/order.cgi',
        domainOrderTrade:
          "https://ca.ovh.com/fr/order/domain/#/legacy/domain/trade/list?options=~~(domain~~'{domain})",
        bulkChangeOwner:
          'https://ca.ovh.com/ca/fr/order/domain/#/legacy/domain/trade/list',
        exchangeOrder: 'https://www.ovh.com/ca/fr/emails/hosted-exchange/',
      },
      SG: {
        support: 'https://www.ovh.com/ca/en/support/',
        guides: {
          home: 'https://docs.ovh.com/sg/en/',
          all: 'https://docs.ovh.com/sg/en/',
          dnsForExternalDomain:
            'https://docs.ovh.com/sg/en/domains/create_a_dns_zone_for_a_domain_which_is_not_registered_at_ovh/',
          hostingPrivateDatabase:
            'https://docs.ovh.com/asia/en/hosting/getting-started-with-private-sql/',
          hostingPrivateDatabaseDBaaS: {
            beginner:
              'https://docs.ovh.com/asia/en/clouddb/getting-started-with-clouddb/',
            db:
              'https://docs.ovh.com/asia/en/clouddb/get-started-with-mysql-and-mariadb/',
            beginPostgre:
              'https://docs.ovh.com/asia/en/clouddb/getting-started-with-postgresql/',
          },
          wordpress:
            'https://codex.wordpress.org/Getting_Started_with_WordPress',
          prestashop:
            'http://doc.prestashop.com/display/PS16/English+documentation',
          phpAppendices: 'http://php.net/manual/en/appendices.php',
          works: {
            apache:
              'https://community.ovh.com/t/faq-how-can-i-update-my-website-to-support-apache-2-4/3851',
          },
        },
        dnssec_service: 'https://www.ovh.com/sg/domains/dnssec_service.xml',
        domainOrderChange: 'https://ca.ovh.com/fr/cgi-bin/newOrder/order.cgi',
        domainOrderTrade:
          "https://ca.ovh.com/sg/order/domain/#/legacy/domain/trade/list?options=~~(domain~~'{domain})",
        bulkChangeOwner:
          'https://ca.ovh.com/sg/order/domain/#/legacy/domain/trade/list',
        exchangeOrder: 'https://www.ovh.com/us/emails/hosted-exchange/',
      },
      WE: {
        support: 'https://www.ovh.com/ca/en/support/',
        guides: {
          home: 'https://docs.ovh.com/ca/en/',
          all: 'https://docs.ovh.com/ca/en/',
          dnsForExternalDomain:
            'https://docs.ovh.com/ca/en/domains/create_a_dns_zone_for_a_domain_which_is_not_registered_at_ovh/',
          hostingPrivateDatabase:
            'https://docs.ovh.com/ca/en/hosting/getting-started-with-private-sql/',
          hostingPrivateDatabaseDBaaS: {
            beginner:
              'https://docs.ovh.com/ca/en/clouddb/getting-started-with-clouddb/',
            db:
              'https://docs.ovh.com/ca/en/clouddb/get-started-with-mysql-and-mariadb/',
            beginPostgre:
              'https://docs.ovh.com/ca/en/clouddb/getting-started-with-postgresql/',
          },
          wordpress:
            'https://codex.wordpress.org/Getting_Started_with_WordPress',
          prestashop:
            'http://doc.prestashop.com/display/PS16/English+documentation',
          phpAppendices: 'http://php.net/manual/en/appendices.php',
          works: {
            apache:
              'https://community.ovh.com/t/faq-how-can-i-update-my-website-to-support-apache-2-4/3851',
          },
        },
        dnssec_service: 'https://www.ovh.com/world/domains/dnssec_service.xml',
        domainOrderChange: 'https://ca.ovh.com/en/cgi-bin/newOrder/order.cgi',
        domainOrderTrade:
          "https://us.ovh.com/us/order/domain/#/legacy/domain/trade/list?options=~~(domain~~'{domain})",
        bulkChangeOwner:
          'https://us.ovh.com/us/order/domain/#/legacy/domain/trade/list',
        exchangeOrder: 'https://www.ovh.com/us/emails/hosted-exchange/',
      },
      WS: {
        // eq to es_US
        support: 'https://www.ovh.com/ca/en/support/',
        guides: {
          home: 'https://docs.ovh.com/us/es/',
          all: 'https://docs.ovh.com/us/es/',
          dnsForExternalDomain:
            'https://docs.ovh.com/us/es/domains/create_a_dns_zone_for_a_domain_which_is_not_registered_at_ovh/',
          hostingPrivateDatabase:
            'https://docs.ovh.com/us/es/hosting/getting-started-with-private-sql/',
          hostingPrivateDatabaseDBaaS: {
            beginner:
              'https://docs.ovh.com/us/es/clouddb/getting-started-with-clouddb/',
            db:
              'https://docs.ovh.com/us/es/clouddb/get-started-with-mysql-and-mariadb/',
            beginPostgre:
              'https://docs.ovh.com/us/es/clouddb/getting-started-with-postgresql/',
          },
          wordpress:
            'https://codex.wordpress.org/Getting_Started_with_WordPress',
          prestashop:
            'http://doc.prestashop.com/display/PS16/English+documentation',
          phpAppendices: 'http://php.net/manual/en/appendices.php',
          works: {
            apache:
              'https://community.ovh.com/t/faq-how-can-i-update-my-website-to-support-apache-2-4/3851',
          },
        },
        dnssec_service:
          'https://www.ovh.com/world/es/domains/dnssec_service.xml',
        domainOrderChange: 'https://ca.ovh.com/en/cgi-bin/newOrder/order.cgi',
        domainOrderTrade:
          "https://us.ovh.com/es/order/domain/#/legacy/domain/trade/list?options=~~(domain~~'{domain})",
        bulkChangeOwner:
          'https://us.ovh.com/es/order/domain/#/legacy/domain/trade/list',
        exchangeOrder: 'https://www.ovh.com/us/emails/hosted-exchange/',
      },
      express_order: {
        ASIA: 'https://ca.ovh.com/asia/order/express/',
        IN: 'https://ca.ovh.com/en-in/order/express/',
        AU: 'https://ca.ovh.com/au/order/express/',
        CA: 'https://ca.ovh.com/en/order/express/',
        QC: 'https://ca.ovh.com/fr/order/express/',
        SG: 'https://ca.ovh.com/sg/order/express/',
        WE: 'https://us.ovh.com/us/order/express/',
        WS: 'https://us.ovh.com/us/es/order/express/',
      },
      domain_order_options_service: {
        ASIA:
          "https://ca.ovh.com/asia/order/domain/#/legacy/domain/hosting/choose?options=~(~(flow~'hosting_existing_service~serviceName~'{serviceName}))&fqdn={domainName}",
        IN:
          'https://ca.ovh.com/en-in/order/domain/#/legacy/domain/hosting/choose?options=~(~(flow~hosting_existing_service~serviceName~{serviceName}))&fqdn={domainName}',
        AU:
          "https://ca.ovh.com/au/order/domain/#/legacy/domain/hosting/choose?options=~(~(flow~'hosting_existing_service~serviceName~'{serviceName}))&fqdn={domainName}",
        CA:
          "https://ca.ovh.com/en/order/domain/#/legacy/domain/hosting/choose?options=~(~(flow~'hosting_existing_service~serviceName~'{serviceName}))&fqdn={domainName}",
        QC:
          "https://ca.ovh.com/fr/order/domain/#/legacy/domain/hosting/choose?options=~(~(flow~'hosting_existing_service~serviceName~'{serviceName}))&fqdn={domainName}",
        SG:
          "https://ca.ovh.com/sg/order/domain/#/legacy/domain/hosting/choose?options=~(~(flow~'hosting_existing_service~serviceName~'{serviceName}))&fqdn={domainName}",
        WE:
          "https://us.ovh.com/us/order/domain/#/legacy/domain/hosting/choose?options=~(~(flow~'hosting_existing_service~serviceName~'{serviceName}))&fqdn={domainName}",
        WS:
          "https://us.ovh.com/us/es/order/domain/#/legacy/domain/hosting/choose?options=~(~(flow~'hosting_existing_service~serviceName~'{serviceName}))&fqdn={domainName}",
      },
      TOOLS: {
        ZONE_CHECK: 'https://www.zonemaster.net/',
      },
    },
    COMODO: {
      knowledgebase:
        'https://support.comodo.com/index.php?/Knowledgebase/Article/View/702/0/ev-certificate-validation-checklist',
      contactEmail: 'validation@comodo.eu',
      phoneNumber: '+31 88 775 7777',
    },
    SECTIGO: {
      knowledgebase:
        'https://sectigo.com/knowledge-base/detail/EV-Certificate-Validation-Checklist-1527076098137/kA01N000000zFOr',
      contactEmail: 'https://sectigo.com/support-ticket',
    },
    website_url: {
      new_nic: {
        de_DE:
          'https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=DE',
        en_GB:
          'https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=GB',
        es_ES:
          'https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=ES',
        es_US: 'https://ovhcloud.com/auth/signup/',
        fr_CA:
          'https://ca.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=CA',
        fr_FR:
          'https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=FR',
        it_IT:
          'https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=IT',
        lt_LT:
          'https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=LT',
        pl_PL:
          'https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=PL',
        pt_PT:
          'https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=PT',
        fi_FI:
          'https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=FI',
        cs_CZ:
          'https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=CZ',
      },
    },
    flags_options: [
      { value: 256, label: '256 - Zone Signing Key (ZSK)' },
      { value: 257, label: '257 - Key Signing Key (KSK)' },
    ],
    algorithm_options: [
      { value: 3, label: '3 - DSA' },
      { value: 5, label: '5 - RSASHA1' },
      { value: 6, label: '6 - DSA-NSEC3-SHA1' },
      { value: 7, label: '7 - RSASHA1-NSEC3-SHA1' },
      { value: 8, label: '8 - RSASHA256' },
      { value: 10, label: '10 - RSASHA512' },
      { value: 13, label: '13 - ECDSAP256SHA256' },
      { value: 14, label: '14 - ECDSAP384SHA384' },
      { value: 15, label: '15 - ED25519' },
    ],
    ORDER_URL: {
      ASIA: 'https://ca.ovh.com/asia/order/express/#/express/review?products=',
      IN: 'https://ca.ovh.com/en-in/order/express/#/express/review?products=',
      AU: 'https://ca.ovh.com/au/order/express/#/express/review?products=',
      CA: 'https://ca.ovh.com/en/order/express/#/express/review?products=',
      QC: 'https://ca.ovh.com/fr/order/express/#/express/review?products=',
      SG: 'https://ca.ovh.com/sg/order/express/#/express/review?products=',
      WE: 'https://us.ovh.com/us/order/express/#/express/review?products=',
      WS: 'https://us.ovh.com/es/order/express/#/express/review?products=',
    },
  },
};
