import { useParams } from 'react-router-dom';
import {
  Headers,
  PciGuidesHeader,
  useColumnFilters,
  useDataGrid,
} from '@ovh-ux/manager-react-components';

import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { useProject } from '@ovh-ux/manager-pci-common';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import BreadcrumbCIDR from '@/components/CIDR/Breadcrumb.component';
import BlockCIDR from '@/components/CIDR/CIDR.component';
import { useIpRestrictionsWithFilter } from '@/api/hooks/useIpRestrictions';
import { useSuspenseRegistry } from '@/api/hooks/useRegistry';
import { DatagridProvider } from './DatagridContext.provider';

export default function BlocIPBlock() {
  const { projectId = '', registryId = '' } = useParams();
  const { data: project } = useProject();
  const { data: registry } = useSuspenseRegistry(projectId, registryId);
  const dataGrid = useDataGrid();
  const columnFilters = useColumnFilters();
  const { data: dataCIDR } = useIpRestrictionsWithFilter(
    projectId,
    registryId,
    ['management', 'registry'],
    dataGrid.pagination,
    columnFilters.filters,
    dataGrid.sorting,
  );
  const { t } = useTranslation(['ip-restrictions']);

  return (
    <>
      {project && <BreadcrumbCIDR />}

      <div className="header my-8">
        <Headers
          title={registry.name}
          headerButton={
            <div className="min-w-[7rem]">
              <PciGuidesHeader category="private_registry" />
            </div>
          }
        />
        <OsdsText
          className="block mb-6"
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('private_registry_cidr_manage_title')}
        </OsdsText>
      </div>

      <DatagridProvider
        dataGrid={dataGrid}
        columnFilters={columnFilters}
        data={dataCIDR.rows}
        totalRows={dataCIDR.totalRows}
      >
        <BlockCIDR />
      </DatagridProvider>
    </>
  );
}
