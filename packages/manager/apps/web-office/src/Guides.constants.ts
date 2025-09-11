import { ONBOARDING_CSP1, ONBOARDING_CSP2, ONBOARDING_REMOTE_DESKTOP } from './Tracking.constants';

export interface GuideLinks {
  [key: string]: string;
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
  url: GuideLinks;
  tracking?: string;
}

export interface GuidesList {
  [key: string]: Guide;
}

const helpRoot = 'https://docs.ovh.com/';
const csmRoot = 'https://help.ovhcloud.com/csm/';

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
  MA: `${helpRoot}fr/microsoft-collaborative-solutions/commander-et-gerer-un-groupe-de-licences-office-365-ovh/`,
  TN: `${helpRoot}fr/microsoft-collaborative-solutions/commander-et-gerer-un-groupe-de-licences-office-365-ovh/`,
  SN: `${helpRoot}fr/microsoft-collaborative-solutions/commander-et-gerer-un-groupe-de-licences-office-365-ovh/`,
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
  MA: `${helpRoot}fr/microsoft-collaborative-solutions/commander-et-gerer-un-groupe-de-licences-office-365-revendeur-csp2-ovh/`,
  TN: `${helpRoot}fr/microsoft-collaborative-solutions/commander-et-gerer-un-groupe-de-licences-office-365-revendeur-csp2-ovh/`,
  SN: `${helpRoot}fr/microsoft-collaborative-solutions/commander-et-gerer-un-groupe-de-licences-office-365-revendeur-csp2-ovh/`,
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
  MA: `${helpRoot}fr/microsoft-collaborative-solutions/office365-proplus-bureau-a-distance/`,
  TN: `${helpRoot}fr/microsoft-collaborative-solutions/office365-proplus-bureau-a-distance/`,
  SN: `${helpRoot}fr/microsoft-collaborative-solutions/office365-proplus-bureau-a-distance/`,
};

export const WEB_OFFICE_GUIDES: GuideLinks = {
  DEFAULT: `${csmRoot}en-ie-microsoft-office365-csp1?id=kb_article_view&sysparm_article=KB0053502`,
  DE: `${csmRoot}de-microsoft-office365-csp1?id=kb_article_view&sysparm_article=KB0053520`,
  ES: `${csmRoot}es-es-microsoft-office365-csp1?id=kb_article_view&sysparm_article=KB0053505`,
  IE: `${csmRoot}en-ie-microsoft-office365-csp1?id=kb_article_view&sysparm_article=KB0053502`,
  IT: `${csmRoot}it-microsoft-office365-csp1?id=kb_article_view&sysparm_article=KB0053519`,
  PL: `${csmRoot}pl-microsoft-office365-csp1?id=kb_article_view&sysparm_article=KB0053522`,
  PT: `${csmRoot}pt-microsoft-office365-csp1?id=kb_article_view&sysparm_article=KB0053509`,
  GB: `${csmRoot}en-gb-microsoft-office365-csp1?id=kb_article_view&sysparm_article=KB0041601`,
  FR: `${csmRoot}fr-microsoft-office365-csp1?id=kb_article_view&sysparm_article=KB0053507`,
  MA: `${csmRoot}fr-microsoft-office365-csp1?id=kb_article_view&sysparm_article=KB0053507`,
  TN: `${csmRoot}fr-microsoft-office365-csp1?id=kb_article_view&sysparm_article=KB0053507`,
  SN: `${csmRoot}fr-microsoft-office365-csp1?id=kb_article_view&sysparm_article=KB0053507`,
};

export const ORDER_URL: Record<string, string> = {
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
};

export const GUIDES_LIST: GuidesList = {
  office_cta_order: {
    key: 'web-office_onboarding_cta_order',
    url: ORDER_URL,
  },
  office_guides: {
    key: 'web-office_dashboard_guides',
    url: WEB_OFFICE_GUIDES,
  },
  office_onboarding1_guides: {
    key: 'web-office_onboarding1_guides',
    url: WEB_OFFICE_ONBOARDING_1,
    tracking: ONBOARDING_CSP1,
  },
  office_onboarding2_guides: {
    key: 'web-office_onboarding2_guides',
    url: WEB_OFFICE_ONBOARDING_2,
    tracking: ONBOARDING_CSP2,
  },
  office_onboarding3_guides: {
    key: 'web-office_onboarding3_guides',
    url: WEB_OFFICE_ONBOARDING_3,
    tracking: ONBOARDING_REMOTE_DESKTOP,
  },
};

export default {
  GUIDES_LIST,
};
