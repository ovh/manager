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
      { fieldType: 'MX', target: 'mx1.mail.ovh.ca', priority: 1 },
      { fieldType: 'MX', target: 'mx2.mail.ovh.ca', priority: 5 },
      { fieldType: 'MX', target: 'mx3.mail.ovh.ca', priority: 50 },
      { fieldType: 'MX', target: 'mx4.mail.ovh.ca', priority: 100 },
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
  },
};

export default {
  EXCHANGE_MX_CONFIG,
  EXCHANGE_CONFIG_URL,
  EXCHANGE_CONFIG,
};
