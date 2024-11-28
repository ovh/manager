import { useMemo } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
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
        <Guides
          section={GuideSections.landing}
          noEngineFilter
          onGuideClick={(guide) =>
            track(TRACKING.servicesList.guideClick(guide.title))
          }
        />
      </div>
      <Button
        data-testid="create-service-button"
        variant="outline"
        size="sm"
        className="text-base"
        asChild
      >
        <Link
          to="./new"
          className="hover:no-underline"
          onClick={() => track(TRACKING.servicesList.createDatabaseClick())}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('createNewService')}
        </Link>
      </Button>
      <ServicesList services={filteredServices} />
      <LegalMentions className="mt-4" />
      <Outlet />
    </>
  );
};

export default Services;
