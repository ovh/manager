import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Datagrid, DatagridColumn } from '@ovh-ux/manager-react-components';
import { ODS_ICON_NAME, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsLink, OdsText } from '@ovhcloud/ods-components/react';
import { UserNativeType } from '@/api/users/type';
import Loading from '@/components/Loading/Loading';
import { useOfficeLicenseDetail, useOfficeUsers } from '@/hooks';
import { BadgeStatus } from '@/components/BadgeStatus';
import { UserStateEnum } from '@/api/api.type';
import ActionButtonUsers from './ActionButtonUsers.component';

export default function Users() {
  const { t } = useTranslation('dashboard/users');

  const { data: dataUsers, isLoading: isLoadingUsers } = useOfficeUsers();
  const {
    data: dataLicenceDetail,
    isLoading: isLoadingLicenceDetail,
  } = useOfficeLicenseDetail();

  if (isLoadingUsers || isLoadingLicenceDetail) {
    return <Loading />;
  }

  const columns: DatagridColumn<UserNativeType>[] = [
    {
      id: 'firstName',
      cell: (item: UserNativeType) => (
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.firstName}</OdsText>
      ),
      label: 'dashboard_users_table_firstName',
    },
    {
      id: 'lastName',
      cell: (item: UserNativeType) => (
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.lastName}</OdsText>
      ),
      label: 'dashboard_users_table_lastName',
    },
    {
      id: 'activationEmail',
      cell: (item: UserNativeType) => (
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {item.activationEmail}
        </OdsText>
      ),
      label: 'dashboard_users_table_activationEmail',
    },
    {
      id: 'licences',
      cell: (item: UserNativeType) => (
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.licences}</OdsText>
      ),
      label: 'dashboard_users_table_licences',
    },
    {
      id: 'status',
      cell: (item: UserNativeType) =>
        item.isVirtual ? (
          <BadgeStatus
            itemStatus={
              item.taskPendingId
                ? UserStateEnum.CREATING
                : UserStateEnum.UNCONFIGURED
            }
          ></BadgeStatus>
        ) : (
          <BadgeStatus itemStatus={item.status}></BadgeStatus>
        ),
      label: 'dashboard_users_table_status',
    },
    {
      id: 'action',
      cell: (item: UserNativeType) => (
        <ActionButtonUsers
          usersItem={item}
          licenceDetail={dataLicenceDetail}
        ></ActionButtonUsers>
      ),
      label: '',
    },
  ];

  return (
    <div className="mb-4" data-testid="test">
      <OdsText preset={ODS_TEXT_PRESET.paragraph} className="mb-4">
        <Trans
          t={t}
          i18nKey={'dashboard_users_download_text'}
          components={{
            officeLink: (
              <OdsLink
                target="_blank"
                referrerpolicy="strict-origin-when-cross-origin"
                href={'https://portal.office.com/'}
                icon={ODS_ICON_NAME.externalLink}
                label={'Office'}
              ></OdsLink>
            ),
          }}
        />
        <p>{t('dashboard_users_download_info')}</p>
        <strong>{t('dashboard_users_download_id')}</strong>
      </OdsText>

      {columns && (
        <Datagrid
          columns={columns.map((column) => ({
            ...column,
            label: t(column.label),
          }))}
          items={dataUsers || []}
          totalItems={dataUsers?.length || 0}
          className="mt-4"
        />
      )}
    </div>
  );
}
