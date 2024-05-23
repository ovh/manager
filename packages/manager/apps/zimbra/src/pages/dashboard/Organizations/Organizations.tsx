import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  OsdsButton,
  OsdsIcon,
  OsdsMessage,
  OsdsText,
} from '@ovhcloud/ods-components/react';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { Datagrid, DatagridColumn } from '@ovhcloud/manager-components';
import { useQuery } from '@tanstack/react-query';
import { ResourceStatus } from '@/api/api.type';
import {
  getZimbraPlatformOrganization,
  getZimbraPlatformOrganizationQueryKey,
} from '@/api';
import { usePlatform } from '@/hooks';
import { ActionButtonOrganization } from './ActionButtonOrganization';
import IdLink from './IdLink';
import LabelChip from '@/components/LabelChip';
import { BadgeStatus } from '@/components/BadgeStatus';

export type OrganizationItem = {
  id: string;
  name: string;
  label: string;
  account: string;
  status: string;
};

export default function Organizations() {
  const { t } = useTranslation('organisations');
  const { platformId } = usePlatform();
  const { data } = useQuery({
    queryKey: platformId
      ? getZimbraPlatformOrganizationQueryKey(platformId)
      : null,
    queryFn: () =>
      platformId ? getZimbraPlatformOrganization(platformId) : null,
    enabled: !!platformId,
  });
  const items: OrganizationItem[] =
    data?.map((item) => ({
      id: item.id,
      name: item.targetSpec.name,
      label: item.targetSpec.label,
      account:
        item.targetSpec.accountsStatistics[0]?.configuredAccountsCount?.toString() ||
        '',
      status: item.resourceStatus || '',
    })) ?? [];

  const handleAddOrganisation = () => {
    console.log('Ajouter une nouvelle organisation');
  };
  const [deleteSuccess, setDeleteSuccess] = useState<{
    message: string;
    status: boolean;
  }>({
    message: '',
    status: false,
  });
  const handleDeleteSuccess = (hasError: boolean) => {
    const message = hasError
      ? t('zimbra_organization_delete_error_message')
      : t('zimbra_organization_delete_success_message');
    setDeleteSuccess({ message, status: true });
  };

  const columns: DatagridColumn<OrganizationItem>[] = useMemo(
    () => [
      {
        id: 'name',
        cell: (item) => <IdLink id={item.id}>{item.name}</IdLink>,
        label: 'zimbra_organization_name',
      },

      {
        id: 'label',
        cell: (item) =>
          item.label && <LabelChip id={item.id}>{item.label}</LabelChip>,
        label: 'zimbra_organization_label',
      },
      {
        id: 'account',
        cell: (item) => (
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_TEXT_SIZE._200}
            level={ODS_TEXT_LEVEL.body}
          >
            {item.account}
          </OsdsText>
        ),
        label: 'zimbra_organization_account_number',
      },
      {
        id: 'status',
        cell: (item) => <BadgeStatus itemStatus={item.status}></BadgeStatus>,
        label: 'zimbra_organization_status',
      },
      {
        id: 'tooltip',
        cell: (item) =>
          (item.status === ResourceStatus.READY ||
            item.status === ResourceStatus.ERROR) && (
            <ActionButtonOrganization
              organizationItem={item}
              onDeleteSuccessCallback={(error: any) =>
                handleDeleteSuccess(error)
              }
            />
          ),
        label: '',
      },
    ],
    [],
  );
  return (
    <div className="py-6">
      {deleteSuccess.status &&
        deleteSuccess.message ===
          t('zimbra_organization_delete_success_message') && (
          <OsdsMessage type={ODS_MESSAGE_TYPE.success}>
            {deleteSuccess.message}
          </OsdsMessage>
        )}
      {deleteSuccess.status &&
        deleteSuccess.message ===
          t('zimbra_organization_delete_error_message') && (
          <OsdsMessage type={ODS_MESSAGE_TYPE.error}>
            {deleteSuccess.message}
          </OsdsMessage>
        )}
      <div className="flex items-center justify-between">
        <OsdsButton
          color={ODS_THEME_COLOR_INTENT.primary}
          inline={true}
          size={ODS_BUTTON_SIZE.sm}
          onClick={handleAddOrganisation}
        >
          <span slot="start">
            <OsdsIcon
              name={ODS_ICON_NAME.PLUS}
              size={ODS_ICON_SIZE.sm}
              color={ODS_THEME_COLOR_INTENT.primary}
              contrasted
            ></OsdsIcon>
          </span>
          <span slot="end">{t('zimbra_organization_cta')}</span>
        </OsdsButton>
      </div>
      <Datagrid
        columns={columns.map((column) => ({
          ...column,
          label: t(column.label),
        }))}
        items={items}
        totalItems={platformId?.length || 0}
      />
    </div>
  );
}
