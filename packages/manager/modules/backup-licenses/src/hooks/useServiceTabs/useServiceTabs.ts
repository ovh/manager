import { useMemo } from 'react';

import { useLocation } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';
import { SERVICE_NAV_TABS, ServiceNavTab } from '@/routes/routes.constants';

export type ServiceTab = ServiceNavTab & {
  /** Libellé traduit. */
  title: string;
  isActive: boolean;
};

/**
 * Un onglet est actif si l'URL courante est la sienne ou l'une de ses sous-routes
 * (ex. `/linked-servers/add` gardera « Linked servers » sélectionné).
 */
const isTabActive = (pathname: string, to: string): boolean =>
  pathname === to || pathname.startsWith(`${to}/`);

/** Onglets de la page de service, traduits, avec l'onglet actif calculé depuis l'URL. */
export const useServiceTabs = (): ServiceTab[] => {
  const { t } = useTranslation([BACKUP_LICENSES_NAMESPACES.DASHBOARD, NAMESPACES.DASHBOARD]);
  const { pathname } = useLocation();

  return useMemo(
    () =>
      SERVICE_NAV_TABS.map((tab) => ({
        ...tab,
        title: t(tab.title),
        // Un onglet désactivé n'est pas navigable : il ne peut donc jamais être actif.
        isActive: !tab.isDisabled && isTabActive(pathname, tab.to),
      })),
    [pathname, t],
  );
};
