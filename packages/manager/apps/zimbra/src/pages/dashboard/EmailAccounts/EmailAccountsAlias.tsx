import React from 'react';
import {
  Datagrid,
  DatagridColumn,
  Subtitle,
} from '@ovhcloud/manager-components';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  AliasType,
  getZimbraPlatformAlias,
  getZimbraPlatformAliasQueryKey,
} from '@/api/alias';
import { usePlatform } from '@/hooks';
import ActionButtonAlias from './ActionButtonAlias';
import { BadgeStatus } from '@/components/BadgeStatus';

export type AliasItem = {
  id: string;
  alias: string;
  status: string;
};

export default function EmailAccountsAlias() {
  const { t } = useTranslation('accounts/alias');
  const { platformId } = usePlatform();
  const { data } = useQuery({
    queryKey: getZimbraPlatformAliasQueryKey(platformId),
    queryFn: () => getZimbraPlatformAlias(platformId),
    enabled: !!platformId,
  });

  const columns: DatagridColumn<AliasItem>[] = [
    {
      id: 'alias',
      cell: (item: AliasItem) => (
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._100}
          level={ODS_TEXT_LEVEL.body}
        >
          {item.alias}
        </OsdsText>
      ),
      label: 'zimbra_account_alias_datagrid_alias_label',
    },
    {
      id: 'status',
      cell: (item: AliasItem) => (
        <BadgeStatus itemStatus={item.status}></BadgeStatus>
      ),
      label: 'zimbra_account_alias_datagrid_status_label',
    },
    {
      id: 'tooltip',
      cell: (item: AliasItem) => <ActionButtonAlias aliasItem={item} />,
      label: '',
    },
  ];

  const items: AliasItem[] =
    data?.map((item: AliasType) => ({
      id: item.id,
      alias: item.currentState.alias,
      status: item.resourceStatus,
    })) ?? [];

  return (
    <div className="py-6 mt-8">
      <div className="mb-8">
        <Subtitle>{t('zimbra_account_alias_title')}</Subtitle>
      </div>
      <Datagrid
        columns={columns.map((column) => ({
          ...column,
          label: t(column.label),
        }))}
        items={items}
        totalItems={items.length}
      />
    </div>
  );
}
