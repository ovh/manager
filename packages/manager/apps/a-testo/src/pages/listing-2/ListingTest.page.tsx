import React from 'react';
import { BaseLayout, Breadcrumb, useDataApi, Datagrid } from '@ovh-ux/muk';
const ListingTestPage = () => {
  const columns = [
    {
      id: 'name',
      label: 'Name',
      accessorKey: 'name',
    },
  ];
  const data = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Doe' },
    { id: 3, name: 'John Smith' },
    { id: 4, name: 'Jane Smith' },
  ];
  return (
    <BaseLayout
      header={{
        title: 'Listing Test',
      }}
      breadcrumb={<Breadcrumb appName="a-testo" rootLabel="a-testo" />}
    >
      <Datagrid columns={columns} data={data} />
    </BaseLayout>
  );
};
// const ListingTestPage = () => {
//   return <div>Listing Test Page</div>;
// };

export default ListingTestPage;
