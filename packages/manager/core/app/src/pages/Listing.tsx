import React, { useEffect, useState } from 'react';
import { Badge, Flex, Spacer, Stack } from '@chakra-ui/react';
import Listing, { ListingData, ListingState } from '@/components/Listing';
import SearchInput from '@/components/SearchInput';
import { listVps, Vps } from '@/api/Vps';

type ListingPageState = {
  list: ListingState;
  search: string;
};

export default function ListingPage(): JSX.Element {
  const [state, setState] = useState<ListingPageState>({
    list: {
      currentPage: 1,
      pageSize: 10,
    },
    search: '',
  });
  const [services, setServices] = useState<ListingData<Vps>>();

  useEffect(() => {
    const { currentPage, pageSize, sort } = state.list;
    setServices(null);
    listVps({
      currentPage,
      pageSize,
      search: {
        key: 'name',
        value: state.search,
      },
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
          onSubmit={(value) =>
            setState({
              list: {
                ...state.list,
                currentPage: 1,
              },
              search: value,
            })
          }
        />
      </Flex>
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
