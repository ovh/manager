export interface GuideLinks {
  [key: string]: string | Guide;
  FR?: string;
  GB?: string;
  DE?: string;
  ES?: string;
  IT?: string;
  PL?: string;
  PT?: string;
  IE?: string;
  DEFAULT?: string;
  MA?: string;
  TN?: string;
  SN?: string;
  IN?: string;
}

export interface Guide {
  key: string;
  url: GuideLinks | string;
  tracking: string;
}

const helpRoot = 'https://docs.ovh.com/';

export const WEB_OFFICE_ONBOARDING_1: GuideLinks = {
  FR: `${helpRoot}fr/microsoft-collaborative-solutions/commander-et-gerer-un-groupe-de-licences-office-365-ovh/`,
  DE: `${helpRoot}de/microsoft-collaborative-solutions/bestellung_und_verwaltung_einer_office_365_lizenzgruppe_bei_ovh/`,
  ES: `${helpRoot}es/microsoft-collaborative-solutions/contratar_y_gestionar_un_grupo_de_licencias_de_office_365_ovh/`,
  IE: `${helpRoot}ie/en/microsoft-collaborative-solutions/manage-office-365-csp1/`,
  IT: `${helpRoot}it/microsoft-collaborative-solutions/ordina_e_gestisci_un_gruppo_di_licenze_office_365_ovh/`,
  PL: `${helpRoot}pl/microsoft-collaborative-solutions/zamowienie_grupy_licencji_office_365_ovh/`,
  PT: `${helpRoot}pt/microsoft-collaborative-solutions/encomendar-et-gerir-um-grupo-de-licenças-office-365-ovh/`,
  GB: `${helpRoot}gb/en/microsoft-collaborative-solutions/manage-office-365-csp1/`,
  DEFAULT: `${helpRoot}gb/en/microsoft-collaborative-solutions/manage-office-365-csp1/`,
};
export const WEB_OFFICE_ONBOARDING_2: GuideLinks = {
  FR: `${helpRoot}fr/microsoft-collaborative-solutions/commander-et-gerer-un-groupe-de-licences-office-365-revendeur-csp2-ovh/`,
  DE: `${helpRoot}de/microsoft-collaborative-solutions/verwaltung_einer_office_365_reseller_lizenzgruppe_csp2/`,
  ES: `${helpRoot}es/microsoft-collaborative-solutions/contratar-y-gestionar-un-grupo-de-licencias-office-365-revendedor-csp2-ovh/`,
  IE: `${helpRoot}ie/en/microsoft-collaborative-solutions/order-and-manage-a-group-of-ovh-office-365-csp2-reseller-licences/`,
  IT: `${helpRoot}it/microsoft-collaborative-solutions/ordina_e_gestisci_un_gruppo_di_licenze_office_365_reseller_ovh_csp2/`,
  PL: `${helpRoot}pl/microsoft-collaborative-solutions/zarzadzanie-licencje-office-365-reseller-csp2/`,
  PT: `${helpRoot}pt/microsoft-collaborative-solutions/encomendar_e_gerir_um_grupo_de_licencas_office_365_revendedor_csp2_ovh/`,
  GB: `${helpRoot}en/microsoft-collaborative-solutions/order-and-manage-a-group-of-ovh-office-365-csp2-reseller-licences/`,
  DEFAULT: `${helpRoot}gb/en/microsoft-collaborative-solutions/order-and-manage-a-group-of-ovh-office-365-csp2-reseller-licences/`,
};

export const WEB_OFFICE_ONBOARDING_3: GuideLinks = {
  DEFAULT: `${helpRoot}gb/en/microsoft-collaborative-solutions/office365-proplus-remote-desktop/`,
  DE: `${helpRoot}de/microsoft-collaborative-solutions/office365-proplus-remotedesktopdienste/`,
  ES: `${helpRoot}es/microsoft-collaborative-solutions/office365-proplus-escritorio-remoto/`,
  IE: `${helpRoot}ie/en/microsoft-collaborative-solutions/office365-proplus-remote-desktop/`,
  IT: `${helpRoot}it/microsoft-collaborative-solutions/office365-proplus-desktop-remoto/`,
  PL: `${helpRoot}pl/microsoft-collaborative-solutions/office365-proplus-biuro-a-zdalne/`,
  PT: `${helpRoot}pt/microsoft-collaborative-solutions/office365-proplus-escritório-a-distância/`,
  GB: `${helpRoot}gb/en/microsoft-collaborative-solutions/office365-proplus-remote-desktop/`,
  FR: `${helpRoot}fr/microsoft-collaborative-solutions/office365-proplus-bureau-a-distance/`,
};

export const CTAS: Record<string, string> = {
  DEFAULT: 'https://ovhcloud.com/en/collaborative-tools/microsoft-365/',
  ASIA: 'https://ovhcloud.com/asia/collaborative-tools/microsoft-365/',
  IN: 'https://www.ovhcloud.com/en-in/collaborative-tools/microsoft-365/',
  DE: 'https://ovhcloud.com/de/collaborative-tools/microsoft-365/',
  ES: 'https://ovhcloud.com/es-es/collaborative-tools/microsoft-365/',
  IE: 'https://ovhcloud.com/en-ie/collaborative-tools/microsoft-365/',
  IT: 'https://ovhcloud.com/it/collaborative-tools/microsoft-365/',
  NL: 'https://ovhcloud.com/nl/collaborative-tools/microsoft-365/',
  PL: 'https://ovhcloud.com/pl/collaborative-tools/microsoft-365/',
  PT: 'https://ovhcloud.com/pt/collaborative-tools/microsoft-365/',
  GB: 'https://ovhcloud.com/en-gb/collaborative-tools/microsoft-365/',
  CA: 'https://ovhcloud.com/en-ca/collaborative-tools/microsoft-365/',
  QC: 'https://ovhcloud.com/fr-ca/collaborative-tools/microsoft-365/',
  MA: 'https://ovhcloud.com/fr-ma/collaborative-tools/microsoft-365/',
  SN: 'https://ovhcloud.com/fr-sn/collaborative-tools/microsoft-365/',
  TN: 'https://ovhcloud.com/fr-tn/collaborative-tools/microsoft-365/',
  AU: 'https://ovhcloud.com/en-au/collaborative-tools/microsoft-365/',
  SG: 'https://ovhcloud.com/en-sg/collaborative-tools/microsoft-365/',
  FR: 'https://ovhcloud.com/fr/collaborative-tools/microsoft-365/',
  CZ: 'https://ovhcloud.com/cz-cs/collaborative-tools/microsoft-365/',
  FI: 'https://ovhcloud.com/fi/collaborative-tools/microsoft-365/',
  LT: 'https://ovhcloud.com/lt/collaborative-tools/microsoft-365/',
  WE: 'https://ovhcloud.com/us-en/collaborative-tools/microsoft-365/',
  WS: 'https://ovhcloud.com/us-en/collaborative-tools/microsoft-365/',
};
