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

import { IamApiResourceGroup, listResourceGroup } from '@/api';

export default function IamGroups() {
  const { t } = useTranslation('iam/groups');
  const searchParams = useListingSearchParams();
  const { state: locationState } = useLocation();

  const actionResult = locationState?.actionResult;

  const [columns, setColumns] = useState<ListingColumn<IamApiResourceGroup>[]>([
    {
      key: 'name',
      label: t('group_name'),
      filterable: FilterCategories.String,
      search: true,
      sortable: true,
      hidden: searchParams.isColumnHidden('name'),
    },
    {
      key: 'createdAt',
      label: t('group_created_at'),
      filterable: FilterCategories.Date,
      search: true,
      sortable: true,
      hidden: searchParams.isColumnHidden('createdAt'),
      renderer: ({ item: group }) => (
        <DatePretty date={new Date(group.createdAt)} />
      ),
    },
    {
      key: 'updatedAt',
      label: t('group_updated_at'),
      filterable: FilterCategories.Date,
      search: true,
      sortable: true,
      hidden: searchParams.isColumnHidden('updatedAt'),
      renderer: ({ item: group }) => (
        <DatePretty date={new Date(group.updatedAt)} />
      ),
    },
  ]);

  const actionButtonOptions = {
    label: t('group_create'),
    title: t('group_create_title'),
    to: 'add',
  };

  const actionColumnOptions = {
    title: t('group_actions'),
    disabled: (group: IamApiResourceGroup) => group.readOnly,
    actions: [
      {
        key: 'edit',
        label: t('group_action_edit'),
        title: ({ name }: IamApiResourceGroup) =>
          t('group_action_edit_title', { name }),
        to: ({ id }: IamApiResourceGroup) => `${id}/edit`,
      },
      {
        key: 'delete',
        label: t('group_action_delete'),
        title: ({ name }: IamApiResourceGroup) =>
          t('group_action_delete_title', { name }),
        to: ({ id }: IamApiResourceGroup) => `${id}/delete`,
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

  const { data: resourceGroups, isLoading } = useQuery(
    ['iam_resource_group', queryParams],
    async (): Promise<ListingData<IamApiResourceGroup>> => {
      const { totalCount, data } = await listResourceGroup(queryParams);
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
        data={isLoading ? null : resourceGroups}
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
