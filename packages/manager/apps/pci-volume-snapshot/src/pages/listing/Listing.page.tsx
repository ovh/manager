import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
} from '@ovhcloud/ods-components/react';
import {
  BaseLayout,
  Datagrid,
  PciGuidesHeader,
  RedirectionGuard,
  useDataGrid,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { useProject } from '@ovh-ux/manager-pci-common';
import { useTranslation } from 'react-i18next';
import { useDatagridColumn } from '@/pages/listing/useDatagridColumn';
import {
  usePaginatedVolumeSnapshot,
  useVolumeSnapshots,
} from '@/api/hooks/useSnapshots';

export default function ListingPage() {
  const { t } = useTranslation(['volumes']);

  const hrefProject = useProjectUrl('public-cloud');
  const { data: project } = useProject();

  const columns = useDatagridColumn();
  const { pagination, setPagination, sorting, setSorting } = useDataGrid({
    id: 'creationDate',
    desc: true,
  });
  const { paginatedSnapshots, isLoading } = usePaginatedVolumeSnapshot(
    project?.project_id || '',
    pagination,
    sorting,
  );

  return (
    <RedirectionGuard condition={false} isLoading={false} route={''}>
      <BaseLayout
        breadcrumb={
          <OdsBreadcrumb>
            <OdsBreadcrumbItem
              label={project?.description}
              href={hrefProject}
            />
            <OdsBreadcrumbItem
              label={t('pci_projects_project_storages_snapshots_title')}
              href={'#'}
            />
          </OdsBreadcrumb>
        }
        header={{
          title: t('pci_projects_project_storages_snapshots_title'),
          headerButton: <PciGuidesHeader category={'storage'} />,
        }}
      >
        <Datagrid
          columns={columns}
          items={isLoading ? [] : paginatedSnapshots.rows}
          totalItems={paginatedSnapshots.totalRows}
          pagination={pagination}
          onPaginationChange={setPagination}
          sorting={sorting}
          onSortChange={setSorting}
          isLoading={isLoading}
        />
      </BaseLayout>
    </RedirectionGuard>
  );
}
