import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge, Link } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { listNutanix, Nutanix } from '@/api/nutanix';
import { FilterCategories } from '@/api/filters';

import Listing, { ListingColumn, ListingData } from '@/components/Listing';
import useListingSearchParams from '@/hooks/useListingSearchParams';

export default function ListingPage(): JSX.Element {
  const { t } = useTranslation('common');
  const searchParams = useListingSearchParams();
  const [columns, setColumns] = useState<ListingColumn<Nutanix>[]>([
    {
      key: 'serviceName',
      label: t('cluster_name'),
      filterable: FilterCategories.String,
      search: true,
      hidden: searchParams.isColumnHidden('serviceName'),
    },
    {
      key: 'node_count',
      label: t('node_count'),
      hidden: searchParams.isColumnHidden('node_count'),
      renderer: (nutanix) => <span>{nutanix.targetSpec.nodes.length}</span>,
    },
    {
      key: 'status',
      label: t('status'),
      hidden: searchParams.isColumnHidden('status'),
      renderer: (nutanix) => <Badge>{nutanix.status}</Badge>,
    },
    {
      key: 'location',
      label: t('location'),
      hidden: searchParams.isColumnHidden('location'),
    },
    {
      key: 'admin',
      label: t('administration_interface'),
      hidden: searchParams.isColumnHidden('admin'),
      renderer: (nutanix) => (
        <Link href={nutanix.targetSpec.controlPanelURL} isExternal>
          {t('prism_central_url')}
          <ExternalLinkIcon ml={2} />
        </Link>
      ),
    },
  ]);
  const [services, setServices] = useState<ListingData<Nutanix>>();

  return (
    <Listing
      columns={columns}
      data={services}
      initialState={searchParams.getInitialState()}
      onChange={(state) => {
        const { currentPage, pageSize, sort } = state.table;
        setServices(null);
        searchParams.updateState(state);
        listNutanix({
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
