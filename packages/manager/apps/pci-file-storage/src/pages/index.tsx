import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { OdsPaginationItemPerPageChangedEvent } from '@ovhcloud/ods-components';
import { OsdsPagination } from '@ovhcloud/ods-components/react';
import { getListingIcebergV6 } from '@/api';

import TableContainer from '@/components/layout-helpers/Listing/TableContainer';
import Loading from '@/components/Loading/Loading';
import ErrorBanner from '@/components/Error/Error';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';

const INITAL_PAGE = 1;

export default function Listing() {
  const [res, setRes] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { t } = useTranslation('pci-file-storage/listing');

  const { data, isError, error, isLoading, status }: any = useQuery({
    queryKey: [`servicesListingIceberg-${page}-${pageSize}`],
    queryFn: () => getListingIcebergV6({ pageSize, page }),
    staleTime: Infinity,
    enabled: true,
  });

  useEffect(() => {
    if (status === 'success' && data?.data) {
      if (totalPages === 0) {
        setTotalPages(Math.ceil(data.totalCount / pageSize));
      }
      setTotalCount(data.totalCount);
      setRes(data?.data);
    }
  }, [data?.data]);

  if (isError) {
    return <ErrorBanner error={error.response} />;
  }

  if (isLoading && page === 1) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (data?.length === 0) return <Navigate to="onboarding" />;

  const onOdsPageSizeChange = (event: OdsPaginationItemPerPageChangedEvent) => {
    if (event?.detail?.current) {
      const newPageSize = Number(event.detail.current);
      setPageSize(newPageSize);
      setTotalPages(Math.ceil(data.totalCount / newPageSize));
      setPage(INITAL_PAGE);
    }
  };

  return (
    <>
      <div className="pt-5 pb-10">
        <Breadcrumb />
        <h2>pci-file-storage</h2>
        <div>{res.length > 0 && <TableContainer data={res} />}</div>
        <div className="flex justify-end items-center mt-4">
          {totalPages > 1 && (
            <OsdsPagination
              current={page}
              id="main-pagination"
              totalPages={totalPages}
              totalItems={totalCount}
              defaultItemsPerPage={pageSize}
              onOdsPaginationItemPerPageChanged={onOdsPageSizeChange}
              onClick={(event: any) => setPage(event.target.current)}
            />
          )}
        </div>
      </div>
    </>
  );
}
