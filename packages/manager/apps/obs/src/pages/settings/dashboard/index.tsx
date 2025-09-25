import { Suspense, useEffect, useMemo, useState } from 'react';
import { Outlet, useMatch, useNavigate, useParams } from 'react-router-dom';
import {
  BaseLayout,
  ChangelogLinks,
  GuideButton,
  Headers,
} from '@ovh-ux/manager-react-components';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OdsSpinner } from '@ovhcloud/ods-components/react';
import TabsPanel from '@/components/tabsPanel/TabsPanel.component';
import { ObsServiceSelector } from '@/components/service-components/serviceSelector/ObsServiceSelector.component';
import { ObsServiceOrderButton } from '@/components/service-components/serviceOrderButton/ObsServiceOrderButton.component';
import { ObsSettingsOutletContext } from '@/types/ObsSettings.type';

export const CHANGELOG_LINKS: ChangelogLinks = {
  changelog:
    'https://github.com/orgs/ovh/projects/16/views/6?pane=info&sliceBy%5Bvalue%5D=Baremetal',
  roadmap:
    'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Baremetal',
  'feature-request':
    'https://github.com/ovh/infrastructure-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
};

export type TabItemProps = {
  name: string;
  title: string;
  pathMatchers?: RegExp[];
  to: string;
};

const SettingsDashboardPage = () => {
  const { serviceId: serviceIdParam } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [serviceId, setServiceId] = useState<string | undefined>(
    serviceIdParam,
  );

  const match = useMatch('/settings/:serviceId/*');
  const subPath = match?.params['*'] || 'general-informations';

  const settingsBasePath = `/settings/${serviceId}`;

  const tabsList: TabItemProps[] = [
    {
      name: 'general-informations',
      title: 'Informations générales',
      to: `${settingsBasePath}/general-informations`,
    },
    {
      name: 'grafana',
      title: 'Grafana',
      to: `${settingsBasePath}/grafana`,
    },
    {
      name: 'politiqueIAM',
      title: 'Politique IAM',
      to: `${settingsBasePath}/politiqueIAM`,
    },
    {
      name: 'infrastructure',
      title: 'Infrastructure dediée',
      to: `${settingsBasePath}/infrastructure`,
    },
  ];

  useEffect(() => {
    if (!serviceId && serviceIdParam) {
      setServiceId(serviceIdParam);
    }
  }, [serviceIdParam, serviceId]);

  const handleServiceChange = (newServiceId: string) => {
    setServiceId(newServiceId);
    navigate(`/settings/${newServiceId}/${subPath}`, { replace: true });
  };

  const contextValue: ObsSettingsOutletContext = useMemo(() => {
    return {
      serviceId,
    };
  }, [serviceId]);

  return (
    <section>
      <div className="pt-8 px-4 md:pt-9 md:px-10 md:mt-2">
        <div className="mt-[24px]">
          <Headers
            title="Settings"
            changelogButton={
              <GuideButton
                items={[
                  {
                    id: 1,
                    href: '',
                    target: '_blank',
                    label: 'Guides',
                  },
                ]}
              />
            }
          />
        </div>
        <div className="flex justify-between">
          <ObsServiceSelector
            initialServiceId={serviceId}
            onServiceChange={handleServiceChange}
          />
          <ObsServiceOrderButton />
        </div>
      </div>

      {serviceId && (
        <BaseLayout tabs={<TabsPanel tabs={tabsList} />}>
          <Suspense fallback={<OdsSpinner size={ODS_SPINNER_SIZE.md} />}>
            <Outlet context={contextValue} />
          </Suspense>
        </BaseLayout>
      )}
    </section>
  );
};

export default SettingsDashboardPage;
