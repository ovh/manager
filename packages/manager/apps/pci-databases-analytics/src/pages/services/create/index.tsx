import { useParams } from 'react-router';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useGetAvailabilities,
  useGetCapabilities,
  useGetEnginesCapabilities,
  useGetRegionsCapabilities,
  useGetSuggestions,
} from '@/hooks/api/availabilities.api.hooks';
import { useGetCatalog } from '@/hooks/api/catalog.api.hooks';
import { useAvailabilities } from '@/hooks/useAvailabilities';
import LegalMentions from '@/pages/_components/legalMentions';
import OrderFunnel from './_components/order-funnel';
import { database } from '@/models/database';

export function breadcrumb() {
  return 'New';
}

const Service = () => {
  const { projectId, category } = useParams();
  const availabilitiesQuery = useGetAvailabilities(projectId);
  const suggestions = useGetSuggestions(projectId);
  const capabilitiesQuery = useGetCapabilities(projectId);
  const enginesCapabilities = useGetEnginesCapabilities(projectId);
  const regionsCapabilities = useGetRegionsCapabilities(projectId);
  const catalogQuery = useGetCatalog();
  const loading =
    availabilitiesQuery.isLoading ||
    suggestions.isLoading ||
    capabilitiesQuery.isLoading ||
    enginesCapabilities.isLoading ||
    regionsCapabilities.isLoading ||
    catalogQuery.isLoading;
  return (
    <>
      <p>Create a Service</p>
      {loading ? (
        <Skeleton className="h-4 w-32" />
      ) : (
        <OrderFunnel
          availabilities={availabilitiesQuery.data.filter((a) =>
            category === database.CategoryEnum.all
              ? a
              : a.category === category,
          )}
          capabilities={capabilitiesQuery.data}
          engineCapabilities={enginesCapabilities.data}
          regionCapabilities={regionsCapabilities.data}
          suggestions={suggestions.data}
          catalog={catalogQuery.data}
        />
      )}
      <LegalMentions showRedisMessage={true} className="mt-4" />
    </>
  );
};

export default Service;
