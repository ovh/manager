export const URLS = {
  number: {
    FR: 'https://www.ovhtelecom.fr/telephonie/numeros/',
  },
  domain: {
    ES: 'https://www.ovh.es/dominios/',
    FR: 'https://www.ovh.com/fr/domaines/tarifs/',
  },
  internet: {
    xdsl: {
      FR: 'https://www.ovhtelecom.fr/adsl/',
    },
    fiber: {
      FR: 'https://www.ovhtelecom.fr/fibre/',
    },
    enterprise: {
      FR: 'https://www.ovhtelecom.fr/adsl/entreprise/',
    },
    rescue: {
      FR: 'https://www.ovhtelecom.fr/adsl/connexion-de-secours.xml',
    },
    sdsl: {
      FR: 'https://www.ovhtelecom.fr/sdsl/',
    },
    adslCreation: {
      FR: 'https://www.ovhtelecom.fr/adsl/ouvrir-une-ligne.xml',
    },
    otb: {
      FR: 'https://www.ovhtelecom.fr/overthebox/',
    },
  },
  telephony: {
    voip: {
      FR: 'https://www.ovhtelecom.fr/telephonie/voip/',
    },
    siptrunk: {
      FR: 'https://www.ovhtelecom.fr/telephonie/sip-trunk/',
    },
    siptrunkCall: {
      FR: 'https://www.ovhtelecom.fr/telephonie/sip-trunk-forfait-inclus/',
    },
  },
  email: {
    exchange: {
      ES: 'https://www.ovh.es/emails/hosted-exchange/',
      FR: 'https://www.ovh.com/fr/emails/hosted-exchange/',
    },
    sharepoint: {
      ES: 'https://www.ovh.es/sharepoint/?range=mail',
      FR: 'https://www.ovhtelecom.fr/sharepoint/?range=mail',
    },
  },
  office: {
    business: {
      ES: 'https://www.ovh.es/office-365/',
      FR: 'https://www.ovhtelecom.fr/office-365-business/',
    },
    sharepoint: {
      ES: 'https://www.ovh.es/sharepoint/?range=mail',
      FR: 'https://www.ovhtelecom.fr/sharepoint/?range=mail',
    },
  },
  hubic: {
    FR: 'https://hubic.com/fr/offres/',
  },
  sms: {
    sms: {
      FR: 'https://www.ovhtelecom.fr/sms/',
    },
    hlr: {
      FR: 'https://www.ovhtelecom.fr/sms/home-location-register/',
    },
  },
  fax: {
    FR: 'https://www.ovhtelecom.fr/fax/',
  },
  overTheBox: {
    FR: 'https://www.ovhtelecom.fr/overthebox/tarifs.xml',
  },
};

export const TELEPHONY_AVAILABILITY = {
  order: ['FR'],
};

export default { URLS, TELEPHONY_AVAILABILITY };
