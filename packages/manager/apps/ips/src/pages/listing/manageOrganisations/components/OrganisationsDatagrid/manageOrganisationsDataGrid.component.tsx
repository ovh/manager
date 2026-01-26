import React, { useMemo, useState } from 'react';

import { Outlet } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { TABLE_SIZE } from '@ovhcloud/ods-react';

import { Datagrid, DatagridColumn } from '@ovh-ux/muk';

import { OrgDetails } from '@/data/api';
import { useGetOrganisationsDetails } from '@/data/hooks/organisation';

import { OrganisationsActionsCell } from '../DatagridCells/OrganisationsActionsCell';
import { OrganisationsAddressCell } from '../DatagridCells/OrganisationsAddressCell';
import { OrganisationsNameCell } from '../DatagridCells/OrganisationsNameCell';

export const ManageOrganisationsDatagrid: React.FC = () => {
  const { t } = useTranslation('manage-organisations');
  const pageSize = 10;
  const [numberOfPageDisplayed, setNumberOfPageDisplayed] = useState(1);
  const { data: orgDetails, loading } = useGetOrganisationsDetails({
    enabled: true,
  });
  const paginatedOrgList = useMemo(() => {
    if (!orgDetails || loading) return [];

    return orgDetails.slice(0, pageSize * numberOfPageDisplayed) || [];
  }, [numberOfPageDisplayed, loading, orgDetails]);

  const columns: DatagridColumn<OrgDetails>[] = [
    {
      id: 'organisationId',
      accessorKey: 'organisationId',
      header: t('manageOrganisationsTabOrganisaton'),
      size: 100,
    },
    {
      id: 'type',
      accessorKey: 'registry',
      header: t('manageOrganisationsTabType'),
      size: 70,
    },
    {
      id: 'name',
      accessorKey: 'firstname',
      header: t('manageOrganisationsTabSurname'),
      cell: OrganisationsNameCell,
    },
    {
      id: 'email',
      accessorKey: 'abuse_mailbox',
      header: t('manageOrganisationsTabEmail'),
    },
    {
      id: 'phone',
      accessorKey: 'phone',
      header: t('manageOrganisationsTabPhone'),
    },
    {
      id: 'address',
      accessorKey: 'address',
      header: t('manageOrganisationsTabAddress'),
      cell: OrganisationsAddressCell,
    },
    {
      id: 'action',
      accessorKey: 'organisationId',
      header: '',
      size: 50,
      cell: OrganisationsActionsCell,
    },
  ];

  return (
    <>
      <Datagrid
        containerHeight={numberOfPageDisplayed * pageSize * 51 + 50}
        isLoading={loading}
        size={TABLE_SIZE.sm}
        columns={columns}
        data={paginatedOrgList}
        totalCount={orgDetails?.length}
        onFetchNextPage={() => setNumberOfPageDisplayed((nb) => nb + 1)}
        onFetchAllPages={() =>
          setNumberOfPageDisplayed(orgDetails?.length / pageSize)
        }
        hasNextPage={numberOfPageDisplayed * pageSize < orgDetails?.length}
      />
      <Outlet />
    </>
  );
};

export default ManageOrganisationsDatagrid;
