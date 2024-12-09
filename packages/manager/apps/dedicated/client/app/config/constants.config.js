import defaults from 'lodash/defaults';

const constants = {
  EU: {
    RENEW_URL:
      'https://eu.ovh.com/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
    vmsUrl: {
      IN: 'https://vms.status-ovhcloud.com/index_ynm1.html',
      OTHERS: 'http://vms.status-ovhcloud.com/',
    },
    statusUrl: 'https://www.status-ovhcloud.com/',
    UNIVERS: 'dedicated',
    SECTIONS_UNIVERSE_MAP: {
      sd: ['server'],
      pcc: ['hpc'],
    },
    URLS: {
      CZ: {
        express_order: 'https://www.ovh.cz/order/express/#/express/',
        express_order_resume:
          'https://www.ovh.cz/order/express/#/new/express/resume',
        support: 'http://www.ovh.cz/podpora/',
        support_contact: 'http://www.ovh.cz/podpora/',
        guides: {
          home: 'http://prirucky.ovh.cz/',
          privateCloudHome: 'https://docs.ovh.com/cz/cs/private-cloud/',
          vrack:
            'https://docs.ovh.com/cz/cs/dedicated/konfigurace-dedikovanych-serveru-vrack/',
        },
        presentations: {
          home: 'https://www.ovh.cz/private-cloud/',
          nsx: 'https://www.ovh.cz/private-cloud/moznosti/nsx.xml',
          veeam: 'https://www.ovh.cz/private-cloud/moznosti/veeam.xml',
          vrops: 'https://www.ovh.cz/private-cloud/moznosti/vrops.xml',
        },
        vpsCloud: 'http://www.ovh.cz/vps/vps-cloud.xml',
        dedicatedIpmi:
          'https://docs.ovh.com/cz/cs/dedicated/pouziti-ipmi-dedikovane-servery/',
        changeOwner:
          'https://www.ovh.cz/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.cz/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        exchangeOrder: 'https://www.ovh.cz/emails/hosted-exchange-2013/',
        faq: 'https://www.ovh.cz/dedikovane_servery/faq.xml',
        faqVps: 'https://www.ovh.cz/vps/pomoc-faq.xml',
        dedicatedOrder: 'https://www.ovhcloud.com/en-ie/bare-metal/prices/',
        dedicatedEcoRangeOrder: 'https://eco.ovhcloud.com/en-ie/',
        threeAZClusterOrder:
          'https://www.ovhcloud.com/en-ie/bare-metal/prices/?display=list&use_cases=multi-az',
        iplbOrder: 'https://www.ovh.cz/reseni/load-balancer/',
      },
      DE: {
        express_order: 'https://www.ovh.de/order/express/#/express/',
        express_order_resume:
          'https://www.ovh.de/order/express/#/new/express/resume',
        support: 'http://www.ovh.de/support/',
        support_contact: 'http://www.ovh.de/support/',
        guides: {
          home: 'http://hilfe.ovh.de/',
          privateCloudHome: 'https://docs.ovh.com/de/private-cloud/',
          autoRenew:
            'https://www.ovh.de/g1271.anleitung_zur_nutzung_der_automatischen_verlangerung_bei_ovh',
          ipv6Vps: 'https://www.ovh.de/g2365.vps-ipv6',
          billing: 'https://docs.ovh.com/de/billing/',
          vrack:
            'https://docs.ovh.com/de/dedicated/mehrere-dedizierte-server-im-vrack-konfigurieren/',
        },
        presentations: {
          home: 'https://www.ovh.de/private-cloud/',
          nsx: 'https://www.ovh.de/private-cloud/optionen/nsx.xml',
          veeam: 'https://www.ovh.de/private-cloud/optionen/veeam.xml',
          vrops: 'https://www.ovh.de/private-cloud/optionen/vrops.xml',
        },
        vpsCloud: 'http://www.ovh.de/virtual_server/vps-cloud.xml',
        dedicatedIpmi:
          'https://docs.ovh.com/de/dedicated/verwendung-ipmi-dedicated-server/',
        changeOwner:
          'https://www.ovh.de/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.de/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        exchangeOrder: 'https://www.ovh.de/emails/hosted-exchange/',
        faq: 'https://www.ovh.de/dedicated_server/faq.xml',
        faqVps: 'https://www.ovh.de/virtual_server/faq-hilfe.xml',
        dedicatedOrder: 'https://www.ovhcloud.com/de/bare-metal/prices/',
        dedicatedEcoRangeOrder: 'https://eco.ovhcloud.com/de/',
        threeAZClusterOrder:
          'https://www.ovhcloud.com/de/bare-metal/prices/?display=list&use_cases=multi-az',
        iplbOrder: 'https://www.ovh.de/loesungen/load-balancer/',
      },
      ES: {
        express_order: 'https://www.ovh.es/order/express/#/express/',
        express_order_resume:
          'https://www.ovh.es/order/express/#/new/express/resume',
        support: 'http://www.ovh.es/soporte/',
        support_contact: 'http://www.ovh.es/soporte/',
        guides: {
          home: 'http://guias.ovh.es/',
          privateCloudHome: 'https://docs.ovh.com/es/private-cloud/',
          autoRenew: 'https://www.ovh.es/g1271.renovacion_automatica_en_ovh',
          ipv6Vps: 'https://www.ovh.es/g2365.vps-ipv6',
          billing: 'https://docs.ovh.com/es/billing/',
          vrack:
            'https://docs.ovh.com/es/dedicated/configurar-vrack-en-servidor-dedicado/',
        },
        presentations: {
          home: 'https://www.ovh.es/private-cloud/',
          nsx: 'https://www.ovh.es/private-cloud/opciones/nsx.xml',
          veeam: 'https://www.ovh.es/private-cloud/opciones/veeam.xml',
          vrops: 'https://www.ovh.es/private-cloud/opciones/vrops.xml',
        },
        vpsCloud: 'http://www.ovh.es/vps/vps-cloud.xml',
        dedicatedIpmi:
          'https://docs.ovh.com/es/dedicated/utilizar-ipmi-servidor-dedicado/',
        changeOwner:
          'https://www.ovh.es/cgi-bin/procedure/procedureChangeOwner.cgi',
        dedicated2016News: 'http://www.ovh.es/a1837.news',
        exchangeOrder: 'https://www.ovh.es/emails/hosted-exchange/',
        faq: 'https://www.ovh.es/servidores_dedicados/faq.xml',
        faqVps: 'https://www.ovh.es/vps/ayuda-faq.xml',
        dedicatedOrder: 'https://www.ovhcloud.com/es-es/bare-metal/prices/',
        dedicatedEcoRangeOrder: 'https://eco.ovhcloud.com/es-es/',
        threeAZClusterOrder:
          'https://www.ovhcloud.com/es-es/bare-metal/prices/?display=list&use_cases=multi-az',
        iplbOrder: 'https://www.ovh.es/soluciones/load-balancer/',
      },
      FI: {
        express_order: 'https://www.ovh-hosting.fi/order/express/#/express/',
        express_order_resume:
          'https://www.ovh-hosting.fi/order/express/#/new/express/resume',
        support: 'http://www.ovh-hosting.fi/tuki/',
        support_contact: 'http://www.ovh-hosting.fi/tuki/',
        guides: {
          home: 'http://ohjeet.ovh-hosting.fi/',
          privateCloudHome: 'https://docs.ovh.com/fi/private-cloud/',
          autoRenew: 'https://www.ovh-hosting.fi/g1271.automaattinen-uusinta',
          reinitPassword:
            'https://www.ovh-hosting.fi/g2366.virtuaalikoneen_root-salasanan_vaihto',
          ipv6Vps: 'https://www.ovh-hosting.fi/g2365.vps-ipv6',
          billing: 'https://docs.ovh.com/fi/billing/',
          vrack:
            'https://docs.ovh.com/fi/dedicated/usean-dedikoidun-palvelimen-konfigurointi-vrack/',
        },
        presentations: {
          home: 'https://www.ovh-hosting.fi/private-cloud/',
          nsx: 'https://www.ovh-hosting.fi/private-cloud/lisapalvelut/nsx.xml',
          veeam:
            'https://www.ovh-hosting.fi/private-cloud/lisapalvelut/veeam.xml',
          vrops:
            'https://www.ovh-hosting.fi/private-cloud/lisapalvelut/vrops.xml',
        },
        vpsCloud: 'http://www.ovh-hosting.fi/vps/vps-cloud.xml',
        dedicatedIpmi:
          'https://docs.ovh.com/fi/dedicated/ipmi-konsolin-kaytto-dedikoidut-palvelimet/',
        changeOwner:
          'https://www.ovh.com/cgi-bin/fi/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh-hosting.fi/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        exchangeOrder:
          'https://www.ovh-hosting.fi/sahkopostit/hosted-exchange/',
        faq: 'https://www.ovh-hosting.fi/dedikoidut_palvelimet/ukk.xml',
        faqVps: 'https://www.ovh-hosting.fi/vps/faq-help.xml',
        dedicatedOrder: 'https://www.ovhcloud.com/en-ie/bare-metal/prices/',
        dedicatedEcoRangeOrder: 'https://eco.ovhcloud.com/en-ie/',
        threeAZClusterOrder:
          'https://www.ovhcloud.com/en-ie/bare-metal/prices/?display=list&use_cases=multi-az',
        iplbOrder: 'https://www.ovh-hosting.fi/ratkaisut/load-balancer/',
      },
      FR: {
        express_order: 'https://www.ovh.com/fr/order/express/#/express/',
        express_order_resume:
          'https://www.ovh.com/fr/order/express/#/new/express/resume',
        support: 'https://www.ovh.com/fr/support/',
        support_contact: 'https://www.ovh.com/fr/support/nous-contacter/',
        guides: {
          home: 'https://docs.ovh.com',
          privateCloudHome: 'https://docs.ovh.com/fr/private-cloud/',
          autoRenew:
            'https://www.ovh.com/fr/g1271.guide_dutilisation_du_renouvellement_automatique_ovh',
          additionalDisksGuide:
            'https://www.ovh.com/fr/g2181.Commande_et_utilisation_d_un_disque_additionnel',
          all: 'https://www.ovh.com/fr/support/knowledge/',
          reinitPassword:
            'https://www.ovh.com/fr/g2366.changer_le_mot_de_passe_root_sur_un_vps',
          ipv6Vps: 'https://www.ovh.fr/g2365.vps-ipv6',
          megaRaidLED:
            'https://docs.ovh.com/fr/fr/cloud/dedicated/hotswap-raid-hard/',
          noMegaRaidLED:
            'https://docs.ovh.com/fr/fr/cloud/dedicated/hotswap-raid-soft/',
          diskSerial:
            'http://docs.ovh.com/fr/fr/cloud/dedicated/find-disk-serial-number/',
          vmEncryption: 'https://docs.ovh.com/fr/private-cloud/vm-encrypt/',
          billing: 'https://docs.ovh.com/fr/billing/',
          vrack:
            'https://docs.ovh.com/fr/dedicated/configurer-plusieurs-serveurs-dedies-dans-le-vrack/',
        },
        presentations: {
          home: 'https://www.ovh.com/fr/private-cloud/',
          nsx: 'https://www.ovh.com/fr/private-cloud/options/nsx.xml',
          veeam: 'https://www.ovh.com/fr/private-cloud/options/veeam.xml',
          vrops: 'https://www.ovh.com/fr/private-cloud/options/vrops.xml',
        },
        vpsCloud: 'https://www.ovh.com/fr/vps/vps-cloud.xml',
        dedicatedIpmi:
          'https://docs.ovh.com/fr/dedicated/utilisation-ipmi-serveurs-dedies/',
        changeOwner:
          'https://www.ovh.com/cgi-bin/fr/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.com/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        dedicated2016News:
          'https://www.ovh.com/fr/news/a1837.nouveaux-serveurs-dedies-2016',
        exchangeOrder: 'https://www.ovh.com/fr/emails/hosted-exchange/',
        housingPhoneSupport: '09 72 10 00 70',
        faq: 'https://www.ovh.com/fr/serveurs_dedies/faq.xml',
        faqVps: 'https://www.ovh.com/fr/vps/aide-faq.xml',
        faqDedicatedCloud:
          'https://pccdocs.ovh.net/pages/viewpage.action?pageId=7766169',
        dedicatedOrder: 'https://www.ovhcloud.com/fr/bare-metal/prices/',
        dedicatedEcoRangeOrder: 'https://eco.ovhcloud.com/fr/',
        threeAZClusterOrder:
          'https://www.ovhcloud.com/fr/bare-metal/prices/?display=list&use_cases=multi-az',
        cloudProjectOrder:
          'https://www.ovh.com/manager/cloud/#/iaas/pci/project/new',
        iplbOrder: 'https://www.ovh.com/fr/solutions/load-balancer/',
      },
      GB: {
        express_order: 'https://www.ovh.co.uk/order/express/#/express/',
        express_order_resume:
          'https://www.ovh.co.uk/order/express/#/new/express/resume',
        support: 'http://www.ovh.co.uk/support/',
        support_contact: 'http://www.ovh.co.uk/support/',
        guides: {
          home: 'http://help.ovh.co.uk/',
          privateCloudHome: 'https://docs.ovh.com/gb/en/private-cloud/',
          autoRenew:
            'https://www.ovh.co.uk/g1271.how_to_use_automatic_renewal_at_ovh',
          all: 'https://www.ovh.co.uk/community/knowledge/',
          nsx: 'https://www.ovh.co.uk/private-cloud/options/nsx.xml',
          vrops: 'https://www.ovh.co.uk/private-cloud/options/vrops.xml',
          pcidss:
            'https://www.ovh.co.uk/private-cloud/payment-infrastructure/pci-dss.xml',
          hds: 'https://www.ovh.co.uk/private-cloud/healthcare/agrement.xml',
          reinitPassword:
            'https://www.ovh.co.uk/g2366.change_the_root_password_on_a_vps_linux',
          ipv6Vps: 'https://www.ovh.co.uk/g2365.vps-ipv6',
          vmEncryption: 'https://docs.ovh.com/gb/en/private-cloud/vm-encrypt/',
          billing: 'https://docs.ovh.com/gb/en/billing/',
          vrack:
            'https://docs.ovh.com/gb/en/dedicated/configuring-vrack-on-dedicated-servers/',
        },
        presentations: {
          home: 'https://www.ovh.co.uk/private-cloud/',
          nsx: 'https://www.ovh.co.uk/private-cloud/options/nsx.xml',
          veeam: 'https://www.ovh.co.uk/private-cloud/options/veeam.xml',
          vrops: 'https://www.ovh.co.uk/private-cloud/options/vrops.xml',
        },
        vpsCloud: 'http://www.ovh.co.uk/vps/vps-cloud.xml',
        dedicatedIpmi:
          'https://docs.ovh.com/gb/en/dedicated/use-ipmi-dedicated-servers/',
        changeOwner:
          'https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.co.uk/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        exchangeOrder: 'https://www.ovh.co.uk/emails/hosted-exchange/',
        faq: 'https://www.ovh.co.uk/dedicated_servers/faq.xml',
        faqVps: 'https://www.ovh.co.uk/vps/faq-help.xml',
        dedicatedOrder: 'https://www.ovhcloud.com/en-gb/bare-metal/prices/',
        dedicatedEcoRangeOrder: 'https://eco.ovhcloud.com/en-gb/',
        threeAZClusterOrder:
          'https://www.ovhcloud.com/en-gb/bare-metal/prices/?display=list&use_cases=multi-az',
        iplbOrder: 'https://www.ovh.co.uk/solutions/load-balancer/',
      },
      IT: {
        express_order: 'https://www.ovh.it/order/express/#/express/',
        express_order_resume:
          'https://www.ovh.it/order/express/#/new/express/resume',
        support: 'http://www.ovh.it/supporto/',
        support_contact: 'http://www.ovh.it/supporto/',
        guides: {
          home: 'http://guida.ovh.it/',
          privateCloudHome: 'https://docs.ovh.com/it/private-cloud/',
          autoRenew:
            'https://www.ovh.it/g1271.imposta_il_rinnovo_automatico_dei_tuoi_servizi_ovh',
          reinitPassword:
            'https://www.ovh.it/g2366.modifica_la_password_di_root_su_un_vps_linux',
          ipv6Vps: 'https://www.ovh.it/g2365.vps-ipv6',
          billing: 'https://docs.ovh.com/it/billing/',
          vrack:
            'https://docs.ovh.com/it/dedicated/configurare-server-dedicati-vrack/',
        },
        presentations: {
          home: 'https://www.ovh.it/private-cloud/',
          nsx: 'https://www.ovh.it/private-cloud/opzioni/nsx.xml',
          veeam: 'https://www.ovh.it/private-cloud/opzioni/veeam.xml',
          vrops: 'https://www.ovh.it/private-cloud/opzioni/vrops.xml',
        },
        vpsCloud: 'http://www.ovh.it/vps/vps-cloud.xml',
        dedicatedIpmi:
          'https://docs.ovh.com/it/dedicated/utilizzo-ipmi-server-dedicati/',
        changeOwner:
          'https://www.ovh.it/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.it/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        dedicated2016News: 'http://www.ovh.it/a1837.news',
        exchangeOrder: 'https://www.ovh.it/emails/hosted-exchange/',
        faq: 'https://www.ovh.it/server_dedicati/faq.xml',
        faqVps: 'https://www.ovh.it/vps/aiuto-faq.xml',
        dedicatedOrder: 'https://www.ovhcloud.com/it/bare-metal/prices/',
        dedicatedEcoRangeOrder: 'https://eco.ovhcloud.com/it/',
        threeAZClusterOrder:
          'https://www.ovhcloud.com/it/bare-metal/prices/?display=list&use_cases=multi-az',
        iplbOrder: 'https://www.ovh.it/soluzioni/load-balancer/',
      },
      LT: {
        express_order: 'https://www.ovh.lt/order/express/#/express/',
        express_order_resume:
          'https://www.ovh.lt/order/express/#/new/express/resume',
        support: 'http://www.ovh.lt/pagalba/',
        support_contact: 'http://www.ovh.lt/pagalba/',
        guides: {
          home: 'http://gidai.ovh.lt/',
          privateCloudHome: 'https://docs.ovh.com/lt/private-cloud/',
          autoRenew:
            'https://www.ovh.lt/g1271.automatinis_ovh_paslaugu_galiojimo_pratesimas',
          reinitPassword:
            'https://www.ovh.lt/g2366.root_slaptazodzio_keitimas_vps_linux',
          ipv6Vps: 'https://www.ovh.lt/g2365.vps-ipv6',
          billing: 'https://docs.ovh.com/lt/billing/',
          vrack:
            'https://docs.ovh.com/lt/dedicated/configuring-vrack-on-dedicated-servers/',
        },
        presentations: {
          home: 'https://www.ovh.lt/private-cloud/',
          nsx: 'https://www.ovh.lt/private-cloud/parinktys/nsx.xml',
          veeam: 'https://www.ovh.lt/private-cloud/parinktys/veeam.xml',
          vrops: 'https://www.ovh.lt/private-cloud/parinktys/vrops.xml',
        },
        vpsCloud: 'http://www.ovh.lt/vps/vps-cloud.xml',
        dedicatedIpmi:
          'https://docs.ovh.com/lt/dedicated/use-ipmi-dedicated-servers/',
        changeOwner:
          'https://www.ovh.com/cgi-bin/lt/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.lt/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        dedicated2016News: 'http://www.ovh.lt/a1837.news',
        exchangeOrder: 'https://www.ovh.lt/El_pastas/hosted-exchange/',
        faq: 'https://www.ovh.lt/dedikuoti_serveriai/duk.xml',
        faqVps: 'https://www.ovh.lt/vps/pagalba-duk.xml',
        dedicatedOrder: 'https://www.ovhcloud.com/en-ie/bare-metal/prices/',
        dedicatedEcoRangeOrder: 'https://eco.ovhcloud.com/en-ie/',
        threeAZClusterOrder:
          'https://www.ovhcloud.com/en-ie/bare-metal/prices/?display=list&use_cases=multi-az',
        iplbOrder: 'https://www.ovh.lt/sprendimai/load-balancer/',
      },
      NL: {
        express_order: 'https://www.ovh.nl/order/express/#/express/',
        express_order_resume:
          'https://www.ovh.nl/order/express/#/new/express/resume',
        support: 'http://www.ovh.nl/support/',
        support_contact: 'http://www.ovh.nl/support/',
        guides: {
          home: 'http://gids.ovh.nl/',
          privateCloudHome: 'https://docs.ovh.com/nl/private-cloud/',
          autoRenew:
            'https://www.ovh.nl/g1271.ovh_handleiding_voor_het_gebruik_van_de_automatische_verlenging',
          ipv6Vps: 'https://www.ovh.nl/g2365.vps-ipv6',
          billing: 'https://docs.ovh.com/nl/billing/',
          vrack:
            'https://docs.ovh.com/nl/dedicated/configuratie-meerdere-dedicated-servers-op-vrack/',
        },
        presentations: {
          home: 'https://www.ovh.nl/private-cloud/',
          nsx: 'https://www.ovh.nl/private-cloud/opties/nsx.xml',
          veeam: 'https://www.ovh.nl/private-cloud/opties/veeam.xml',
          vrops: 'https://www.ovh.nl/private-cloud/opties/vrops.xml',
        },
        vpsCloud: 'http://www.ovh.nl/vps/vps-cloud.xml',
        dedicatedIpmi:
          'https://docs.ovh.com/nl/dedicated/gebruik-ipmi-dedicated-servers/',
        changeOwner:
          'https://www.ovh.nl/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.nl/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        dedicated2016News: 'http://www.ovh.nl/a1837.news',
        exchangeOrder: 'https://www.ovh.nl/emails/hosted-exchange/',
        faq: 'https://www.ovh.nl/dedicated_servers/faq.xml',
        faqVps: 'https://www.ovh.nl/vps/hulp-faq.xml',
        dedicatedOrder: 'https://www.ovhcloud.com/nl/bare-metal/prices/',
        dedicatedEcoRangeOrder: 'https://eco.ovhcloud.com/nl/',
        threeAZClusterOrder:
          'https://www.ovhcloud.com/nl/bare-metal/prices/?display=list&use_cases=multi-az',
        iplbOrder: 'https://www.ovh.nl/oplossing/load-balancer/',
      },
      PL: {
        express_order: 'https://www.ovh.pl/order/express/#/express/',
        express_order_resume:
          'https://www.ovh.pl/order/express/#/new/express/resume',
        support: 'https://www.ovh.pl/pomoc/',
        support_contact: 'https://www.ovh.pl/pomoc/',
        guides: {
          home: 'http://pomoc.ovh.pl/',
          privateCloudHome: 'https://docs.ovh.com/pl/private-cloud/',
          autoRenew:
            'https://www.ovh.pl/g1271.przewodnik_dotyczacy_opcji_automatycznego_odnawiania_uslug_w_ovh',
          reinitPassword:
            'https://www.ovh.pl/g2366.Zmiana_hasla_root_na_serwerze_vps_linux',
          ipv6Vps: 'https://www.ovh.pl/g2365.vps-ipv6',
          billing: 'https://docs.ovh.com/pl/billing/',
          vrack:
            'https://docs.ovh.com/pl/dedicated/konfiguracja-kilku-serwerow-dedykowanych-vrack/',
        },
        presentations: {
          home: 'https://www.ovh.pl/private-cloud/',
          nsx: 'https://www.ovh.pl/private-cloud/opcje/nsx.xml',
          veeam: 'https://www.ovh.pl/private-cloud/opcje/veeam.xml',
          vrops: 'https://www.ovh.pl/private-cloud/opcje/vrops.xml',
        },
        vpsCloud: 'https://www.ovh.pl/vps/vps-cloud.xml',
        dedicatedIpmi:
          'https://docs.ovh.com/pl/dedicated/uzywanie-ipmi-serwery-dedykowane/',
        changeOwner:
          'https://www.ovh.pl/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.pl/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        dedicated2016News: 'http://www.ovh.pl/a1837.news',
        exchangeOrder: 'https://www.ovh.pl/emaile/hosted-exchange/',
        faq: 'https://www.ovh.pl/serwery_dedykowane/faq.xml',
        faqVps: 'https://www.ovh.pl/vps/pomoc-faq.xml',
        dedicatedOrder: 'https://www.ovhcloud.com/pl/bare-metal/prices/',
        dedicatedEcoRangeOrder: 'https://eco.ovhcloud.com/pl/',
        threeAZClusterOrder:
          'https://www.ovhcloud.com/pl/bare-metal/prices/?display=list&use_cases=multi-az',
        iplbOrder: 'https://www.ovh.pl/rozwiazania/ip-load-balancing/',
      },
      PT: {
        express_order: 'https://www.ovh.pt/order/express/#/express/',
        express_order_resume:
          'https://www.ovh.pt/order/express/#/new/express/resume',
        support: 'https://www.ovh.pt/suporte/',
        support_contact: 'https://www.ovh.pt/suporte/',
        guides: {
          home: 'http://guias.ovh.pt/',
          privateCloudHome: 'https://docs.ovh.com/pt/private-cloud/',
          autoRenew:
            'https://www.ovh.pt/g1271.guia_de_utilizacao_da_renovacao_automatica_da_ovh',
          reinitPassword:
            'https://www.ovh.pt/g2366.alterar_a_password_root_num_servidor_vps_linux',
          ipv6Vps: 'https://www.ovh.pt/g2365.vps-ipv6',
          billing: 'https://docs.ovh.com/pt/billing/',
          vrack:
            'https://docs.ovh.com/pt/dedicated/configurar-varios-servidores-dedicados-no-vrack/',
        },
        presentations: {
          home: 'https://www.ovh.pt/private-cloud/',
          nsx: 'https://www.ovh.pt/private-cloud/opcoes/nsx.xml',
          veeam: 'https://www.ovh.pt/private-cloud/opcoes/veeam.xml',
          vrops: 'https://www.ovh.pt/private-cloud/opcoes/vrops.xml',
        },
        vpsCloud: 'http://www.ovh.pt/vps/vps-cloud.xml',
        dedicatedIpmi:
          'https://docs.ovh.com/pt/dedicated/usar-ipmi-servidores-dedicados/',
        changeOwner:
          'https://www.ovh.pt/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.pt/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        dedicated2016News: 'http://www.ovh.pt/a1837.news',
        exchangeOrder: 'https://www.ovh.pt/emails/hosted-exchange-2013/',
        faq: 'https://www.ovh.pt/servidores_dedicados/faq.xml ',
        faqVps: 'https://www.ovh.pt/vps/vps-ssd.xml',
        dedicatedOrder: 'https://www.ovhcloud.com/pt/bare-metal/prices/',
        dedicatedEcoRangeOrder: 'https://eco.ovhcloud.com/en-ie/',
        threeAZClusterOrder:
          'https://www.ovhcloud.com/pt/bare-metal/prices/?display=list&use_cases=multi-az',
        iplbOrder: 'https://www.ovh.pt/solucoes/load-balancer/',
      },
      IE: {
        express_order: 'https://www.ovh.ie/order/express/#/express/',
        express_order_resume:
          'https://www.ovh.ie/order/express/#/new/express/resume',
        support: 'https://www.ovh.ie/suport/',
        support_contact: 'https://www.ovh.ie/suport/',
        guides: {
          home: 'http://help.ovh.ie/',
          privateCloudHome: 'https://docs.ovh.com/ie/en/private-cloud/',
          autoRenew:
            'https://www.ovh.ie/g1271.how_to_use_automatic_renewal_at_ovh',
          all: 'https://www.ovh.ie/community/knowledge/',
          nsx: 'https://www.ovh.ie/private-cloud/options/nsx.xml',
          vrops: 'https://www.ovh.ie/private-cloud/options/vrops.xml',
          billing: 'https://docs.ovh.com/ie/en/billing/',
          vrack:
            'https://docs.ovh.com/ie/en/dedicated/configuring-vrack-on-dedicated-servers/',
        },
        presentations: {
          home: 'https://www.ovh.ie/private-cloud/',
          nsx: 'https://www.ovh.ie/private-cloud/options/nsx.xml',
          veeam: 'https://www.ovh.ie/private-cloud/options/veeam.xml',
          vrops: 'https://www.ovh.ie/private-cloud/options/vrops.xml',
        },
        vpsCloud: 'http://www.ovh.ie/vps/vps-cloud.xml',
        dedicatedIpmi:
          'https://docs.ovh.com/ie/en/dedicated/use-ipmi-dedicated-servers/',
        changeOwner:
          'https://www.ovh.ie/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.ie/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        dedicated2016News: 'http://www.ovh.ie/a1837.news',
        exchangeOrder: 'https://www.ovh.ie/emails/hosted-exchange-2013/',
        faq: 'https://www.ovh.ie/dedicated_servers/faq.xml',
        faqVps: 'https://www.ovh.ie/vps/vps-ssd.xml',
        dedicatedOrder: 'https://www.ovhcloud.com/en-ie/bare-metal/prices/',
        dedicatedEcoRangeOrder: 'https://eco.ovhcloud.com/en-ie/',
        threeAZClusterOrder:
          'https://www.ovhcloud.com/en-ie/bare-metal/prices/?display=list&use_cases=multi-az',
        iplbOrder: 'https://www.ovh.ie/solutions/load-balancer/',
      },
    },
    website_url: {
      new_nic: {
        en_AU: 'http://www.ovh.com/au/support/new_nic.xml',
        de_DE: 'http://www.ovh.de/support/new_nic.xml',
        en_GB: 'http://www.ovh.co.uk/support/new_nic.xml',
        en_CA: 'http://www.ovh.com/ca/en/support/new_nic.xml',
        en_US: 'http://www.ovh.com/us/support/new_nic.xml',
        es_ES: 'http://www.ovh.es/soporte/new_nic.xml',
        es_US: 'http://www.ovh.com/us/support/new_nic.xml',
        fr_CA: 'http://www.ovh.com/ca/fr/support/new_nic.xml',
        fr_FR: 'https://www.ovh.com/fr/support/new_nic.xml',
        fr_MA: 'http://www.ovh.ma/support/new_nic.xml',
        fr_SN: 'http://www.ovh.sn/support/new_nic.xml',
        fr_TN: 'http://www.ovh.com.tn/support/new_nic.xml',
        it_IT: 'https://www.ovh.it/cgi-bin/it/nic/newNic.cgi',
        lt_LT: 'http://www.ovh.lt/pagalba/new_nic.xml',
        nl_NL: 'http://www.ovh.nl/support/new_nic.xml',
        pl_PL: 'http://www.ovh.pl/support/new_nic.xml',
        pt_PT: 'http://www.ovh.pt/suporte/new_nic.xml',
        sk_SK: 'http://www.ovh.cz/podpora/new_nic.xml',
        fi_FI: 'http://www.ovh-hosting.fi/tuki/new_nic.xml',
        cs_CZ: 'http://www.ovh.cz/podpora/new_nic.xml',
      },
    },
    TOP_GUIDES: {
      all: {
        fr_FR: 'https://docs.ovh.com/fr/dedicated/',
        de_DE: 'https://docs.ovh.com/de/dedicated/',
        en_AU: 'https://docs.ovh.com/au/en/dedicated/',
        en_CA: 'https://docs.ovh.com/ca/en/dedicated/',
        en_GB: 'https://docs.ovh.com/gb/en/dedicated/',
        en_US: 'https://support.us.ovhcloud.com/hc/en-us',
        es_ES: 'https://docs.ovh.com/es/dedicated/',
        it_IT: 'https://docs.ovh.com/it/dedicated/',
        lt_LT: 'https://docs.ovh.com/lt/dedicated/',
        nl_NL: 'https://docs.ovh.com/nl/dedicated/',
        pl_PL: 'https://docs.ovh.com/pl/dedicated/',
        pt_PT: 'https://docs.ovh.com/pt/dedicated/',
        fi_FI: 'https://docs.ovh.com/fi/dedicated/',
        cs_CZ: 'https://docs.ovh.com/cz/cs/dedicated/',
      },
      sd: {
        FR: [
          {
            title: 'core_sd_top_guide_1_title',
            atInternetClickTag: 'getting-started-with-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/fr-dedicated-servers-getting-started-dedicated-server?id=kb_article_view&sysparm_article=KB0043481',
          },
          {
            title: 'core_sd_top_guide_2_title',
            atInternetClickTag: 'getting-started-with-eco-server',
            url:
              'https://help.ovhcloud.com/csm/fr-dedicated-servers-getting-started-dedicated-server-eco?id=kb_article_view&sysparm_article=KB0043494',
          },
          {
            title: 'core_sd_top_guide_3_title',
            atInternetClickTag: 'how-to-secure-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/fr-dedicated-servers-securing-server?id=kb_article_view&sysparm_article=KB0043978',
          },
          {
            title: 'core_sd_top_guide_4_title',
            atInternetClickTag: 'how-to-create-ssh-key',
            url:
              'https://help.ovhcloud.com/csm/fr-dedicated-servers-creating-ssh-keys?id=kb_article_view&sysparm_article=KB0043385',
          },
          {
            title: 'core_sd_top_guide_5_title',
            atInternetClickTag: 'ipmi-for-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/fr-dedicated-servers-ipmi?id=kb_article_view&sysparm_article=KB0044038',
          },
          {
            title: 'core_sd_top_guide_6_title',
            atInternetClickTag: 'migrate-data-between-servers',
            url:
              'https://help.ovhcloud.com/csm/fr-dedicated-servers-migrate-data-between-servers?id=kb_article_view&sysparm_article=KB0043707',
          },
          {
            title: 'core_sd_top_guide_7_title',
            atInternetClickTag: 'configure-new-window-server-installation',
            url:
              'https://help.ovhcloud.com/csm/fr-dedicated-servers-windows-first-config-dedicated?id=kb_article_view&sysparm_article=KB0044082',
          },
        ],
        DE: [
          {
            title: 'core_sd_top_guide_1_title',
            atInternetClickTag: 'getting-started-with-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/de-dedicated-servers-getting-started-dedicated-server?id=kb_article_view&sysparm_article=KB0030498',
          },
          {
            title: 'core_sd_top_guide_2_title',
            atInternetClickTag: 'getting-started-with-eco-server',
            url:
              'https://help.ovhcloud.com/csm/de-dedicated-servers-getting-started-dedicated-server-eco?id=kb_article_view&sysparm_article=KB0043485',
          },
          {
            title: 'core_sd_top_guide_3_title',
            atInternetClickTag: 'how-to-secure-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/de-dedicated-servers-securing-server?id=kb_article_view&sysparm_article=KB0043981',
          },
          {
            title: 'core_sd_top_guide_4_title',
            atInternetClickTag: 'how-to-create-ssh-key',
            url:
              'https://help.ovhcloud.com/csm/de-dedicated-servers-creating-ssh-keys?id=kb_article_view&sysparm_article=KB0030395',
          },
          {
            title: 'core_sd_top_guide_5_title',
            atInternetClickTag: 'ipmi-for-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/de-dedicated-servers-ipmi?id=kb_article_view&sysparm_article=KB0031092',
          },
          {
            title: 'core_sd_top_guide_6_title',
            atInternetClickTag: 'migrate-data-between-servers',
            url:
              'https://help.ovhcloud.com/csm/de-dedicated-servers-migrate-data-between-servers?id=kb_article_view&sysparm_article=KB0043692',
          },
          {
            title: 'core_sd_top_guide_7_title',
            atInternetClickTag: 'configure-new-window-server-installation',
            url:
              'https://help.ovhcloud.com/csm/de-dedicated-servers-windows-first-config-dedicated?id=kb_article_view&sysparm_article=KB0044073',
          },
        ],
        ES: [
          {
            title: 'core_sd_top_guide_1_title',
            atInternetClickTag: 'getting-started-with-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/es-es-dedicated-servers-getting-started-dedicated-server?id=kb_article_view&sysparm_article=KB0043480',
          },
          {
            title: 'core_sd_top_guide_2_title',
            atInternetClickTag: 'getting-started-with-eco-server',
            url:
              'https://help.ovhcloud.com/csm/es-es-dedicated-servers-getting-started-dedicated-server-eco?id=kb_article_view&sysparm_article=KB0043496',
          },
          {
            title: 'core_sd_top_guide_3_title',
            atInternetClickTag: 'how-to-secure-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/es-es-dedicated-servers-securing-server?id=kb_article_view&sysparm_article=KB0043976',
          },
          {
            title: 'core_sd_top_guide_4_title',
            atInternetClickTag: 'how-to-create-ssh-key',
            url:
              'https://help.ovhcloud.com/csm/es-es-dedicated-servers-creating-ssh-keys?id=kb_article_view&sysparm_article=KB0043383',
          },
          {
            title: 'core_sd_top_guide_5_title',
            atInternetClickTag: 'ipmi-for-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/es-es-dedicated-servers-ipmi?id=kb_article_view&sysparm_article=KB0044040',
          },
          {
            title: 'core_sd_top_guide_6_title',
            atInternetClickTag: 'migrate-data-between-servers',
            url:
              'https://help.ovhcloud.com/csm/es-es-dedicated-servers-migrate-data-between-servers?id=kb_article_view&sysparm_article=KB0043701',
          },
          {
            title: 'core_sd_top_guide_1_title',
            atInternetClickTag: 'TopGuide-DedicatedServers-1',
            url:
              'https://docs.ovh.com/ca/en/dedicated/getting-started-dedicated-server/',
          },
          {
            title: 'core_sd_top_guide_2_title',
            atInternetClickTag: 'TopGuide-DedicatedServers-2',
            url: 'https://docs.ovh.com/ca/en/dedicated/',
          },
          {
            title: 'core_sd_top_guide_3_title',
            atInternetClickTag: 'TopGuide-DedicatedServers-3',
            url:
              'https://docs.ovh.com/ca/en/public-cloud/configure-reverse-dns-instance/',
          },
          {
            title: 'core_sd_top_guide_firewall_title',
            atInternetClickTag: 'TopGuide-DedicatedServers-Firewall',
            url: 'https://docs.ovh.com/ca/en/dedicated/firewall-network/',
          },
          {
            title: 'core_sd_top_guide_5_title',
            atInternetClickTag: 'TopGuide-DedicatedServers-5',
            url: 'https://docs.ovh.com/ca/en/dedicated/network-virtual-mac/',
          },
          {
            title: 'core_sd_top_guide_6_title',
            atInternetClickTag: 'TopGuide-DedicatedServers-6',
            url: 'https://docs.ovh.com/ca/en/dedicated/network-ipaliasing/',
          },
          {
            title: 'core_sd_top_guide_7_title',
            atInternetClickTag: 'configure-new-window-server-installation',
            url:
              'https://help.ovhcloud.com/csm/es-es-dedicated-servers-windows-first-config-dedicated?id=kb_article_view&sysparm_article=KB0044080',
          },
        ],
        IT: [
          {
            title: 'core_sd_top_guide_1_title',
            atInternetClickTag: 'getting-started-with-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/it-dedicated-servers-getting-started-dedicated-server?id=kb_article_view&sysparm_article=KB0043487',
          },
          {
            title: 'core_sd_top_guide_2_title',
            atInternetClickTag: 'getting-started-with-eco-server',
            url:
              'https://help.ovhcloud.com/csm/it-dedicated-servers-getting-started-dedicated-server-eco?id=kb_article_view&sysparm_article=KB0043497',
          },
          {
            title: 'core_sd_top_guide_3_title',
            atInternetClickTag: 'how-to-secure-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/it-dedicated-servers-securing-server?id=kb_article_view&sysparm_article=KB0043982',
          },
          {
            title: 'core_sd_top_guide_4_title',
            atInternetClickTag: 'how-to-create-ssh-key',
            url:
              'https://help.ovhcloud.com/csm/it-dedicated-servers-creating-ssh-keys?id=kb_article_view&sysparm_article=KB0043384',
          },
          {
            title: 'core_sd_top_guide_5_title',
            atInternetClickTag: 'ipmi-for-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/it-dedicated-servers-ipmi?id=kb_article_view&sysparm_article=KB0044044',
          },
          {
            title: 'core_sd_top_guide_6_title',
            atInternetClickTag: 'migrate-data-between-servers',
            url:
              'https://help.ovhcloud.com/csm/it-dedicated-servers-migrate-data-between-servers?id=kb_article_view&sysparm_article=KB0043708',
          },
          {
            title: 'core_sd_top_guide_7_title',
            atInternetClickTag: 'configure-new-window-server-installation',
            url:
              'https://help.ovhcloud.com/csm/it-dedicated-servers-windows-first-config-dedicated?id=kb_article_view&sysparm_article=KB0044085',
          },
        ],
        IE: [
          {
            title: 'core_sd_top_guide_1_title',
            atInternetClickTag: 'getting-started-with-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/en-ie-dedicated-servers-getting-started-dedicated-server?id=kb_article_view&sysparm_article=KB0043476',
          },
          {
            title: 'core_sd_top_guide_2_title',
            atInternetClickTag: 'getting-started-with-eco-server',
            url:
              'https://help.ovhcloud.com/csm/en-ie-dedicated-servers-getting-started-dedicated-server-eco?id=kb_article_view&sysparm_article=KB0043490',
          },
          {
            title: 'core_sd_top_guide_3_title',
            atInternetClickTag: 'how-to-secure-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/en-ie-dedicated-servers-securing-server?id=kb_article_view&sysparm_article=KB0043971',
          },
          {
            title: 'core_sd_top_guide_4_title',
            atInternetClickTag: 'how-to-create-ssh-key',
            url:
              'https://help.ovhcloud.com/csm/en-ie-dedicated-servers-creating-ssh-keys?id=kb_article_view&sysparm_article=KB0043380',
          },
          {
            title: 'core_sd_top_guide_5_title',
            atInternetClickTag: 'ipmi-for-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/en-ie-dedicated-servers-ipmi?id=kb_article_view&sysparm_article=KB0044035',
          },
          {
            title: 'core_sd_top_guide_6_title',
            atInternetClickTag: 'migrate-data-between-servers',
            url:
              'https://help.ovhcloud.com/csm/en-ie-dedicated-servers-migrate-data-between-servers?id=kb_article_view&sysparm_article=KB0043689',
          },
          {
            title: 'core_sd_top_guide_7_title',
            atInternetClickTag: 'configure-new-window-server-installation',
            url:
              'https://help.ovhcloud.com/csm/en-ie-dedicated-servers-windows-first-config-dedicated?id=kb_article_view&sysparm_article=KB0044074',
          },
        ],
        PL: [
          {
            title: 'core_sd_top_guide_1_title',
            atInternetClickTag: 'getting-started-with-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/pl-dedicated-servers-getting-started-dedicated-server?id=kb_article_view&sysparm_article=KB0043483',
          },
          {
            title: 'core_sd_top_guide_2_title',
            atInternetClickTag: 'getting-started-with-eco-server',
            url:
              'https://help.ovhcloud.com/csm/pl-dedicated-servers-getting-started-dedicated-server-eco?id=kb_article_view&sysparm_article=KB0043504',
          },
          {
            title: 'core_sd_top_guide_3_title',
            atInternetClickTag: 'how-to-secure-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/pl-dedicated-servers-securing-server?id=kb_article_view&sysparm_article=KB0043983',
          },
          {
            title: 'core_sd_top_guide_4_title',
            atInternetClickTag: 'how-to-create-ssh-key',
            url:
              'https://help.ovhcloud.com/csm/pl-dedicated-servers-creating-ssh-keys?id=kb_article_view&sysparm_article=KB0043388',
          },
          {
            title: 'core_sd_top_guide_5_title',
            atInternetClickTag: 'ipmi-for-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/pl-dedicated-servers-ipmi?id=kb_article_view&sysparm_article=KB0044045',
          },
          {
            title: 'core_sd_top_guide_6_title',
            atInternetClickTag: 'migrate-data-between-servers',
            url:
              'https://help.ovhcloud.com/csm/pl-dedicated-servers-migrate-data-between-servers?id=kb_article_view&sysparm_article=KB0043709',
          },
          {
            title: 'core_sd_top_guide_7_title',
            atInternetClickTag: 'configure-new-window-server-installation',
            url:
              'https://help.ovhcloud.com/csm/pl-dedicated-servers-windows-first-config-dedicated?id=kb_article_view&sysparm_article=KB0044407',
          },
        ],
        PT: [
          {
            title: 'core_sd_top_guide_1_title',
            atInternetClickTag: 'getting-started-with-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/pt-dedicated-servers-getting-started-dedicated-server?id=kb_article_view&sysparm_article=KB0043484',
          },
          {
            title: 'core_sd_top_guide_2_title',
            atInternetClickTag: 'getting-started-with-eco-server',
            url:
              'https://help.ovhcloud.com/csm/pt-dedicated-servers-getting-started-dedicated-server-eco?id=kb_article_view&sysparm_article=KB0043502',
          },
          {
            title: 'core_sd_top_guide_3_title',
            atInternetClickTag: 'how-to-secure-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/pt-dedicated-servers-securing-server?id=kb_article_view&sysparm_article=KB0043986',
          },
          {
            title: 'core_sd_top_guide_4_title',
            atInternetClickTag: 'how-to-create-ssh-key',
            url:
              'https://help.ovhcloud.com/csm/pt-dedicated-servers-creating-ssh-keys?id=kb_article_view&sysparm_article=KB0043386',
          },
          {
            title: 'core_sd_top_guide_5_title',
            atInternetClickTag: 'ipmi-for-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/pt-dedicated-servers-ipmi?id=kb_article_view&sysparm_article=KB0044042',
          },
          {
            title: 'core_sd_top_guide_6_title',
            atInternetClickTag: 'migrate-data-between-servers',
            url:
              'https://help.ovhcloud.com/csm/pt-dedicated-servers-migrate-data-between-servers?id=kb_article_view&sysparm_article=KB0043702',
          },
          {
            title: 'core_sd_top_guide_7_title',
            atInternetClickTag: 'configure-new-window-server-installation',
            url:
              'https://help.ovhcloud.com/csm/pt-dedicated-servers-windows-first-config-dedicated?id=kb_article_view&sysparm_article=KB0044084',
          },
        ],
        EN: [
          {
            title: 'core_sd_top_guide_1_title',
            atInternetClickTag: 'getting-started-with-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/en-gb-dedicated-servers-getting-started-dedicated-server?id=kb_article_view&sysparm_article=KB0043475',
          },
          {
            title: 'core_sd_top_guide_2_title',
            atInternetClickTag: 'getting-started-with-eco-server',
            url:
              'https://help.ovhcloud.com/csm/en-gb-dedicated-servers-getting-started-dedicated-server-eco?id=kb_article_view&sysparm_article=KB0043488',
          },
          {
            title: 'core_sd_top_guide_3_title',
            atInternetClickTag: 'how-to-secure-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/en-gb-dedicated-servers-securing-server?id=kb_article_view&sysparm_article=KB0043969',
          },
          {
            title: 'core_sd_top_guide_4_title',
            atInternetClickTag: 'how-to-create-ssh-key',
            url:
              'https://help.ovhcloud.com/csm/en-gb-dedicated-servers-creating-ssh-keys?id=kb_article_view&sysparm_article=KB0043377',
          },
          {
            title: 'core_sd_top_guide_5_title',
            atInternetClickTag: 'ipmi-for-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/en-gb-dedicated-servers-ipmi?id=kb_article_view&sysparm_article=KB0044034',
          },
          {
            title: 'core_sd_top_guide_6_title',
            atInternetClickTag: 'migrate-data-between-servers',
            url:
              'https://help.ovhcloud.com/csm/en-gb-dedicated-servers-migrate-data-between-servers?id=kb_article_view&sysparm_article=KB0043697',
          },
          {
            title: 'core_sd_top_guide_7_title',
            atInternetClickTag: 'configure-new-window-server-installation',
            url:
              'https://help.ovhcloud.com/csm/en-gb-dedicated-servers-windows-first-config-dedicated?id=kb_article_view&sysparm_article=KB0044077',
          },
        ],
        AU: [
          {
            title: 'core_sd_top_guide_1_title',
            atInternetClickTag: 'getting-started-with-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/en-au-dedicated-servers-getting-started-dedicated-server?id=kb_article_view&sysparm_article=KB0043474',
          },
          {
            title: 'core_sd_top_guide_2_title',
            atInternetClickTag: 'getting-started-with-eco-server',
            url:
              'https://help.ovhcloud.com/csm/en-au-dedicated-servers-getting-started-dedicated-server-eco?id=kb_article_view&sysparm_article=KB0043486',
          },
          {
            title: 'core_sd_top_guide_3_title',
            atInternetClickTag: 'how-to-secure-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/en-au-dedicated-servers-securing-server?id=kb_article_view&sysparm_article=KB0043972',
          },
          {
            title: 'core_sd_top_guide_4_title',
            atInternetClickTag: 'how-to-create-ssh-key',
            url:
              'https://help.ovhcloud.com/csm/en-au-dedicated-servers-creating-ssh-keys?id=kb_article_view&sysparm_article=KB0043375',
          },
          {
            title: 'core_sd_top_guide_5_title',
            atInternetClickTag: 'ipmi-for-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/en-au-dedicated-servers-ipmi?id=kb_article_view&sysparm_article=KB0044033',
          },
          {
            title: 'core_sd_top_guide_6_title',
            atInternetClickTag: 'migrate-data-between-servers',
            url:
              'https://help.ovhcloud.com/csm/en-au-dedicated-servers-migrate-data-between-servers?id=kb_article_view&sysparm_article=KB0043696',
          },
          {
            title: 'core_sd_top_guide_7_title',
            atInternetClickTag: 'configure-new-window-server-installation',
            url:
              'https://help.ovhcloud.com/csm/en-gb-dedicated-servers-windows-first-config-dedicated?id=kb_article_view&sysparm_article=KB0044077', // TODO
          },
        ],
        ASIA: [
          {
            title: 'core_sd_top_guide_1_title',
            atInternetClickTag: 'getting-started-with-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/asia-dedicated-servers-getting-started-dedicated-server?id=kb_article_view&sysparm_article=KB0043472',
          },
          {
            title: 'core_sd_top_guide_2_title',
            atInternetClickTag: 'getting-started-with-eco-server',
            url:
              'https://help.ovhcloud.com/csm/asia-dedicated-servers-getting-started-dedicated-server-eco?id=kb_article_view&sysparm_article=KB0030513',
          },
          {
            title: 'core_sd_top_guide_3_title',
            atInternetClickTag: 'how-to-secure-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/asia-dedicated-servers-securing-server?id=kb_article_view&sysparm_article=KB0031024',
          },
          {
            title: 'core_sd_top_guide_4_title',
            atInternetClickTag: 'how-to-create-ssh-key',
            url:
              'https://help.ovhcloud.com/csm/asia-dedicated-servers-creating-ssh-keys?id=kb_article_view&sysparm_article=KB0043373',
          },
          {
            title: 'core_sd_top_guide_5_title',
            atInternetClickTag: 'ipmi-for-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/asia-dedicated-servers-ipmi?id=kb_article_view&sysparm_article=KB0044031',
          },
          {
            title: 'core_sd_top_guide_6_title',
            atInternetClickTag: 'migrate-data-between-servers',
            url:
              'https://help.ovhcloud.com/csm/asia-dedicated-servers-migrate-data-between-servers?id=kb_article_view&sysparm_article=KB0030724',
          },
          {
            title: 'core_sd_top_guide_7_title',
            atInternetClickTag: 'configure-new-window-server-installation',
            url:
              'https://help.ovhcloud.com/csm/en-ca-dedicated-servers-windows-first-config-dedicated?id=kb_article_view&sysparm_article=KB0044076',
          },
        ],
        SG: [
          {
            title: 'core_sd_top_guide_1_title',
            atInternetClickTag: 'getting-started-with-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/en-sg-dedicated-servers-getting-started-dedicated-server?id=kb_article_view&sysparm_article=KB0043478',
          },
          {
            title: 'core_sd_top_guide_2_title',
            atInternetClickTag: 'getting-started-with-eco-server',
            url:
              'https://help.ovhcloud.com/csm/en-sg-dedicated-servers-getting-started-dedicated-server-eco?id=kb_article_view&sysparm_article=KB0043493',
          },
          {
            title: 'core_sd_top_guide_3_title',
            atInternetClickTag: 'how-to-secure-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/en-sg-dedicated-servers-securing-server?id=kb_article_view&sysparm_article=KB0043974',
          },
          {
            title: 'core_sd_top_guide_4_title',
            atInternetClickTag: 'how-to-create-ssh-key',
            url:
              'https://help.ovhcloud.com/csm/en-sg-dedicated-servers-creating-ssh-keys?id=kb_article_view&sysparm_article=KB0043379',
          },
          {
            title: 'core_sd_top_guide_5_title',
            atInternetClickTag: 'ipmi-for-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/en-sg-dedicated-servers-ipmi?id=kb_article_view&sysparm_article=KB0044032',
          },
          {
            title: 'core_sd_top_guide_6_title',
            atInternetClickTag: 'migrate-data-between-servers',
            url:
              'https://help.ovhcloud.com/csm/en-sg-dedicated-servers-migrate-data-between-servers?id=kb_article_view&sysparm_article=KB0043699',
          },
          {
            title: 'core_sd_top_guide_7_title',
            atInternetClickTag: 'configure-new-window-server-installation',
            url:
              'https://help.ovhcloud.com/csm/en-sg-dedicated-servers-windows-first-config-dedicated?id=kb_article_view&sysparm_article=KB0044079',
          },
          {
            title: 'core_sd_top_guide_8_title',
            atInternetClickTag: 'TopGuide-DedicatedServers-8',
            url:
              'https://docs.ovh.com/ca/en/dedicated/find-disk-serial-number/',
          },
        ],
      },
      pcc: {
        fr_FR: [
          {
            title: 'core_pcc_top_guide_13_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-13',
            url:
              'https://help.ovhcloud.com/csm/fr-vmware-authorise-ip-addresses-vcenter?id=kb_article_view&sysparm_article=KB0045333',
          },
          {
            title: 'core_pcc_top_guide_12_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-12',
            url:
              'https://help.ovhcloud.com/csm/fr-documentation-hosted-private-cloud-sap-ovhcloud?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=2060f0edb41ca5141e11b36be2047d2a',
          },
          {
            title: 'core_pcc_top_guide_11_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-11',
            url: 'https://docs.ovh.com/fr/nutanix/',
          },
          {
            title: 'core_pcc_top_guide_1_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-1',
            url:
              'https://docs.ovh.com/fr/private-cloud/connexion-interface-vsphere/',
          },
          {
            title: 'core_pcc_top_guide_2_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-2',
            url:
              'https://docs.ovh.com/fr/private-cloud/deploiement-d-une-machine-virtuelle/',
          },
          {
            title: 'core_pcc_top_guide_3_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-3',
            url:
              'https://docs.ovh.com/fr/private-cloud/configuration-ip-machine-virtuelle/',
          },
          {
            title: 'core_pcc_top_guide_4_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-4',
            url:
              'https://docs.ovh.com/fr/private-cloud/modification-des-ressources-d-une-machine-virtuelle/',
          },
          {
            title: 'core_pcc_top_guide_5_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-5',
            url: 'https://docs.ovh.com/fr/private-cloud/connexion-en-sftp/',
          },
          {
            title: 'core_pcc_top_guide_6_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-6',
            url: 'https://www.vmware.com/support/pubs/',
          },
          {
            title: 'core_pcc_top_guide_7_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-7',
            url:
              'https://docs.ovh.com/fr/private-cloud/suppression-serveur-hote/#supprimer-le-serveur-hote',
          },
          {
            title: 'core_pcc_top_guide_10_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-10',
            url: 'http://pubs.vmware.com/NSX-62/index.jsp?lang=fr',
          },
          {
            title: 'core_pcc_top_guide_14_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-14',
            url:
              'https://help.ovhcloud.com/csm/fr-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad&spa=1',
          },
        ],
        de_DE: [
          {
            title: 'core_pcc_top_guide_13_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-13',
            url:
              'https://help.ovhcloud.com/csm/de-vmware-authorise-ip-addresses-vcenter?id=kb_article_view&sysparm_article=KB0045323',
          },
          {
            title: 'core_pcc_top_guide_12_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-12',
            url:
              'https://help.ovhcloud.com/csm/de-documentation-hosted-private-cloud-sap-ovhcloud?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=2060f0edb41ca5141e11b36be2047d2a',
          },
          {
            title: 'core_pcc_top_guide_1_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-1',
            url:
              'https://docs.ovh.com/de/private-cloud/den_vsphere_client_installieren/',
          },
          {
            title: 'core_pcc_top_guide_2_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-2',
            url:
              'https://docs.ovh.com/de/private-cloud/virtuelle-maschine-deployen/',
          },
          {
            title: 'core_pcc_top_guide_3_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-3',
            url:
              ' https://docs.ovh.com/de/private-cloud/ip-server-konfiguration/',
          },
          {
            title: 'core_pcc_top_guide_4_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-4',
            url:
              'https://docs.ovh.com/de/private-cloud/nderung_der_hardware-konfiguration_einer_virtuellen_maschine/',
          },
          {
            title: 'core_pcc_top_guide_5_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-5',
            url: 'https://docs.ovh.com/de/private-cloud/verbindung_per_sftp/',
          },
          {
            title: 'core_pcc_top_guide_6_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-6',
            url: 'https://www.vmware.com/support/pubs/',
          },
          {
            title: 'core_pcc_top_guide_7_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-7',
            url: 'https://docs.ovh.com/de/private-cloud/host-server-loeschen/',
          },
          {
            title: 'core_pcc_top_guide_10_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-10',
            url:
              'https://docs.vmware.com/de/VMware-NSX-Data-Center-for-vSphere/index.html',
          },
          {
            title: 'core_pcc_top_guide_14_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-14',
            url:
              'https://help.ovhcloud.com/csm/worldeuro-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad',
          },
        ],
        en_GB: [
          {
            title: 'core_pcc_top_guide_13_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-13',
            url:
              'https://help.ovhcloud.com/csm/en-gb-vmware-authorise-ip-addresses-vcenter?id=kb_article_view&sysparm_article=KB0045321',
          },
          {
            title: 'core_pcc_top_guide_12_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-12',
            url:
              'https://help.ovhcloud.com/csm/en-gb-documentation-hosted-private-cloud-sap-ovhcloud?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=2060f0edb41ca5141e11b36be2047d2a',
          },
          {
            title: 'core_pcc_top_guide_11_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-11',
            url: 'https://docs.ovh.com/us/en/nutanix/',
          },
          {
            title: 'core_pcc_top_guide_3_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-3',
            url:
              'https://www.ovh.co.uk/g582.configure_an_ip_address_on_a_virtual_machine',
          },
          {
            title: 'core_pcc_top_guide_4_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-4',
            url:
              'https://www.ovh.co.uk/g587.modify_the_hardware_configuration_of_your_virtual_machine',
          },
          {
            title: 'core_pcc_top_guide_5_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-5',
            url: 'https://www.ovh.co.uk/g589.sftp_connection',
          },
          {
            title: 'core_pcc_top_guide_6_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-6',
            url: 'https://www.vmware.com/support/pubs/',
          },
          {
            title: 'core_pcc_top_guide_7_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-7',
            url: 'https://pccdocs.ovh.net/display/VS/Remove+a+host',
          },
          {
            title: 'core_pcc_top_guide_9_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-9',
            url: 'https://pccdocs.ovh.net/display/ND/Getting+Started+with+NSX',
          },
          {
            title: 'core_pcc_top_guide_10_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-10',
            url: 'http://pubs.vmware.com/NSX-62/index.jsp?lang=en',
          },
          {
            title: 'core_pcc_top_guide_14_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-14',
            url:
              'https://help.ovhcloud.com/csm/worldeuro-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad',
          },
        ],
      },
    },
    accountCreation: {
      default: 'https://www.ovh.com/auth/signup/#/?ovhCompany=ovh',
      CZ: 'https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=cz',
      DE: 'https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=de',
      ES: 'https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=es',
      FI: 'https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=fi',
      FR: 'https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=fr',
      GB: 'https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=gb',
      IE: 'https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=ie',
      IT: 'https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=it',
      LT: 'https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=lt',
      NL: 'https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=nl',
      PL: 'https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=pl',
      PT: 'https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=pt',
      SN: 'https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=sn',
      TN: 'https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=tn',
    },
    billingRenew: {
      CA:
        'https://ca.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      CZ:
        'https://www.ovh.cz/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      DE:
        'https://www.ovh.de/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      EN:
        'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      ES:
        'https://www.ovh.es/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      FI:
        'https://www.ovh-hosting.fi/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      FR:
        'https://eu.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      GB:
        'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      IE:
        'https://www.ovh.ie/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      IT:
        'https://www.ovh.it/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      LT:
        'https://www.ovh.lt/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      MA:
        'https://www.ovh.com/ma/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      NL:
        'https://www.ovh.nl/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      PL:
        'https://www.ovh.pl/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      PT:
        'https://www.ovh.pt/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      QC:
        'https://ca.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      RU:
        'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      SN:
        'https://www.ovh.sn/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      TN:
        'https://www.ovh.com/tn/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      WE:
        'https://ca.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
    },
    SUPPORT: {
      CZ: '+420 246 030 899',
      DE: '+49 (0)681 906730',
      ES: '902 106 113',
      FI: '(09) 477 8910',
      FR: '1007',
      GB: '0333 370 0425',
      IE: '+353 (0)1 293 7844',
      IT: '02 5560 0423',
      LT: '+370 5 243 00 10',
      NL: '+31 (0)20 808 6057',
      PL: '71 750 02 00',
      PT: '+351 213 155 642',
    },
  },
  CA: {
    RENEW_URL:
      'https://ca.ovh.com/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
    vmsUrl: {
      IN: 'https://vms.status-ovhcloud.com/index_ynm1.html',
      OTHERS: 'http://vms.status-ovhcloud.com/',
    },
    statusUrl: 'https://www.status-ovhcloud.com/',
    UNIVERS: 'dedicated',
    SECTIONS_UNIVERSE_MAP: {
      sd: ['server'],
      pcc: ['hpc'],
    },
    URLS: {
      ASIA: {
        express_order: 'https://ca.ovh.com/asia/order/express/#/express/',
        express_order_resume:
          'https://ca.ovh.com/asia/order/express/#/new/express/resume',
        support: 'http://www.ovh.co.uk/support/',
        support_contact: 'https://www.ovh.com/ca/en/support/',
        guides: {
          home: 'https://docs.ovh.com/ca/en/',
          privateCloudHome: 'https://docs.ovh.com/ca/en/private-cloud/',
          reinitPassword:
            'http://docs.ovh.ca/en/faqs-server-issues.html#server-password-lost-forgotten',
          ipv6Vps: 'https://www.ovh.com/us/g2365.vps-ipv6',
        },
        presentations: {
          home: 'https://www.ovh.com/asia/private-cloud/',
          nsx: 'https://www.ovh.com/asia/private-cloud/options/nsx.xml',
          veeam: 'https://www.ovh.com/asia/private-cloud/options/veeam.xml',
          vrops: 'https://www.ovh.com/asia/private-cloud/options/vrops.xml',
        },
        vpsCloud: 'https://www.ovh.com/ca/en/vps/vps-cloud.xml',
        dedicatedIpmi:
          'https://docs.ovh.com/gb/en/dedicated/use-ipmi-dedicated-servers/',
        changeOwner:
          'https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.co.uk/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        exchangeOrder: 'https://www.ovh.com/us/emails/hosted-exchange/',
        faq: 'https://www.ovh.com/ca/en/dedicated-servers/faq.xml',
        faqVps: 'https://www.ovh.com/us/vps/faq-help.xml',
        dedicatedOrder: 'https://www.ovhcloud.com/asia/bare-metal/prices/',
        dedicatedEcoRangeOrder: 'https://eco.ovhcloud.com/asia/',
        threeAZClusterOrder:
          'https://www.ovhcloud.com/asia/bare-metal/prices/?display=list&use_cases=multi-az',
        cloudProjectOrder:
          'https://ca.ovh.com/manager/cloud/index.html#/iaas/pci/project/new',
        iplbOrder: 'https://www.ovh.com/world/solutions/load-balancer/',
      },
      IN: {
        express_order: 'https://ca.ovh.com/in/order/express/#/express/',
        express_order_resume:
          'https://ca.ovh.com/in/order/express/#/new/express/resume',
        support: 'http://www.ovh.co.uk/support/',
        support_contact: 'https://www.ovh.com/ca/en/support/',
        guides: {
          home: 'https://docs.ovh.com/ca/en/',
          privateCloudHome: 'https://docs.ovh.com/ca/en/private-cloud/',
          reinitPassword:
            'http://docs.ovh.ca/en/faqs-server-issues.html#server-password-lost-forgotten',
          ipv6Vps: 'https://www.ovh.com/us/g2365.vps-ipv6',
        },
        presentations: {
          home: 'https://www.ovh.com/asia/private-cloud/',
          nsx: 'https://www.ovh.com/asia/private-cloud/options/nsx.xml',
          veeam: 'https://www.ovh.com/asia/private-cloud/options/veeam.xml',
          vrops: 'https://www.ovh.com/asia/private-cloud/options/vrops.xml',
        },
        vpsCloud: 'https://www.ovh.com/ca/en/vps/vps-cloud.xml',
        dedicatedIpmi:
          'https://docs.ovh.com/gb/en/dedicated/use-ipmi-dedicated-servers/',
        changeOwner:
          'https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.co.uk/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        RealTimeMonitoring: 'https://docs.ovh.com/gb/en/dedicated/install-rtm/',
        exchangeOrder: 'https://www.ovh.com/us/emails/hosted-exchange/',
        faq: 'https://www.ovh.com/ca/en/dedicated-servers/faq.xml',
        faqVps: 'https://www.ovh.com/us/vps/faq-help.xml',
        dedicatedOrder: 'https://www.ovhcloud.com/en-in/bare-metal/prices/',
        dedicatedEcoRangeOrder: 'https://eco.static.ovh.net/en-in/',
        threeAZClusterOrder:
          'https://www.ovhcloud.com/en-in/bare-metal/prices/?display=list&use_cases=multi-az',
        cloudProjectOrder:
          'https://ca.ovh.com/manager/cloud/index.html#/iaas/pci/project/new',
        iplbOrder: 'https://www.ovh.com/world/solutions/load-balancer/',
      },
      AU: {
        express_order: 'https://ca.ovh.com/au/order/express/#/express/',
        express_order_resume:
          'https://ca.ovh.com/au/order/express/#/new/express/resume',
        support: 'http://www.ovh.co.uk/support/',
        support_contact: 'https://www.ovh.com/ca/en/support/',
        guides: {
          home: 'https://docs.ovh.com/ca/en/',
          privateCloudHome: 'https://docs.ovh.com/au/en/private-cloud/',
          reinitPassword:
            'http://docs.ovh.ca/en/faqs-server-issues.html#server-password-lost-forgotten',
          ipv6Vps: 'https://www.ovh.com/us/g2365.vps-ipv6',
          billing: 'https://docs.ovh.com/au/en/billing/',
        },
        presentations: {
          home: 'https://www.ovh.com.au/private-cloud/',
          nsx: 'https://www.ovh.com.au/private-cloud/options/nsx.xml',
          veeam: 'https://www.ovh.com.au/private-cloud/options/veeam.xml',
          vrops: 'https://www.ovh.com.au/private-cloud/options/vrops.xml',
        },
        vpsCloud: 'https://www.ovh.com/ca/en/vps/vps-cloud.xml',
        dedicatedIpmi:
          'https://docs.ovh.com/gb/en/dedicated/use-ipmi-dedicated-servers/',
        changeOwner:
          'https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.co.uk/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        exchangeOrder: 'https://www.ovh.com/us/emails/hosted-exchange/',
        faq: 'https://www.ovh.com/ca/en/dedicated-servers/faq.xml',
        faqVps: 'https://www.ovh.com/us/vps/faq-help.xml',
        dedicatedOrder: 'https://www.ovhcloud.com/en-au/bare-metal/prices/',
        dedicatedEcoRangeOrder: 'https://eco.ovhcloud.com/en-au/',
        threeAZClusterOrder:
          'https://www.ovhcloud.com/en-au/bare-metal/prices/?display=list&use_cases=multi-az',
        cloudProjectOrder:
          'https://ca.ovh.com/manager/cloud/index.html#/iaas/pci/project/new',
        iplbOrder: 'https://www.ovh.com/world/solutions/load-balancer/',
      },
      CA: {
        // eq to en_CA
        express_order: 'https://ca.ovh.com/en/order/express/#/express/',
        express_order_resume:
          'https://ca.ovh.com/en/order/express/#/new/express/resume',
        support: 'http://www.ovh.co.uk/support/',
        support_contact: 'https://www.ovh.com/ca/en/support/',
        guides: {
          home: 'https://docs.ovh.com/ca/en/',
          privateCloudHome: 'https://docs.ovh.com/ca/en/private-cloud/',
          reinitPassword:
            'http://docs.ovh.ca/en/faqs-server-issues.html#server-password-lost-forgotten',
          ipv6Vps: 'https://www.ovh.com/ca/en/g2365.vps-ipv6',
          billing: 'https://docs.ovh.com/ca/en/billing/',
        },
        presentations: {
          home: 'https://www.ovh.com/ca/en/private-cloud/',
          nsx: 'https://www.ovh.com/ca/en/private-cloud/options/nsx.xml',
          veeam: 'https://www.ovh.com/ca/en/private-cloud/options/veeam.xml',
          vrops: 'https://www.ovh.com/ca/en/private-cloud/options/vrops.xml',
        },
        vpsCloud: 'https://www.ovh.com/ca/en/vps/vps-cloud.xml',
        dedicatedIpmi:
          'https://docs.ovh.com/gb/en/dedicated/use-ipmi-dedicated-servers/',
        changeOwner:
          'https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://ca.ovh.com/en/order/domain/#/legacy/domain/trade/list?options=~~(domain~~'{domain})",
        exchangeOrder: 'https://www.ovh.com/ca/en/emails/hosted-exchange/',
        faq: 'https://www.ovh.com/ca/en/dedicated-servers/faq.xml',
        faqVps: 'https://www.ovh.com/ca/en/vps/faq-help.xml',
        dedicatedOrder: 'https://www.ovhcloud.com/en-ca/bare-metal/prices/',
        dedicatedEcoRangeOrder: 'https://eco.ovhcloud.com/en-ca/',
        threeAZClusterOrder:
          'https://www.ovhcloud.com/en-ca/bare-metal/prices/?display=list&use_cases=multi-az',
        cloudProjectOrder:
          'https://ca.ovh.com/manager/cloud/index.html#/iaas/pci/project/new',
        iplbOrder: 'https://www.ovh.com/ca/en/solutions/load-balancer/',
      },
      QC: {
        // eq to fr_CA
        express_order: 'https://ca.ovh.com/fr/order/express/#/express/',
        express_order_resume:
          'https://ca.ovh.com/fr/order/express/#/new/express/resume',
        support: 'https://www.ovh.com/fr/support/',
        support_contact: 'https://www.ovh.com/ca/fr/support/',
        guides: {
          home: 'https://docs.ovh.com/ca/fr/',
          privateCloudHome: 'https://docs.ovh.com/ca/fr/private-cloud/',
          reinitPassword:
            'http://docs.ovh.ca/fr/faqs-server-issues.html#server-password-lost-forgotten',
          ipv6Vps: 'https://www.ovh.com/ca/fr/g2365.vps-ipv6',
          billing: 'https://docs.ovh.com/ca/fr/billing/',
        },
        presentations: {
          home: 'https://www.ovh.com/ca/fr/private-cloud/',
          nsx: 'https://www.ovh.com/ca/fr/private-cloud/options/nsx.xml',
          veeam: 'https://www.ovh.com/ca/fr/private-cloud/options/veeam.xml',
          vrops: 'https://www.ovh.com/ca/fr/private-cloud/options/vrops.xml',
        },
        vpsCloud: 'https://www.ovh.com/ca/fr/vps/vps-cloud.xml',
        dedicatedIpmi:
          'https://docs.ovh.com/fr/dedicated/utilisation-ipmi-serveurs-dedies/',
        changeOwner:
          'https://www.ovh.com/cgi-bin/fr/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.com/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        exchangeOrder: 'https://www.ovh.com/ca/fr/emails/hosted-exchange/',
        faq: 'https://www.ovh.com/ca/fr/serveurs-dedies/faq.xml',
        faqVps: 'https://www.ovh.com/ca/fr/vps/aide-faq.xml',
        dedicatedOrder: 'https://www.ovhcloud.com/fr-ca/bare-metal/prices/',
        dedicatedEcoRangeOrder: 'https://eco.ovhcloud.com/fr-ca/',
        threeAZClusterOrder:
          'https://www.ovhcloud.com/fr-ca/bare-metal/prices/?display=list&use_cases=multi-az',
        cloudProjectOrder:
          'https://ca.ovh.com/manager/cloud/index.html#/iaas/pci/project/new',
        iplbOrder: 'https://www.ovh.com/ca/fr/solutions/load-balancer/',
      },
      SG: {
        express_order: 'https://ca.ovh.com/sg/order/express/#/express/',
        express_order_resume:
          'https://ca.ovh.com/sg/order/express/#/new/express/resume',
        support: 'http://www.ovh.co.uk/support/',
        support_contact: 'https://www.ovh.com/ca/en/support/',
        guides: {
          home: 'https://docs.ovh.com/ca/en/',
          privateCloudHome: 'https://docs.ovh.com/sg/en/private-cloud/',
          reinitPassword:
            'http://docs.ovh.ca/en/faqs-server-issues.html#server-password-lost-forgotten',
          ipv6Vps: 'https://www.ovh.com/us/g2365.vps-ipv6',
        },
        presentations: {
          home: 'https://www.ovh.com/sg/private-cloud/',
          nsx: 'https://www.ovh.com/sg/private-cloud/options/nsx.xml',
          veeam: 'https://www.ovh.com/sg/private-cloud/options/veeam.xml',
          vrops: 'https://www.ovh.com/sg/private-cloud/options/vrops.xml',
        },
        vpsCloud: 'https://www.ovh.com/ca/en/vps/vps-cloud.xml',
        dedicatedIpmi:
          'https://docs.ovh.com/gb/en/dedicated/use-ipmi-dedicated-servers/',
        changeOwner:
          'https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.co.uk/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        exchangeOrder: 'https://www.ovh.com/us/emails/hosted-exchange/',
        faq: 'https://www.ovh.es/servidores_dedicados/faq.xml',
        faqVps: 'https://www.ovh.com/us/vps/faq-help.xml',
        dedicatedOrder: 'https://www.ovhcloud.com/en-sg/bare-metal/prices/',
        dedicatedEcoRangeOrder: 'https://eco.ovhcloud.com/en-sg/',
        threeAZClusterOrder:
          'https://www.ovhcloud.com/en-sg/bare-metal/prices/?display=list&use_cases=multi-az',
        cloudProjectOrder:
          'https://ca.ovh.com/manager/cloud/index.html#/iaas/pci/project/new',
        iplbOrder: 'https://www.ovh.com/world/solutions/load-balancer/',
      },
      WE: {
        express_order: 'https://us.ovh.com/us/order/express/#/express/',
        express_order_resume:
          'https://us.ovh.com/us/order/express/#/new/express/resume',
        support: 'http://www.ovh.co.uk/support/',
        support_contact: 'https://www.ovh.com/ca/en/support/',
        guides: {
          home: 'https://docs.ovh.com/ca/en/',
          privateCloudHome: 'https://docs.ovh.com/ca/en/private-cloud/',
          reinitPassword:
            'http://docs.ovh.ca/en/faqs-server-issues.html#server-password-lost-forgotten',
          ipv6Vps: 'https://www.ovh.com/us/g2365.vps-ipv6',
        },
        presentations: {
          home: 'https://www.ovh.com/world/private-cloud/',
          nsx: 'https://www.ovh.com/world/private-cloud/options/nsx.xml',
          veeam: 'https://www.ovh.com/world/private-cloud/options/veeam.xml',
          vrops: 'https://www.ovh.com/world/private-cloud/options/vrops.xml',
        },
        vpsCloud: 'https://www.ovh.com/ca/en/vps/vps-cloud.xml',
        dedicatedIpmi:
          'https://docs.ovh.com/gb/en/dedicated/use-ipmi-dedicated-servers/',
        changeOwner:
          'https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.co.uk/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        exchangeOrder: 'https://www.ovh.com/us/emails/hosted-exchange/',
        faq: 'https://www.ovh.es/servidores_dedicados/faq.xml',
        faqVps: 'https://www.ovh.com/us/vps/faq-help.xml',
        dedicatedOrder: 'https://www.ovhcloud.com/en/bare-metal/prices/',
        dedicatedEcoRangeOrder: 'https://eco.ovhcloud.com/en/',
        threeAZClusterOrder:
          'https://www.ovhcloud.com/en/bare-metal/prices/?display=list&use_cases=multi-az',
        cloudProjectOrder:
          'https://ca.ovh.com/manager/cloud/index.html#/iaas/pci/project/new',
        iplbOrder: 'https://www.ovh.com/world/solutions/load-balancer/',
      },
      WS: {
        // eq to es_US
        express_order: 'https://us.ovh.com/es/order/express/#/express/',
        express_order_resume:
          'https://us.ovh.com/es/order/express/#/new/express/resume',
        support: 'https://www.ovh.com/fr/support/',
        support_contact: 'https://www.ovh.com/ca/en/support/',
        guides: {
          home: 'https://docs.ovh.com/ca/en/',
          privateCloudHome: 'https://docs.ovh.com/ca/en/private-cloud/',
          reinitPassword:
            'http://docs.ovh.ca/en/faqs-server-issues.html#server-password-lost-forgotten',
        },
        presentations: {
          home: 'https://www.ovh.com/world/es/private-cloud/',
          nsx: 'https://www.ovh.com/world/es/private-cloud/options/nsx.xml',
          veeam: 'https://www.ovh.com/world/es/private-cloud/options/veeam.xml',
          vrops: 'https://www.ovh.com/world/es/private-cloud/options/vrops.xml',
        },
        vpsCloud: 'https://www.ovh.com/us/es/vps/vps-cloud.xml',
        dedicatedIpmi:
          'https://docs.ovh.com/gb/en/dedicated/use-ipmi-dedicated-servers/',
        changeOwner:
          'https://www.ovh.es/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.es/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        exchangeOrder: 'https://www.ovh.com/us/es/emails/hosted-exchange/',
        faq: 'https://www.ovh.com/us/es/servidores-dedicados/faq.xml',
        faqVps: 'https://www.ovh.com/us/es/vps/ayuda-faq.xml',
        dedicatedOrder: 'https://www.ovhcloud.com/es/bare-metal/prices/',
        dedicatedEcoRangeOrder: 'https://eco.ovhcloud.com/en/',
        threeAZClusterOrder:
          'https://www.ovhcloud.com/es/bare-metal/prices/?display=list&use_cases=multi-az',
        cloudProjectOrder:
          'https://ca.ovh.com/manager/cloud/index.html#/iaas/pci/project/new',
        iplbOrder: 'https://www.ovh.com/world/es/soluciones/load-balancer/',
      },
    },
    website_url: {
      new_nic: {
        en_AU: 'http://www.ovh.com/ca/en/support/new_nic.xml',
        de_DE: 'http://www.ovh.de/support/new_nic.xml',
        en_GB: 'http://www.ovh.co.uk/support/new_nic.xml',
        en_CA: 'http://www.ovh.com/ca/en/support/new_nic.xml',
        en_US: 'http://www.ovh.com/us/support/new_nic.xml',
        es_ES: 'http://www.ovh.es/soporte/new_nic.xml',
        es_US: 'http://www.ovh.com/us/support/new_nic.xml',
        fr_CA: 'http://www.ovh.com/ca/fr/support/new_nic.xml',
        fr_FR: 'https://www.ovh.com/fr/support/new_nic.xml',
        fr_MA: 'http://www.ovh.ma/support/new_nic.xml',
        fr_SN: 'http://www.ovh.sn/support/new_nic.xml',
        fr_TN: 'http://www.ovh.com.tn/support/new_nic.xml',
        it_IT: 'https://www.ovh.it/cgi-bin/it/nic/newNic.cgi',
        lt_LT: 'http://www.ovh.lt/pagalba/new_nic.xml',
        nl_NL: 'http://www.ovh.nl/support/new_nic.xml',
        pl_PL: 'http://www.ovh.pl/support/new_nic.xml',
        pt_PT: 'http://www.ovh.pt/suporte/new_nic.xml',
        sk_SK: 'http://www.ovh.cz/podpora/new_nic.xml',
        fi_FI: 'http://www.ovh-hosting.fi/tuki/new_nic.xml',
        cs_CZ: 'http://www.ovh.cz/podpora/new_nic.xml',
      },
    },
    TOP_GUIDES: {
      sd: {
        CA: [
          {
            title: 'core_sd_top_guide_1_title',
            atInternetClickTag: 'getting-started-with-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/en-ca-dedicated-servers-getting-started-dedicated-server?id=kb_article_view&sysparm_article=KB0043473',
          },
          {
            title: 'core_sd_top_guide_2_title',
            atInternetClickTag: 'getting-started-with-eco-server',
            url:
              'https://help.ovhcloud.com/csm/en-ca-dedicated-servers-getting-started-dedicated-server-eco?id=kb_article_view&sysparm_article=KB0043489',
          },
          {
            title: 'core_sd_top_guide_3_title',
            atInternetClickTag: 'how-to-secure-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/en-ca-dedicated-servers-securing-server?id=kb_article_view&sysparm_article=KB0043970',
          },
          {
            title: 'core_sd_top_guide_4_title',
            atInternetClickTag: 'how-to-create-ssh-key',
            url:
              'https://help.ovhcloud.com/csm/en-ca-dedicated-servers-creating-ssh-keys?id=kb_article_view&sysparm_article=KB0043376',
          },
          {
            title: 'core_sd_top_guide_5_title',
            atInternetClickTag: 'ipmi-for-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/en-ca-dedicated-servers-ipmi?id=kb_article_view&sysparm_article=KB0044036',
          },
          {
            title: 'core_sd_top_guide_6_title',
            atInternetClickTag: 'migrate-data-between-servers',
            url:
              'https://help.ovhcloud.com/csm/en-ca-dedicated-servers-migrate-data-between-servers?id=kb_article_view&sysparm_article=KB0043695',
          },
          {
            title: 'core_sd_top_guide_7_title',
            atInternetClickTag: 'configure-new-window-server-installation',
            url:
              'https://help.ovhcloud.com/csm/en-ca-dedicated-servers-windows-first-config-dedicated?id=kb_article_view&sysparm_article=KB0044076',
          },
        ],
        QC: [
          {
            title: 'core_sd_top_guide_1_title',
            atInternetClickTag: 'getting-started-with-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/fr-ca-dedicated-servers-getting-started-dedicated-server?id=kb_article_view&sysparm_article=KB0043482',
          },
          {
            title: 'core_sd_top_guide_2_title',
            atInternetClickTag: 'getting-started-with-eco-server',
            url:
              'https://help.ovhcloud.com/csm/fr-ca-dedicated-servers-getting-started-dedicated-server-eco?id=kb_article_view&sysparm_article=KB0043495',
          },
          {
            title: 'core_sd_top_guide_3_title',
            atInternetClickTag: 'how-to-secure-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/fr-ca-dedicated-servers-securing-server?id=kb_article_view&sysparm_article=KB0043979',
          },
          {
            title: 'core_sd_top_guide_4_title',
            atInternetClickTag: 'how-to-create-ssh-key',
            url:
              'https://help.ovhcloud.com/csm/fr-ca-dedicated-servers-creating-ssh-keys?id=kb_article_view&sysparm_article=KB0043382',
          },
          {
            title: 'core_sd_top_guide_5_title',
            atInternetClickTag: 'ipmi-for-dedicated-server',
            url:
              'https://help.ovhcloud.com/csm/fr-ca-dedicated-servers-ipmi?id=kb_article_view&sysparm_article=KB0044039',
          },
          {
            title: 'core_sd_top_guide_6_title',
            atInternetClickTag: 'migrate-data-between-servers',
            url:
              'https://help.ovhcloud.com/csm/fr-ca-dedicated-servers-migrate-data-between-servers?id=kb_article_view&sysparm_article=KB0043706',
          },
          {
            title: 'core_sd_top_guide_7_title',
            atInternetClickTag: 'configure-new-window-server-installation',
            url:
              'https://help.ovhcloud.com/csm/fr-ca-dedicated-servers-windows-first-config-dedicated?id=kb_article_view&sysparm_article=KB0044083',
          },
        ],
      },
      pcc: {
        fr_FR: [
          {
            title: 'core_pcc_top_guide_13_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-13',
            url:
              'https://help.ovhcloud.com/csm/fr-vmware-authorise-ip-addresses-vcenter?id=kb_article_view&sysparm_article=KB0045333',
          },
          {
            title: 'core_pcc_top_guide_12_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-12',
            url:
              'https://help.ovhcloud.com/csm/fr-documentation-hosted-private-cloud-sap-ovhcloud?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=2060f0edb41ca5141e11b36be2047d2a',
          },
          {
            title: 'core_pcc_top_guide_11_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-11',
            url: 'https://docs.ovh.com/fr/nutanix/',
          },
          {
            title: 'core_pcc_top_guide_1_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-1',
            url:
              'https://docs.ovh.com/fr/private-cloud/connexion-interface-vsphere/',
          },
          {
            title: 'core_pcc_top_guide_2_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-2',
            url:
              'https://docs.ovh.com/fr/private-cloud/deploiement-d-une-machine-virtuelle/',
          },
          {
            title: 'core_pcc_top_guide_3_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-3',
            url:
              'https://docs.ovh.com/fr/private-cloud/configuration-ip-machine-virtuelle/',
          },
          {
            title: 'core_pcc_top_guide_4_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-4',
            url:
              'https://docs.ovh.com/fr/private-cloud/modification-des-ressources-d-une-machine-virtuelle/',
          },
          {
            title: 'core_pcc_top_guide_5_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-5',
            url: 'https://docs.ovh.com/fr/private-cloud/connexion-en-sftp/',
          },
          {
            title: 'core_pcc_top_guide_6_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-6',
            url: 'https://www.vmware.com/support/pubs/',
          },
          {
            title: 'core_pcc_top_guide_7_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-7',
            url:
              'https://docs.ovh.com/fr/private-cloud/suppression-serveur-hote/#supprimer-le-serveur-hote',
          },
          {
            title: 'core_pcc_top_guide_10_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-10',
            url: 'http://pubs.vmware.com/NSX-62/index.jsp?lang=fr',
          },
          {
            title: 'core_pcc_top_guide_14_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-14v',
            url:
              'https://help.ovhcloud.com/csm/fr-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad&spa=1',
          },
        ],
        de_DE: [
          {
            title: 'core_pcc_top_guide_13_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-13',
            url:
              'https://help.ovhcloud.com/csm/de-vmware-authorise-ip-addresses-vcenter?id=kb_article_view&sysparm_article=KB0045323',
          },
          {
            title: 'core_pcc_top_guide_12_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-12',
            url:
              'https://help.ovhcloud.com/csm/de-documentation-hosted-private-cloud-sap-ovhcloud?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=2060f0edb41ca5141e11b36be2047d2a',
          },
          {
            title: 'core_pcc_top_guide_1_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-1',
            url:
              'https://docs.ovh.com/de/private-cloud/den_vsphere_client_installieren/',
          },
          {
            title: 'core_pcc_top_guide_2_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-2',
            url:
              'https://docs.ovh.com/de/private-cloud/virtuelle-maschine-deployen/',
          },
          {
            title: 'core_pcc_top_guide_3_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-3',
            url:
              ' https://docs.ovh.com/de/private-cloud/ip-server-konfiguration/',
          },
          {
            title: 'core_pcc_top_guide_4_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-4',
            url:
              'https://docs.ovh.com/de/private-cloud/nderung_der_hardware-konfiguration_einer_virtuellen_maschine/',
          },
          {
            title: 'core_pcc_top_guide_5_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-5',
            url: 'https://docs.ovh.com/de/private-cloud/verbindung_per_sftp/',
          },
          {
            title: 'core_pcc_top_guide_6_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-6',
            url: 'https://www.vmware.com/support/pubs/',
          },
          {
            title: 'core_pcc_top_guide_7_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-7',
            url: 'https://docs.ovh.com/de/private-cloud/host-server-loeschen/',
          },
          {
            title: 'core_pcc_top_guide_10_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-10',
            url:
              'https://docs.vmware.com/de/VMware-NSX-Data-Center-for-vSphere/index.html',
          },
          {
            title: 'core_pcc_top_guide_14_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-14',
            url:
              'https://help.ovhcloud.com/csm/worldeuro-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad',
          },
        ],
        en_GB: [
          {
            title: 'core_pcc_top_guide_13_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-13',
            url:
              'https://help.ovhcloud.com/csm/en-gb-vmware-authorise-ip-addresses-vcenter?id=kb_article_view&sysparm_article=KB0045321',
          },
          {
            title: 'core_pcc_top_guide_12_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-12',
            url:
              'https://help.ovhcloud.com/csm/en-gb-documentation-hosted-private-cloud-sap-ovhcloud?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=2060f0edb41ca5141e11b36be2047d2a',
          },
          {
            title: 'core_pcc_top_guide_11_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-11',
            url: 'https://docs.ovh.com/us/en/nutanix/',
          },
          {
            title: 'core_pcc_top_guide_3_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-3',
            url:
              'https://www.ovh.co.uk/g582.configure_an_ip_address_on_a_virtual_machine',
          },
          {
            title: 'core_pcc_top_guide_4_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-4',
            url:
              'https://www.ovh.co.uk/g587.modify_the_hardware_configuration_of_your_virtual_machine',
          },
          {
            title: 'core_pcc_top_guide_5_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-5',
            url: 'https://www.ovh.co.uk/g589.sftp_connection',
          },
          {
            title: 'core_pcc_top_guide_6_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-6',
            url: 'https://www.vmware.com/support/pubs/',
          },
          {
            title: 'core_pcc_top_guide_7_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-7',
            url: 'https://pccdocs.ovh.net/display/VS/Remove+a+host',
          },
          {
            title: 'core_pcc_top_guide_9_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-9',
            url: 'https://pccdocs.ovh.net/display/ND/Getting+Started+with+NSX',
          },
          {
            title: 'core_pcc_top_guide_10_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-10',
            url: 'http://pubs.vmware.com/NSX-62/index.jsp?lang=en',
          },
          {
            title: 'core_pcc_top_guide_14_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-14',
            url:
              'https://help.ovhcloud.com/csm/worldeuro-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad',
          },
        ],
      },
    },
    accountCreation: {
      default: 'http://www.ovh.com/ca/fr/support/new_nic.xml',
      DE: 'http://www.ovh.de/support/new_nic.xml',
      GB: 'http://www.ovh.co.uk/support/new_nic.xml',
      en_CA: 'http://www.ovh.com/ca/en/support/new_nic.xml',
      en_US: 'http://www.ovh.com/us/support/new_nic.xml',
      ES: 'http://www.ovh.es/soporte/new_nic.xml',
      es_US: 'http://www.ovh.com/us/support/new_nic.xml',
      fr_CA: 'http://www.ovh.com/ca/fr/support/new_nic.xml',
      FR: 'https://www.ovh.com/fr/support/new_nic.xml',
      MA: 'http://www.ovh.ma/support/new_nic.xml',
      SN: 'http://www.ovh.sn/support/new_nic.xml',
      TN: 'http://www.ovh.com.tn/support/new_nic.xml',
      IT: 'https://www.ovh.it/cgi-bin/it/nic/newNic.cgi',
      LT: 'http://www.ovh.lt/pagalba/new_nic.xml',
      NL: 'http://www.ovh.nl/support/new_nic.xml',
      PL: 'http://www.ovh.pl/support/new_nic.xml',
      PT: 'http://www.ovh.pt/suporte/new_nic.xml',
      SK: 'http://www.ovh.cz/podpora/new_nic.xml',
      FI: 'http://www.ovh-hosting.fi/tuki/new_nic.xml',
      CZ: 'http://www.ovh.cz/podpora/new_nic.xml',
    },
    billingRenew: {
      AU:
        'https://ca.ovh.com/au/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      CA:
        'https://ca.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      CZ:
        'https://www.ovh.cz/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      DE:
        'https://www.ovh.de/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      EN:
        'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      ES:
        'https://www.ovh.es/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      FI:
        'https://www.ovh-hosting.fi/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      FR:
        'https://eu.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      GB:
        'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      IE:
        'https://www.ovh.ie/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      IT:
        'https://www.ovh.it/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      LT:
        'https://www.ovh.lt/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      MA:
        'https://www.ovh.com/ma/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      NL:
        'https://www.ovh.nl/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      PL:
        'https://www.ovh.pl/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      PT:
        'https://www.ovh.pt/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      QC:
        'https://ca.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      RU:
        'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      SG:
        'https://ca.ovh.com/sg/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      SN:
        'https://www.ovh.sn/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      TN:
        'https://www.ovh.com/tn/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      WE:
        'https://ca.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
    },
    SUPPORT: {
      ASIA: '+65 3163 8340',
      AU: '1300 OVH AUS (684 287)',
      CA: '1-855-684-5463',
      QC: '1-855-684-5463',
      SG: '+65 3163 8340',
      WE: '1-855-684-5463',
      WS: '1-855-684-5463',
    },
  },
  US: {
    RENEW_URL: '/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
    statusUrl: 'https://status.us.ovhcloud.com/',
    vrackUrl: 'https://us.ovhcloud.com/manager/cloud/index.html#/vrack',
    UNIVERS: 'dedicated',
    SECTIONS_UNIVERSE_MAP: {
      sd: ['server'],
      pcc: ['hpc'],
    },
    URLS: {
      US: {
        express_order: 'https://us.ovhcloud.com/order/express/#/express/',
        express_order_resume:
          'https://us.ovhcloud.com/order/express/#/express/review',
        support: 'http://www.ovh.co.uk/support/',
        support_contact: 'https://www.ovh.com/ca/en/support/',
        guides: {
          all: 'https://support.us.ovhcloud.com/hc/en-us',
          home: 'https://support.us.ovhcloud.com/hc/en-us',
          privateCloudHome: 'https://docs.ovh.com/us/en/private-cloud/',
          reinitPassword:
            'http://docs.ovh.ca/en/faqs-server-issues.html#server-password-lost-forgotten',
          ipv6Vps: 'https://www.ovh.com/ca/en/g2365.vps-ipv6',
          nsx:
            'https://us.ovhcloud.com/enterprise/products/hosted-private-cloud/nsx-datacenter-vsphere/',
          vrops:
            'https://us.ovhcloud.com/enterprise/products/hosted-private-cloud/vrops/',
        },
        presentations: {
          home:
            'https://us.ovhcloud.com/enterprise/products/hosted-private-cloud/',
          nsx:
            'https://us.ovhcloud.com/enterprise/products/hosted-private-cloud/nsx-datacenter-vsphere/',
          veeam:
            'https://us.ovhcloud.com/enterprise/products/hosted-private-cloud/veeam-backup-managed/',
          vrops:
            'https://us.ovhcloud.com/enterprise/products/hosted-private-cloud/vrops/',
        },
        vpsCloud: 'https://www.ovh.com/ca/en/vps/vps-cloud.xml',
        dedicatedIpmi:
          'https://docs.ovh.com/gb/en/dedicated/use-ipmi-dedicated-servers/#testing-and-rebooting-the-ipmi',
        changeOwner:
          'https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.co.uk/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        exchangeOrder: 'https://www.ovh.com/ca/en/emails/hosted-exchange/',
        faq: 'https://www.ovh.com/ca/en/dedicated-servers/faq.xml',
        faqVps: 'https://www.ovh.com/ca/en/vps/faq-help.xml',
        dedicatedOrder: 'https://us.ovhcloud.com/bare-metal/prices/',
        dedicatedEcoRangeOrder: 'https://eco.us.ovhcloud.com/',
        threeAZClusterOrder:
          'https://us.ovhcloud.com/bare-metal/prices/?display=list&use_cases=multi-az',
        vrackOrder:
          "https://us.ovhcloud.com/order/express/#/express/review?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
        cloudProjectOrder:
          'https://us.ovhcloud.com/manager/cloud/#/iaas/pci/offer',
        veeamBackup:
          'https://us.ovhcloud.com/enterprise/products/hosted-private-cloud/veeam-backup-managed/',
        iplbOrder: 'https://www.ovh.com/ca/en/solutions/load-balancer/',
      },
    },
    website_url: {
      new_nic: {
        en_AU: 'http://www.ovh.com/au/support/new_nic.xml',
        de_DE: 'http://www.ovh.de/support/new_nic.xml',
        en_GB: 'http://www.ovh.co.uk/support/new_nic.xml',
        en_CA: 'http://www.ovh.com/ca/en/support/new_nic.xml',
        en_US: 'http://www.ovh.com/us/support/new_nic.xml',
        es_ES: 'http://www.ovh.es/soporte/new_nic.xml',
        es_US: 'http://www.ovh.com/us/support/new_nic.xml',
        fr_CA: 'http://www.ovh.com/ca/fr/support/new_nic.xml',
        fr_FR: 'https://www.ovh.com/fr/support/new_nic.xml',
        fr_MA: 'http://www.ovh.ma/support/new_nic.xml',
        fr_SN: 'http://www.ovh.sn/support/new_nic.xml',
        fr_TN: 'http://www.ovh.com.tn/support/new_nic.xml',
        it_IT: 'https://www.ovh.it/cgi-bin/it/nic/newNic.cgi',
        lt_LT: 'http://www.ovh.lt/pagalba/new_nic.xml',
        nl_NL: 'http://www.ovh.nl/support/new_nic.xml',
        pl_PL: 'http://www.ovh.pl/support/new_nic.xml',
        pt_PT: 'http://www.ovh.pt/suporte/new_nic.xml',
        sk_SK: 'http://www.ovh.cz/podpora/new_nic.xml',
        fi_FI: 'http://www.ovh-hosting.fi/tuki/new_nic.xml',
        cs_CZ: 'http://www.ovh.cz/podpora/new_nic.xml',
      },
    },
    TOP_GUIDES: {
      all:
        'https://support.us.ovhcloud.com/hc/en-us/categories/115000423390-Dedicated-Servers',
      sd: {
        en_GB: [
          {
            title: 'core_sd_top_guide_7_title',
            atInternetClickTag: 'TopGuide-DedicatedServers-7',
            url:
              'https://support.us.ovhcloud.com/hc/en-us/articles/115001754490-Rescue-Mode',
          },
        ],
      },
    },
    accountCreation: {
      default: 'https://us.ovhcloud.com/auth/signup/',
    },
    billingRenew: {
      CA:
        'https://ca.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      CZ:
        'https://www.ovh.cz/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      DE:
        'https://www.ovh.de/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      EN:
        'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      ES:
        'https://www.ovh.es/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      FI:
        'https://www.ovh-hosting.fi/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      FR:
        'https://eu.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      GB:
        'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      IE:
        'https://www.ovh.ie/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      IT:
        'https://www.ovh.it/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      LT:
        'https://www.ovh.lt/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      MA:
        'https://www.ovh.com/ma/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      NL:
        'https://www.ovh.nl/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      PL:
        'https://www.ovh.pl/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      PT:
        'https://www.ovh.pt/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      QC:
        'https://ca.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      RU:
        'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      SN:
        'https://www.ovh.sn/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      TN:
        'https://www.ovh.com/tn/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
      WE:
        'https://ca.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
    },
    SUPPORT: {
      US: '1-855-684-5463',
    },
  },
};
/* in urls, all keys represents the two first letter of the language list in uppercase, except GB */
constants.EU.URLS.EN = constants.EU.URLS.GB;

// language fallback for EU help center (dedicated servers section)
constants.EU.TOP_GUIDES.sd.NL = constants.EU.TOP_GUIDES.sd.IE;
constants.EU.TOP_GUIDES.sd.en_GB = constants.EU.TOP_GUIDES.sd.EN;
constants.EU.TOP_GUIDES.sd.en_IE = constants.EU.TOP_GUIDES.sd.IE;
constants.EU.TOP_GUIDES.sd.fr_CA = constants.CA.TOP_GUIDES.sd.QC;
constants.EU.TOP_GUIDES.sd.fr_FR = constants.EU.TOP_GUIDES.sd.FR;
constants.EU.TOP_GUIDES.sd.de_DE = constants.EU.TOP_GUIDES.sd.DE;
constants.EU.TOP_GUIDES.sd.es_ES = constants.EU.TOP_GUIDES.sd.ES;
constants.EU.TOP_GUIDES.sd.it_IT = constants.EU.TOP_GUIDES.sd.IT;
constants.EU.TOP_GUIDES.sd.pt_PT = constants.EU.TOP_GUIDES.sd.PT;
constants.EU.TOP_GUIDES.sd.pl_PL = constants.EU.TOP_GUIDES.sd.PL;

// language fallback for CA help center (dedicated servers section)
constants.CA.TOP_GUIDES.sd.fr_CA = constants.CA.TOP_GUIDES.sd.QC;
constants.CA.TOP_GUIDES.sd.en_CA = constants.CA.TOP_GUIDES.sd.CA;

// Since all languages are availables in both CA and UE worlPart,
// they must have access to all languages conf
/* eslint-disable no-restricted-syntax, vars-on-top, no-var, block-scoped-var,
no-prototype-builtins, no-redeclare */
for (var lang in constants.EU.URLS) {
  if (constants.EU.URLS.hasOwnProperty(lang)) {
    if (!constants.CA.URLS[lang]) {
      constants.CA.URLS[lang] = constants.EU.URLS[lang];
    }
    if (!constants.US.URLS[lang]) {
      constants.US.URLS[lang] = constants.EU.URLS[lang];
    }
  }
}
for (var lang in constants.CA.URLS) {
  if (constants.CA.URLS.hasOwnProperty(lang) && !constants.EU.URLS[lang]) {
    constants.EU.URLS[lang] = constants.CA.URLS[lang];
  }
}
for (var lang in constants.US.URLS) {
  if (constants.US.URLS.hasOwnProperty(lang) && !constants.EU.URLS[lang]) {
    constants.EU.URLS[lang] = constants.US.URLS[lang];
  }
}
/* eslint-enable no-restricted-syntax, vars-on-top, no-var, block-scoped-var,
no-prototype-builtins, no-redeclare */

constants.CA.TOP_GUIDES = defaults(
  constants.CA.TOP_GUIDES,
  constants.EU.TOP_GUIDES,
);
constants.US.TOP_GUIDES = defaults(
  constants.US.TOP_GUIDES,
  constants.EU.TOP_GUIDES,
);

export default constants;
