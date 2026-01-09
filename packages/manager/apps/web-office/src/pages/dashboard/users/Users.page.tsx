import { useMemo, useState } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import type { VisibilityState } from '@tanstack/react-table';
import { Trans, useTranslation } from 'react-i18next';

import {
  ICON_NAME,
  Icon,
  Link,
  Message,
  MessageBody,
  MessageIcon,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useFeatureAvailability } from '@ovh-ux/manager-module-common-api';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { Button, Datagrid } from '@ovh-ux/muk';
import type { DatagridColumn } from '@ovh-ux/muk';

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
  const { data: availability } = useFeatureAvailability(['web-office:order']);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
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

  const columns: DatagridColumn<UserNativeType | LicensePrepaidType>[] = useMemo(
    () => [
      {
        id: 'firstName',
        header: t(`${NAMESPACES.FORM}:firstname`),
        accessorKey: 'firstName',
        enableHiding: true,
      },
      {
        id: 'lastName',
        header: t(`${NAMESPACES.FORM}:lastname`),
        accessorKey: 'lastName',
        enableHiding: true,
      },
      {
        id: 'activationEmail',
        header: t('dashboard_users_table_activationEmail'),
        accessorKey: 'activationEmail',
        enableHiding: true,
      },
      {
        id: 'licences',
        header: t('dashboard_users_table_licences'),
        accessorKey: 'licences',
        enableHiding: true,
      },
      {
        id: 'status',
        header: t('dashboard_users_table_status'),
        cell: ({
          row: {
            original: { isVirtual, taskPendingId, status },
          },
        }) =>
          isVirtual ? (
            <BadgeStatus
              itemStatus={taskPendingId ? UserStateEnum.CREATING : UserStateEnum.UNCONFIGURED}
            ></BadgeStatus>
          ) : (
            <BadgeStatus itemStatus={status}></BadgeStatus>
          ),
        enableHiding: true,
      },
      {
        id: 'actions',
        maxSize: 50,
        cell: ({ row: { original } }) => (
          <ActionButtonUsers
            usersItem={original}
            licenceDetail={dataLicenceDetail}
          ></ActionButtonUsers>
        ),
      },
    ],
    [dataLicenceDetail, t],
  );

  return (
    <>
      <Outlet />
      <Text preset={TEXT_PRESET.paragraph} className="mb-4">
        <Icon name={ICON_NAME.download} className="mr-4" />
        <Trans
          t={t}
          i18nKey={'dashboard_users_download_text'}
          components={{
            officeLink: (
              <Link
                target="_blank"
                referrerpolicy="strict-origin-when-cross-origin"
                href={'https://portal.office.com/'}
              >
                Microsoft Office
                <Icon name={ICON_NAME.externalLink} />
              </Link>
            ),
          }}
        />
      </Text>
      <Text preset={TEXT_PRESET.paragraph} className="mb-4">
        {t('dashboard_users_download_info')}
      </Text>
      <Message dismissible={false} className="mb-4">
        <MessageIcon name={ICON_NAME.circleInfo} />
        <MessageBody>{t('dashboard_users_download_id')}</MessageBody>
      </Message>
      <Datagrid
        columns={columns}
        data={dataUsers ?? []}
        columnVisibility={{
          columnVisibility,
          setColumnVisibility,
        }}
        topbar={
          availability?.['web-office:order'] && (
            <>
              {!dataLicenceDetail?.serviceType ? (
                <Button data-testid="licenses-order-button" onClick={onOrderLicenses}>
                  {t('common:users_order_licenses')}
                </Button>
              ) : (
                <Button
                  data-testid="users-order-button"
                  urn={dataLicenceDetail?.iam.urn}
                  onClick={onOrderUsers}
                  iamActions={[IAM_ACTIONS.user.create]}
                >
                  {t(`${NAMESPACES.ACTIONS}:order_users`)}
                </Button>
              )}
            </>
          )
        }
        isLoading={isLoadingUsers || isLoadingLicenceDetail}
        containerHeight={400}
      />
    </>
  );
}
