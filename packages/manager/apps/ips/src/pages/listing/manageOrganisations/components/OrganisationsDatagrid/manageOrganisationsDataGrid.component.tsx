import React, { useMemo, useState } from 'react';

import { Outlet } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { SPINNER_SIZE, TABLE_SIZE, Spinner } from '@ovhcloud/ods-react';

import { Datagrid, DatagridColumn } from '@ovh-ux/muk';

import { OrgDetails } from '@/data/api';
import { useGetOrganisationsDetails } from '@/data/hooks/organisation';

import { DatagridActionCell } from './DatagridActionCell.component';
import { DatagridAddressCell } from './DatagridAddressCell.component';

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
      label: t('manageOrganisationsTabOrganisaton'),
      cell: ({ getValue }) => <>{getValue() as string}</>,
    },
    {
      id: 'type',
      accessorKey: 'registry',
      label: t('manageOrganisationsTabType'),
      cell: ({ getValue }) => <>{getValue() as string}</>,
    },
    {
      id: 'name',
      accessorKey: 'firstname',
      label: t('manageOrganisationsTabSurname'),
      cell: ({ row }) => (
        <>{`${row.original?.firstname} ${row.original?.lastname}`}</>
      ),
    },
    {
      id: 'email',
      accessorKey: 'abuse_mailbox',
      label: t('manageOrganisationsTabEmail'),
      cell: ({ getValue }) => <>{getValue() as string}</>,
    },
    {
      id: 'phone',
      accessorKey: 'phone',
      label: t('manageOrganisationsTabPhone'),
      cell: ({ getValue }) => <>{getValue() as string}</>,
    },
    {
      id: 'address',
      accessorKey: 'address',
      label: t('manageOrganisationsTabAddress'),
      cell: ({ row }) => <DatagridAddressCell {...row.original} />,
    },
    {
      id: 'action',
      accessorKey: 'organisationId',
      label: '',
      cell: ({ row }) => <DatagridActionCell {...row.original} />,
    },
  ];

  const loadMoreOrgs = () => {
    setNumberOfPageDisplayed(numberOfPageDisplayed + 1);
  };

  return (
    <>
      {loading ? (
        <div>
          <Spinner size={SPINNER_SIZE.lg} />
        </div>
      ) : (
        <>
          <Datagrid
            size={TABLE_SIZE.sm}
            columns={columns}
            data={paginatedOrgList}
            totalCount={orgDetails?.length}
            onFetchNextPage={loadMoreOrgs}
            hasNextPage={numberOfPageDisplayed * pageSize < orgDetails?.length}
          />
          <Outlet />
        </>
      )}
    </>
  );
};

export default ManageOrganisationsDatagrid;
