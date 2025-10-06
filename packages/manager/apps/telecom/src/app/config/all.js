angular
  .module('managerApp')
  .constant('UNIVERSE', 'TELECOM')
  .constant('TARGET', 'EU')
  .constant('DASHBOARD', {
    services: [
      'xdslAccess',
      'voipLine',
      'hostedEmail',
      'exchangeAccount',
      'exchangeIndividual',
      'exchangeLite',
      'emailPro',
      'voipEcoFax',
      'domain',
      'siteBuilderStart',
    ],
  })
  .constant('SIDEBAR', {
    TOGGLE_OPEN_CLOSE_EVENT_PREFIX: 'toggle-sidebar-element-',
    PACK: {
      AUTO_OPEN_BEFORE: 6,
      LIMIT: 50,
      HEIGHT: '50vh',
      ID: 'pack-sidebar',
      ROUTE: '#pack',
      INFINITE_SCROLL_TIME: 500,
    },
    TELEPHONY: {
      AUTO_OPEN_BEFORE: 6,
      LIMIT: 100,
      HEIGHT: '25vh',
      ID: 'telephony-sidebar',
      ROUTE: '#/telecom/telephony',
      INFINITE_SCROLL_TIME: 500,
    },
    SMS: {
      AUTO_OPEN_BEFORE: 6,
      LIMIT: 100,
      HEIGHT: '25vh',
      ID: 'sms-sidebar',
      ROUTE: '#/telecom/sms',
      INFINITE_SCROLL_TIME: 500,
    },
    FAX: {
      AUTO_OPEN_BEFORE: 6,
      LIMIT: 100,
      HEIGHT: '25vh',
      ID: 'fax-sidebar',
      ROUTE: '#freefax',
      INFINITE_SCROLL_TIME: 500,
    },
    OVERTHEBOX: {
      AUTO_OPEN_BEFORE: 6,
      LIMIT: 100,
      HEIGHT: '25vh',
      ID: 'overthebox-sidebar',
      ROUTE: '#overTheBox',
      INFINITE_SCROLL_TIME: 500,
    },
    DESKAAS: {
      AUTO_OPEN_BEFORE: 0,
      LIMIT: 1,
      HEIGHT: '25vh',
      ID: 'deskass-sidebar',
      INFINITE_SCROLL_TIME: 500,
    },
  })
  .constant('costs', {
    voip: {
      shipping: {
        transporter: {
          value: 9.99,
          currencyCode: 'EUR',
        },
      },
    },
    rsva: {
      tariffBearing: {
        value: 20,
        currencySymbol: '€',
      },
    },
    packMove: {
      lineCreation: {
        value: 49.99,
        currencyCode: 'EUR',
      },
    },
  })
  .constant('URLS', {
    oldV6ServiceTransfert:
      'https://www.ovhtelecom.fr/espaceclient/index.html#/administration/changeOffer/',
    support: 'https://www.ovh.com/fr/support/',
    support_contact: 'https://www.ovh.com/fr/support/nous-contacter/',
    guides: {
      home: 'https://docs.ovh.com',
      telephony: 'https://docs.ovh.com/fr/voip/',
      packActivate:
        'https://docs.ovh.com/fr/xdsl/comment-activer-mes-lignes-telephoniques-offre-adsl-vdsl/',
      modemConfig:
        'https://docs.ovh.com/fr/xdsl/configuration_du_modem_a_partir_de_votre_espace_client/',
      modemReinit:
        'https://docs.ovh.com/fr/xdsl/redemarrer-reinitialiser-modem-adsl-ovh/',
      interruptedService:
        'https://docs.ovh.com/fr/xdsl/interruption-de-service/',
      overTheBox: 'https://docs.ovh.com/display/public/CRXDSL/Accueil+xDSL',
      sms: {
        receivers: 'https://www.ovh.com/fr/g2402.liste_de_destinataire_sms',
      },
      xdsl: {
        emailPro:
          'https://docs.ovh.com/fr/xdsl/comment-gerer-mes-adresses-e-mails ',
      },
    },
    ipOrderContract:
      'http://www.ovh.com/fr/support/documents_legaux/contrat_part_IP_supplementaires_xdsl.pdf',
    orderInternet: 'https://www.ovhtelecom.fr/offre-internet/',
    orderTelephony: 'http://www.ovhtelecom.fr/telephonie/',
    orderExchange: 'https://www.ovh.com/fr/emails/hosted-exchange-2013/',
    orderFax: 'http://www.ovhtelecom.fr/fax/',
    orderSms: 'https://www.ovhtelecom.fr/sms/',
    orderExpressLite: 'https://www.ovhtelecom.fr/adsl/express-lite/',
    orderBoost: 'https://www.ovhtelecom.fr/adsl/offres-de-connexion.xml',
    overTheBoxManager: 'http://overthebox.ovh',
    generalConditions: {
      packAdslPro2013:
        'http://www.ovh.com/fr/support/documents_legaux/Conditions_generales_PackADSLPro2013.pdf',
      packAdslEnterprise2013:
        'http://www.ovh.com/fr/support/documents_legaux/Conditions_Generales_PackADSLGTRREADY2013.pdf',
    },
    keyGenHelp: 'https://www.ovh.com/fr/g1769.creation_des_cles_ssh',
    transferTable:
      'https://www.ovhtelecom.fr/telephonie/numeros_speciaux_08/reforme-des-numeros-speciaux.xml',
    deontology:
      'https://www.ovhtelecom.fr/support/documents_legaux/conditions%20particulieres%20deontologie%20numeros%20SVA%20Fr.pdf',
    graphicCharter: 'http://s.svaplus.fr/mmdia/a/48/5/11439485prvpu.pdf',
    svaToSvaPlus: 'http://s.svaplus.fr/mmdia/a/76/7/11442767lidlp.pdf',
    telecomWebSite: 'https://www.ovhtelecom.fr/',
    xdslIncident: 'https://www.ovhtelecom.fr/xdsl/incident/#/',
  })
  .constant('TASK_STATUS', {
    cancelled: {
      icon: 'ovh-font-failure text-danger',
    },
    doing: {
      icon: 'ovh-font-inprogress text-primary',
      spinner: true,
    },
    done: {
      icon: 'ovh-font-check text-success',
    },
    error: {
      icon: 'ovh-font-failure text-danger',
    },
    problem: {
      icon: 'ovh-font-failure text-danger',
    },
    todo: {
      icon: 'ovh-font-scheduled text-info',
    },
  })
  .constant('FREEFAX', {
    discreteCredit: [10, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 100000],
    maxNotifications: 5,
    audioFormat: ['aiff', 'au', 'flac', 'mp3', 'ogg', 'wav'],
  })
  .constant('PACK_IP', {
    baseIpv4Range: 32,
  })
  .constant('XDSL', {
    chart: {
      grey: '#333',
      blue: '#64AEDE',
      blueDark: '#324392',
      fontStyle: '11px Open Sans, Trebuchet MS, sans-serif',
      dateFormat: '%a, %d %b %Y à %H:%M',
    },
    statisticsPeriodEnum: ['preview', 'daily', 'weekly', 'monthly', 'yearly'],
  })
  .constant('ORDER_STATUS', {
    done: {
      class: 'success',
      icon: 'ovh-font-success',
      priority: 0,
    },
    doing: {
      class: 'primary',
      icon: 'ovh-font-inprogress',
      priority: 1,
    },
    todo: {
      class: 'info',
      icon: 'ovh-font-scheduled',
      priority: 2,
    },
    error: {
      class: 'danger',
      icon: 'ovh-font-failure',
      priority: 3,
    },
  })
  .constant('PAGINATION_PER_PAGE', 5)
  .constant('ORDER_URLS', {
    number: 'https://www.ovhtelecom.fr/telephonie/numeros/',
    domain: 'https://www.ovh.com/fr/domaines/tarifs/',
    internet: {
      xdsl: 'https://www.ovhtelecom.fr/adsl/',
      fiber: 'https://www.ovhtelecom.fr/fibre/',
      enterprise: 'https://www.ovhtelecom.fr/adsl/entreprise/',
      rescue: 'https://www.ovhtelecom.fr/adsl/connexion-de-secours.xml',
      sdsl: 'https://www.ovhtelecom.fr/sdsl/',
      adslCreation: 'https://www.ovhtelecom.fr/adsl/ouvrir-une-ligne.xml',
      otb: 'https://www.ovhtelecom.fr/overthebox/',
    },
    telephony: {
      voip: 'https://www.ovhtelecom.fr/telephonie/voip/',
      siptrunk: 'https://www.ovhtelecom.fr/telephonie/sip-trunk/',
      siptrunkCall:
        'https://www.ovhtelecom.fr/telephonie/sip-trunk-forfait-inclus/',
    },
    email: {
      exchange: 'https://www.ovhtelecom.fr/emails/',
      sharepoint: 'https://www.ovhtelecom.fr/sharepoint/?range=mail',
    },
    office: {
      business: 'https://www.ovhtelecom.fr/office-365-business/',
      sharepoint: 'https://www.ovhtelecom.fr/sharepoint/?range=mail',
    },
    sms: {
      sms: 'https://www.ovhtelecom.fr/sms/',
      hlr: 'https://www.ovhtelecom.fr/sms/home-location-register/',
    },
    fax: 'https://www.ovhtelecom.fr/fax/',
    overTheBox: '#/overTheBox/order',
  })
  .constant('telecomConfig', {
    env: WEBPACK_ENV.production ? 'prod' : 'dev',
    aapiRouteBase: '/engine/2api',
    apiRouteBase: '/engine/apiv6',
    wsRouteBase: '/engine/ws',
    cookieSessionName: 'APIV6_SESSION',
  })
  .constant('CHANGELOG', {
    pack: {
      links: {
        changelog:
          'https://github.com/orgs/ovh/projects/18/views/2?pane=info&sliceBy%5Bvalue%5D=Connectivity',
        roadmap:
          'https://github.com/orgs/ovh/projects/18/views/1?sliceBy%5Bvalue%5D=Connectivity&pane=info',
        'feature-request':
          'https://github.com/ovh/collaborative-tools-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
      },
      chapters: ['telecom', 'pack', ''],
    },
    overTheBox: {
      links: {
        changelog:
          'https://github.com/orgs/ovh/projects/18/views/2?pane=info&sliceBy%5Bvalue%5D=Connectivity',
        roadmap:
          'https://github.com/orgs/ovh/projects/18/views/1?sliceBy%5Bvalue%5D=Connectivity&pane=info',
        'feature-request':
          'https://github.com/ovh/collaborative-tools-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
      },
      chapters: ['telecom', 'overTheBox', ''],
    },
    telephony: {
      links: {
        changelog:
          'https://github.com/orgs/ovh/projects/18/views/2?pane=info&sliceBy%5Bvalue%5D=VoIP',
        roadmap:
          'https://github.com/orgs/ovh/projects/18/views/1?pane=info&sliceBy%5Bvalue%5D=VoIP',
        'feature-request':
          'https://github.com/ovh/collaborative-tools-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
      },
      chapters: ['telecom', 'telephony', ''],
    },
    sms: {
      links: {
        changelog:
          'https://github.com/orgs/ovh/projects/18/views/2?pane=info&sliceBy%5Bvalue%5D=VoIP',
        roadmap:
          'https://github.com/orgs/ovh/projects/18/views/1?pane=info&sliceBy%5Bvalue%5D=VoIP',
        'feature-request':
          'https://github.com/ovh/collaborative-tools-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
      },
      chapters: ['telecom', 'sms', ''],
    },
  });
