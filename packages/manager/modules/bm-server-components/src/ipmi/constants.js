export const IPMI_GUIGES = {
  CZ: 'https://docs.ovh.com/cz/cs/dedicated/pouziti-ipmi-dedikovane-servery/',
  DE: 'https://docs.ovh.com/de/dedicated/verwendung-ipmi-dedicated-server/',
  ES: 'https://docs.ovh.com/es/dedicated/utilizar-ipmi-servidor-dedicado/',
  FI:
    'https://docs.ovh.com/fi/dedicated/ipmi-konsolin-kaytto-dedikoidut-palvelimet/',
  FR: 'https://docs.ovh.com/fr/dedicated/utilisation-ipmi-serveurs-dedies/',
  QC: 'https://docs.ovh.com/fr/dedicated/utilisation-ipmi-serveurs-dedies/',
  IT: 'https://docs.ovh.com/it/dedicated/utilizzo-ipmi-server-dedicati/',
  LT: 'https://docs.ovh.com/lt/dedicated/use-ipmi-dedicated-servers/',
  NL: 'https://docs.ovh.com/nl/dedicated/gebruik-ipmi-dedicated-servers/',
  PL: 'https://docs.ovh.com/pl/dedicated/uzywanie-ipmi-serwery-dedykowane/',
  PT: 'https://docs.ovh.com/pt/dedicated/usar-ipmi-servidores-dedicados/',
  IE: 'https://docs.ovh.com/ie/en/dedicated/use-ipmi-dedicated-servers/',
  US:
    'https://docs.ovh.com/gb/en/dedicated/use-ipmi-dedicated-servers/#testing-and-rebooting-the-ipmi',
  DEFAULT: 'https://docs.ovh.com/gb/en/dedicated/use-ipmi-dedicated-servers/',
};

export const getIpmiGuideUrl = (subsidiary) => {
  return IPMI_GUIGES[subsidiary] || IPMI_GUIGES.DEFAULT;
};

export default {
  getIpmiGuideUrl,
};
