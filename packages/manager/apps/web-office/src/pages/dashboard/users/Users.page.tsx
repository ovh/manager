import { Outlet, useNavigate } from 'react-router-dom';

import { Trans, useTranslation } from 'react-i18next';

import { ODS_BUTTON_VARIANT, ODS_ICON_NAME, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsButton, OdsIcon, OdsLink, OdsMessage, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Datagrid, ManagerButton } from '@ovh-ux/manager-react-components';
import type { DatagridColumn } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { ORDER_OFFICE } from '@/Tracking.constants';
import { BadgeStatus } from '@/components/badge-status/BadgeStatus.component';
import { UserStateEnum } from '@/data/api/ApiType';
import { LicensePrepaidType } from '@/data/api/license/type';
import { UserNativeType } from '@/data/api/users/type';
import { useLicenseDetail } from '@/data/hooks/license-details/useLicenseDetails';
import { useUsers } from '@/data/hooks/users/useUsers';
import { useGenerateUrl } from '@/hooks/generate-url/useGenerateUrl';
import { IAM_ACTIONS } from '@/utils/IamAction.constants';

import ActionButtonUsers from './ActionButtonUsers.component';

export default function Users() {
  const { t } = useTranslation([
    'dashboard/users',
    'common',
    NAMESPACES.DASHBOARD,
    NAMESPACES.FORM,
    NAMESPACES.ACTIONS,
  ]);
  const { trackClick } = useOvhTracking();
  const { data: dataUsers, isLoading: isLoadingUsers } = useUsers();

  const { data: dataLicenceDetail, isLoading: isLoadingLicenceDetail } = useLicenseDetail();

  const dataServiceName = dataLicenceDetail?.serviceName;
  const dataTenantServiceName = dataLicenceDetail?.tenantServiceName;

  const hrefOrderLicenses = useGenerateUrl('/license/:serviceName/users/order-licenses', 'path', {
    serviceName: dataServiceName,
    tenantServiceName: dataTenantServiceName,
  });

  const hrefOrderUsers = useGenerateUrl('/license/:serviceName/users/order-users', 'path', {
    serviceName: dataServiceName,
  });
  const navigate = useNavigate();
  const tracking = () =>
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [ORDER_OFFICE],
    });
  const onOrderLicenses = () => {
    tracking();
    navigate(hrefOrderLicenses);
  };
  const onOrderUsers = () => {
    tracking();
    navigate(hrefOrderUsers);
  };

  const columns: DatagridColumn<UserNativeType | LicensePrepaidType>[] = [
    {
      id: 'firstName',
      cell: (item: UserNativeType) => (
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.firstName}</OdsText>
      ),
      label: `${NAMESPACES.FORM}:firstname`,
    },
    {
      id: 'lastName',
      cell: (item: UserNativeType) => (
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.lastName}</OdsText>
      ),
      label: `${NAMESPACES.FORM}:lastname`,
      enableHiding: true,
    },
    {
      id: 'activationEmail',
      cell: (item: UserNativeType) => (
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.activationEmail}</OdsText>
      ),
      label: 'dashboard_users_table_activationEmail',
      enableHiding: true,
    },
    {
      id: 'licences',
      cell: (item: UserNativeType) => (
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.licences}</OdsText>
      ),
      label: 'dashboard_users_table_licences',
      enableHiding: true,
    },
    {
      id: 'status',
      cell: (item: UserNativeType) =>
        item.isVirtual ? (
          <BadgeStatus
            itemStatus={item.taskPendingId ? UserStateEnum.CREATING : UserStateEnum.UNCONFIGURED}
          ></BadgeStatus>
        ) : (
          <BadgeStatus itemStatus={item.status}></BadgeStatus>
        ),
      label: 'dashboard_users_table_status',
      enableHiding: true,
    },
    {
      id: 'action',
      cell: (item: UserNativeType) => (
        <ActionButtonUsers usersItem={item} licenceDetail={dataLicenceDetail}></ActionButtonUsers>
      ),
      enableHiding: false,
      label: '',
    },
  ];

  return (
    <div className="mb-4">
      <Outlet />
      <OdsText preset={ODS_TEXT_PRESET.paragraph} className="mb-4">
        <OdsIcon name={ODS_ICON_NAME.download} className="mr-4" />
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
                label={'Microsoft Office'}
              ></OdsLink>
            ),
          }}
        />
        <p>{t('dashboard_users_download_info')}</p>
        <OdsMessage isDismissible={false}>{t('dashboard_users_download_id')}</OdsMessage>
      </OdsText>
      <Datagrid
        columns={columns.map((column) => ({
          ...column,
          label: t(column.label),
        }))}
        items={dataUsers || []}
        totalItems={dataUsers?.length || 0}
        topbar={
          !dataLicenceDetail?.serviceType ? (
            <OdsButton
              data-testid="licenses-order-button"
              label={t('common:users_order_licenses')}
              onClick={onOrderLicenses}
              variant={ODS_BUTTON_VARIANT.outline}
            />
          ) : (
            <ManagerButton
              id={dataLicenceDetail.id as string}
              data-testid="users-order-button"
              label={t(`${NAMESPACES.ACTIONS}:order_users`)}
              urn={dataLicenceDetail?.iam.urn}
              onClick={onOrderUsers}
              variant={ODS_BUTTON_VARIANT.outline}
              iamActions={[IAM_ACTIONS.user.create]}
            />
          )
        }
        isLoading={isLoadingUsers || isLoadingLicenceDetail}
      />
    </div>
  );
}
