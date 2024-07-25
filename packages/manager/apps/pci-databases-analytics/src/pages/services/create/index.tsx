import { useSearchParams, useParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useGetAvailabilities,
  useGetFullCapabilities,
  useGetSuggestions,
} from '@/hooks/api/availabilities.api.hooks';
import { useGetCatalog } from '@/hooks/api/catalog.api.hooks';
import LegalMentions from '@/pages/_components/legalMentions';
import OrderFunnel from './_components/order-funnel';
import { database } from '@/models/database';
import BreadcrumbItem from '@/components/Breadcrumb/BreadcrumbItem';
import { OvhLink } from '@/components/links';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey={`breadcrumb`}
      namespace="pci-databases-analytics/services/new"
    />
  );
}

const Service = () => {
  const { t } = useTranslation('pci-databases-analytics/services/new');
  const [searchParams] = useSearchParams();
  const { projectId, category } = useParams();
  const availabilitiesQuery = useGetAvailabilities(projectId);
  const suggestionsQuery = useGetSuggestions(projectId);
  const capabilitiesQuery = useGetFullCapabilities(projectId);
  const catalogQuery = useGetCatalog();
  const loading =
    availabilitiesQuery.isLoading ||
    suggestionsQuery.isLoading ||
    capabilitiesQuery.isLoading ||
    catalogQuery.isLoading;

  let suggestions = suggestionsQuery.data;
  if (searchParams.has('target')) {
    const targetValue = searchParams.get('target');
    try {
      const targetObject = JSON.parse(targetValue);
      if (targetObject?.steps) {
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
      <h2>{t('title')}</h2>
      <p>
        <Trans
          t={t}
          i18nKey={'description'}
          components={{
            anchor: (
              <OvhLink
                application="public-cloud"
                path={`#/pci/projects/${projectId}/private-networks`}
              ></OvhLink>
            ),
          }}
        ></Trans>
      </p>
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
          suggestions={suggestions}
          catalog={catalogQuery.data}
        />
      )}
      <LegalMentions showRedisMessage={true} className="mt-4" />
    </>
  );
};

export default Service;
