export const NETBOOT_GUIDES = {
  ASIA: 'https://docs.ovh.com/asia/en/dedicated/hardware-diagnostics',
  AU: 'https://docs.ovh.com/au/en/dedicated/hardware-diagnostics',
  CA: 'https://docs.ovh.com/ca/en/dedicated/hardware-diagnostics',
  DE:
    'https://docs.ovh.com/de/dedicated/diagnose-hardwarefehler-dedicated-server',
  ES:
    'https://docs.ovh.com/es/dedicated/diagnostico-fallos-hardware-servidor-dedicado',
  FR:
    'https://docs.ovh.com/fr/dedicated/diagnostic-dysfonctionnements-materiels-serveur-dedie',
  GB: 'https://docs.ovh.com/gb/en/dedicated/hardware-diagnostics',
  IE: 'https://docs.ovh.com/ie/en/dedicated/hardware-diagnostics',
  IN: 'https://docs.ovh.com/asia/en/dedicated/hardware-diagnostics',
  IT:
    'https://docs.ovh.com/it/dedicated/diagnostica-problemi-hardware-server-dedicato',
  PL:
    'https://docs.ovh.com/pl/dedicated/diagnostyka-usterek-sprzetowych-serwera-dedykowanego',
  PT:
    'https://docs.ovh.com/pt/dedicated/diagnostico-avarias-materiais-servidor-dedicado',
  QC:
    'https://docs.ovh.com/ca/fr/dedicated/diagnostic-dysfonctionnements-materiels-serveur-dedie',
  SG: 'https://docs.ovh.com/sg/en/dedicated/hardware-diagnostics',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/articles/17562733805843-Hardware-Diagnostics-for-a-Dedicated-Server',
  WE: 'https://docs.ovh.com/us/en/dedicated/hardware-diagnostics',
  WS:
    'https://docs.ovh.com/us/es/dedicated/diagnostico-fallos-hardware-servidor-dedicado',
  DEFAULT: 'https://docs.ovh.com/us/en/dedicated/hardware-diagnostics',
};

export const UNSUPPORTED_SSH_KEY_RESCUES = [
  'WinRescue',
  'rescue-customer-windows',
];

export const getNetbootGuideUrl = (subsidiary) => {
  return NETBOOT_GUIDES[subsidiary] || NETBOOT_GUIDES.DEFAULT;
};

export default {
  getNetbootGuideUrl,
  UNSUPPORTED_SSH_KEY_RESCUES,
};
