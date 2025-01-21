import { ColumnDef } from '@tanstack/react-table';
import { AlertCircle, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import Guides from '@/components/guides/Guides.component';
import OvhLink from '@/components/links/OvhLink.component';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { POLLING } from '@/configuration/polling';
import { useGetRegions } from '@/hooks/api/ai/capabilities/useGetRegions.hook';
import {
  DataStoresWithRegion,
  useGetDatastoresWithRegions,
} from '@/hooks/api/ai/datastore/useGetDatastoresWithRegions.hook';
import * as ai from '@/types/cloud/project/ai';
import { getColumns } from './_components/ DatastoreTableColumns.component';
import { GuideSections } from '@/configuration/guide';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="pci-ai-dashboard/datastores"
    />
  );
}

const Datastore = () => {
  const { t } = useTranslation('pci-ai-dashboard/datastores');
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
        <Guides section={GuideSections.datastore} />
      </div>
      <h3>{t('title')}</h3>
      <Alert variant="info">
        <div className="flex flex-row gap-3 items-center">
          <AlertCircle className="size-8" />
          <div>
            <p>{t('datastoreAlert')}</p>
            <OvhLink application="public-cloud" path={userPath}>
              {t('manageS3UserLinkLabel')}
            </OvhLink>
          </div>
        </div>
      </Alert>
      <p>{t('datastoreParagraphe2')}</p>
      <p>{t('datastoreParagraphe3')}</p>
      <Button
        data-testid="create-datastore-button"
        onClick={() => navigate('./add')}
        className="font-semibold"
        variant="outline"
        size="sm"
      >
        <Plus className="w-4 h-4 mr-2" />
        {t('addButtonLabel')}
      </Button>
      <DataTable
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
