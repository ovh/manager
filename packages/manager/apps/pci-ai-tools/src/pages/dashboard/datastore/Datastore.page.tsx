import { ColumnDef } from '@tanstack/react-table';
import { AlertCircle, ArrowRight, Plus } from 'lucide-react';
import { Alert, Button } from '@datatr-ux/uxlib';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import ai from '@/types/AI';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import Guides from '@/components/guides/Guides.component';
import OvhLink from '@/components/links/OvhLink.component';
import { getColumns } from './_components/ DatastoreTableColumns.component';
import DataTable from '@/components/data-table';
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
      namespace="ai-tools/dashboard/datastores"
    />
  );
}

const Datastore = () => {
  const { t } = useTranslation('ai-tools/dashboard/datastores');
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [regions, setRegions] = useState<ai.capabilities.Region[]>([]);
  const regionQuery = useGetRegions(projectId);
  const datastoreQuery = useGetDatastoresWithRegions(projectId, regions, {
    refetchInterval: POLLING.DATASTORE,
  });
  const columns: ColumnDef<DataStoresWithRegion>[] = getColumns({
    onDeleteClick: (datastore: DataStoresWithRegion) =>
      navigate(`./delete/${datastore.region}/${datastore.alias}`),
  });

  const userPath = `#/pci/project/${projectId}/users`;

  useEffect(() => {
    if (!regionQuery.data) return;
    setRegions(regionQuery.data);
  }, [regionQuery.isSuccess]);

  return (
    <>
      <div className="float-right">
        <Guides />
      </div>
      <h3 className="pb-4">{t('title')}</h3>
      <Alert variant="primary" className="mt-4">
        <div className="flex flex-row gap-3 items-center">
          <AlertCircle className="size-5 shrink-0" />
          <div>
            <p>{t('datastoreAlert')}</p>
            <OvhLink
              application="public-cloud"
              path={userPath}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('manageS3UserLinkLabel')}
              <ArrowRight className="size-4 inline ml-1" />
            </OvhLink>
          </div>
        </div>
      </Alert>
      <p>{t('datastoreParagraphe2')}</p>
      <p>{t('datastoreParagraphe3')}</p>
      <Button
        data-testid="create-datastore-button"
        onClick={() => navigate('./add')}
      >
        <Plus className="size-5 mr-2" />
        {t('addButtonLabel')}
      </Button>

      <DataTable.Provider
        columns={columns}
        data={datastoreQuery.data?.filter(
          (ds) => ds.type === ai.DataStoreTypeEnum.s3,
        )}
        pageSize={25}
      />
      <Outlet />
    </>
  );
};

export default Datastore;
