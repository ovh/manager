import React, { useEffect, useState } from 'react';
import { Badge } from '@chakra-ui/react';
import Listing, { ListingData, ListingState } from '../components/Listing';
import { listVps, Vps } from '@/api/Vps';

export default function ListingPage(): JSX.Element {
  const [listingState, setListingState] = useState<ListingState>({
    currentPage: 1,
    pageSize: 10,
  });
  const [listingData, setListingData] = useState<ListingData<Vps>>();
  const { currentPage, pageSize, sort } = listingState;

  useEffect(() => {
    setListingData(null);
    listVps({
      currentPage,
      pageSize,
      sortBy: sort?.key,
      sortReverse: sort?.reverse,
    }).then(({ totalCount, data }) =>
      setListingData({
        total: totalCount,
        items: data,
      }),
    );
  }, [listingState]);

  return (
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
      data={listingData}
      state={listingState}
      onChange={setListingState}
    />
  );
}
