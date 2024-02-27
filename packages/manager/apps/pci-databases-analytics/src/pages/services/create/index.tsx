import { useSearchParams } from 'react-router-dom';
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
import LegalMentions from '@/pages/_components/legalMentions';
import OrderFunnel from './_components/order-funnel';
import { database } from '@/models/database';

export function breadcrumb() {
  return 'New';
}

const Service = () => {
  const [searchParams] = useSearchParams();
  const { projectId, category } = useParams();
  const availabilitiesQuery = useGetAvailabilities(projectId);
  const suggestionsQuery = useGetSuggestions(projectId);
  const capabilitiesQuery = useGetCapabilities(projectId);
  const enginesCapabilities = useGetEnginesCapabilities(projectId);
  const regionsCapabilities = useGetRegionsCapabilities(projectId);
  const catalogQuery = useGetCatalog();
  const loading =
    availabilitiesQuery.isLoading ||
    suggestionsQuery.isLoading ||
    capabilitiesQuery.isLoading ||
    enginesCapabilities.isLoading ||
    regionsCapabilities.isLoading ||
    catalogQuery.isLoading;

  let suggestions = suggestionsQuery.data;
  if (searchParams.has('target')) {
    const targetValue = searchParams.get('target');
    try {
      const targetObject = JSON.parse(targetValue);
      if (targetObject && targetObject.steps) {
        const stepsObject = targetObject.steps;
        suggestions = suggestions.map((s) =>
          s.engine === stepsObject.STEP_1
            ? {
                default: true,
                engine: s.engine,
                version: stepsObject.STEP_2 ?? s.version,
                plan: stepsObject.STEP_3 ?? s.plan,
                region: stepsObject.STEP_4 ?? s.region,
                flavor: stepsObject.STEP_5 ?? s.flavor,
              }
            : {
                ...s,
                default: false,
              },
        );
      }
      // eslint-disable-next-line no-empty
    } catch (error) {}
  }
  return (
    <>
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
          suggestions={suggestions}
          catalog={catalogQuery.data}
        />
      )}
      <LegalMentions showRedisMessage={true} className="mt-4" />
    </>
  );
};

export default Service;
