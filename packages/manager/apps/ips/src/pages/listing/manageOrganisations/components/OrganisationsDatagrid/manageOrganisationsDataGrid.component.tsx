import React, { useMemo, useState } from 'react';

import { Outlet } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_SPINNER_SIZE, ODS_TABLE_SIZE } from '@ovhcloud/ods-components';
import { OdsSpinner } from '@ovhcloud/ods-components/react';

import {
  DataGridTextCell,
  Datagrid,
  DatagridColumn,
} from '@ovh-ux/manager-react-components';

import { OrgDetails } from '@/data/api';
import { useGetOrganisationsDetails } from '@/data/hooks/organisation';

import { DatagridActionCell } from './DatagridActionCell.component';
import { DatagridAddressCell } from './DatagridAddressCell.component';

export const ManageOrganisationsDatagrid: React.FC = () => {
  const { t } = useTranslation('manage-organisations');
  const pageSize = 10;
  const [numberOfPageDisplayed, setNumberOfPageDisplayed] = useState(1);
  const { data: orgDetails, isLoading } = useGetOrganisationsDetails({
    enabled: true,
  });
  const paginatedOrgList = useMemo(() => {
    if (!orgDetails || isLoading) return [];

    return orgDetails.slice(0, pageSize * numberOfPageDisplayed) || [];
  }, [numberOfPageDisplayed, isLoading, orgDetails]);

  const columns: DatagridColumn<OrgDetails>[] = [
    {
      id: 'organisationId',
      label: t('manageOrganisationsTabOrganisaton'),
      cell: (org: OrgDetails) => (
        <DataGridTextCell>{org?.organisationId}</DataGridTextCell>
      ),
    },
    {
      id: 'type',
      label: t('manageOrganisationsTabType'),
      cell: (org: OrgDetails) => (
        <DataGridTextCell>{org?.registry}</DataGridTextCell>
      ),
    },
    {
      id: 'name',
      label: t('manageOrganisationsTabSurname'),
      cell: (org: OrgDetails) => (
        <DataGridTextCell>{`${org?.firstname} ${org?.lastname}`}</DataGridTextCell>
      ),
    },
    {
      id: 'email',
      label: t('manageOrganisationsTabEmail'),
      cell: (org: OrgDetails) => (
        <DataGridTextCell>{org?.abuse_mailbox}</DataGridTextCell>
      ),
    },
    {
      id: 'phone',
      label: t('manageOrganisationsTabPhone'),
      cell: (org: OrgDetails) => (
        <DataGridTextCell>{org?.phone}</DataGridTextCell>
      ),
    },
    {
      id: 'address',
      label: t('manageOrganisationsTabAddress'),
      cell: DatagridAddressCell,
    },
    {
      id: 'action',
      label: '',
      cell: DatagridActionCell,
    },
  ];

  const loadMoreOrgs = () => {
    setNumberOfPageDisplayed(numberOfPageDisplayed + 1);
  };

  return (
    <>
      {isLoading ? (
        <div>
          <OdsSpinner size={ODS_SPINNER_SIZE.lg} />
        </div>
      ) : (
        <>
          <Datagrid
            className="-mx-6 pb-[200px]"
            size={ODS_TABLE_SIZE.sm}
            columns={columns}
            items={paginatedOrgList}
            totalItems={orgDetails?.length}
            numberOfLoadingRows={10}
            onFetchNextPage={loadMoreOrgs}
            hasNextPage={numberOfPageDisplayed * pageSize < orgDetails?.length}
            resetExpandedRowsOnItemsChange={true}
            noResultLabel={t('manageOrganisationsTabNodata')}
          />
          <Outlet />
        </>
      )}
    </>
  );
};

export default ManageOrganisationsDatagrid;
