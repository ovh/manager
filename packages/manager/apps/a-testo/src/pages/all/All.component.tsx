import { useState, useMemo, useCallback } from 'react';
import {
  VisibilityState,
  ExpandedState,
  RowSelectionState,
  Row,
} from '@tanstack/react-table';
import { TABLE_SIZE } from '@ovhcloud/ods-react';
import { Datagrid, BaseLayout, Breadcrumb } from '@ovh-ux/muk';

const defaultData = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
    // subRows: [
    //   {
    //     id: 1002,
    //     name: 'John Doe',
    //     email: 'john.doe@example.com',
    //     phone: '1234567890',
    //   },
    //   {
    //     id: 1003,
    //     name: 'Jane Doe',
    //     email: 'jane.doe@example.com',
    //     phone: '0987654321',
    //   },
    //   {
    //     id: 1004,
    //     name: 'Jim Beam',
    //     email: 'jim.beam@example.com',
    //     phone: '1111111111',
    //   },
    //   {
    //     id: 1005,
    //     name: 'John Doe',
    //     email: 'john.doe@example.com',
    //     phone: '1234567890',
    //   },
    // ],
  },
  {
    id: 2,
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '0987654321',
  },
  {
    id: 3,
    name: 'Jim Beam',
    email: 'jim.beam@example.com',
    phone: '1111111111',
  },
  {
    id: 4,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
  },
  {
    id: 5,
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '0987654321',
  },
  {
    id: 6,
    name: 'Jim Beam',
    email: 'jim.beam@example.com',
    phone: '1111111111',
  },
  {
    id: 7,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
  },
  {
    id: 8,
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '0987654321',
  },
  {
    id: 9,
    name: 'Jim Beam',
    email: 'jim.beam@example.com',
    phone: '1111111111',
  },
  {
    id: 10,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
  },
];

const AllComponent = () => {
  const [data, setData] = useState(defaultData);
  const columns = [
    {
      id: 'id',
      header: 'ID',
      accessorKey: 'id',
      enableHiding: true,
    },
    {
      header: 'Name',
      accessorKey: 'name',
      enableHiding: true,
    },
    {
      header: 'Email',
      accessorKey: 'email',
      enableHiding: true,
    },
    {
      header: 'Phone',
      accessorKey: 'phone',
      enableHiding: true,
    },
  ];

  const fetchAllPages = useCallback(() => {
    // ajouter 10000 lignes de données
    const newData = Array.from({ length: 10000 }, (_, index) => ({
      id: index + 10,
      name: `John Doe ${index + 10}`,
      email: `john.doe${index + 10}@example.com`,
      phone: `1234567890${index + 10}`,
    }));
    const tmp = [...data, ...newData];
    setData(tmp);
  }, []);

  const fetchNextPage = () => {
    console.info('fetchNextPage');
    const indexToAdd = data.length + 1;
    console.info('indexToAdd : ', indexToAdd);
    // ajouter 10 lignes de données
    const newData = Array.from({ length: 10 }, (_, index) => ({
      id: indexToAdd + index,
      name: `John Doe ${index + indexToAdd}`,
      email: `john.doe${index + indexToAdd}@example.com`,
      phone: `1234567890${index + indexToAdd}`,
      //   subRows: [
      //     {
      //       id: indexToAdd + index + 1,
      //       name: `John Doe ${indexToAdd + index + 1}`,
      //       email: `john.doe${indexToAdd + index + 1}@example.com`,
      //       phone: `1234567890${indexToAdd + index + 1}`,
      //     },
      //   ],
    }));
    const tmp = [...data, ...newData];
    setData(tmp);
  };

  console.info('******************************************');
  console.info('listing page data : ', data);
  //   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  //   const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [expanded, setExpanded] = useState<ExpandedState>({});
  return (
    <BaseLayout
      header={{ title: 'All' }}
      breadcrumb={<Breadcrumb appName="a-testo" rootLabel="a-testo-2" />}
    >
      <Datagrid
        columns={columns}
        data={data}
        hasNextPage={true}
        onFetchNextPage={fetchNextPage}
        onFetchAllPages={fetchAllPages}
        hideHeader={false}
        expandable={{
          expanded,
          setExpanded,
          getRowCanExpand: (row) => row.original.id === 1,
        }}
        size={TABLE_SIZE.md}
        // columnVisibility={{
        //   columnVisibility,
        //   setColumnVisibility,
        // }}
        // rowSelection={{
        //   rowSelection,
        //   setRowSelection,
        // }}
        // renderSubComponent={() => {
        //   return <div>SubComponent</div>;
        // }}
        // subComponentHeight={65}
      />
    </BaseLayout>
  );
};

export default AllComponent;
