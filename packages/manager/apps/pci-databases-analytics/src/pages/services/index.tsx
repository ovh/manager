import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { useGetServices } from '@/hooks/api/services.api.hooks';
import { database } from '@/models/database';
import ServicesList from './_components/serviceListTable';
import Onboarding from './_components/onboarding';
import LegalMentions from '../_components/legalMentions';
import { POLLING } from '@/configuration/polling';
import { Link } from '@/components/links';
import { Button } from '@/components/ui/button';
import Guides from '@/components/guides';
import { GuideSections } from '@/models/guide';
import { useTrackPage, useTrackAction } from '@/hooks/useTracking';
import { TRACKING } from '@/configuration/tracking';

const Services = () => {
  const { t } = useTranslation('pci-databases-analytics/services');
  useTrackPage(TRACKING.servicesList.page());
  const track = useTrackAction();
  const { projectId, category } = useParams();
  const servicesQuery = useGetServices(projectId, {
    refetchInterval: POLLING.SERVICES,
  });
  const filteredServices = useMemo(() => {
    if (!servicesQuery.data) return [];
    return servicesQuery.data.filter(
      (service) =>
        category === database.CategoryEnum.all || service.category === category,
    );
  }, [servicesQuery.data, category]);
  const hasRedisService =
    filteredServices.filter((s) => s.engine === database.EngineEnum.redis)
      .length > 0;

  if (servicesQuery.isLoading) return <ServicesList.Skeleton />;
  if (servicesQuery.isSuccess && filteredServices.length === 0) {
    return <Onboarding />;
  }
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
      <ServicesList
        services={filteredServices}
        refetchFn={servicesQuery.refetch}
      />
      <LegalMentions showRedisMessage={hasRedisService} className="mt-4" />
    </>
  );
};

export default Services;
