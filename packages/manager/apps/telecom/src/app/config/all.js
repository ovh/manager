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
      'hubic',
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
  .constant('REDIRECT_URLS', {
    billing:
      'https://www.ovh.com/manager/dedicated/index.html#/billing/history',
    billingPayments:
      'https://www.ovh.com/manager/dedicated/index.html#/billing/payments',
    contacts:
      'https://www.ovh.com/manager/dedicated/index.html#/useraccount/contacts?tab=SERVICES',
    support: 'https://www.ovh.com/manager/dedicated/index.html#/support',
    ordersInProgress:
      'https://www.ovh.com/manager/dedicated/index.html#/billing/orders?status=in-progress',
    orders:
      'https://www.ovh.com/manager/dedicated/index.html#/billing/orders?status=all',
    services:
      'https://www.ovh.com/manager/dedicated/index.html#/billing/autoRenew',
    servicesAgreements:
      'https://www.ovh.com/manager/dedicated/index.html#/useraccount/agreements',
    paymentMeans:
      'https://www.ovh.com/manager/dedicated/index.html#/billing/mean',
    billingMean:
      'https://www.ovh.com/manager/dedicated/index.html#/billing/mean',
    billingVouchers:
      'https://www.ovh.com/manager/dedicated/index.html#/billing/vouchers',
    billingRefunds:
      'https://www.ovh.com/manager/dedicated/index.html#/billing/refunds',
    billingFidelity:
      'https://www.ovh.com/manager/dedicated/index.html#/billing/fidelity',
    billingCredits:
      'https://www.ovh.com/manager/dedicated/index.html#/billing/credits',
    addCreditCard:
      'https://www.ovh.com/manager/dedicated/index.html#/billing/mean/add?meanType=creditCard',
    ovhAccount:
      'https://www.ovh.com/manager/dedicated/index.html#/billing/ovhaccount',
    debtAccount:
      'https://www.ovh.com/manager/dedicated/index.html#/billing/statements',
    userInfos:
      'https://www.ovh.com/manager/dedicated/index.html#/useraccount/infos',
    userSecurity:
      'https://www.ovh.com/manager/dedicated/index.html#/useraccount/security',
    userEmails:
      'https://www.ovh.com/manager/dedicated/index.html#/useraccount/emails',
    userSubscriptions:
      'https://www.ovh.com/manager/dedicated/index.html#/useraccount/subscriptions',
    userSSH:
      'https://www.ovh.com/manager/dedicated/index.html#/useraccount/ssh',
    userAdvanced:
      'https://www.ovh.com/manager/dedicated/index.html#/useraccount/advanced',

    telephony:
      'https://www.ovh.com/managerv3/telephony2-main.pl#rdm/menu/grp/all/menu/number/num/{line}/page/home',
    faxV4:
      'https://www.ovh.com/managerv3/telephony2-main.pl#rdm/65459/page/line_fax_options/grp/all/menu/line/num/{fax}',
    telephonyV4: 'https://www.ovh.com/managerv3/telephony2-main.pl',
    oldV6ServiceMove:
      'https://www.ovhtelecom.fr/espaceclient/index.html#/administration/move/',
    oldV6ServiceTransfert:
      'https://www.ovhtelecom.fr/espaceclient/index.html#/administration/changeOffer/',
    oldV6ServiceResiliate:
      'https://www.ovhtelecom.fr/espaceclient/index.html#/administration/terminate/',
    domain: 'https://www.ovh.com/manager/web/#/configuration/domain/{domain}',
    deskaas: 'https://www.ovh.com/manager/sunrise/index.html#/deskaas',
    exchangeAccount:
      'https://www.ovh.com/manager/web/index.html#/exchange/{organizationName}/{exchangeService}?tab=ACCOUNT',
  })
  .constant('URLS', {
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
    orderHubic: 'https://hubic.com/fr/offres/',
    orderSms: 'https://www.ovhtelecom.fr/sms/',
    orderExpressLite: 'https://www.ovhtelecom.fr/adsl/express-lite/',
    orderBoost: 'https://www.ovhtelecom.fr/adsl/offres-de-connexion.xml',
    hubicVoucher: 'https://hubic.com/home/gift/',
    hubicLogin: 'https://hubic.com/home/',
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
  .constant('TRACKING', {
    atInternetConfiguration: { level2: '5' },
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
    hubic: 'https://hubic.com/fr/offres/',
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
    apiv7RouteBase: '/engine/apiv7',
    wsRouteBase: '/engine/ws',
    loginUrl: WEBPACK_ENV.production ? '/auth' : 'https://www.ovh.com/auth',
    cookieSessionName: 'APIV6_SESSION',
  });
