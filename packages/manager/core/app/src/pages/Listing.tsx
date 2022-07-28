import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Link, Text } from '@chakra-ui/react';
import Listing, { ListingRange, ListingService } from '../components/Listing';

interface VpsService extends ListingService {
  name: string;
  serviceId: string;
  reverse: string;
  model: string;
  location: string;
  status: string;
}

function initMockData(t: (key: string) => string) {
  const services: VpsService[] = [];
  const listingHeader = [
    t('name'),
    t('reverse'),
    t('model'),
    t('location'),
    t('status'),
  ];
  for (let i = 1; i <= 150; i += 1) {
    services.push({
      id: i,
      name: `Service name #${i}`,
      serviceId: '123',
      reverse: `127.0.0.1.eu`,
      model: `MODEL-${i % 3}`,
      location: 'GRA1',
      status: 'normal',
    });
  }
  return { listingHeader, services };
}

function renderVps(service: VpsService, column: keyof VpsService): JSX.Element {
  if (column === 'name') {
    return <Link href="#">{service[column]}</Link>;
  }
  return <Text>{service[column]}</Text>;
}

export default function ListingPage(): JSX.Element {
  const { t } = useTranslation('listing');
  const navigate = useNavigate();
  const { page: pageParam } = useParams();
  const [searchParams] = useSearchParams();

  const { listingHeader, services } = initMockData(t);
  const currentPage = Number(pageParam) || 1;
  const defaultPageSize = 10;
  const pageSize = Number(searchParams.get('pageSize')) || defaultPageSize;

  const fetchVps = ({ start, end }: ListingRange) => {
    return Promise.resolve({
      services: services.slice(start, end),
      totalCount: services.length,
    });
  };

  const paginationChangeHandler = (page: number, size: number) => {
    const search = size !== defaultPageSize ? `?pageSize=${size}` : '';
    navigate(`/vps/${page}${search}`);
  };

  return (
    <Listing
      currentPage={currentPage}
      pageSize={pageSize}
      header={listingHeader}
      fetchServices={fetchVps}
      renderService={renderVps}
      onPaginationChange={paginationChangeHandler}
    />
  );
}
