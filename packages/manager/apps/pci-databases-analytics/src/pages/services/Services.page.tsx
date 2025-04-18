import { useMemo } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetServices } from '@/hooks/api/database/service/useGetServices.hook';
import ServicesList from './_components/ServiceListTable.component';
import LegalMentions from '../_components/LegalMentions.component';
import { POLLING } from '@/configuration/polling.constants';
import Guides from '@/components/guides/Guides.component';
import { GuideSections } from '@/types/guide';
import { useTrackAction } from '@/hooks/useTracking';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { TRACKING } from '@/configuration/tracking.constants';
import * as database from '@/types/cloud/project/database';
import RoadmapChangelog from '@/components/roadmap-changelog/RoadmapChangelog.component';

const Services = () => {
  const { t } = useTranslation('pci-databases-analytics/services');
  const track = useTrackAction();
  const { projectId, category } = useParams();
  const { isUserActive } = useUserActivityContext();
  const servicesQuery = useGetServices(projectId, {
    refetchInterval: isUserActive && POLLING.SERVICES,
  });

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
          <RoadmapChangelog />
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
      <LegalMentions />
      <Outlet />
    </>
  );
};

export default Services;
