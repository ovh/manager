import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { getNodeInterventions, NutanixNodeIntervention } from '@/api/nutanix';
import Listing, { ListingColumn } from '@/components/Listing';
import DatePretty from '@/components/DatePretty';
import useListingSearchParams from '@/hooks/useListingSearchParams';

export default function NodeInterventionsPage(): JSX.Element {
  const { t } = useTranslation('common');
  const { nodeId } = useParams();
  const searchParams = useListingSearchParams();
  const [columns, setColumns] = useState<
    ListingColumn<NutanixNodeIntervention>[]
  >([
    {
      key: 'date',
      label: t('name'),
      renderer: ({ item }) => <DatePretty date={item.date} />,
    },
    {
      key: 'type',
      label: t('type'),
      renderer: ({ item }) => <span>{item.type}</span>,
    },
  ]);
  const [state, setState] = useState(searchParams.getInitialState(columns));
  const { currentPage, pageSize } = state.table;

  const { data: services, isLoading } = useQuery(
    ['nutanix_node_intervention', nodeId, pageSize, currentPage],
    () =>
      getNodeInterventions(nodeId, pageSize, (currentPage - 1) * pageSize).then(
        (result) => ({
          total: result.count,
          items: result.list.results,
        }),
      ),
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
