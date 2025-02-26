import { useTranslation } from 'react-i18next';
import { Outlet, useParams } from 'react-router-dom';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import Guides from '@/components/guides/Guides.component';
import { useGetCatalog } from '@/hooks/api/catalog/useGetCatalog.hook';
import { useGetRegions } from '@/hooks/api/ai/capabilities/useGetRegions.hook';
import { Skeleton } from '@/components/ui/skeleton';
import { GuideSections } from '@/configuration/guide';
import OrderFunnel from './_components/OrderFunnel.component';
import { useGetSuggestions } from '@/hooks/api/ai/app/useGetSuggestions.hook';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey={`breadcrumb`}
      namespace="pci-ai-deploy/apps/create"
    />
  );
}

const App = () => {
  const { t } = useTranslation('pci-ai-deploy/apps/create');
  const { projectId } = useParams();

  const suggestionsQuery = useGetSuggestions(projectId, {
    refetchOnWindowFocus: false,
  });

  const regionsQuery = useGetRegions(projectId, {
    refetchOnWindowFocus: false,
  });
  const catalogQuery = useGetCatalog({ refetchOnWindowFocus: false });

  const loading =
    regionsQuery.isPending ||
    catalogQuery.isPending ||
    suggestionsQuery.isPending;

  return (
    <>
      <div className="flex justify-between w-full items-center">
        <h2>{t('title')}</h2>
        <Guides section={[GuideSections.apps]} />
      </div>

      {loading ? (
        <div
          data-testid="order-funnel-skeleton"
          className="grid grid-cols-1 lg:grid-cols-4 gap-4"
        >
          <div className="col-span-1 md:col-span-3 divide-y-[1rem] divide-transparent">
            <Skeleton className="w-80 h-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
              <Skeleton className="w-full h-52" />
              <Skeleton className="w-full h-52" />
              <Skeleton className="w-full h-52" />
              <Skeleton className="w-full h-52" />
              <Skeleton className="w-full h-52" />
            </div>
          </div>
          <Skeleton className="w-full h-[600px]" />
        </div>
      ) : (
        <OrderFunnel
          regions={regionsQuery.data}
          catalog={catalogQuery.data}
          suggestions={suggestionsQuery.data}
        />
      )}
      <Outlet />
    </>
  );
};

export default App;
