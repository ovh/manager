import { useDatagridSearchParams } from '@ovhcloud/manager-components';
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
  OsdsDivider,
  OsdsIcon,
  OsdsMessage,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useProjectRegions } from '@/api/hooks/useRegions';
import {
  useGlobalRegionsNetworks,
  useAggregatedNonLocalNetworks,
} from '@/api/hooks/useNetwork';
import { useGateways } from '@/api/hooks/useGateway';

import GlobalRegionsDatagrid from './GlobalRegionsDatagrid';

export type TGlobalRegions = {
  projectId: string;
  projectUrl: string;
};

export default function GlobalRegionsComponent({
  projectId,
  projectUrl,
}: Readonly<TGlobalRegions>) {
  const { t } = useTranslation(['common', 'error']);

  const { pagination, setPagination } = useDatagridSearchParams();

  const { data: regions, isLoading: regionsLoading } = useProjectRegions(
    projectId,
  );

  const { data: gateways, isLoading: gatewaysLoading } = useGateways(projectId);
  const {
    data: aggregatedNetworks,
    isLoading: aggregatedNetworksLoading,
  } = useAggregatedNonLocalNetworks(projectId, regions);

  const {
    data: networks,
    error,
    isLoading: networksLoading,
  } = useGlobalRegionsNetworks(
    projectId,
    aggregatedNetworks || [],
    gateways || [],
    pagination,
  );

  const isLoading =
    gatewaysLoading ||
    regionsLoading ||
    aggregatedNetworksLoading ||
    networksLoading;

  return (
    <div>
      <OsdsDivider />

      <div className="sm:flex items-center justify-between">
        <OsdsButton
          className="mr-1 xs:mb-1 sm:mb-0"
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
          {t('pci_projects_project_network_private_create')}
        </OsdsButton>
      </div>

      {error && (
        <OsdsMessage className="mt-4" type={ODS_MESSAGE_TYPE.error}>
          {t('manager_error_page_default', { ns: 'error' })}
        </OsdsMessage>
      )}

      {isLoading && !error && (
        <div className="text-center">
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
        </div>
      )}

      {!error && !isLoading && networks.rows.length > 0 && (
        <div className="mt-8">
          <GlobalRegionsDatagrid
            projectUrl={projectUrl}
            items={networks.rows}
            totalItems={networks.totalRows || 0}
            pagination={pagination}
            pageCount={networks.pageCount || 0}
            onPaginationChange={setPagination}
          />
        </div>
      )}
    </div>
  );
}
