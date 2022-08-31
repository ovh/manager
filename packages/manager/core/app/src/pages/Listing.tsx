import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Badge, Link, Skeleton } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { useQuery } from '@tanstack/react-query';
import { listNutanix, fetchNutanixMetaInfos, Nutanix } from '@/api/nutanix';
import { FilterCategories } from '@/api/filters';

import Listing, { ListingColumn, ListingData } from '@/components/Listing';
import useListingSearchParams from '@/hooks/useListingSearchParams';

const getStatusBadgeVariant = (nutanix: Nutanix) => {
  switch (nutanix.status) {
    case 'Active':
      return 'success';
    case 'Deploying':
      return 'warning';
    case 'Error':
      return 'error';
    default:
      return 'infos';
  }
};

export default function ListingPage(): JSX.Element {
  const { t } = useTranslation('nutanix');
  const searchParams = useListingSearchParams();
  const [columns, setColumns] = useState<ListingColumn<Nutanix>[]>([
    {
      key: 'serviceName',
      label: t('cluster_name'),
      filterable: FilterCategories.String,
      search: true,
      sortable: true,
      hidden: searchParams.isColumnHidden('serviceName'),
      renderer: ({ item: nutanix }) => (
        <Link as={RouterLink} to={`/nutanix/${nutanix.serviceName}`}>
          {nutanix.serviceName}
        </Link>
      ),
    },
    {
      key: 'node_count',
      label: t('node_count'),
      sortable: true,
      hidden: searchParams.isColumnHidden('node_count'),
      renderer: ({ item: nutanix }) => (
        <span>{nutanix.targetSpec.nodes.length}</span>
      ),
    },
    {
      key: 'status',
      label: t('status'),
      sortable: true,
      hidden: searchParams.isColumnHidden('status'),
      renderer: ({ item: nutanix }) => (
        <Badge variant={getStatusBadgeVariant(nutanix)}>
          {t(`status_${nutanix.status.toLowerCase()}`)}
        </Badge>
      ),
    },
    {
      key: 'location',
      label: t('location'),
      hidden: searchParams.isColumnHidden('location'),
      renderer: ({ item: nutanix }) => {
        const query = useQuery(
          ['nutanix_metaInfos', nutanix.targetSpec.nodes[0].server],
          () => fetchNutanixMetaInfos(nutanix),
          { staleTime: 60 * 1000 },
        );
        if (query.isLoading) {
          return <Skeleton height={'.5rem'} />;
        }

        const [, localisation, number] = (query.data.region || '').match(
          /([^0-9]+)([0-9]*)/,
        );
        return <>{t(`dc_region_${localisation}`, { number })}</>;
      },
    },
    {
      key: 'admin',
      label: t('administration_interface'),
      hidden: searchParams.isColumnHidden('admin'),
      renderer: ({ item: nutanix }) => (
        <Link href={nutanix.targetSpec.controlPanelURL} isExternal>
          {t('prism_central_url')}
          <ExternalLinkIcon ml={2} />
        </Link>
      ),
    },
  ]);
  const [state, setState] = useState(searchParams.getInitialState(columns));

  const { currentPage, pageSize, sort } = state.table;
  const queryParams = {
    currentPage,
    pageSize,
    filters: state.filters,
    sortBy: sort?.key,
    sortReverse: sort?.reverse || false,
  };

  const { data: services, isLoading } = useQuery(
    ['nutanix', queryParams],
    async (): Promise<ListingData<Nutanix>> => {
      const { totalCount, data } = await listNutanix(queryParams);
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
    <Listing
      columns={columns}
      data={isLoading ? null : services}
      state={state}
      onChange={setState}
      onColumnsChange={(cols) => {
        setColumns(cols);
        searchParams.updateColumns(cols);
      }}
    />
  );
}
