import React from 'react';
import {
  Datagrid,
  DatagridColumn,
  Title,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  OsdsButton,
  OsdsMessage,
  OsdsRadioButton,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_TYPE,
  ODS_RADIO_BUTTON_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  getVeeamBackupProductSettings,
  useOrderURL,
} from '@ovh-ux/manager-module-order';
import { urls } from '@/routes/routes.constant';
import {
  BackupStatus,
  VCDOrganization,
  VCDOrganizationWithBackupStatus,
  getAvailabilityZone,
  getOrganizationUuid,
  useOrganizationWithBackupStatusList,
} from '@/data';
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
        <OsdsRadioButton
          size={ODS_RADIO_BUTTON_SIZE.xs}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() => {
            if (!isOrganizationDisabled(organization)) {
              setSelectedVcdOrg(organization);
            }
          }}
          checked={organization?.id === selectedVcdOrg?.id || undefined}
          disabled={isOrganizationDisabled(organization) || undefined}
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

  return (
    <>
      <Title className="block mb-9">{t('choose_org_title')}</Title>
      {isLoading && <Loading className="mb-5" />}
      {!isLoading && !isError && (
        <NoOrganizationMessage organizationList={data?.pages[0].data} />
      )}
      {isError && (
        <OsdsMessage className="mb-9" type={ODS_MESSAGE_TYPE.error}>
          {error.message}
        </OsdsMessage>
      )}
      {!isLoading &&
        flattenData?.length > 0 &&
        flattenData?.every((org) =>
          [BackupStatus.active, BackupStatus.error].includes(org.backupStatus),
        ) && (
          <OsdsMessage className="mb-9" type={ODS_MESSAGE_TYPE.warning}>
            {t(
              hasNextPage
                ? 'all_organization_backed_up_message_fetch_next_page'
                : 'all_organization_backed_up_message',
            )}
          </OsdsMessage>
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
        <OsdsButton
          inline
          variant={ODS_BUTTON_VARIANT.ghost}
          size={ODS_BUTTON_SIZE.sm}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() => navigate(urls.listing)}
        >
          {t('cancel_button')}
        </OsdsButton>
        <OsdsButton
          className="ml-6"
          inline
          variant={ODS_BUTTON_VARIANT.flat}
          size={ODS_BUTTON_SIZE.sm}
          color={ODS_THEME_COLOR_INTENT.primary}
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
          disabled={!selectedVcdOrg || undefined}
        >
          {t('order_button')}
        </OsdsButton>
      </div>
    </>
  );
};
