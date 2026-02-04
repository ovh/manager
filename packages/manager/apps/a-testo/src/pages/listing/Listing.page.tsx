import { useState, useEffect } from 'react';
import { VisibilityState, RowSelectionState, Row } from '@tanstack/react-table';
import {
  BaseLayout,
  Breadcrumb,
  useDataApi,
  Datagrid,
  ActionMenu,
  useColumnFilters,
} from '@ovh-ux/muk';
import { BUTTON_SIZE, TABLE_SIZE } from '@ovhcloud/ods-react';
import { ExpandedState } from '@tanstack/react-table';
import { FilterCategories } from '@ovh-ux/manager-core-api';

const ListingPage = () => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const {
    flattenData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetching,
    sorting,
    filters,
    search,
  } = useDataApi({
    route: '/dedicated/server',
    version: 'v6',
    cacheKey: ['dedicated-server'],
    iceberg: true,
    enabled: true,
  });
  const columns = [
    {
      id: 'name',
      label: 'name',
      header: 'name',
      accessorKey: 'name',
      isSortable: true,
      isFilterable: true,
      enableHiding: true,
      comparator: FilterCategories.String,
      cell: ({ getValue }: any) => <div>{getValue()}</div>,
      isSearchable: true,
    },
    {
      id: 'ip',
      label: 'ip',
      header: 'ip',
      accessorKey: 'ip',
      isSortable: true,
      isFilterable: true,
      enableHiding: true,
      comparator: FilterCategories.String,
      cell: ({ getValue }: any) => <div>{getValue()}</div>,
    },
    {
      id: 'actions',
      // header: 'actions',
      // accessorKey: 'actions',
      enableHiding: true,
      label: 'actions',
      cell: () => {
        return (
          <div className="text-center w-full text-center">
            <ActionMenu
              size={BUTTON_SIZE.sm}
              id="actions-menu"
              items={[
                {
                  id: 0,
                  label: 'Edit',
                },
              ]}
              isCompact
            />
          </div>
        );
      },
      size: 30,
    },
    // {
    //   id: 'os',
    //   label: 'os',
    //   accessorKey: 'os',
    //   isSortable: true,
    //   cell: ({ getValue }: any) => <div>{getValue()}</div>,
    // },
    // {
    //   id: 'rack',
    //   label: 'rack',
    //   accessorKey: 'rack',
    //   isSortable: true,
    //   cell: ({ getValue }: any) => <div>{getValue()}</div>,
    // },
    // {
    //   id: 'linkSpeed',
    //   label: 'linkSpeed',
    //   accessorKey: 'linkSpeed',
    //   isSortable: true,
    //   cell: ({ getValue }: any) => <div>{getValue()}</div>,
    // },
    // {
    //   id: 'powerState',
    //   label: 'powerState',
    //   accessorKey: 'powerState',
    //   isSortable: true,
    //   cell: ({ getValue }: any) => <div>{getValue()}</div>,
    // },
    // {
    //   id: 'serverId',
    //   label: 'serverId',
    //   accessorKey: 'serverId',
    //   isSortable: true,
    //   cell: ({ getValue }: any) => <div>{getValue()}</div>,
    // },
    // {
    //   id: 'reverse',
    //   label: 'reverse',
    //   accessorKey: 'reverse',
    //   isSortable: true,
    //   cell: ({ getValue }: any) => <div>{getValue()}</div>,
    // },
    // {
    //   id: 'region',
    //   label: 'region',
    //   accessorKey: 'region',
    //   isSortable: true,
    //   cell: ({ getValue }: any) => <div>{getValue()}</div>,
    // },
    // {
    //   id: 'supportLevel',
    //   label: 'supportLevel',
    //   accessorKey: 'supportLevel',
    //   isSortable: true,
    //   cell: ({ getValue }: any) => <div>{getValue()}</div>,
    // },
    // {
    //   id: 'availabilityZone',
    //   label: 'availabilityZone',
    //   accessorKey: 'availabilityZone',
    //   isSortable: true,
    //   cell: ({ getValue }: any) => <div>{getValue()}</div>,
    // },
    // {
    //   id: 'bootId',
    //   label: 'bootId',
    //   accessorKey: 'bootId',
    //   isSortable: true,
    //   cell: ({ getValue }: any) => <div>{getValue()}</div>,
    // },
    // {
    //   id: 'datacenter',
    //   label: 'datacenter',
    //   accessorKey: 'datacenter',
    //   isSortable: true,
    //   cell: ({ getValue }: any) => <div>{getValue()}</div>,
    // },
  ];

  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const map = flattenData?.map((item) => {
      console.info('item : ', item);
      return {
        ...item,
        // subRows: [
        //   {
        //     id: 87897 + index,
        //     ip: '192.168.1.1',
        //     os: 'Windows',
        //     linkSpeed: 10000,
        //   },
        // ],
      };
    });
    setItems(map);
  }, [flattenData]);
  console.info('coucou alex !!!!!');
  console.info('columnVisibility : ', columnVisibility);
  console.info('a-testo filters :', filters);
  console.info('a-testo search :', search);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  return (
    <BaseLayout
      header={{
        title: 'Listing',
      }}
      breadcrumb={<Breadcrumb appName="a-testo" rootLabel="a-coucou" />}
    >
      {/* {items?.length > 0 && ( */}
      <Datagrid
        autoScroll={true}
        isLoading={isLoading}
        columns={columns}
        data={items?.length > 0 ? items : []}
        // containerHeight={550}
        // hideHeader={true}
        // hasNextPage={hasNextPage}
        onFetchNextPage={fetchNextPage}
        size={TABLE_SIZE.md}
        // columnVisibility={{
        //   columnVisibility,
        //   setColumnVisibility,
        // }}
        sorting={{
          sorting: sorting?.sorting ?? [],
          setSorting: sorting?.setSorting ?? (() => {}),
          manualSorting: true,
        }}
        filters={{
          filters: filters?.filters ?? [],
          add: filters?.add ?? (() => {}),
          remove: filters?.remove ?? (() => {}),
        }}
        search={search}
        // topbar={<div className="bg-red-500 w-full">Left side</div>}
        // expandable={{
        //   expanded,
        //   setExpanded,
        //   getRowCanExpand: (row: any) => {
        //     console.info('row : ', row);
        //     return row?.original?.linkSpeed < 25000;
        //   },
        // }}
        // rowSelection={{
        //   rowSelection,
        //   setRowSelection,
          // enableRowSelection: (row: any) => {
          //   return row?.original?.linkSpeed < 25000;
          // },
        // }}
      />
      {/* )} */}
      {/* {rowSelection && (
        <div>
          <div>Row Selection</div>
          <div>{JSON.stringify(rowSelection)}</div>
        </div>
      )} */}
    </BaseLayout>
  );
};

export default ListingPage;
