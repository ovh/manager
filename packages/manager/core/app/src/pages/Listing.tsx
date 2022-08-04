import React, { useEffect, useState } from 'react';
import { Badge, Flex, Spacer, Stack } from '@chakra-ui/react';
import Listing, { ListingData, ListingState } from '@/components/Listing';
import FilterList from '@/components/FilterList';
import SearchInput from '@/components/SearchInput';
import { Filter, FilterComparator } from '@/api/filters';
import { listVps, Vps } from '@/api/Vps';

type ListingPageState = {
  list: ListingState;
  filters: Filter[];
};

export default function ListingPage(): JSX.Element {
  const [state, setState] = useState<ListingPageState>({
    list: {
      currentPage: 1,
      pageSize: 10,
    },
    filters: [],
  });
  const [services, setServices] = useState<ListingData<Vps>>();

  useEffect(() => {
    const { currentPage, pageSize, sort } = state.list;
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
  }, [state]);

  return (
    <Stack>
      <Flex>
        <Spacer />
        <SearchInput
          onSubmit={(value) => {
            const { filters } = state;
            filters.push({
              key: 'name',
              value,
              label: 'Name',
              comparator: FilterComparator.Includes,
            });
            setState({
              ...state,
              filters,
              list: {
                ...state.list,
                currentPage: 1,
              },
            });
          }}
        />
      </Flex>
      <FilterList
        filters={state.filters}
        onChange={(filters) =>
          setState({
            ...state,
            filters,
          })
        }
      />
      <Listing
        columns={[
          {
            key: 'name',
            label: 'Name',
          },
          {
            key: 'zone',
            label: 'Zone',
          },
          {
            key: 'state',
            label: 'State',
            renderer: (vps) => <Badge>{vps.state}</Badge>,
          },
        ]}
        data={services}
        state={state.list}
        onChange={(list) =>
          setState({
            ...state,
            list,
          })
        }
      />
    </Stack>
  );
}
