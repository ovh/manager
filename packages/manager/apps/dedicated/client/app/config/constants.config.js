import defaults from 'lodash/defaults';

const constants = {
  EU: {
    RENEW_URL:
      'https://eu.ovh.com/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
    vmsUrl: 'http://travaux.ovh.net/vms/',
    travauxUrl: 'http://travaux.ovh.net/',
    UNIVERS: 'dedicated',
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
        RealTimeMonitoring:
          'https://docs.ovh.com/cz/cs/dedicated/instalace-rtm',
        changeOwner:
          'https://www.ovh.cz/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.cz/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        exchangeOrder: 'https://www.ovh.cz/emails/hosted-exchange-2013/',
        faq: 'https://www.ovh.cz/dedikovane_servery/faq.xml',
        faqVps: 'https://www.ovh.cz/vps/pomoc-faq.xml',
        dedicatedOrder: 'https://www.ovh.cz/dedikovane_servery',
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
          sshCreate: 'https://www.ovh.de/g1769.creating_ssh_keys',
          sshChange:
            'https://www.ovh.de/g2069.replacing_your_lost_ssh_key_pair',
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
        RealTimeMonitoring:
          'https://docs.ovh.com/de/dedicated/rtm-installieren/',
        changeOwner:
          'https://www.ovh.de/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.de/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        exchangeOrder: 'https://www.ovh.de/emails/hosted-exchange/',
        faq: 'https://www.ovh.de/dedicated_server/faq.xml',
        faqVps: 'https://www.ovh.de/virtual_server/faq-hilfe.xml',
        dedicatedOrder: 'https://www.ovh.de/dedicated_server',
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
          sshCreate: 'https://www.ovh.es/g1769.creating_ssh_keys',
          sshAdd: 'https://www.ovh.es/g1924.configuring_additionnal_ssh_key',
          sshChange:
            'https://www.ovh.es/g2069.replacing_your_lost_ssh_key_pair',
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
        RealTimeMonitoring: 'https://docs.ovh.com/gb/en/dedicated/install-rtm/',
        changeOwner:
          'https://www.ovh.es/cgi-bin/procedure/procedureChangeOwner.cgi',
        dedicated2016News: 'http://www.ovh.es/a1837.news',
        exchangeOrder: 'https://www.ovh.es/emails/hosted-exchange/',
        faq: 'https://www.ovh.es/servidores_dedicados/faq.xml',
        faqVps: 'https://www.ovh.es/vps/ayuda-faq.xml',
        dedicatedOrder: 'https://www.ovh.es/servidores_dedicados',
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
        RealTimeMonitoring: 'https://docs.ovh.com/fi/dedicated/rtm-asennus/',
        changeOwner:
          'https://www.ovh.com/cgi-bin/fi/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh-hosting.fi/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        exchangeOrder:
          'https://www.ovh-hosting.fi/sahkopostit/hosted-exchange/',
        faq: 'https://www.ovh-hosting.fi/dedikoidut_palvelimet/ukk.xml',
        faqVps: 'https://www.ovh-hosting.fi/vps/faq-help.xml',
        dedicatedOrder: 'https://www.ovh-hosting.fi/dedikoidut_palvelimet',
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
          sshCreate:
            'https://docs.ovh.com/fr/public-cloud/creation-des-cles-ssh/',
          sshAdd:
            'https://docs.ovh.com/fr/public-cloud/configurer-des-cles-ssh-supplementaires/',
          sshChange:
            'https://docs.ovh.com/fr/public-cloud/changer-sa-cle-ssh-en-cas-de-perte/',
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
        RealTimeMonitoring: 'https://docs.ovh.com/gb/en/dedicated/install-rtm/',
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
        dedicatedOrder: 'https://www.ovh.com/fr/serveurs_dedies',
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
          sshCreate:
            'https://docs.ovh.com/gb/en/public-cloud/configuring_additional_ssh_keys/',
          sshAdd:
            'https://docs.ovh.com/gb/en/public-cloud/configuring_additional_ssh_keys/',
          sshChange:
            'https://docs.ovh.com/gb/en/public-cloud/replacing_your_lost_ssh_key_pair/',
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
        RealTimeMonitoring: 'https://docs.ovh.com/gb/en/dedicated/install-rtm/',
        changeOwner:
          'https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.co.uk/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        exchangeOrder: 'https://www.ovh.co.uk/emails/hosted-exchange/',
        faq: 'https://www.ovh.co.uk/dedicated_servers/faq.xml',
        faqVps: 'https://www.ovh.co.uk/vps/faq-help.xml',
        dedicatedOrder: 'https://www.ovh.co.uk/dedicated_servers',
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
          sshCreate: 'https://www.ovh.it/g1769.creating_ssh_keys',
          sshAdd: 'https://www.ovh.it/g1924.configuring_additionnal_ssh_key',
          sshChange:
            'https://www.ovh.it/g2069.replacing_your_lost_ssh_key_pair',
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
        RealTimeMonitoring: 'https://docs.ovh.com/it/dedicated/installare-rtm/',
        changeOwner:
          'https://www.ovh.it/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.it/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        dedicated2016News: 'http://www.ovh.it/a1837.news',
        exchangeOrder: 'https://www.ovh.it/emails/hosted-exchange/',
        faq: 'https://www.ovh.it/server_dedicati/faq.xml',
        faqVps: 'https://www.ovh.it/vps/aiuto-faq.xml',
        dedicatedOrder: 'https://www.ovh.it/server_dedicati',
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
          sshCreate: 'https://www.ovh.lt/g1769.creating_ssh_keys',
          sshChange:
            'https://www.ovh.lt/g2069.replacing_your_lost_ssh_key_pair',
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
        RealTimeMonitoring: 'https://docs.ovh.com/gb/en/dedicated/install-rtm/',
        changeOwner:
          'https://www.ovh.com/cgi-bin/lt/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.lt/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        dedicated2016News: 'http://www.ovh.lt/a1837.news',
        exchangeOrder: 'https://www.ovh.lt/El_pastas/hosted-exchange/',
        faq: 'https://www.ovh.lt/dedikuoti_serveriai/duk.xml',
        faqVps: 'https://www.ovh.lt/vps/pagalba-duk.xml',
        dedicatedOrder: 'https://www.ovh.lt/dedikuoti_serveriai',
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
          sshCreate: 'https://www.ovh.nl/g1769.creating_ssh_keys',
          sshChange:
            'https://www.ovh.nl/g2069.replacing_your_lost_ssh_key_pair',
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
        dedicatedOrder: 'https://www.ovh.nl/dedicated_servers',
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
          sshCreate: 'https://www.ovh.pl/g1769.creating_ssh_keys',
          sshAdd: 'https://www.ovh.pl/g1924.configuring_additionnal_ssh_key',
          shhChange:
            'https://www.ovh.pl/g2069.replacing_your_lost_ssh_key_pair',
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
        RealTimeMonitoring: 'https://docs.ovh.com/pl/dedicated/instalacja-rtm/',
        changeOwner:
          'https://www.ovh.pl/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.pl/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        dedicated2016News: 'http://www.ovh.pl/a1837.news',
        exchangeOrder: 'https://www.ovh.pl/emaile/hosted-exchange/',
        faq: 'https://www.ovh.pl/serwery_dedykowane/faq.xml',
        faqVps: 'https://www.ovh.pl/vps/pomoc-faq.xml',
        dedicatedOrder: 'https://www.ovh.pl/serwery_dedykowane',
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
          sshCreate: 'https://www.ovh.pt/g1769.creating_ssh_keys',
          sshAdd: 'https://www.ovh.pt/g1924.configuring_additionnal_ssh_key',
          sshChange:
            'https://www.ovh.pt/g2069.replacing_your_lost_ssh_key_pair',
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
        RealTimeMonitoring: 'https://docs.ovh.com/pt/dedicated/instalar-rtm/',
        changeOwner:
          'https://www.ovh.pt/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.pt/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        dedicated2016News: 'http://www.ovh.pt/a1837.news',
        exchangeOrder: 'https://www.ovh.pt/emails/hosted-exchange-2013/',
        faq: 'https://www.ovh.pt/servidores_dedicados/faq.xml ',
        faqVps: 'https://www.ovh.pt/vps/vps-ssd.xml',
        dedicatedOrder: 'https://www.ovh.pt/servidores_dedicados',
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
          sshAdd: 'https://www.ovh.ie/g1924.configuring_additionnal_ssh_key',
          sshChange:
            'https://www.ovh.ie/g2069.replacing_your_lost_ssh_key_pair',
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
        dedicatedOrder: 'https://www.ovh.ie/dedicated_servers',
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
        fr_FR: [
          {
            title: 'core_sd_top_guide_1_title',
            atInternetClickTag: 'TopGuide-DedicatedServers-1',
            url:
              'https://docs.ovh.com/fr/dedicated/premiers-pas-serveur-dedie/',
          },
          {
            title: 'core_sd_top_guide_2_title',
            atInternetClickTag: 'TopGuide-DedicatedServers-2',
            url: 'https://www.ovh.com/fr/g845.netboot',
          },
          {
            title: 'core_sd_top_guide_3_title',
            atInternetClickTag: 'TopGuide-DedicatedServers-3',
            url: 'https://www.ovh.com/fr/g849.configurer_le_reverse',
          },
          {
            title: 'core_sd_top_guide_firewall_title',
            atInternetClickTag: 'TopGuide-DedicatedServers-Firewall',
            url: 'https://docs.ovh.com/fr/dedicated/firewall-network/',
          },
          {
            title: 'core_sd_top_guide_5_title',
            atInternetClickTag: 'TopGuide-DedicatedServers-5',
            url: 'https://docs.ovh.com/fr/dedicated/network-virtual-mac/',
          },
          {
            title: 'core_sd_top_guide_6_title',
            atInternetClickTag: 'TopGuide-DedicatedServers-6',
            url: 'https://docs.ovh.com/fr/dedicated/network-ipaliasing/',
          },
          {
            title: 'core_sd_top_guide_7_title',
            atInternetClickTag: 'TopGuide-DedicatedServers-7',
            url: 'https://docs.ovh.com/fr/dedicated/ovh-rescue/',
          },
          {
            title: 'core_sd_top_guide_8_title',
            atInternetClickTag: 'TopGuide-DedicatedServers-8',
            url:
              'https://docs.ovh.com/fr/dedicated/find-disk-serial-number/#pour-un-raid-materiel_1',
          },
        ],
        en_GB: [
          {
            title: 'core_sd_top_guide_7_title',
            atInternetClickTag: 'TopGuide-DedicatedServers-7',
            url: 'https://docs.ovh.com/ca/en/dedicated/rescue-mode',
          },
        ],
      },
      pcc: {
        fr_FR: [
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
            url: 'https://docs.ovh.com/fr/private-cloud/suppression-d-un-hote/',
          },
          {
            title: 'core_pcc_top_guide_10_title',
            atInternetClickTag: 'TopGuide-PrivateCloud-10',
            url: 'http://pubs.vmware.com/NSX-62/index.jsp?lang=fr',
          },
        ],
        en_GB: [
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
    REDIRECT_URLS: {
      listTicket: 'https://www.ovh.com/manager/dedicated/index.html#/ticket',
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
    vmsUrl: 'http://status.ovh.net/vms/',
    travauxUrl: 'http://status.ovh.net/',
    UNIVERS: 'dedicated',
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
          sshCreate: 'https://www.ovh.com/ca/en/g1769.creating_ssh_keys',
          sshAdd:
            'https://www.ovh.com/ca/en/g1924.configuring_additionnal_ssh_key',
          sshChange:
            'https://www.ovh.com/ca/en/g2069.replacing_your_lost_ssh_key_pair',
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
        dedicatedOrder: 'https://www.ovh.com/asia/dedicated-servers',
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
          sshCreate: 'https://www.ovh.com/ca/en/g1769.creating_ssh_keys',
          sshAdd:
            'https://www.ovh.com/ca/en/g1924.configuring_additionnal_ssh_key',
          sshChange:
            'https://www.ovh.com/ca/en/g2069.replacing_your_lost_ssh_key_pair',
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
        RealTimeMonitoring: 'https://docs.ovh.com/gb/en/dedicated/install-rtm/',
        exchangeOrder: 'https://www.ovh.com/us/emails/hosted-exchange/',
        faq: 'https://www.ovh.com/ca/en/dedicated-servers/faq.xml',
        faqVps: 'https://www.ovh.com/us/vps/faq-help.xml',
        dedicatedOrder: 'https://www.ovh.com.au/dedicated-servers',
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
          sshCreate: 'https://www.ovh.com/ca/en/g1769.creating_ssh_keys',
          sshAdd:
            'https://www.ovh.com/ca/en/g1924.configuring_additionnal_ssh_key',
          sshChange:
            'https://www.ovh.com/ca/en/g2069.replacing_your_lost_ssh_key_pair',
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
          "https://www.ovh.co.uk/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
        RealTimeMonitoring: 'https://docs.ovh.com/gb/en/dedicated/install-rtm/',
        exchangeOrder: 'https://www.ovh.com/ca/en/emails/hosted-exchange/',
        faq: 'https://www.ovh.com/ca/en/dedicated-servers/faq.xml',
        faqVps: 'https://www.ovh.com/ca/en/vps/faq-help.xml',
        dedicatedOrder: 'https://www.ovh.com/ca/en/dedicated-servers',
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
          sshCreate: 'https://www.ovh.com/ca/fr/g1769.creation_des_cles_ssh',
          sshAdd:
            'https://www.ovh.com/ca/fr/g1924.configurer_des_cles_ssh_supplementaires',
          sshChange:
            'https://www.ovh.com/ca/fr/g2069.changer_sa_cle_ssh_en_cas_de_perte',
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
        RealTimeMonitoring: 'https://docs.ovh.com/gb/en/dedicated/install-rtm/',
        exchangeOrder: 'https://www.ovh.com/ca/fr/emails/hosted-exchange/',
        faq: 'https://www.ovh.com/ca/fr/serveurs-dedies/faq.xml',
        faqVps: 'https://www.ovh.com/ca/fr/vps/aide-faq.xml',
        dedicatedOrder: 'https://www.ovh.com/ca/fr/serveurs-dedies',
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
          sshCreate: 'https://www.ovh.com/ca/en/g1769.creating_ssh_keys',
          sshAdd:
            'https://www.ovh.com/ca/en/g1924.configuring_additionnal_ssh_key',
          sshChange:
            'https://www.ovh.com/ca/en/g2069.replacing_your_lost_ssh_key_pair',
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
        RealTimeMonitoring: 'https://docs.ovh.com/gb/en/dedicated/install-rtm/',
        exchangeOrder: 'https://www.ovh.com/us/emails/hosted-exchange/',
        faq: 'https://www.ovh.es/servidores_dedicados/faq.xml',
        faqVps: 'https://www.ovh.com/us/vps/faq-help.xml',
        dedicatedOrder: 'https://www.ovh.com/sg/dedicated-servers',
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
          sshCreate: 'https://www.ovh.com/ca/en/g1769.creating_ssh_keys',
          sshAdd:
            'https://www.ovh.com/ca/en/g1924.configuring_additionnal_ssh_key',
          sshChange:
            'https://www.ovh.com/ca/en/g2069.replacing_your_lost_ssh_key_pair',
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
        RealTimeMonitoring: 'https://docs.ovh.com/gb/en/dedicated/install-rtm/',
        exchangeOrder: 'https://www.ovh.com/us/emails/hosted-exchange/',
        faq: 'https://www.ovh.es/servidores_dedicados/faq.xml',
        faqVps: 'https://www.ovh.com/us/vps/faq-help.xml',
        dedicatedOrder: 'https://www.ovh.com/world/dedicated-servers',
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
          sshCreate: 'https://www.ovh.com/ca/en/g1769.creating_ssh_keys',
          sshAdd:
            'https://www.ovh.com/ca/en/g1924.configuring_additionnal_ssh_key',
          sshChange:
            'https://www.ovh.com/ca/en/g2069.replacing_your_lost_ssh_key_pair',
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
        RealTimeMonitoring: 'https://docs.ovh.com/gb/en/dedicated/install-rtm/',
        exchangeOrder: 'https://www.ovh.com/us/es/emails/hosted-exchange/',
        faq: 'https://www.ovh.com/us/es/servidores-dedicados/faq.xml',
        faqVps: 'https://www.ovh.com/us/es/vps/ayuda-faq.xml',
        dedicatedOrder: 'https://www.ovh.com/world/dedicated-servers',
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
    TOP_GUIDES: {},
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
    REDIRECT_URLS: {
      listTicket: 'https://ca.ovh.com/manager/dedicated/index.html#/ticket',
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
    vmsUrl: 'http://status.ovh.net/vms/',
    travauxUrl: 'http://status.ovh.net/',
    vrackUrl: 'https://us.ovhcloud.com/manager/cloud/index.html#/vrack',
    UNIVERS: 'dedicated',
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
          sshCreate:
            'http://support.us.ovhcloud.com/hc/en-us/articles/115001588250-SSH-Key-Management',
          sshAdd:
            'http://support.us.ovhcloud.com/hc/en-us/articles/115001588250-SSH-Key-Management',
          sshChange:
            'http://support.us.ovhcloud.com/hc/en-us/articles/115001588250-SSH-Key-Management',
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
        RealTimeMonitoring:
          'https://support.us.ovhcloud.com/hc/en-us/articles/115001821044-Learning-About-OVH-US-Monitoring',
        exchangeOrder: 'https://www.ovh.com/ca/en/emails/hosted-exchange/',
        faq: 'https://www.ovh.com/ca/en/dedicated-servers/faq.xml',
        faqVps: 'https://www.ovh.com/ca/en/vps/faq-help.xml',
        dedicatedOrder: 'https://us.ovhcloud.com/bare-metal/prices',
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
    REDIRECT_URLS: {
      listTicket:
        'https://us.ovhcloud.com/manager/dedicated/index.html#/ticket',
    },
    SUPPORT: {
      US: '1-855-684-5463',
    },
  },
};
/* in urls, all keys represents the two first letter of the language list in uppercase, except GB */
constants.EU.URLS.EN = constants.EU.URLS.GB;

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
