import { useState } from 'react';
import {
  useDataApi,
  BaseLayout,
  Breadcrumb,
  Datagrid,
  ActionMenu,
} from '@ovh-ux/muk';

const NashaPage = () => {
  const {
    flattenData,
    isLoading,
    sorting,
    hasNextPage,
    fetchNextPage,
  } = useDataApi({
    route: 'dedicated/nasha',
    version: 'v6',
    cacheKey: ['nasha'],
    iceberg: false,
    enabled: true,
  });
  const items = flattenData?.map((item, index) => {
    return {
      id: index,
      name: item,
    };
  });
  const columns = [
    {
      id: 'name',
      label: 'Name',
      accessorKey: 'name',
      isSortable: true,
    },
    // {
    //   id: 'actions',
    //   label: 'Actions',
    //   size: 30,
    //   cell: () => {
    //     return (
    //       <div className="text-center w-full text-center">
    //         <ActionMenu
    //           items={[
    //             {
    //               id: 0,
    //               label: 'Delete',
    //               onClick: () => {
    //                 console.log('delete');
    //               },
    //             },
    //           ]}
    //           id={`actions`}
    //         />
    //       </div>
    //     );
    //   },
    // },
  ];
  console.info('sorting : ', sorting);
  console.info('flattenData ALEX TEST : ', flattenData);
  console.info('items ALEX TEST : ', items);
  return (
    <BaseLayout
      header={{ title: 'Nasha' }}
      breadcrumb={<Breadcrumb appName="a-testo" rootLabel="a-testo-2" />}
    >
      <Datagrid
        isLoading={isLoading}
        columns={columns}
        data={items}
        sorting={sorting}
        hasNextPage={hasNextPage}
        onFetchNextPage={fetchNextPage}
      />
    </BaseLayout>
  );
};

export default NashaPage;
