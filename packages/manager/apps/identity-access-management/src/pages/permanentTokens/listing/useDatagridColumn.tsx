import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  DatagridColumn,
  DataGridTextCell,
  useFormatDate,
} from '@ovh-ux/manager-react-components';
import {
  FilterTypeCategories,
  FilterCategories,
} from '@ovh-ux/manager-core-api';

import { IamUserToken } from '@/data/api/iam-users';
import { Actions } from './Actions.component';
import { ExpirationStatus } from '@/pages/permanentTokens/components/ExpirationStatus.component';

export function useDatagridColumn(): DatagridColumn<IamUserToken>[] {
  const { t } = useTranslation('permanent-tokens');
  const formatDate = useFormatDate();

  return [
    {
      id: 'name',
      label: t('iam_user_tokens_datagrid_column_name'),
      cell: (token: IamUserToken) => (
        <DataGridTextCell>{token.name}</DataGridTextCell>
      ),
      type: FilterTypeCategories.String,
      isSearchable: true,
      isSortable: true,
      isFilterable: true,
    },
    {
      id: 'description',
      label: t('iam_user_tokens_datagrid_column_description'),
      cell: (token: IamUserToken) => (
        <DataGridTextCell>{token.description}</DataGridTextCell>
      ),
      type: FilterTypeCategories.String,
      isSearchable: true,
      isSortable: true,
      isFilterable: true,
    },
    {
      id: 'creation',
      label: t('iam_user_tokens_datagrid_column_creation'),
      cell: (token: IamUserToken) => (
        <DataGridTextCell>
          {formatDate({ date: token.creation, format: 'P' })}
        </DataGridTextCell>
      ),
      type: FilterTypeCategories.Date,
      isSortable: true,
      isFilterable: true,
    },
    {
      id: 'expiration',
      label: t('iam_user_tokens_datagrid_column_expiration'),
      cell: (token: IamUserToken) => (
        <DataGridTextCell>
          {formatDate({ date: token.expiresAt, format: 'P' })}
        </DataGridTextCell>
      ),
      type: FilterTypeCategories.Date,
      isSortable: true,
      isFilterable: true,
    },
    {
      id: 'exporationStatus',
      label: t('iam_user_tokens_datagrid_column_expiration_status'),
      cell: (token: IamUserToken) => (
        <DataGridTextCell>
          <ExpirationStatus token={token} />
        </DataGridTextCell>
      ),
    },
    {
      id: 'lastUsed',
      label: t('iam_user_tokens_datagrid_column_last_usage'),
      cell: (token: IamUserToken) => (
        <DataGridTextCell>
          {formatDate({ date: token.lastUsed, format: 'P' })}
        </DataGridTextCell>
      ),
      type: FilterTypeCategories.Date,
      isSortable: true,
      isFilterable: true,
    },
    {
      id: 'actions',
      label: '',
      cell: (token: IamUserToken) => <Actions token={token} />,
    },
  ];
}
