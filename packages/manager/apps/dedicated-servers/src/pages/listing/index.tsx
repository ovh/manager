import React, { useEffect, useContext, useState } from 'react';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import {
  Outlet,
  useLocation,
  useMatches,
  useNavigate,
  NavLink,
} from 'react-router-dom';
import {
  useOvhTracking,
  useRouteSynchro,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';
import {
  ChangelogButton,
  BaseLayout,
  GuideButton,
} from '@ovh-ux/manager-react-components';
import { OdsTabs, OdsTab } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { CHANGELOG_LINKS } from '@/data/constants/changelogLinks';
import { urls } from '@/routes/routes.constant';
import { useCluster } from '@/hooks/useCluster';
import useGuides from '@/hooks/useGuides';

export default function Layout() {
  const { t } = useTranslation('dedicated-servers');
  const location = useLocation();
  const { shell } = useContext(ShellContext);
  const matches = useMatches();
  const { trackCurrentPage, trackClick } = useOvhTracking();
  const { data, isSuccess: isSuccessCluster } = useCluster();
  const [activePanel, setActivePanel] = useState('');
  const navigate = useNavigate();
  const guides = useGuides(t);

  useRouteSynchro();

  useEffect(() => {
    const match = matches.slice(-1);
    defineCurrentPage(`app.dedicated-servers-${match[0]?.id}`);
  }, [location]);

  useEffect(() => {
    shell.ux.hidePreloader();
    trackCurrentPage();
  }, []);

  useEffect(() => {
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
      } else {
        setActivePanel('server');
        navigate(urls.server);
      }
    }
  }, [location.pathname]);

  return (
    <React.Suspense>
      <BaseLayout
        header={{
          title: t('title'),
          changelogButton: <ChangelogButton links={CHANGELOG_LINKS} />,
          headerButton: <GuideButton items={guides} />,
        }}
        tabs={
          <div>
            <OdsTabs>
              <NavLink
                key={'osds-tab-bar-item-server'}
                to={'/server'}
                className="no-underline"
                onClick={() => {
                  trackClick({
                    actionType: 'action',
                    actions: ['main-tabnav', 'go-to-tab', 'all-servers'],
                  });
                }}
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
              {isSuccessCluster && data?.length > 0 && (
                <NavLink
                  key={`osds-tab-bar-item-cluster`}
                  to={'/cluster'}
                  className="no-underline"
                  onClick={() => {
                    trackClick({
                      actionType: 'action',
                      actions: ['main-tabnav', 'go-to-tab', '3az-clusters'],
                    });
                  }}
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
              )}
            </OdsTabs>
          </div>
        }
      >
        <Outlet />
      </BaseLayout>
    </React.Suspense>
  );
}
