import React, { useEffect, useContext, useState } from 'react';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import { Outlet, useLocation, useMatches, useNavigate } from 'react-router-dom';
import {
  useOvhTracking,
  useRouteSynchro,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';
import { ChangelogButton, ErrorBanner } from '@ovh-ux/manager-react-components';
import { BaseLayout } from '@ovh-ux/manager-react-components';
import { NavLink } from 'react-router-dom';
import { OdsTabs, OdsTab } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { CHANGELOG_LINKS } from '@/data/constants/changelogLinks';
import { useDedicatedServer } from '@/hooks/useDedicatedServer';
import { urls } from '@/routes/routes.constant';

export default function Layout() {
  const { t } = useTranslation('dedicated-servers');
  const location = useLocation();
  const { shell } = useContext(ShellContext);
  const matches = useMatches();
  const { trackCurrentPage } = useOvhTracking();
  const {
    error,
    data: dedicatedServer,
  } = useDedicatedServer();
  const [activePanel, setActivePanel] = useState('');
  const navigate = useNavigate();

  useRouteSynchro();

  useEffect(() => {
    const match = matches.slice(-1);
    defineCurrentPage(`app.dedicated-servers-${match[0]?.id}`);
  }, [location]);

  useEffect(() => {
    trackCurrentPage();
  }, [location]);

  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  useEffect(() => {
    if (location.pathname && location.pathname === '/' && dedicatedServer) {
      if (dedicatedServer.length > 0) {
        setActivePanel('server');
        navigate(urls.server);
      } else {
        navigate(urls.onboarding);
      }
    }

    if (!location.pathname) {
      setActivePanel('server');
      navigate(urls.server);
    } else {
      const activeTab = [urls.server, urls.cluster].find((tab) => {
        const [pathname] = (tab || '').split('?');
        return pathname === location.pathname;
      });
      if (activeTab) {
        setActivePanel(activeTab.replace('/', ''));
      }
    }
  }, [location.pathname, dedicatedServer]);

  return (
    <React.Suspense>
      {error ? (
        <ErrorBanner error={error} />
      ) : (
        <BaseLayout
          header={{
            title: t('title'),
            changelogButton: <ChangelogButton links={CHANGELOG_LINKS} />,
          }}
          tabs={
            <div>
              <OdsTabs>
                <NavLink
                  key={'osds-tab-bar-item-server'}
                  to={'/server'}
                  className="no-underline"
                >
                  <OdsTab
                    id={'server-tab'}
                    role="tab"
                    isSelected={activePanel === 'server'}
                    isDisabled={false}
                  >
                    {t('all_servers')}
                  </OdsTab>
                </NavLink>
                <NavLink
                  key={`osds-tab-bar-item-cluster`}
                  to={'/cluster'}
                  className="no-underline"
                >
                  <OdsTab
                    id={'cluster-tab'}
                    role="tab"
                    isSelected={activePanel === 'cluster'}
                    isDisabled={false}
                  >
                    {t('clusters')}
                  </OdsTab>
                </NavLink>
              </OdsTabs>
            </div>
          }
        >
          <Outlet />
        </BaseLayout>
      )}
    </React.Suspense>
  );
}
