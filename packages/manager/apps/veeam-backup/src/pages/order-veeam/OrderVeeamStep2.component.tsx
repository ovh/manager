import React from 'react';
import { Datagrid, DatagridColumn } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  OdsButton,
  OdsMessage,
  OdsRadio,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  getVeeamBackupProductSettings,
  useOrderURL,
} from '@ovh-ux/manager-module-order';
import {
  BackupStatus,
  VCDOrganization,
  VCDOrganizationWithBackupStatus,
  getAvailabilityZone,
  getOrganizationUuid,
  useOrganizationWithBackupStatusList,
} from '@ovh-ux/manager-module-vcd-api';
import { urls } from '@/routes/routes.constant';
import { Loading } from '@/components/Loading/Loading';
import {
  BackupStatusCell,
  DescriptionCell,
  LocationCell,
  NameCell,
  RegionCell,
} from './VCDOrganiationDatagridCell.component';
import { NoOrganizationMessage } from '@/components/NoOrganizationMessage/NoOrganizationMessage.component';

const useExpressOrderLink = () => {
  const orderBaseUrl = useOrderURL('express_review_base');

  return {
    getVeeamBackupOrderLink: ({
      datacenterZone,
      orgId,
    }: {
      datacenterZone?: string;
      orgId: string;
    }) => {
      const settings = getVeeamBackupProductSettings({ datacenterZone, orgId });
      return `${orderBaseUrl}?products=~(${settings})`;
    },
  };
};

const isOrganizationDisabled = (
  organization: VCDOrganizationWithBackupStatus,
) => organization.backupStatus !== BackupStatus.none;

export const OrderVeeamStep2: React.FC = () => {
  const { t } = useTranslation('order-veeam');
  const [selectedVcdOrg, setSelectedVcdOrg] = React.useState<VCDOrganization>(
    null,
  );
  const { getVeeamBackupOrderLink } = useExpressOrderLink();
  const navigate = useNavigate();
  const {
    data,
    flattenData,
    fetchNextPage,
    hasNextPage,
    isError,
    isLoading,
    error,
  } = useOrganizationWithBackupStatusList({ pageSize: 10 });

  const columns: DatagridColumn<VCDOrganizationWithBackupStatus>[] = [
    {
      id: 'action',
      label: '',
      isSortable: false,
      cell: (organization) => (
        <OdsRadio
          name="radio-organization"
          onClick={() => {
            if (!isOrganizationDisabled(organization)) {
              setSelectedVcdOrg(organization);
            }
          }}
          isChecked={organization?.id === selectedVcdOrg?.id}
          isDisabled={isOrganizationDisabled(organization)}
        />
      ),
    },
    {
      id: 'name',
      label: t('name_cell'),
      isSortable: false,
      cell: NameCell,
    },
    {
      id: 'status',
      label: 'Veeam Managed Backup',
      isSortable: false,
      cell: BackupStatusCell,
    },
    {
      id: 'location',
      label: t('location_cell'),
      isSortable: false,
      cell: LocationCell,
    },
    {
      id: 'region',
      label: t('region_cell'),
      isSortable: false,
      cell: RegionCell,
    },
    {
      id: 'description',
      label: t('description_cell'),
      isSortable: false,
      cell: DescriptionCell,
    },
  ];

  const allOrgsBackedUp = React.useMemo(
    () =>
      flattenData?.length > 0 &&
      flattenData?.every((org) =>
        [BackupStatus.active, BackupStatus.error].includes(org.backupStatus),
      ),
    [flattenData],
  );

  return (
    <>
      <OdsText preset="heading-1" className="block mb-9">
        {t('choose_org_title')}
      </OdsText>
      {isLoading && <Loading className="mb-5" />}
      {!isLoading && !isError && (
        <NoOrganizationMessage organizationList={data?.pages[0].data} />
      )}
      {isError && (
        <OdsMessage className="mb-9" color="danger">
          {error.message}
        </OdsMessage>
      )}
      {!isLoading && allOrgsBackedUp && (
        <OdsMessage className="mb-9" color="warning">
          {t(
            hasNextPage
              ? 'all_organization_backed_up_message_fetch_next_page'
              : 'all_organization_backed_up_message',
          )}
        </OdsMessage>
      )}
      <React.Suspense fallback={<Loading />}>
        {!isLoading && flattenData?.length > 0 && (
          <div className="mb-9">
            <Datagrid
              columns={columns}
              items={flattenData}
              totalItems={flattenData.length}
              hasNextPage={hasNextPage}
              onFetchNextPage={fetchNextPage}
              contentAlignLeft
            />
          </div>
        )}
      </React.Suspense>
      <div>
        <OdsButton
          label={t('cancel_button')}
          variant="ghost"
          onClick={() => navigate(urls.listing)}
        />
        <OdsButton
          label={t('order_button')}
          className="ml-6"
          onClick={() => {
            window.open(
              getVeeamBackupOrderLink({
                orgId: getOrganizationUuid(selectedVcdOrg),
                datacenterZone: getAvailabilityZone(selectedVcdOrg),
              }),
              '_blank',
            );
            navigate(urls.listing);
          }}
          isDisabled={!selectedVcdOrg}
        />
      </div>
    </>
  );
};
