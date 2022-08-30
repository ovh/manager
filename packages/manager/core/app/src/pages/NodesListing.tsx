import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Badge, Link, Skeleton } from '@chakra-ui/react';
import { applyFilters, FilterCategories } from '@/api/filters';
import {
  fetchNutanixNodeMetaInfos,
  listNutanixNodes,
  NutanixNode,
  NutanixNodeMetaInfos,
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

type ListingNode = NutanixNode & Partial<NutanixNodeMetaInfos>;

export default function NodesListingPage(): JSX.Element {
  const { t } = useTranslation('nutanix');
  const queryClient = useQueryClient();
  const { serviceId } = useParams();
  const searchParams = useListingSearchParams();
  const [services, setServices] = useState<ListingNode[]>([]);
  const [filteredServices, setFilteredServices] = useState<ListingNode[]>(null);
  const [columns, setColumns] = useState<ListingColumn<ListingNode>[]>([
    {
      key: 'displayName',
      label: t('node_name'),
      filterable: FilterCategories.String,
      hidden: searchParams.isColumnHidden('displayName'),
      renderer: ({ item: server }) => (
        <Link
          as={RouterLink}
          to={`/nutanix/${serviceId}/details/nodes/${server.serviceName}`}
        >
          {server.displayName}
        </Link>
      ),
      search: true,
    },
    {
      key: 'commercialRange',
      label: t('server_type'),
      filterable: FilterCategories.String,
      hidden: searchParams.isColumnHidden('commercialRange'),
      renderer: ({ item: server }) => {
        if (!server.commercialRange) {
          return <Skeleton height="0.5rem" />;
        }
        return <>{server.commercialRange}</>;
      },
    },
    {
      key: 'stateLabel',
      label: t('status'),
      filterable: FilterCategories.String,
      hidden: searchParams.isColumnHidden('stateLabel'),
      renderer: ({ item: server }) => {
        if (!server.state) {
          return <Skeleton height="0.5rem" />;
        }
        const { state } = server;
        return (
          <Badge variant={getStatusBadgeVariant(state)}>
            {t(`node_status_${state.toLowerCase()}`)}
          </Badge>
        );
      },
    },
    {
      key: 'datacenter',
      label: t('location'),
      hidden: searchParams.isColumnHidden('datacenter'),
      renderer: ({ item: server }) => {
        if (!server.datacenter) {
          return <Skeleton height="0.5rem" />;
        }
        return <DatacenterLabel datacenterId={server.datacenter} />;
      },
    },
  ]);
  const [state, setState] = useState(searchParams.getInitialState(columns));

  const { data: nutanixNodes, isLoading: isLoadingNodes } = useQuery(
    ['nutanix_nodes', serviceId],
    () => listNutanixNodes(serviceId),
    { staleTime: 5 * 60 * 1000 },
  );

  useEffect(() => {
    if (!isLoadingNodes) {
      setServices(nutanixNodes);
    }
  }, [nutanixNodes, isLoadingNodes]);

  // fetch services meta data
  useEffect(() => {
    services.forEach(({ serviceName }) => {
      queryClient
        .fetchQuery(
          ['nutanix_node_infos', serviceName],
          () => fetchNutanixNodeMetaInfos(serviceName),
          { staleTime: 5 * 60 * 1000 },
        )
        .then((infos) => {
          setServices((oldServices) =>
            oldServices.map((service) => {
              if (service.serviceName === serviceName)
                return {
                  ...service,
                  commercialRange: infos.commercialRange,
                  state: infos.state,
                  stateLabel: t(`node_status_${infos.state.toLowerCase()}`),
                  datacenter: infos.datacenter,
                };
              return service;
            }),
          );
        });
    });
  }, [JSON.stringify(services)]);

  // filter services when service list changes
  useEffect(() => {
    setFilteredServices(applyFilters(services, state.filters));
  }, [services]);

  // filter services when filters & sorting changs
  useEffect(() => {
    searchParams.updateState(state);
    setFilteredServices(applyFilters(services, state.filters));
  }, [JSON.stringify(state)]);

  return (
    <Listing
      columns={columns}
      data={
        !isLoadingNodes && {
          items: filteredServices,
          total: filteredServices?.length || 0,
        }
      }
      state={state}
      onChange={setState}
      onColumnsChange={(cols) => {
        setColumns(cols);
        searchParams.updateColumns(cols);
      }}
    />
  );
}
