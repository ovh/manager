import {
  DataGridTextCell,
  Datagrid,
  useDatagridSearchParams,
} from '@ovhcloud/manager-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_MESSAGE_TYPE, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import {
  OsdsLink,
  OsdsMessage,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { FailoverIP } from '@/interface';
import { useFailoverIPs } from '@/api/hooks/useFailoverIP';
import FailoverIPActions from './FailoverIPActions';

export default function FailoverIPComponent({ projectId, projectUrl }) {
  const { t } = useTranslation('common');

  const { pagination, setPagination } = useDatagridSearchParams();

  const { error, data: floatingIPs, isLoading } = useFailoverIPs(
    projectId || '',
    {
      pagination,
    },
  );

  const goToInstanceHref = (id: string) => `${projectUrl}/instances/${id}`;

  const columns = [
    {
      id: 'failover-ip',
      cell: (props: FailoverIP) => (
        <DataGridTextCell> {props.ip}</DataGridTextCell>
      ),
      label: t('pci_additional_ips_failover_ip_title'),
    },
    {
      id: 'bloc-ip',
      cell: (props: FailoverIP) => (
        <DataGridTextCell>{props.block}</DataGridTextCell>
      ),
      label: t('pci_additional_ips_ip_block'),
    },

    {
      id: 'country',
      cell: (props: FailoverIP) => (
        <DataGridTextCell>
          {t(`pci_additional_ips_country_${props.geoloc}`)}
        </DataGridTextCell>
      ),
      label: t('pci_additional_ips_geoloc'),
    },
    {
      id: 'id',
      cell: (props: FailoverIP) => (
        <DataGridTextCell>{props.id}</DataGridTextCell>
      ),
      label: t('pci_additional_ips_id'),
    },
    {
      id: 'routed-to',
      cell: (props: FailoverIP) => (
        <DataGridTextCell>
          <OsdsLink
            color={ODS_THEME_COLOR_INTENT.primary}
            href={goToInstanceHref(props.routedTo)}
          >
            {props.associatedEntity?.name}
          </OsdsLink>
        </DataGridTextCell>
      ),
      label: t('pci_additional_ips_routedTo'),
    },
    {
      id: 'actions',
      cell: () => <FailoverIPActions />,
      label: '',
    },
  ];

  return (
    <>
      <div className="flex">
        <OsdsSelect>
          <span slot="placeholder">{t('common_actions')}</span>
          <OsdsSelectOption>
            {t('pci_additional_ips_import_failover_ip')}
          </OsdsSelectOption>
          <OsdsSelectOption>{t('pci_additional_ips_order')}</OsdsSelectOption>
        </OsdsSelect>
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
