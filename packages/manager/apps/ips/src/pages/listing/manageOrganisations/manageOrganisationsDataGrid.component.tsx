import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { Datagrid } from '@ovh-ux/manager-react-components';
import { useGetOrganisationsList } from '@/data/hooks/organisation';
import {
  OrganisationsIdCell,
  OrganisationsTypeCell,
  OrganisationsSurnameCell,
  OrganisationsEmailCell,
  OrganisationsPhoneCell,
  OrganisationsAddressCell,
  OrganisationsActionsCell,
} from '../components/DatagridCells';

export const ManageOrganisationsDatagrid: React.FC = () => {
  const { t } = useTranslation('manage-organisations');
  const pageSize = 10;
  const [numberOfPageDisplayed, setNumberOfPageDisplayed] = useState(1);
  const [paginatedOrgList, setPaginatedOrgList] = useState<string[]>([]);
  const { organisations, isLoading } = useGetOrganisationsList();
  const columns = [
    {
      id: 'organisationId',
      label: t('manageOrganisationsTabOrganisaton'),
      cell: OrganisationsIdCell,
    },
    {
      id: 'type',
      label: t('manageOrganisationsTabType'),
      cell: OrganisationsTypeCell,
    },
    {
      id: 'name',
      label: t('manageOrganisationsTabSurname'),
      cell: OrganisationsSurnameCell,
    },
    {
      id: 'email',
      label: t('manageOrganisationsTabEmail'),
      cell: OrganisationsEmailCell,
    },
    {
      id: 'phone',
      label: t('manageOrganisationsTabPhone'),
      cell: OrganisationsPhoneCell,
    },
    {
      id: 'address',
      label: t('manageOrganisationsTabAddress'),
      cell: OrganisationsAddressCell,
    },
    {
      id: 'action',
      label: '',
      cell: OrganisationsActionsCell,
    },
  ];

  const loadMoreIps = () => {
    setNumberOfPageDisplayed(numberOfPageDisplayed + 1);
  };

  useEffect(() => {
    if (!organisations) return;
    setPaginatedOrgList(
      organisations.slice(0, pageSize * numberOfPageDisplayed),
    );
  }, [organisations, numberOfPageDisplayed]);

  return (
    <>
      {isLoading ? (
        <div>
          <OdsSpinner size={ODS_SPINNER_SIZE.lg} />
        </div>
      ) : (
        <Datagrid
          className="pb-[200px] -mx-6"
          columns={columns}
          items={paginatedOrgList.map((orgName) => ({ org: orgName }))}
          totalItems={organisations.length}
          numberOfLoadingRows={10}
          onFetchNextPage={loadMoreIps}
          hasNextPage={numberOfPageDisplayed * pageSize < organisations.length}
          resetExpandedRowsOnItemsChange={true}
          noResultLabel={t('manageOrganisationsTabNodata')}
        />
      )}
    </>
  );
};

export default ManageOrganisationsDatagrid;
