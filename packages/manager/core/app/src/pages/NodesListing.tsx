import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Badge, Link, Skeleton } from '@chakra-ui/react';
import { applyFilters, FilterCategories } from '@/api/filters';
import {
  fetchNutanixNodeMetaInfos,
  listNutanixNodes,
  NutanixNode,
} from '@/api/nutanix';

import Listing, { ListingColumn } from '@/components/Listing';
import DatacenterLabel from '@/components/DatacenterLabel';

import useListingSearchParams from '@/hooks/useListingSearchParams';

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'OK':
      return 'success';
    case 'ERROR':
      return 'warning';
    case 'HACKED':
    case 'HACKED_BLOCKED':
      return 'error';
    default:
      return 'infos';
  }
};

export default function NodesListingPage(): JSX.Element {
  const { t } = useTranslation('nutanix');
  const { serviceId } = useParams();
  const searchParams = useListingSearchParams();
  const [services, setServices] = useState<NutanixNode[]>([]);
  const [columns, setColumns] = useState<ListingColumn<NutanixNode>[]>([
    {
      key: 'displayName',
      label: t('node_name'),
      filterable: FilterCategories.String,
      hidden: searchParams.isColumnHidden('displayName'),
      renderer: ({ item: server }) => (
        <Link
          as={RouterLink}
          to={`/nutanix/${serviceId}/nodes/${server.serviceName}`}
        >
          {server.displayName}
        </Link>
      ),
      search: true,
      sortable: true,
    },
    {
      key: 'server_type',
      label: t('server_type'),
      filterable: FilterCategories.String,
      hidden: searchParams.isColumnHidden('server_type'),
      renderer: ({ item: server }) => {
        const query = useQuery(
          ['nutanix_node_metaInfos', server.serviceName],
          () => fetchNutanixNodeMetaInfos(server.serviceName),
          { staleTime: 60 * 1000 },
        );
        if (query.isLoading) {
          return <Skeleton height="0.5rem" />;
        }
        return <>{query.data.commercialRange}</>;
      },
      sortable: true,
    },
    {
      key: 'status',
      label: t('status'),
      filterable: FilterCategories.String,
      hidden: searchParams.isColumnHidden('status'),
      renderer: ({ item: server }) => {
        const query = useQuery(
          ['nutanix_node_metaInfos', server.serviceName],
          () => fetchNutanixNodeMetaInfos(server.serviceName),
          { staleTime: 60 * 1000 },
        );
        if (query.isLoading) {
          return <Skeleton height="0.5rem" />;
        }
        const { state } = query.data;
        return (
          <Badge variant={getStatusBadgeVariant(state)}>
            {t(`node_status_${state.toLowerCase()}`)}
          </Badge>
        );
      },
    },
    {
      key: 'location',
      label: t('location'),
      filterable: FilterCategories.String,
      hidden: searchParams.isColumnHidden('location'),
      renderer: ({ item: server }) => {
        const query = useQuery(
          ['nutanix_node_metaInfos', server.serviceName],
          () => fetchNutanixNodeMetaInfos(server.serviceName),
          { staleTime: 60 * 1000 },
        );
        if (query.isLoading) {
          return <Skeleton height="0.5rem" />;
        }
        return <DatacenterLabel datacenterId={query.data.datacenter} />;
      },
    },
  ]);
  const [state, setState] = useState(searchParams.getInitialState(columns));

  useEffect(() => {
    setServices(null);
    searchParams.updateState(state);
    listNutanixNodes(serviceId).then((data) => {
      setServices(applyFilters(data, state.filters));
    });
  }, [JSON.stringify(state)]);

  return (
    <Listing
      columns={columns}
      data={{
        items: services,
        total: services?.length || 0,
      }}
      state={state}
      onChange={setState}
      onColumnsChange={(cols) => {
        setColumns(cols);
        searchParams.updateColumns(cols);
      }}
    />
  );
}
