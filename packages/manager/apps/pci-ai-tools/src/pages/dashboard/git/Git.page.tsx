import { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@datatr-ux/uxlib';
import ai from '@/types/AI';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import Guides from '@/components/guides/Guides.component';
import { getColumns } from './_components/GitTableColumns.component';
import DataTable from '@/components/data-table';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { POLLING } from '@/configuration/polling.constants';
import { useGetRegions } from '@/data/hooks/ai/capabilities/useGetRegions.hook';
import {
  DataStoresWithRegion,
  useGetDatastoresWithRegions,
} from '@/data/hooks/ai/data/useGetDatastoresWithRegions.hook';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="ai-tools/dashboard/git"
    />
  );
}

const Git = () => {
  const { t } = useTranslation('ai-tools/dashboard/git');
  const navigate = useNavigate();
  const { projectId } = useParams();
  const regionQuery = useGetRegions(projectId);
  const regions = regionQuery.data || [];
  const { isUserActive } = useUserActivityContext();
  const datastoreQuery = useGetDatastoresWithRegions(projectId, regions, {
    refetchInterval: isUserActive && POLLING.DATASTORE,
    enabled: !!regionQuery.data,
  });
  const columns: ColumnDef<DataStoresWithRegion>[] = getColumns({
    onDeleteClick: (git: DataStoresWithRegion) =>
      navigate(`./delete/${git.region}/${git.alias}`),
  });

  return (
    <>
      <div className="float-right">
        <Guides />
      </div>
      <h3>{t('title')}</h3>
      <p>{t('gitParagraphe2')}</p>
      <p>{t('gitParagraphe3')}</p>
      <Button data-testid="create-git-button" onClick={() => navigate('./add')}>
        <Plus className="size-5 mr-2" />
        {t('addButtonLabel')}
      </Button>

      <DataTable.Provider
        columns={columns}
        data={datastoreQuery.data?.filter(
          (ds) => ds.type === ai.DataStoreTypeEnum.git,
        )}
        pageSize={25}
      />
      <Outlet />
    </>
  );
};

export default Git;
