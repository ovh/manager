import React, { useState, useEffect, useCallback } from 'react';
import { Text, TEXT_PRESET, Divider, DIVIDER_SPACING } from '@ovhcloud/ods-react';
import { Datagrid, useUrlParams, useColumnFilters, useV2UrlParams } from '@ovh-ux/muk';
import { withRouter, reactRouterParameters } from 'storybook-addon-react-router-v6';
import { FilterCategories,  } from '@ovh-ux/manager-core-api';

type Character = {
  id: number;
  name: string;
  gender: string;
  status: string;
  species: string;
  type: string;
  url: string;
  created: string;
};

type CharacterResponse = {
  info: {
    count: number;
    next: string | null;
  };
  results: Character[];
};

const DatagridStory = () => {
  const columns = [
    {
      id: 'id',
      label: 'ID',
      accessorKey: 'id',
    },
    {
      id: 'name',
      label: 'Name',
      accessorKey: 'name',
    },
    {
      id: 'gender',
      label: 'Gender',
      accessorKey: 'gender',
      comparator: FilterCategories.Options,
      isFilterable: true,
      filterOptions: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Genderless', value: 'genderless' },
        { label: 'unknown', value: 'unknown' },
      ],
    },
    {
      id: 'status',
      label: 'Status',
      accessorKey: 'status',
      isFilterable: true,
      comparator: FilterCategories.Options,
      filterOptions: [
        { label: 'Alive', value: 'alive' },
        { label: 'Dead', value: 'dead' },
        { label: 'Unknown', value: 'unknown' },
      ],
    },
  ];
  const [data, setData] = useState<CharacterResponse | null>(null);
  const [page, setPage] = useState(1);
  const [flattenData, setFlattenData] = useState<Character[]>([]);
  const hasNextPage = data?.info?.next !== null;
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const [searchInput, setSearchInput] = useState('');
  const QUERY_KEYS = ['gender', 'status'];
  const { params, setQueryParams, queryString, deleteQueryParam } = useUrlParams(QUERY_KEYS);
  const { addFilterAndParamsInUrl, removeFilterByCoreFilter } = useV2UrlParams({
    urlParams: {
      params,
      setParams: setQueryParams,
      deleteParams: deleteQueryParam,
    },
    columns,
    filters,
    addFilter,
    removeFilter,
    searchInput,
    setSearchInput,
  });

  const onFetchNextPage = useCallback(() => {
    setPage(page + 1);
  }, [page]);

  useEffect(() => {
    const url = queryString ? `https://rickandmortyapi.com/api/character/?page=${page}&${queryString}` : `https://rickandmortyapi.com/api/character/?page=${page}`;
    fetch(url).then(response => response.json()).then(data => {
      setData(data);
    });
  }, [page, queryString]);

  useEffect(() => {
    setFlattenData([]);
  }, [queryString]);

  useEffect(() => {
    setFlattenData([ ...flattenData, ...(data?.results || []) ]);
  }, [data]);

  const onSearch = useCallback(
    (search: string | undefined) => {
      if (search) {
        setQueryParams({ ['name']: search ?? '' });
      } else {
        deleteQueryParam('name');
      }
    },
    [setQueryParams],
  );

  return (
    <>
      <div>
        <Text preset={TEXT_PRESET.heading3}>
          {queryString ? `www.sample.com/my-path?${queryString}` : 'www.exemple.com/my-path'}
        </Text>
      </div>
      <Divider spacing={DIVIDER_SPACING._24} />
      { flattenData.length > 0 && (
        <Datagrid
          columns={columns}
          data={flattenData || []}
          hasNextPage={hasNextPage}
          onFetchNextPage={onFetchNextPage}
          filters={{
            filters,
            add: addFilterAndParamsInUrl,
            remove: removeFilterByCoreFilter,
          }}
          search={{
            searchInput: searchInput,
            setSearchInput: setSearchInput,
            onSearch: onSearch,
            searchParams: 'name',
          }}
          totalCount={data?.info?.count}
        />
      )}
    </>
  );
};

export const UrlParams = DatagridStory.bind({});

const meta = {
    title: 'Manager UI Kit/Hooks/useUrlParams',
    component: Datagrid,
    tags: ['autodocs'],
    decorators: [withRouter],
    parameters: {
      docs: {
        description: {
          component:
            'The `Datagrid` component provides a powerful data table with built-in pagination controls. The footer actions section includes "Load More" and "Load All" buttons for progressive data loading.',
        },
      },
      preserveArgs: false,
      reactRouter: reactRouterParameters({
        location: {
          searchParams: { gender: 'Male', status: 'Alive' },
        },
        routing: { path: '/' },
      }),
    },
  };

  export default meta;