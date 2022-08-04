import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@chakra-ui/react';
import { ListingTableData } from '@/components/ListingTable';
import { listVps, Vps } from '@/api/Vps';
import { FilterCategories } from '@/api/filters';

import Listing from '@/components/Listing';

export default function ListingPage(): JSX.Element {
  const { t } = useTranslation('common');
  const [services, setServices] = useState<ListingTableData<Vps>>();

  return (
    <Listing
      columns={[
        {
          key: 'name',
          label: t('name'),
          filterable: FilterCategories.String,
          search: true,
        },
        {
          key: 'zone',
          label: t('zone'),
          filterable: FilterCategories.String,
        },
        {
          key: 'state',
          label: t('state'),
          renderer: (vps) => <Badge>{vps.state}</Badge>,
        },
      ]}
      data={services}
      onChange={(state) => {
        const { currentPage, pageSize, sort } = state.table;
        setServices(null);
        listVps({
          currentPage,
          pageSize,
          filters: state.filters,
          sortBy: sort?.key,
          sortReverse: sort?.reverse,
        }).then(({ totalCount, data }) =>
          setServices({
            total: totalCount,
            items: data,
          }),
        );
      }}
    />
  );
}
