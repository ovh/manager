import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  Listing,
  ListingColumn,
  ListingData,
  useListingSearchParams,
  DatePretty,
  MessageBox,
} from '@ovh-ux/manager-react-core-components';
import { FilterCategories } from '@ovh-ux/manager-core-api';
import { Outlet, useLocation } from 'react-router-dom';

import { listPolicies } from '@/api/iam';
import { IamApiPolicy } from '@/api/types';

export default function IamPolicies() {
  const { t } = useTranslation('iam/policies');
  const searchParams = useListingSearchParams();
  const { state: locationState } = useLocation();

  const actionResult = locationState?.actionResult;

  const [columns, setColumns] = useState<ListingColumn<IamApiPolicy>[]>([
    {
      key: 'name',
      label: t('policy_name'),
      filterable: FilterCategories.String,
      search: true,
      sortable: true,
      hidden: searchParams.isColumnHidden('name'),
    },
    {
      key: 'createdAt',
      label: t('policy_created_at'),
      filterable: FilterCategories.Date,
      search: true,
      sortable: true,
      hidden: searchParams.isColumnHidden('createdAt'),
      renderer: ({ item: policy }) => (
        <DatePretty date={new Date(policy.createdAt)} />
      ),
    },
    {
      key: 'updatedAt',
      label: t('policy_updated_at'),
      filterable: FilterCategories.Date,
      search: true,
      sortable: true,
      hidden: searchParams.isColumnHidden('updatedAt'),
      renderer: ({ item: policy }) =>
        policy.updatedAt ? (
          <DatePretty date={new Date(policy.updatedAt)} />
        ) : (
          <></>
        ),
    },
  ]);

  const actionButtonOptions = {
    label: t('policy_create'),
    title: t('policy_create_title'),
    to: 'add',
  };

  const actionColumnOptions = {
    title: t('policy_actions'),
    actions: [
      {
        key: 'edit',
        label: t('policy_action_edit'),
        title: ({ name }: IamApiPolicy) =>
          t('policy_action_edit_title', { name }),
        to: ({ id }: IamApiPolicy) => `${id}/edit`,
      },
      {
        key: 'delete',
        label: t('policy_action_delete'),
        title: ({ name }: IamApiPolicy) =>
          t('policy_action_delete_title', { name }),
        to: ({ id }: IamApiPolicy) => `${id}/delete`,
      },
    ],
  };

  const [state, setState] = useState(searchParams.getInitialState(columns));

  const { currentPage, pageSize, sort } = state.table;
  const queryParams = {
    currentPage,
    pageSize,
    filters: state.filters,
    sortBy: sort?.key,
    sortReverse: sort?.reverse || false,
  };

  const { data: policies, isLoading } = useQuery(
    ['iam_policy', queryParams],
    async (): Promise<ListingData<IamApiPolicy>> => {
      const { totalCount, data } = await listPolicies(queryParams);
      return {
        total: totalCount,
        items: data,
      };
    },
    { staleTime: 60 * 1000, refetchInterval: 60 * 1000 },
  );

  useEffect(() => {
    searchParams.updateState(state);
  }, [JSON.stringify(state)]);

  return (
    <>
      <Outlet />
      {actionResult && <MessageBox {...actionResult} dismissable={true} />}
      <Listing
        columns={columns}
        data={isLoading ? null : policies}
        state={state}
        onChange={setState}
        onColumnsChange={(cols) => {
          setColumns(cols);
          searchParams.updateColumns(cols);
        }}
        actionButton={actionButtonOptions}
        actionColumn={actionColumnOptions}
      />
    </>
  );
}
