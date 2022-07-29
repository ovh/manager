import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Listing, { ListingData, ListingState } from '../components/Listing';

type MyService = {
  id: string;
  num: number;
  name: string;
  serviceId: string;
  reverse: string;
  model: string;
  location: string;
  status: string;
};

function initServices() {
  const services: MyService[] = [];
  for (let i = 1; i <= 500; i += 1) {
    services.push({
      id: `${i}`,
      num: i * i,
      name: `Service name #${i}`,
      serviceId: '123',
      reverse: `127.0.0.1.eu`,
      model: `MODEL-${i % 3}`,
      location: 'GRA1',
      status: 'normal',
    });
  }
  return services;
}

function initColumns(t: (key: string) => string) {
  const render = (id: keyof MyService) => (service: MyService) => {
    return <>{service[id]}</>;
  };
  return [
    {
      label: t('id'),
      render: render('id'),
      sort: (a: MyService, b: MyService) => Number(a.id) - Number(b.id),
    },
    {
      label: t('numeric'),
      render: render('num'),
      sort: (a: MyService, b: MyService) => a.num - b.num,
    },
    {
      label: t('name'),
      render: render('name'),
      sort: (a: MyService, b: MyService) => a.name.localeCompare(b.name),
    },
    {
      label: t('reverse'),
      render: render('reverse'),
    },
    {
      label: t('model'),
      render: render('model'),
    },
    {
      label: t('location'),
      render: render('location'),
    },
    {
      label: t('status'),
      render: render('status'),
    },
  ];
}

export default function ListingPage(): JSX.Element {
  const { t } = useTranslation('listing');
  const [columns] = useState(initColumns(t));
  const [services] = useState(initServices());

  const [listingState, setListingState] = useState<ListingState<MyService>>({
    currentPage: 1,
    pageSize: 10,
  });
  const [data, setData] = useState<ListingData<MyService>>();
  const { currentPage, pageSize, sort } = listingState;

  const fetchServices = () => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    let items = sort ? services.sort(sort.column.sort) : services;
    if (sort?.reverse) {
      items = items.reverse();
    }
    setTimeout(
      () =>
        setData({
          items: items.slice(start, end),
          total: services.length,
        }),
      1000,
    );
  };

  useEffect(() => {
    fetchServices();
  }, [listingState]);

  const listingChangeHandler = (state: ListingState<MyService>) => {
    setListingState(state);
    setData(null);
  };

  return (
    <Listing
      columns={columns}
      data={data}
      state={listingState}
      onChange={listingChangeHandler}
    />
  );
}
