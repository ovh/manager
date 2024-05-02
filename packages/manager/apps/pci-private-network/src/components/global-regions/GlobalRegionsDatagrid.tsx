import { PaginationState } from '@ovhcloud/manager-components';
import { OsdsPagination } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { TAggregatedNetwork } from '@/api/data/network';
import DataGridBodyRow from './DatagridBodyRow';
import DatagridHeader from './DatagridHeader';
import DataGridNoResults from './DatagridNoResults';

export type TGlobalRegionsDatagrid = {
  items: TAggregatedNetwork[];
  projectUrl: string;
  totalItems: number;
  pageCount: number;
  pagination: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
};

export default function GlobalRegionsDatagrid({
  items,
  projectUrl,
  totalItems,
  pagination,
  pageCount,
  onPaginationChange,
}: Readonly<TGlobalRegionsDatagrid>): JSX.Element {
  const { t } = useTranslation(['common', 'pagination']);

  return (
    <div className="container contents overflow-x-auto">
      <table className="w-full mb-2 border-collapse">
        <thead>
          <DatagridHeader />
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((network) => (
              <DataGridBodyRow
                key={network.vlanId}
                projectUrl={projectUrl}
                network={network}
              />
            ))
          ) : (
            <DataGridNoResults />
          )}
        </tbody>
      </table>

      {items?.length > 0 && pagination ? (
        <OsdsPagination
          defaultCurrentPage={pagination.pageIndex + 1}
          className="flex xs:justify-start md:justify-end"
          total-items={totalItems}
          total-pages={pageCount}
          default-items-per-page={pagination.pageSize}
          onOdsPaginationChanged={({ detail }) => {
            if (detail.current !== detail.oldCurrent) {
              onPaginationChange({
                ...pagination,
                pageIndex: detail.current - 1,
                pageSize: detail.itemPerPage,
              });
            }
          }}
          onOdsPaginationItemPerPageChanged={({ detail }) => {
            if (detail.current !== pagination.pageSize)
              onPaginationChange({
                ...pagination,
                pageSize: detail.current,
                pageIndex: 0,
              });
          }}
        >
          <span slot="before-total-items" className="mr-3">
            {t('common_pagination_of', { ns: 'pagination' })}
          </span>
          <span slot="after-total-items" className="ml-3">
            {t('common_pagination_results', { ns: 'pagination' })}
          </span>
        </OsdsPagination>
      ) : (
        <div className="mb-6" aria-hidden="true"></div>
      )}
    </div>
  );
}
