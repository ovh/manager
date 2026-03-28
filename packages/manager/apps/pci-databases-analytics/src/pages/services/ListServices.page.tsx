import { useMemo } from 'react';
import { Outlet, redirect, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetServices } from '@/data/hooks/database/service/useGetServices.hook';
import ServicesList from './_components/ServiceListTable.component';
import LegalMentions from '../_components/LegalMentions.component';
import { POLLING } from '@/configuration/polling.constants';
import Guides from '@/components/guides/Guides.component';
import { GuideSections } from '@/types/guide';
import { useTrackAction } from '@/hooks/useTracking.hook';
import { useUserActivityContext } from '@/contexts/UserActivity.context';
import { TRACKING } from '@/configuration/tracking.constants';
import * as database from '@/types/cloud/project/database';
import RoadmapChangelog from '@/components/roadmap-changelog/RoadmapChangelog.component';
import queryClient from '@/query.client';
import { getServices } from '@/data/api/database/service.api';

interface ServicesProps {
  params: {
    projectId: string;
    category: string;
  };
  request: Request;
}

export const Loader = ({ params }: ServicesProps) => {
  const { category, projectId } = params;
  return queryClient
    .fetchQuery({
      queryKey: [projectId, 'database/service'],
      queryFn: () => getServices({ projectId }),
    })
    .then((services) => {
      if (services.length === 0) {
        return redirect(
          `/pci/projects/${projectId}/databases-analytics/${category}/services/onboarding`,
        );
      }
      return null;
    });
};

const ListServices = () => {
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
        className="flex justify-between w-full items-center py-4"
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

export default ListServices;
