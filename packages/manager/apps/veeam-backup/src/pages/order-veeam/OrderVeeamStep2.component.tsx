import React from 'react';
import { Datagrid, DatagridColumn, Title } from '@ovhcloud/manager-components';
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
import { urls } from '@/routes/routes.constant';
import {
  BackupStatus,
  VCDOrganizationWithBackupStatus,
  useOrganizationList,
} from '@/data';
import { Loading } from '@/components/Loading/Loading';
import { VCDOrgInfoLink } from '@/components/Links/VCDOrgInfoLink.component';
import {
  BackupStatusCell,
  DescriptionCell,
  NameCell,
  RegionCell,
} from './VCDOrganiationDatagridCell.component';

const getExpressOrderLink = (orgId: string) => `${orgId}`;

export const OrderVeeamStep2: React.FC = () => {
  const { t } = useTranslation('order-veeam');
  const [selectedVcdOrg, setSelectedVcdOrg] = React.useState('');
  const navigate = useNavigate();
  const {
    data,
    flattenData,
    fetchNextPage,
    hasNextPage,
    isError,
    isLoading,
    error,
  } = useOrganizationList({ pageSize: 10 });

  const columns: DatagridColumn<VCDOrganizationWithBackupStatus>[] = [
    {
      id: 'action',
      label: '',
      isSortable: false,
      cell: (organization) => (
        <OsdsRadioButton
          size={ODS_RADIO_BUTTON_SIZE.xs}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() => setSelectedVcdOrg(organization?.id)}
          checked={organization?.id === selectedVcdOrg || undefined}
          disabled={
            organization.backupStatus !== BackupStatus.none || undefined
          }
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
      {!isLoading && data?.pages[0].data.length === 0 && (
        <OsdsMessage type={ODS_MESSAGE_TYPE.warning}>
          {t('no_organization_message')}
          <VCDOrgInfoLink label={t('no_organization_link')} />
        </OsdsMessage>
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
      <React.Suspense>
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
            window.open(getExpressOrderLink(selectedVcdOrg), '_blank');
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
