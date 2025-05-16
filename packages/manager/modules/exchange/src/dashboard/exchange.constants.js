export const EXCHANGE_MX_CONFIG = {
  EU: {
    spam: [
      { fieldType: 'MX', target: 'mx0.mail.ovh.net.', priority: 1 },
      { fieldType: 'MX', target: 'mx1.mail.ovh.net.', priority: 5 },
      { fieldType: 'MX', target: 'mx2.mail.ovh.net.', priority: 50 },
      { fieldType: 'MX', target: 'mx3.mail.ovh.net.', priority: 100 },
    ],
  },
  CA: {
    spam: [
      { fieldType: 'MX', target: 'mx1.mail.ovh.ca.', priority: 1 },
      { fieldType: 'MX', target: 'mx2.mail.ovh.ca.', priority: 5 },
      { fieldType: 'MX', target: 'mx3.mail.ovh.ca.', priority: 50 },
      { fieldType: 'MX', target: 'mx4.mail.ovh.ca.', priority: 100 },
    ],
  },
};

export const EXCHANGE_CONFIG_URL = {
  CA: 'http://docs.ovh.ca/en/products-exchange.html',
  CZ: 'https://www.ovh.co.uk/emails/hosted-exchange-2013/guides/',
  DE: 'https://www.ovh.co.uk/emails/hosted-exchange-2013/guides/',
  EN: 'https://www.ovh.co.uk/emails/hosted-exchange-2013/guides/',
  ES: 'https://www.ovh.co.uk/emails/hosted-exchange-2013/guides/',
  EU: 'https://www.ovh.co.uk/emails/hosted-exchange-2013/guides/',
  FI: 'https://www.ovh.co.uk/emails/hosted-exchange-2013/guides/',
  FR: 'https://www.ovh.com/fr/emails/hosted-exchange-2013/guides/',
  GB: 'https://www.ovh.co.uk/emails/hosted-exchange-2013/guides/',
  IE: 'https://www.ovh.co.uk/emails/hosted-exchange-2013/guides/',
  IT: 'https://www.ovh.co.uk/emails/hosted-exchange-2013/guides/',
  LT: 'https://www.ovh.co.uk/emails/hosted-exchange-2013/guides/',
  MA: 'https://www.ovh.co.uk/emails/hosted-exchange-2013/guides/',
  NL: 'https://www.ovh.co.uk/emails/hosted-exchange-2013/guides/',
  PL: 'https://www.ovh.co.uk/emails/hosted-exchange-2013/guides/',
  PT: 'https://www.ovh.co.uk/emails/hosted-exchange-2013/guides/',
  QC: 'http://docs.ovh.ca/fr/products-exchange.html',
  SN: 'https://www.ovh.co.uk/emails/hosted-exchange-2013/guides/',
  TN: 'https://www.ovh.co.uk/emails/hosted-exchange-2013/guides/',
  WE: 'https://www.ovh.co.uk/emails/hosted-exchange-2013/guides/',
  WS: 'https://www.ovh.co.uk/emails/hosted-exchange-2013/guides/',
};

export const EXCHANGE_CONFIG = {
  URLS: {
    GUIDES: {
      BACKUP: {
        FR:
          'https://help.ovhcloud.com/csm/fr-exchange-veeam-backup?id=kb_article_view&sysparm_article=KB0065635',
        ES:
          'https://help.ovhcloud.com/csm/es-es-exchange-veeam-backup?id=kb_article_view&sysparm_article=KB0065716',
        DE:
          'https://help.ovhcloud.com/csm/de-exchange-veeam-backup?id=kb_article_view&sysparm_article=KB0065715',
        IE:
          'https://help.ovhcloud.com/csm/en-ie-exchange-veeam-backup?id=kb_article_view&sysparm_article=KB0065713',
        IT:
          'https://help.ovhcloud.com/csm/it-exchange-veeam-backup?id=kb_article_view&sysparm_article=KB0065718',
        PL:
          'https://help.ovhcloud.com/csm/pl-exchange-veeam-backup?id=kb_article_view&sysparm_article=KB0065717',
        PT:
          'https://help.ovhcloud.com/csm/pt-exchange-veeam-backup?id=kb_article_view&sysparm_article=KB0065714',
        GB:
          'https://help.ovhcloud.com/csm/en-gb-exchange-veeam-backup?id=kb_article_view&sysparm_article=KB0065712',
        MA:
          'https://help.ovhcloud.com/csm/fr-exchange-veeam-backup?id=kb_article_view&sysparm_article=KB0065635',
        SN:
          'https://help.ovhcloud.com/csm/fr-exchange-veeam-backup?id=kb_article_view&sysparm_article=KB0065635',
        TN:
          'https://help.ovhcloud.com/csm/fr-exchange-veeam-backup?id=kb_article_view&sysparm_article=KB0065635',
        WE:
          'https://help.ovhcloud.com/csm/en-ie-exchange-veeam-backup?id=kb_article_view&sysparm_article=KB0065713',
        DEFAULT:
          'https://help.ovhcloud.com/csm/en-ie-exchange-veeam-backup?id=kb_article_view&sysparm_article=KB0065713',
      },
      RESOURCES: {
        CA: '',
        CZ: '',
        DE: '',
        EN: '',
        ES: '',
        FI: '',
        FR:
          'https://www.ovh.com/fr/g1325.exchange_20132016_utilisation_des_comptes_de_ressource',
        GB: '',
        IE: '',
        IT: '',
        LT: '',
        MA: '',
        NL: '',
        PL: '',
        PT: '',
        QC: '',
        RU: '',
        SN: '',
        TN: '',
        WE: '',
      },
      DOCS_HOME: {
        CA: 'http://docs.ovh.ca/en/products-exchange.html',
        CZ: 'http://www.ovh.cz/emails/hosted-exchange-2013/prirucky/',
        DE: 'https://www.ovh.de/emails/hosted-exchange-2013/anleitungen/',
        EN: 'http://docs.ovh.ca/en/products-exchange.html',
        ES: 'https://www.ovh.es/emails/hosted-exchange-2013/guias/',
        FI: '',
        FR: 'https://docs.ovh.com/fr/fr/web/microsoft-collaborative-solutions/',
        GB: 'https://www.ovh.co.uk/emails/hosted-exchange-2013/guides/',
        IE: '',
        IT: 'http://www.ovh.it/emails/hosted-exchange-2013/guide/',
        LT: 'https://www.ovh.lt/El_pastas/hosted-exchange-2013/gidai/',
        MA: '',
        NL: '',
        PL: 'https://www.ovh.pl/emaile/hosted-exchange-2013/przewodniki/',
        PT: 'https://www.ovh.pt/emails/hosted-exchange-2013/guias/',
        QC: 'http://docs.ovh.ca/fr/products-exchange.html',
        RU: '',
        SN: '',
        TN: '',
        WE: '',
      },
      DIAGNOSTIC: {
        CA:
          'https://www.ovh.com/ca/en/g2277.exchange_diagnostic_what_to_do_in_the_event_of_an_error',
        CZ: '',
        DE: 'https://www.ovh.de/g2277.exchange_diagnose_was_tun_bei_fehlern',
        EN:
          'https://www.ovh.com/ca/en/g2277.exchange_diagnostic_what_to_do_in_the_event_of_an_error',
        ES:
          'https://www.ovh.es/g2277.que_hacer_en_caso_de_error_del_diagnostico_exchange',
        FI:
          'https://www.ovh-hosting.fi/g2277.exchange_diagnostiikka_mita_tehda_virhetilanteessa',
        FR:
          'https://www.ovh.com/fr/g2277.diagnostic_exchange_que_faire_en_cas_derreur',
        GB:
          'https://www.ovh.co.uk/g2277.exchange_diagnostic_what_to_do_in_the_event_of_an_error',
        IE: '',
        IT: '',
        LT:
          'https://www.ovh.lt/g2277.exchange_diagnostika_ka_daryti_klaidos_atveju',
        MA: '',
        NL: '',
        PL:
          'https://www.ovh.pl/g2277.diagnostyka_exchange_co_zrobic_w_przypadku_bledu',
        PT:
          'https://www.ovh.pt/g2277.diagnostico_exchange_o_que_fazer_em_caso_de_erro',
        QC:
          'https://www.ovh.com/ca/fr/g2277.diagnostic_exchange_que_faire_en_cas_derreur',
        RU: '',
        SN: '',
        TN: '',
        US:
          'https://www.ovh.com/us/g2277.exchange_diagnostic_what_to_do_in_the_event_of_an_error',
        WE: '',
      },
    },
    OFFICE_365_ORDER: {
      DEFAULT: 'https://ovhcloud.com/en-ie/collaborative-tools/microsoft-365/',
      DE: 'https://ovhcloud.com/de/collaborative-tools/microsoft-365/',
      ES: 'https://ovhcloud.com/es-es/collaborative-tools/microsoft-365/',
      IE: 'https://ovhcloud.com/en-ie/collaborative-tools/microsoft-365/',
      IT: 'https://ovhcloud.com/it/collaborative-tools/microsoft-365/',
      PL: 'https://ovhcloud.com/pl/collaborative-tools/microsoft-365/',
      PT: 'https://ovhcloud.com/pt/collaborative-tools/microsoft-365/',
      GB: 'https://ovhcloud.com/en-gb/collaborative-tools/microsoft-365/',
      FR: 'https://ovhcloud.com/fr/collaborative-tools/microsoft-365/',
      MA: 'https://ovhcloud.com/fr/collaborative-tools/microsoft-365/',
      TN: 'https://ovhcloud.com/fr/collaborative-tools/microsoft-365/',
      SN: 'https://ovhcloud.com/fr/collaborative-tools/microsoft-365/',
    },
  },
};

export const DOMAIN_ORDER_URL = {
  CZ: 'https://www.ovh.cz/cgi-bin/newOrder/order.cgi',
  DE:
    'https://www.ovh.de/order/ps://www.ovh.com/fr/cgi-bin/newOrder/order.cgi/',
  ES: 'https://www.ovh.es/order/webcloud/',
  FI: 'https://www.ovh-hosting.fi/cgi-bin/newOrder/order.cgi',
  FR: 'https://www.ovh.com/fr/order/webcloud/',
  GB: 'https://www.ovh.co.uk/order/webcloud',
  IE: 'https://www.ovh.ie/order/webcloud',
  IT: 'https://www.ovh.it/order/webcloud/',
  LT: 'https://www.ovh.lt/order/webcloud/',
  NL: 'https://www.ovh.nl/order/webcloud/',
  PL: 'https://www.ovh.pl/order/webcloud/',
  PT: 'https://www.ovh.pt/order/webcloud/',
  ASIA: 'https://ca.ovh.com/asia/order/webcloud',
  IN: 'https://ca.ovh.com/in/order/webcloud',
  AU: 'https://ca.ovh.com/au/order/webcloud',
  CA: 'https://ca.ovh.com/en/order/webcloud',
  QC: 'https://ca.ovh.com/fr/order/webcloud',
  SG: 'https://ca.ovh.com/sg/order/webcloud',
  WE: 'https://us.ovh.com/us/order/webcloud',
  WS: 'https://us.ovh.com/es/order/webcloud',
};

export const EXCHANGE_CONTAINER_MESSAGING = 'exchangeMessagingContainerId';

export default {
  EXCHANGE_MX_CONFIG,
  EXCHANGE_CONFIG_URL,
  EXCHANGE_CONFIG,
  EXCHANGE_CONTAINER_MESSAGING,
};
