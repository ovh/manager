import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Datagrid,
  DataGridTextCell,
  useDatagridSearchParams,
} from '@ovhcloud/manager-components';
import { Endpoint, OpenStackTokenResponse } from '@/interface';

export function OpenStackTokenListing({
  token,
}: {
  token: OpenStackTokenResponse;
}) {
  const { t } = useTranslation('common');
  // const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
  // const [sorting, setSorting] = useState<ColumnSort[]>([]);
  const {
    pagination,
    setPagination,
    sorting,
    setSorting,
  } = useDatagridSearchParams();

  const columns = [
    {
      id: 'region_id',
      cell: (e: Endpoint) => {
        return <DataGridTextCell>{e.region_id}</DataGridTextCell>;
      },
      label: t(
        'pci_projects_project_users_openstack-token_token_catalog_region_label',
      ),
    },
    {
      id: 'type',
      cell: (e: Endpoint) => {
        return <DataGridTextCell>{e.type}</DataGridTextCell>;
      },
      label: t(
        'pci_projects_project_users_openstack-token_token_catalog_type_label',
      ),
    },
    {
      id: 'url',
      cell: (e: Endpoint) => {
        return <DataGridTextCell>{e.url}</DataGridTextCell>;
      },
      label: t(
        'pci_projects_project_users_openstack-token_token_catalog_endpoint_label',
      ),
    },
  ];

  const items = useMemo(() => {
    return token?.token?.catalog
      ?.map((catalog) =>
        catalog.endpoints.flat().map((e) => ({
          ...e,
          type: catalog.type,
        })),
      )
      .flat();
  }, [token]);

  const paginatedItems = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return (
      items
        ?.sort((a, b) => {
          const order = sorting[0]?.desc ? -1 : 1;
          switch (sorting[0]?.id) {
            case 'region_id':
              return order * a.region_id.localeCompare(b.region_id);
            case 'type':
              return order * a.type.localeCompare(b.type);
            case 'url':
              return order * a.url.localeCompare(b.url);
            default:
              return 1;
          }
        })
        .slice(start, end) || []
    );
  }, [items, pagination, sorting]);

  return (
    items && (
      <Datagrid
        columns={columns}
        items={paginatedItems}
        totalItems={items.length}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortChange={setSorting}
      />
    )
  );
}
