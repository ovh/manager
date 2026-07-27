import React, { Suspense, useContext } from 'react';

import { NavLink, Outlet } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { OdsTab, OdsTabs } from '@ovhcloud/ods-components/react';

import {
  BaseLayout,
  Breadcrumb,
  ErrorBanner,
  Notifications,
} from '@ovh-ux/manager-react-components';
import { ShellContext, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { tenantsQueries } from '@/data/queries/tenants.queries';
import { useServiceTabs } from '@/hooks/useServiceTabs/useServiceTabs';
import { LABELS } from '@/module.constants';
import { ApiError } from '@/types/ClientApi.type';

/**
 * Page de service Backup Licenses (BKP-1215) : en-tête + barre des 4 onglets.
 *
 * Route de layout sans `path` : elle ne se rend qu'à travers l'un de ses enfants, si bien
 * qu'ajouter les onglets 1.2/1.3/1.4 ne consistera qu'à ajouter des routes enfants.
 *
 * Le titre est le libellé produit statique, pas le nom ni l'id du service : un identifiant en
 * H1 n'apprend rien à l'utilisateur, et le titre reste ainsi affiché même quand la résolution
 * du service échoue. L'identifiant aura sa place dans « General information » (ticket 1.4).
 */
export default function ServiceLayoutPage() {
  const { environment } = useContext(ShellContext);
  const { trackClick } = useOvhTracking();
  const queryClient = useQueryClient();
  const tabs = useServiceTabs();

  const appName = environment.getApplicationName();

  // Résolution de la cascade service → tenant VSPC. Seul son échec est traité ici :
  // l'échec du chargement de la liste est géré dans l'onglet (cf. LinkedServersError).
  const { isError, error } = useQuery({
    ...tenantsQueries.withClient(queryClient).serviceIds(),
    retry: false,
  });

  return (
    <BaseLayout
      header={{ title: LABELS.BACKUP_LICENSES }}
      breadcrumb={<Breadcrumb appName={appName} rootLabel={appName} />}
      message={<Notifications />}
      tabs={
        <OdsTabs>
          {tabs.map((tab) =>
            tab.isDisabled ? (
              // Onglet annoncé mais pas encore livré : `OdsTab` gère nativement l'état
              // désactivé (et son accessibilité), donc pas de `NavLink` ni de tracking.
              <OdsTab key={tab.name} isDisabled>
                {tab.title}
              </OdsTab>
            ) : (
              <NavLink
                key={tab.name}
                to={tab.to}
                className="no-underline"
                onClick={() => {
                  if (tab.trackingActions?.length) {
                    trackClick({ actions: tab.trackingActions });
                  }
                }}
              >
                <OdsTab isSelected={tab.isActive}>{tab.title}</OdsTab>
              </NavLink>
            ),
          )}
        </OdsTabs>
      }
    >
      {isError ? (
        <ErrorBanner
          error={{
            status: (error as ApiError)?.response?.status,
            data: (error as ApiError)?.response?.data,
          }}
        />
      ) : (
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      )}
    </BaseLayout>
  );
}
