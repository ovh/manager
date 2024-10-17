import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import Guides from '@/components/guides/Guides.component';
import { useGetCatalog } from '@/hooks/api/catalog/useGetCatalog.hook';
import OrderFunnel from './_components/OrderFunnel.component';
import { useGetRegions } from '@/hooks/api/ai/capabilities/useGetRegions.hook';
import { useGetFramework } from '@/hooks/api/ai/notebook/capabilities/useGetFramework.hook';
import { useGetEditor } from '@/hooks/api/ai/notebook/capabilities/useGetEditor.hook';
import { useGetDatastoresWithRegions } from '@/hooks/api/ai/datastore/useGetDatastoresWithRegions.hook';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey={`breadcrumb`}
      namespace="pci-ai-notebooks/notebooks/create"
    />
  );
}

const Notebook = () => {
  const { t } = useTranslation('pci-ai-notebooks/notebooks/create');
  const { projectId } = useParams();
  /* /
  const suggestionsQuery = useGetSuggestions(projectId, {
    refetchOnWindowFocus: false,
  });
  */

  const regionsQuery = useGetRegions(projectId, {
    refetchOnWindowFocus: false,
  });
  const catalogQuery = useGetCatalog({ refetchOnWindowFocus: false });
  const frameworkQuery = useGetFramework(projectId, {
    refetchOnWindowFocus: false,
  });

  const editorQuery = useGetEditor(projectId, {
    refetchOnWindowFocus: false,
  });
  return (
    <>
      <div className="flex justify-between w-full items-center">
        <h2>{t('title')}</h2>
        <Guides />
      </div>
      {regionsQuery.isSuccess &&
        catalogQuery.isSuccess &&
        frameworkQuery.isSuccess &&
        editorQuery.isSuccess && (
          <OrderFunnel
            regions={regionsQuery.data}
            catalog={catalogQuery.data}
            frameworks={frameworkQuery.data}
            editors={editorQuery.data}
          />
        )}
    </>
  );
};

export default Notebook;
