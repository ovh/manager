import { useSearchParams, useParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import LegalMentions from '@/pages/_components/LegalMentions.component';
import OrderFunnel from './_components/OrderFunnel.component';
import * as database from '@/types/cloud/project/database';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import OvhLink from '@/components/links/OvhLink.component';
import Guides from '@/components/guides/Guides.component';
import { GuideSections } from '@/types/guide';
import { useGetAvailabilities } from '@/hooks/api/database/availability/useGetAvailabilities.hook';
import { useGetSuggestions } from '@/hooks/api/database/availability/useGetSuggestions.hook';
import { useGetFullCapabilities } from '@/hooks/api/database/capabilities/useGetFullCapabilities.hook';
import { useGetCatalog } from '@/hooks/api/catalog/useGetCatalog.hook';
import OrderSkeleton from '@/components/order/skeleton/OrderSkeleton.component';

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
  const availabilitiesQuery = useGetAvailabilities(
    projectId,
    null,
    null,
    null,
    { refetchOnWindowFocus: false },
  );
  const suggestionsQuery = useGetSuggestions(projectId, {
    refetchOnWindowFocus: false,
  });
  const capabilitiesQuery = useGetFullCapabilities(projectId, {
    refetchOnWindowFocus: false,
  });
  const catalogQuery = useGetCatalog({ refetchOnWindowFocus: false });
  const loading =
    availabilitiesQuery.isPending ||
    suggestionsQuery.isPending ||
    capabilitiesQuery.isPending ||
    catalogQuery.isPending;

  // if we have en engine set in query params, override suggestions
  const stepEngine = searchParams.get('STEP_1');
  const suggestions =
    stepEngine && suggestionsQuery.data?.find((f) => f.engine === stepEngine)
      ? suggestionsQuery.data.map((s) =>
          s.engine === stepEngine
            ? {
                ...s,
                default: true,
                plan: searchParams.get('STEP_2') ?? s.plan,
                region: searchParams.get('STEP_3') ?? s.region,
                flavor: searchParams.get('STEP_4') ?? s.flavor,
              }
            : {
                ...s,
                default: false,
              },
        )
      : suggestionsQuery.data;

  return (
    <>
      <div className="flex justify-between w-full items-center">
        <h2>{t('title')}</h2>
        <Guides section={GuideSections.funnel} noEngineFilter />
      </div>
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
        <OrderSkeleton />
      ) : (
        <OrderFunnel
          availabilities={availabilitiesQuery.data.filter((a) =>
            category === database.engine.CategoryEnum.all
              ? a
              : a.category === category,
          )}
          capabilities={capabilitiesQuery.data}
          suggestions={suggestions}
          catalog={catalogQuery.data}
        />
      )}
      <LegalMentions />
    </>
  );
};

export default Service;
