import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import Guides from '@/components/guides/Guides.component';
import { useGetCatalog } from '@/hooks/api/catalog/useGetCatalog.hook';

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

  const catalogQuery = useGetCatalog({ refetchOnWindowFocus: false });
  return (
    <>
      <div className="flex justify-between w-full items-center">
        <h2>{t('title')}</h2>
        <Guides />
      </div>
    </>
  );
};

export default Notebook;
