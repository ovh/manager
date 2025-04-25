import React, { useEffect, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import {
  DataGridTextCell,
  Datagrid,
  DatagridColumn,
} from '@ovh-ux/manager-react-components';
import { useGetOrganisationsDetails } from '@/data/hooks/organisation';
import {
  OrganisationsActionsCell,
  OrganisationsAddressCell,
} from '../DatagridCells';
import { OrgDetails } from '@/data/api';

export const ManageOrganisationsDatagrid: React.FC = () => {
  const { t } = useTranslation('manage-organisations');
  const pageSize = 10;
  const [numberOfPageDisplayed, setNumberOfPageDisplayed] = useState(1);
  const [paginatedOrgList, setPaginatedOrgList] = useState<OrgDetails[]>([]);
  const { orgDetails, isLoading } = useGetOrganisationsDetails({
    enabled: true,
  });

  const DatagridActionCell = (org: OrgDetails) => {
    return (
      <DataGridTextCell>
        <OrganisationsActionsCell {...org} />
      </DataGridTextCell>
    );
  };

  const DatagridAddressCell = (org: OrgDetails) => {
    return (
      <DataGridTextCell>
        <OrganisationsAddressCell {...org} />
      </DataGridTextCell>
    );
  };

  const columns: DatagridColumn<OrgDetails>[] = useMemo(() => {
    return [
      {
        id: 'organisationId',
        label: t('manageOrganisationsTabOrganisaton'),
        cell: ({ organisationId }: OrgDetails) => (
          <DataGridTextCell>{organisationId}</DataGridTextCell>
        ),
      },
      {
        id: 'type',
        label: t('manageOrganisationsTabType'),
        cell: ({ registry }: OrgDetails) => (
          <DataGridTextCell>{registry}</DataGridTextCell>
        ),
      },
      {
        id: 'name',
        label: t('manageOrganisationsTabSurname'),
        cell: (org: OrgDetails) => (
          <DataGridTextCell>
            {`${org?.firstname} ${org?.lastname}`}
          </DataGridTextCell>
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
        cell: ({ phone }: OrgDetails) => (
          <DataGridTextCell>{phone}</DataGridTextCell>
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
  }, []);

  const loadMoreOrgs = () => {
    setNumberOfPageDisplayed(numberOfPageDisplayed + 1);
  };

  useEffect(() => {
    if (!orgDetails) return;
    setPaginatedOrgList(orgDetails.slice(0, pageSize * numberOfPageDisplayed));
  }, [numberOfPageDisplayed, isLoading]);

  return (
    <>
      {isLoading ? (
        <div>
          <OdsSpinner size={ODS_SPINNER_SIZE.lg} />
        </div>
      ) : (
        <>
          <Datagrid
            className="pb-[200px] -mx-6"
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
