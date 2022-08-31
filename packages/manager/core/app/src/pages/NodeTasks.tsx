import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@chakra-ui/react';
import { getNodeTasks } from '@/api/nutanix';
import { DedicatedServerTask } from '@/api/dedicatedServer';
import Listing, { ListingColumn } from '@/components/Listing';
import DatePretty from '@/components/DatePretty';
import useListingSearchParams from '@/hooks/useListingSearchParams';

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'done':
      return 'success';
    case 'init':
    case 'todo':
      return 'warning';
    case 'customerError':
    case 'ovhError':
      return 'error';
    default:
      return 'infos';
  }
};

export default function NodeTasksPage(): JSX.Element {
  const { t } = useTranslation('node-tasks');
  const { nodeId } = useParams();
  const searchParams = useListingSearchParams();
  const [columns, setColumns] = useState<ListingColumn<DedicatedServerTask>[]>([
    {
      key: 'action',
      label: t('last_action'),
      renderer: ({ item }) => <DatePretty date={item.lastUpdate} />,
    },
    {
      key: 'task',
      label: t('task'),
      renderer: ({ item }) => <span>{t(`function_${item.function}`)}</span>,
    },
    {
      key: 'details',
      label: t('technical_details'),
      renderer: ({ item }) => <span>{item.comment}</span>,
    },
    {
      key: 'status',
      label: t('status'),
      renderer: ({ item }) => (
        <Badge variant={getStatusBadgeVariant(item.status)}>
          {t(`status_${item.status}`)}
        </Badge>
      ),
    },
  ]);
  const [state, setState] = useState(searchParams.getInitialState(columns));
  const { currentPage, pageSize } = state.table;

  const { data: services, isLoading } = useQuery(
    ['nutanix_node_tasks', nodeId, pageSize, currentPage],
    () =>
      getNodeTasks(nodeId, {
        page: currentPage,
        pageSize,
      }).then((result) => ({
        total: result.totalCount,
        items: result.data,
      })),
    { staleTime: 5 * 60 * 1000 },
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
      }}
    />
  );
}
