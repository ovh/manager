import { useMemo } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import {
  ChangelogLinks,
  ChangelogButton,
} from '@ovh-ux/manager-react-components';
import { useGetServices } from '@/hooks/api/database/service/useGetServices.hook';
import ServicesList from './_components/ServiceListTable.component';
import LegalMentions from '../_components/LegalMentions.component';
import { POLLING } from '@/configuration/polling.constants';
import Link from '@/components/links/Link.component';
import { Button } from '@/components/ui/button';
import Guides from '@/components/guides/Guides.component';
import { GuideSections } from '@/types/guide';
import { useTrackAction } from '@/hooks/useTracking';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { TRACKING } from '@/configuration/tracking.constants';
import * as database from '@/types/cloud/project/database';

const Services = () => {
  const { t } = useTranslation('pci-databases-analytics/services');
  const track = useTrackAction();
  const { projectId, category } = useParams();
  const { isUserActive } = useUserActivityContext();
  const servicesQuery = useGetServices(projectId, {
    refetchInterval: isUserActive && POLLING.SERVICES,
  });
  const changelogLinks: ChangelogLinks = {
    changelog:
      'https://github.com/orgs/ovh/projects/16/views/6?pane=info&sliceBy%5Bvalue%5D=Managed+Databases',
    roadmap:
      'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Managed+Databases',
    'feature-request':
      'https://github.com/ovh/public-cloud-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
  };
  const changelogChapters = TRACKING.servicesList.page().split('::');
  const filteredServices = useMemo(() => {
    if (!servicesQuery.data) return [];
    return servicesQuery.data.filter(
      (service) =>
        category === database.engine.CategoryEnum.all ||
        service.category === category,
    );
  }, [servicesQuery.data, category]);

  if (servicesQuery.isLoading) return <ServicesList.Skeleton />;
  return (
    <>
      <div
        data-testid="services-guides-container"
        className="flex justify-between w-full items-center"
      >
        <h2>{t('title')}</h2>
        <div className="flex flex-wrap justify-end gap-1">
          <ChangelogButton
            links={changelogLinks}
            chapters={changelogChapters}
          />
          <Guides
            section={GuideSections.landing}
            noEngineFilter
            onGuideClick={(guide) =>
              track(TRACKING.servicesList.guideClick(guide.title))
            }
          />
        </div>
      </div>
      <ServicesList services={filteredServices} />
      <LegalMentions className="mt-4" />
      <Outlet />
    </>
  );
};

export default Services;
