import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  DatagridColumn,
  DataGridTextCell,
  useFormatDate,
} from '@ovh-ux/manager-react-components';
import { FilterTypeCategories } from '@ovh-ux/manager-core-api';

import { IamServiceAccount } from '@/data/api/iam-service-accounts';
import { Actions } from './Actions.component';
import { ServiceAccountsPolicyCount } from '@/pages/serviceAccounts/components/ServiceAccountsPolicyCount.component';

export function useDatagridColumn(): DatagridColumn<IamServiceAccount>[] {
  const { t } = useTranslation('permanent-tokens');
  const formatDate = useFormatDate();

  return [
    {
      id: 'name',
      label: t('iam_user_tokens_datagrid_column_name'),
      cell: (account: IamServiceAccount) => (
        <DataGridTextCell>{account.name}</DataGridTextCell>
      ),
      type: FilterTypeCategories.String,
      isSearchable: true,
      isSortable: true,
      isFilterable: true,
    },
    {
      id: 'description',
      label: t('iam_user_tokens_datagrid_column_description'),
      cell: (account: IamServiceAccount) => (
        <DataGridTextCell>{account.description}</DataGridTextCell>
      ),
      type: FilterTypeCategories.String,
      isSearchable: true,
      isSortable: true,
      isFilterable: true,
    },
    {
      id: 'policy-count',
      label: 'Politiques associées',
      cell: (account: IamServiceAccount) => (
        <ServiceAccountsPolicyCount account={account} />
      ),
      type: FilterTypeCategories.String,
      isSearchable: false,
      isSortable: false,
      isFilterable: false,
    },
    {
      id: 'creation',
      label: t('iam_user_tokens_datagrid_column_creation'),
      cell: (account: IamServiceAccount) => (
        <DataGridTextCell>
          {formatDate({ date: account.createdAt, format: 'P' })}
        </DataGridTextCell>
      ),
      type: FilterTypeCategories.Date,
      isSortable: true,
      isFilterable: true,
    },
    {
      id: 'actions',
      label: '',
      cell: (account: IamServiceAccount) => <Actions account={account} />,
    },
  ];
}
