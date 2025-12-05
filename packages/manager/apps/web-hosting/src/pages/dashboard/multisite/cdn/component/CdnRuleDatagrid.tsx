import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import punycode from 'punycode/punycode';
import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsText, OdsToggle } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { FilterTypeCategories } from '@ovh-ux/manager-core-api';
import {
  ActionMenu,
  ActionMenuItem,
  DataGridTextCell,
  Datagrid,
  DatagridColumn,
  useResourcesIcebergV6,
} from '@ovh-ux/manager-react-components';

import Loading from '@/components/loading/Loading.component';
import { useDeleteCdnOption, useUpdateCdnOption } from '@/data/hooks/cdn/useCdn';
import { CdnOption, CdnOptionType } from '@/data/types/product/cdn';
import { useDebouncedValue } from '@/hooks/debouncedValue/useDebouncedValue';
import { subRoutes, urls } from '@/routes/routes.constants';
import { buildURLSearchParams } from '@/utils';
import { convertToUnitTime } from '@/utils/cdn';

export default function CdnRuleDatagrid({ range }: { range: string }) {
  const { serviceName, domain } = useParams();
  const navigate = useNavigate();
  const [searchInput, setSearchInput, debouncedSearchInput, setDebouncedSearchInput] =
    useDebouncedValue('');
  const { t } = useTranslation(['dashboard', NAMESPACES.DASHBOARD, NAMESPACES.STATUS]);
  const searchParams = buildURLSearchParams({
    name: punycode.toASCII(debouncedSearchInput),
  });
  const { flattenData, hasNextPage, fetchNextPage, isLoading, filters } =
    useResourcesIcebergV6<CdnOption>({
      route: `/hosting/web/${serviceName}/cdn/domain/${domain}/option${searchParams}`,
      queryKey: ['hosting', 'web', serviceName, 'cdn', 'domain', domain, 'option'],
    });

  const { updateCdnOption } = useUpdateCdnOption(serviceName, domain);
  const { deleteCdnOption } = useDeleteCdnOption(serviceName, domain);

  const rulesData = flattenData
    ?.filter((item) => item?.type === CdnOptionType.CACHE_RULE)
    .sort((a, b) => a.config.priority - b.config.priority);

  const DatagridActionCell = (props: CdnOption) => {
    const items: ActionMenuItem[] = [
      {
        id: 1,
        label: t('cdn_shared_option_cache_rule_table_items_option_set_rule'),
        onClick: () => {
          navigate(
            urls.cdnCacheRule
              .replace(subRoutes.serviceName, serviceName)
              .replace(subRoutes.domain, domain),
            { state: props },
          );
        },
      },
      {
        id: 2,
        label: t('cdn_shared_option_cache_rule_table_items_option_delete_rule'),
        onClick: () => deleteCdnOption(props?.name),
      },
    ];

    return (
      <DataGridTextCell>
        <ActionMenu
          id={props?.name}
          items={items}
          isCompact
          variant={ODS_BUTTON_VARIANT.ghost}
          icon={ODS_ICON_NAME.ellipsisVertical}
        />
      </DataGridTextCell>
    );
  };

  const columns: DatagridColumn<CdnOption>[] = [
    {
      id: 'priority',
      label: t('cdn_shared_option_cache_rule_table_header_order_by'),
      isSortable: true,
      isFilterable: true,
      type: FilterTypeCategories.Numeric,
      cell: (row) => <DataGridTextCell>{row?.config?.priority}</DataGridTextCell>,
    },
    {
      id: 'rule',
      label: t('cdn_shared_option_cache_rule_table_header_rule_name'),
      isSortable: true,
      isSearchable: true,
      isFilterable: true,
      type: FilterTypeCategories.String,
      cell: (row) => <DataGridTextCell>{row.name}</DataGridTextCell>,
    },
    {
      id: 'type',
      label: t(`${NAMESPACES.DASHBOARD}:type`),
      isSortable: true,
      isFilterable: true,
      type: FilterTypeCategories.String,
      cell: (row) => (
        <DataGridTextCell>
          {t(`cdn_shared_option_cache_rule_table_items_type_${row.config?.patternType}`)}
        </DataGridTextCell>
      ),
    },
    {
      id: 'resource',
      label: t('cdn_shared_option_cache_rule_table_header_resource'),
      isSortable: true,
      isFilterable: true,
      type: FilterTypeCategories.String,
      cell: (row) => <DataGridTextCell>{row.pattern}</DataGridTextCell>,
    },
    {
      id: 'time',
      label: t('cdn_shared_option_cache_rule_table_time_to_live'),
      isSortable: true,
      isFilterable: true,
      type: FilterTypeCategories.Numeric,
      cell: (row) => {
        const unitTime = convertToUnitTime(row?.config?.ttl, t);
        return (
          <DataGridTextCell>{`${unitTime?.timeValue} ${unitTime?.timeUnit}`}</DataGridTextCell>
        );
      },
    },
    {
      id: 'status',
      label: t(`${NAMESPACES.STATUS}:status`),
      isSortable: true,
      isFilterable: true,
      type: FilterTypeCategories.Options,
      cell: (row) => {
        const { name, enabled, ...payload } = row;
        return (
          <DataGridTextCell>
            <div className="flex items-center space-x-4">
              <OdsToggle
                name={name}
                value={enabled}
                onClick={() => {
                  updateCdnOption({
                    option: name,
                    cdnOption: {
                      enabled: !enabled,
                      ...payload,
                    },
                  });
                }}
              />
              <OdsText>
                {t(
                  row.enabled
                    ? t(`${NAMESPACES.SERVICE}:service_state_enabled`)
                    : t(`${NAMESPACES.SERVICE}:service_state_disabled`),
                )}
              </OdsText>
            </div>
          </DataGridTextCell>
        );
      },
    },
    {
      id: 'action',
      label: '',
      isSortable: true,
      cell: DatagridActionCell,
    },
  ];

  return (
    <React.Suspense fallback={<Loading />}>
      <OdsText preset={ODS_TEXT_PRESET.heading5}>{t('cdn_shared_option_cache_rule_title')}</OdsText>
      <OdsText preset={ODS_TEXT_PRESET.caption}>
        {t('cdn_shared_option_cache_rule_add_rule_max_rules', {
          range,
          maxItems: 5,
        })}
      </OdsText>
      {columns && (
        <Datagrid
          columns={columns}
          items={rulesData || []}
          totalItems={rulesData?.length || 0}
          hasNextPage={hasNextPage && !isLoading}
          onFetchNextPage={fetchNextPage}
          isLoading={isLoading}
          filters={filters}
          search={{
            searchInput,
            setSearchInput,
            onSearch: (search) => setDebouncedSearchInput(search),
          }}
          topbar={
            <OdsButton
              icon={ODS_ICON_NAME.plus}
              size={ODS_BUTTON_SIZE.sm}
              variant={ODS_BUTTON_VARIANT.outline}
              label={t('cdn_shared_option_cache_rule_btn_add_rule')}
              onClick={() =>
                navigate(
                  urls.cdnCacheRule
                    .replace(subRoutes.serviceName, serviceName)
                    .replace(subRoutes.domain, domain),
                )
              }
            />
          }
        />
      )}
    </React.Suspense>
  );
}
