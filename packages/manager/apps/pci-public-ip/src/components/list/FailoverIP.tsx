import {
  DataGridTextCell,
  Datagrid,
  useDatagridSearchParams,
  Notifications,
} from '@ovhcloud/manager-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsLink,
  OsdsMenuItem,
  OsdsMessage,
  OsdsMenu,
  OsdsSpinner,
  OsdsText,
  OsdsIcon,
  OsdsDivider,
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
      cell: (props: FailoverIP) => (
        <FailoverIPActions projectId={projectId} ipId={props.id} />
      ),
      label: '',
    },
  ];

  return (
    <>
      <Notifications />
      <OsdsDivider />
      <OsdsMenu>
        <OsdsButton
          slot={'menu-title'}
          color={ODS_THEME_COLOR_INTENT.primary}
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.stroked}
          className={'flex'}
        >
          <OsdsText
            size={ODS_THEME_TYPOGRAPHY_SIZE._500}
            color={ODS_THEME_COLOR_INTENT.primary}
            className={'align-middle'}
          >
            {t('common_actions')}
          </OsdsText>
          <OsdsIcon
            name={ODS_ICON_NAME.CHEVRON_DOWN}
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_ICON_SIZE.sm}
            className={'ml-4 align-middle'}
          ></OsdsIcon>
        </OsdsButton>
        <OsdsMenuItem>
          <OsdsButton
            size={ODS_BUTTON_SIZE.sm}
            variant={ODS_BUTTON_VARIANT.ghost}
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            <OsdsText
              size={ODS_THEME_TYPOGRAPHY_SIZE._500}
              level={ODS_TEXT_LEVEL.button}
              color={ODS_THEME_COLOR_INTENT.primary}
              slot={'start'}
            >
              {t('pci_additional_ips_import_failover_ip')}
            </OsdsText>
          </OsdsButton>
        </OsdsMenuItem>
        <OsdsMenuItem>
          <OsdsButton
            size={ODS_BUTTON_SIZE.sm}
            variant={ODS_BUTTON_VARIANT.ghost}
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            <OsdsText
              size={ODS_THEME_TYPOGRAPHY_SIZE._500}
              level={ODS_TEXT_LEVEL.button}
              color={ODS_THEME_COLOR_INTENT.primary}
              slot={'start'}
            >
              {t('pci_additional_ips_order')}
            </OsdsText>
          </OsdsButton>
        </OsdsMenuItem>
      </OsdsMenu>

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
