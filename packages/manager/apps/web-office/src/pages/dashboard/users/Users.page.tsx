import { Outlet, useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import {
  Datagrid,
  DatagridColumn,
  ManagerButton,
} from '@ovh-ux/manager-react-components';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsIcon,
  OdsLink,
  OdsMessage,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { UserNativeType } from '@/data/api/users/type';
import { useGenerateUrl } from '@/hooks';
import { useLicenseDetail, useUsers } from '@/data/hooks';
import { BadgeStatus } from '@/components/badgeStatus/BadgeStatus.component';
import { UserStateEnum } from '@/data/api/api.type';
import ActionButtonUsers from './ActionButtonUsers.component';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

export default function Users() {
  const { t } = useTranslation(['dashboard/users', 'common']);
  const { data: dataUsers, isLoading: isLoadingUsers } = useUsers();

  const {
    data: dataLicenceDetail,
    isLoading: isLoadingLicenceDetail,
  } = useLicenseDetail();

  const dataServiceName = dataLicenceDetail?.serviceName;
  const dataTenantServiceName = dataLicenceDetail?.tenantServiceName;

  const hrefOrderLicenses = useGenerateUrl(
    '/license/:serviceName/users/order-licenses',
    'path',
    {
      serviceName: dataServiceName,
      tenantServiceName: dataTenantServiceName,
    },
  );

  const hrefOrderUsers = useGenerateUrl(
    '/license/:serviceName/users/order-users',
    'path',
    {
      serviceName: dataServiceName,
    },
  );
  const navigate = useNavigate();
  const onOrderLicenses = () => navigate(hrefOrderLicenses);
  const onOrderUsers = () => navigate(hrefOrderUsers);
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
      enableHiding: true,
    },
    {
      id: 'activationEmail',
      cell: (item: UserNativeType) => (
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {item.activationEmail}
        </OdsText>
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
      enableHiding: true,
    },
    {
      id: 'action',
      cell: (item: UserNativeType) => (
        <ActionButtonUsers
          usersItem={item}
          licenceDetail={dataLicenceDetail}
        ></ActionButtonUsers>
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
        <OdsMessage isDismissible={false}>
          {t('dashboard_users_download_id')}
        </OdsMessage>
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
              id={dataLicenceDetail.id}
              data-testid="users-order-button"
              label={t('common:users_order_users')}
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
