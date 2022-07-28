import React, { useEffect, useMemo, useState } from 'react';
import {
  Checkbox,
  Flex,
  VStack,
  Spacer,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Td,
  Tr,
  Th,
} from '@chakra-ui/react';

import ListingPagination from './ListingPagination';

export type ListingRange = {
  start: number;
  end: number;
};

export type ListingService = {
  id: string | number;
};

export type ListingFetchResult<T extends ListingService> = {
  services: T[];
  totalCount: number;
};

export type ListingProps<T extends ListingService> = {
  currentPage: number;
  pageSize: number;
  header: string[];
  fetchServices: (changes: ListingRange) => Promise<ListingFetchResult<T>>;
  renderService: (service: T, column: keyof T) => JSX.Element;
  onPaginationChange: (currentPage: number, pageSize: number) => void;
};

export default function Listing<T extends ListingService>({
  currentPage,
  pageSize,
  header,
  fetchServices,
  renderService,
  onPaginationChange,
}: ListingProps<T>): JSX.Element {
  const [listingData, setListingData] = useState<ListingFetchResult<T>>(null);

  const paginationChangeHandler = ({
    currentPage: page,
    itemsPerPage: size,
  }: {
    currentPage: number;
    itemsPerPage: number;
  }) => {
    onPaginationChange(page, size);
  };

  useEffect(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    fetchServices({ start, end }).then((result) => {
      if (result.services.length === 0) {
        onPaginationChange(Math.ceil(result.totalCount / pageSize), pageSize);
      } else {
        setListingData(result);
      }
    });
  }, [currentPage, pageSize]);

  const columns = useMemo(
    () => [
      <Th key="selector">
        <Checkbox></Checkbox>
      </Th>,
      ...header.map((column) => <Th key={column}>{column}</Th>),
    ],
    [header],
  );

  const cells = useMemo(
    () =>
      listingData?.services.map((service) => (
        <Tr key={service.id}>
          {[
            <Td key="selector">
              <Checkbox></Checkbox>
            </Td>,
            ...header.map((column) => (
              <Td key={column}>{renderService(service, column as keyof T)}</Td>
            )),
          ]}
        </Tr>
      )),
    [listingData, header],
  );

  return (
    <VStack align="left">
      <TableContainer>
        <Table>
          <Thead>
            <Tr>{columns}</Tr>
          </Thead>
          <Tbody>{cells}</Tbody>
        </Table>
      </TableContainer>
      {listingData && (
        <Flex>
          <Spacer />
          <ListingPagination
            currentPage={currentPage}
            itemsCount={listingData?.totalCount}
            itemsPerPage={pageSize}
            onChange={paginationChangeHandler}
          />
        </Flex>
      )}
    </VStack>
  );
}
