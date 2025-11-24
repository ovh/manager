import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import punycode from 'punycode/punycode';
import { useTranslation } from 'react-i18next';

import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Button,
  ICON_NAME,
  Icon,
  TEXT_PRESET,
  Text,
  Toggle,
  ToggleControl,
  ToggleLabel,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { FilterTypeCategories } from '@ovh-ux/manager-core-api';
import { ActionMenu, ActionMenuItemProps, Datagrid, DatagridColumn, useDataApi } from '@ovh-ux/muk';

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
  const { flattenData, hasNextPage, fetchNextPage, isLoading, filters } = useDataApi<CdnOption>({
    route: `/hosting/web/${serviceName}/cdn/domain/${domain}/option${searchParams}`,
    cacheKey: ['hosting', 'web', serviceName, 'cdn', 'domain', domain, 'option'],
    version: 'v6',
  });

  const { updateCdnOption } = useUpdateCdnOption(serviceName, domain);
  const { deleteCdnOption } = useDeleteCdnOption(serviceName, domain);

  const rulesData = flattenData
    ?.filter((item) => item?.type === CdnOptionType.CACHE_RULE)
    .sort((a, b) => a.config.priority - b.config.priority);

  const DatagridActionCell = (props: CdnOption) => {
    const items: ActionMenuItemProps[] = [
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
      <ActionMenu
        id={props?.name}
        items={items}
        isCompact
        variant={BUTTON_VARIANT.ghost}
        icon={ICON_NAME.ellipsisVertical}
      />
    );
  };

  const columns: DatagridColumn<CdnOption>[] = [
    {
      id: 'priority',
      accessorFn: (row) => row?.config?.priority,
      header: t('cdn_shared_option_cache_rule_table_header_order_by'),
      label: t('cdn_shared_option_cache_rule_table_header_order_by'),
      isSortable: true,
      isFilterable: true,
      type: FilterTypeCategories.Numeric,
      cell: ({ row }) => <div>{row?.original?.config?.priority}</div>,
    },
    {
      id: 'rule',
      accessorFn: (row) => row?.name,
      header: t('cdn_shared_option_cache_rule_table_header_rule_name'),
      label: t('cdn_shared_option_cache_rule_table_header_rule_name'),
      isSortable: true,
      isSearchable: true,
      isFilterable: true,
      type: FilterTypeCategories.String,
      cell: ({ row }) => <div>{row?.original.name}</div>,
    },
    {
      id: 'type',
      accessorFn: (row) => row?.config?.patternType,
      header: t(`${NAMESPACES.DASHBOARD}:type`),
      label: t(`${NAMESPACES.DASHBOARD}:type`),
      isSortable: true,
      isFilterable: true,
      type: FilterTypeCategories.String,
      cell: ({ row }) => (
        <div>
          {t(`cdn_shared_option_cache_rule_table_items_type_${row?.original?.config?.patternType}`)}
        </div>
      ),
    },
    {
      id: 'resource',
      accessorFn: (row) => row?.pattern,
      header: t('cdn_shared_option_cache_rule_table_header_resource'),
      label: t('cdn_shared_option_cache_rule_table_header_resource'),
      isSortable: true,
      isFilterable: true,
      type: FilterTypeCategories.String,
      cell: ({ row }) => <div>{row?.original?.pattern}</div>,
    },
    {
      id: 'time',
      accessorFn: (row) => row?.config?.ttl,
      header: t('cdn_shared_option_cache_rule_table_time_to_live'),
      label: t('cdn_shared_option_cache_rule_table_time_to_live'),
      isSortable: true,
      isFilterable: true,
      type: FilterTypeCategories.Numeric,
      cell: ({ row }) => {
        const unitTime = convertToUnitTime(row?.original?.config?.ttl, t);
        return <div>{`${unitTime?.timeValue} ${unitTime?.timeUnit}`}</div>;
      },
    },
    {
      id: 'status',
      accessorFn: (row) => row?.enabled,
      header: t(`${NAMESPACES.STATUS}:status`),
      label: t(`${NAMESPACES.STATUS}:status`),
      isSortable: true,
      isFilterable: true,
      type: FilterTypeCategories.Options,
      cell: ({ row }) => {
        const { name, enabled, ...payload } = row?.original;
        return (
          <div>
            <div className="flex items-center space-x-4">
              <Toggle
                id={name}
                key={`${name}-${enabled}`}
                name={name}
                checked={enabled}
                onCheckedChange={(detail) => {
                  updateCdnOption({
                    option: name,
                    cdnOption: {
                      enabled: detail.checked,
                      ...payload,
                    },
                  });
                }}
              >
                <ToggleControl />
                <ToggleLabel>
                  <Text>
                    {t(
                      row?.original?.enabled
                        ? t(`${NAMESPACES.SERVICE}:service_state_enabled`)
                        : t(`${NAMESPACES.SERVICE}:service_state_disabled`),
                    )}
                  </Text>
                </ToggleLabel>
              </Toggle>
            </div>
          </div>
        );
      },
    },
    {
      id: 'action',
      accessorFn: () => '',
      header: '',
      isSortable: true,
      cell: ({ row }) => <DatagridActionCell {...row.original} />,
    },
  ];

  return (
    <React.Suspense fallback={<Loading />}>
      <Text preset={TEXT_PRESET.heading5}>{t('cdn_shared_option_cache_rule_title')}</Text>
      <Text preset={TEXT_PRESET.caption}>
        {t('cdn_shared_option_cache_rule_add_rule_max_rules', {
          range,
          maxItems: 5,
        })}
      </Text>

      <Datagrid
        columns={rulesData ? columns : []}
        data={rulesData || []}
        hasNextPage={hasNextPage && !isLoading}
        onFetchNextPage={(): void => {
          void fetchNextPage();
        }}
        isLoading={isLoading}
        filters={filters}
        search={{
          searchInput,
          setSearchInput,
          onSearch: (search) => setDebouncedSearchInput(search),
        }}
        topbar={
          <Button
            size={BUTTON_SIZE.sm}
            variant={BUTTON_VARIANT.outline}
            onClick={() =>
              navigate(
                urls.cdnCacheRule
                  .replace(subRoutes.serviceName, serviceName)
                  .replace(subRoutes.domain, domain),
              )
            }
          >
            <>
              <Icon name={ICON_NAME.plus} />
              {t('cdn_shared_option_cache_rule_btn_add_rule')}
            </>
          </Button>
        }
      />
    </React.Suspense>
  );
}
