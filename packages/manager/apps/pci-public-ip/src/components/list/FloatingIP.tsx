import {
  DataGridTextCell,
  Datagrid,
  useDatagridSearchParams,
} from '@ovhcloud/manager-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsIcon,
  OsdsLink,
  OsdsMessage,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { FloatingIP } from '@/interface';
import { useFLoatingIPs } from '@/hooks/useFloatingIP';
import Actions from './Actions';

export default function FloatingIPComponent({ projectId, projectUrl }) {
  const { t } = useTranslation('common');

  const { pagination, setPagination } = useDatagridSearchParams();

  const { error, data: floatingIPs, isLoading } = useFLoatingIPs(
    projectId || '',
    { pagination },
  );

  const goToInstanceHref = (id: string) => `${projectUrl}/instances/${id}`;

  const columns = [
    {
      id: 'ip-address',
      cell: (props: FloatingIP) => (
        <DataGridTextCell> {props.ip}</DataGridTextCell>
      ),
      label: t('pci_additional_ips_floating_ip_grid_ip'),
    },
    {
      id: 'region',
      cell: (props: FloatingIP) => (
        <DataGridTextCell>{props.region}</DataGridTextCell>
      ),
      label: t('pci_additional_ips_floating_ip_grid_region'),
    },

    {
      id: 'associated-service',
      cell: (props: FloatingIP) => (
        <DataGridTextCell>{props.associatedEntity?.id}</DataGridTextCell>
      ),
      label: t('pci_additional_ips_floating_ip_grid_associated_service'),
    },
    {
      id: 'associated-endpoint',
      cell: (props: FloatingIP) => (
        <DataGridTextCell>
          <OsdsLink
            color={ODS_THEME_COLOR_INTENT.primary}
            href={goToInstanceHref(props.associatedEntity?.id)}
          >
            {props.associatedEntity?.name}
          </OsdsLink>
        </DataGridTextCell>
      ),
      label: t('pci_additional_ips_floating_ip_grid_assocated_endpoint'),
    },
    {
      id: 'actions',
      cell: () => <Actions />,
      label: '',
    },
  ];

  return (
    <>
      <div className="flex">
        <OsdsButton
          className="mr-1"
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.stroked}
          color={ODS_THEME_COLOR_INTENT.primary}
        >
          <OsdsIcon
            name={ODS_ICON_NAME.ADD}
            size={ODS_ICON_SIZE.xxs}
            color={ODS_THEME_COLOR_INTENT.primary}
            className="mr-3"
          />
          {t('pci_additional_ips_add_additional_ip')}
        </OsdsButton>
      </div>

      {error && (
        <OsdsMessage className="mt-4" type={ODS_MESSAGE_TYPE.error}>
          {t('manager_error_page_default')}
        </OsdsMessage>
      )}

      {isLoading && !error && (
        <div className="text-center">
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
        </div>
      )}

      {!isLoading && !error && (
        <div className="mt-8">
          <Datagrid
            columns={columns}
            items={floatingIPs.rows || []}
            totalItems={floatingIPs.totalRows || 0}
            pagination={pagination}
            onPaginationChange={setPagination}
          />
        </div>
      )}
    </>
  );
}
