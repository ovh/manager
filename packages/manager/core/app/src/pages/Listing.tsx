import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@chakra-ui/react';
import { listVps, Vps } from '@/api/Vps';
import { FilterCategories } from '@/api/filters';

import Listing, {
  ListingColumn,
  ListingData,
  ListingState,
} from '@/components/Listing';
import useListingSearchParams from '@/hooks/useListingSearchParams';

export default function ListingPage(): JSX.Element {
  const { t } = useTranslation('common');
  const searchParams = useListingSearchParams();
  const [columns, setColumns] = useState<ListingColumn<Vps>[]>([
    {
      key: 'name',
      label: t('name'),
      filterable: FilterCategories.String,
      search: true,
      hidden: searchParams.isColumnHidden('name'),
    },
    {
      key: 'zone',
      label: t('zone'),
      filterable: FilterCategories.String,
      hidden: searchParams.isColumnHidden('zone'),
    },
    {
      key: 'state',
      label: t('state'),
      renderer: (vps) => <Badge>{vps.state}</Badge>,
      hidden: searchParams.isColumnHidden('state'),
    },
  ]);
  const [services, setServices] = useState<ListingData<Vps>>();

  return (
    <Listing
      columns={columns}
      data={services}
      initialState={searchParams.getInitialState()}
      onChange={(state) => {
        const { currentPage, pageSize, sort } = state.table;
        setServices(null);
        searchParams.updateState(state);
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
      onColumnsChange={(cols) => {
        setColumns(cols);
        searchParams.updateColumns(cols);
      }}
    />
  );
}
