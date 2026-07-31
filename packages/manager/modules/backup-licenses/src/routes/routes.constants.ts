import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { BACKUP_LICENSES_NAMESPACES } from '@/BackupLicenses.translations';

export const subRoutes = {
  onboarding: 'onboarding' as const,
  order: 'order' as const,
  linkedServers: 'linked-servers' as const,
  vaults: 'vaults' as const,
  billing: 'billing' as const,
  generalInformation: 'general-information' as const,
  edit: 'edit' as const,
} as const;

export const urlParams = {
  backupServerId: ':backupServerId' as const,
} as const;

export const urls = {
  root: `/`,
  onboarding: `/${subRoutes.onboarding}`,
} as const;

// Absolute paths for cross-page navigation (routes are mounted under "/" by the consumer app).
export const routeUrls = {
  onboarding: `/${subRoutes.onboarding}`,
  order: `/${subRoutes.order}`,
  linkedServers: `/${subRoutes.linkedServers}`,
  vaults: `/${subRoutes.vaults}`,
  billing: `/${subRoutes.billing}`,
  generalInformation: `/${subRoutes.generalInformation}`,
  /** Page pleine (sœur de `order`), pas une modale : BKP-1218 reprend le tunnel de commande. */
  edit: (backupServerId: string) => `/${subRoutes.edit}/${backupServerId}`,
} as const;

export type ServiceNavTab = {
  name: string;
  /** Clé i18n du libellé de l'onglet. */
  title: string;
  to: string;
  trackingActions?: string[];
  /**
   * Onglet affiché mais non navigable, tant que son ticket n'est pas livré.
   * Retirer ce flag et ajouter la route correspondante dans `routes.tsx` suffit à l'activer.
   */
  isDisabled?: boolean;
};

/**
 * Barre d'onglets de la page de service (BKP-1215). Ordre imposé par le ticket.
 * Les onglets 2/3/4 restent visibles mais désactivés jusqu'aux tickets 1.2/1.3/1.4 :
 * aucun élément d'interface ne doit mener à une route inexistante.
 */
export const SERVICE_NAV_TABS: readonly ServiceNavTab[] = Object.freeze([
  {
    name: 'linked-servers',
    title: `${BACKUP_LICENSES_NAMESPACES.DASHBOARD}:tab.linked_servers`,
    to: routeUrls.linkedServers,
    trackingActions: ['click::linked-servers-tab'],
  },
  {
    name: 'vaults',
    title: `${BACKUP_LICENSES_NAMESPACES.DASHBOARD}:tab.vaults`,
    to: routeUrls.vaults,
    isDisabled: true,
  },
  {
    name: 'billing',
    title: `${BACKUP_LICENSES_NAMESPACES.DASHBOARD}:tab.billing`,
    to: routeUrls.billing,
    isDisabled: true,
  },
  {
    name: 'general-information',
    title: `${NAMESPACES.DASHBOARD}:general_information`,
    to: routeUrls.generalInformation,
    isDisabled: true,
  },
]);
