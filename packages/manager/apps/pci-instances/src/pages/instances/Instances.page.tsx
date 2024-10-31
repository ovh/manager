import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Navigate,
  Outlet,
  useHref,
  useParams,
  useRouteLoaderData,
} from 'react-router-dom';
import { TProject } from '@ovh-ux/manager-pci-common';
import {
  Datagrid,
  DatagridColumn,
  FilterAdd,
  FilterList,
  Notifications,
  PageLayout,
  PciGuidesHeader,
  Title,
  useColumnFilters,
  useNotifications,
  useTranslatedMicroRegions,
} from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OsdsButton,
  OsdsDivider,
  OsdsIcon,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSearchBar,
  OsdsLink,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  OsdsSearchBarCustomEvent,
} from '@ovhcloud/ods-components';
import { Trans, useTranslation } from 'react-i18next';
import { FilterComparator } from '@ovh-ux/manager-core-api';
import { Spinner } from '@/components/spinner/Spinner.component';
import { TInstance, useInstances } from '@/data/hooks/instance/useInstances';
import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import { SUB_PATHS } from '@/routes/routes';
import { StatusCell } from './datagrid/cell/StatusCell.component';
import { ActionsCell } from './datagrid/cell/ActionsCell.component';
import { NameIdCell } from './datagrid/cell/NameIdCell.component';
import { TextCell } from '@/components/datagrid/cell/TextCell.component';
import { AddressesCell } from './datagrid/cell/AddressesCell.component';

const initialSorting = {
  id: 'name',
  desc: false,
};

const Instances: FC = () => {
  const { t } = useTranslation(['list', 'common']);
  const { projectId } = useParams() as { projectId: string }; // safe because projectId has already been handled by async route loader
  const project = useRouteLoaderData('root') as TProject;
  const createInstanceHref = useHref('./new');
  const [sorting, setSorting] = useState(initialSorting);
  const [searchField, setSearchField] = useState('');
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const {
    addWarning,
    clearNotifications,
    notifications,
    addError,
  } = useNotifications();
  const filterPopoverRef = useRef<HTMLOsdsPopoverElement>(null);
  const { translateMicroRegion } = useTranslatedMicroRegions();

  const {
    data,
    isLoading: instancesQueryLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    hasInconsistency,
    refresh,
    isFetching,
    isRefetching,
    isError,
  } = useInstances(projectId, {
    limit: 10,
    sort: sorting.id,
    sortOrder: sorting.desc ? 'desc' : 'asc',
    filters,
  });

  const datagridColumns: DatagridColumn<TInstance>[] = useMemo(
    () => [
      {
        id: 'name',
        cell: (instance) => (
          <NameIdCell isLoading={isRefetching} instance={instance} />
        ),
        label: t('pci_instances_list_column_nameId'),
        isSortable: true,
      },
      {
        id: 'region',
        cell: (instance) => (
          <TextCell
            isLoading={isRefetching}
            label={translateMicroRegion(instance.region)}
          />
        ),
        label: t('pci_instances_list_column_region'),
        isSortable: false,
      },
      {
        id: 'flavor',
        cell: (instance) => (
          <TextCell isLoading={isRefetching} label={instance.flavorName} />
        ),
        label: t('pci_instances_list_column_flavor'),
        isSortable: true,
      },
      {
        id: 'image',
        cell: (instance) => (
          <TextCell isLoading={isRefetching} label={instance.imageName} />
        ),
        label: t('pci_instances_list_column_image'),
        isSortable: true,
      },
      {
        id: 'publicIPs',
        cell: (instance) => (
          <AddressesCell
            isLoading={isRefetching}
            addresses={instance.addresses.get('public') ?? []}
          />
        ),
        label: t('pci_instances_list_column_public_IPs'),
        isSortable: false,
      },
      {
        id: 'privateIPs',
        cell: (instance) => (
          <AddressesCell
            isLoading={isRefetching}
            addresses={instance.addresses.get('private') ?? []}
          />
        ),
        label: t('pci_instances_list_column_private_IPs'),
        isSortable: false,
      },
      {
        id: 'status',
        cell: (instance) => (
          <StatusCell isLoading={isRefetching} instance={instance} />
        ),
        label: t('pci_instances_list_column_status'),
        isSortable: false,
      },
      {
        id: 'actions',
        cell: (instance) => (
          <ActionsCell isLoading={isRefetching} instance={instance} />
        ),
        label: t('pci_instances_list_column_actions'),
        isSortable: false,
      },
    ],
    [isRefetching, t, translateMicroRegion],
  );

  const filterColumns = useMemo(
    () => [
      {
        id: 'name',
        label: t('pci_instances_list_column_nameId'),
        comparators: [FilterComparator.Includes],
      },
      {
        id: 'flavor',
        label: t('pci_instances_list_column_flavor'),
        comparators: [FilterComparator.Includes],
      },
      {
        id: 'image',
        label: t('pci_instances_list_column_image'),
        comparators: [FilterComparator.Includes],
      },
    ],
    [t],
  );

  const resetSortAndFilters = useCallback(() => {
    if (filters.length) filters.forEach(removeFilter);
    if (JSON.stringify(sorting) !== JSON.stringify(initialSorting))
      setSorting(initialSorting);
  }, [filters, sorting]);

  const handleRefresh = useCallback(() => {
    refresh();
    resetSortAndFilters();
  }, [refresh, resetSortAndFilters]);

  const errorMessage = useMemo(
    () => (
      <>
        <Trans
          t={t}
          i18nKey="pci_instances_list_unknown_error_message1"
          tOptions={{ interpolation: { escapeValue: true } }}
          shouldUnescape
          components={{
            Link: (
              <OsdsLink
                color={ODS_THEME_COLOR_INTENT.error}
                onClick={handleRefresh}
              />
            ),
          }}
        />
        <br />
        <Trans t={t} i18nKey="pci_instances_list_unknown_error_message2" />
      </>
    ),
    [handleRefresh, t],
  );

  const handleOdsSearchSubmit = useCallback(
    (
      event: OsdsSearchBarCustomEvent<{
        optionValue: string;
        inputValue: string;
      }>,
    ) => {
      addFilter({
        key: 'search',
        value: event.detail.inputValue,
        comparator: FilterComparator.Includes,
        label: 'name',
      });
      setSearchField('');
    },
    [addFilter],
  );

  const handleFetchNextPage = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  useEffect(() => {
    if (hasInconsistency)
      addWarning(t('pci_instances_list_inconsistency_message'), true);
    return () => {
      clearNotifications();
    };
  }, [addWarning, hasInconsistency, t, clearNotifications]);

  useEffect(() => {
    if (isFetching && notifications.length) clearNotifications();
  }, [clearNotifications, isFetching, notifications.length]);

  useEffect(() => {
    if (isError) addError(errorMessage, true);
  }, [isError, addError, t, errorMessage]);

  if (instancesQueryLoading) return <Spinner />;

  if (data && !data.length && !filters.length && !isFetching)
    return <Navigate to={SUB_PATHS.onboarding} />;

  return (
    <>
      <PageLayout>
        {project && <Breadcrumb projectLabel={project.description ?? ''} />}
        <div className="header mb-6 mt-8">
          <div className="flex items-center justify-between">
            <Title>{t('common:pci_instances_common_instances_title')}</Title>
            <PciGuidesHeader category="instances"></PciGuidesHeader>
          </div>
        </div>
        <div>
          <OsdsDivider />
          <Notifications />
          <OsdsDivider />
          <div className={'sm:flex items-center justify-between mt-4'}>
            <OsdsButton
              size={ODS_BUTTON_SIZE.sm}
              variant={ODS_BUTTON_VARIANT.stroked}
              color={ODS_THEME_COLOR_INTENT.primary}
              inline
              href={createInstanceHref}
            >
              <span slot="start" className="flex items-center">
                <OsdsIcon
                  name={ODS_ICON_NAME.ADD}
                  size={ODS_ICON_SIZE.xxs}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  className="mr-4"
                />
                <span>{t('common:pci_instances_common_create_instance')}</span>
              </span>
            </OsdsButton>
            <div className="justify-between flex gap-5">
              <div>
                <OsdsButton
                  slot="reset-trigger"
                  size={ODS_BUTTON_SIZE.sm}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  variant={ODS_BUTTON_VARIANT.stroked}
                  onClick={handleRefresh}
                  {...(isFetching && { disabled: true })}
                >
                  <OsdsIcon
                    name={ODS_ICON_NAME.REFRESH}
                    size={ODS_ICON_SIZE.xs}
                    className={'mr-2'}
                    color={ODS_THEME_COLOR_INTENT.primary}
                  />
                </OsdsButton>
              </div>
              <OsdsSearchBar
                className={'w-auto'}
                value={searchField}
                disabled={filters.length > 0 || isFetching}
                onOdsSearchSubmit={handleOdsSearchSubmit}
              />
              <OsdsPopover ref={filterPopoverRef}>
                <OsdsButton
                  slot="popover-trigger"
                  size={ODS_BUTTON_SIZE.sm}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  variant={ODS_BUTTON_VARIANT.stroked}
                  {...((filters.length > 0 || isFetching) && {
                    disabled: true,
                  })}
                >
                  <OsdsIcon
                    name={ODS_ICON_NAME.FILTER}
                    size={ODS_ICON_SIZE.xs}
                    className={'mr-2'}
                    color={ODS_THEME_COLOR_INTENT.primary}
                  />
                  {t('common:pci_instances_common_filter')}
                </OsdsButton>
                <OsdsPopoverContent>
                  <FilterAdd
                    columns={filterColumns}
                    onAddFilter={(addedFilter, column) => {
                      addFilter({
                        ...addedFilter,
                        label: column.id,
                      });
                      filterPopoverRef.current?.closeSurface();
                    }}
                  />
                </OsdsPopoverContent>
              </OsdsPopover>
            </div>
          </div>
          <div className="my-5">
            <FilterList filters={filters} onRemoveFilter={removeFilter} />
          </div>
          {data && (
            <div className="mt-10">
              <Datagrid
                columns={datagridColumns}
                hasNextPage={!isFetchingNextPage && hasNextPage}
                items={data}
                onFetchNextPage={handleFetchNextPage}
                totalItems={data.length}
                sorting={sorting}
                onSortChange={setSorting}
                manualSorting
                className={'!overflow-x-visible'}
              />
            </div>
          )}
          {isFetchingNextPage && (
            <div className="mt-5">
              <Spinner />
            </div>
          )}
        </div>
      </PageLayout>
      <Outlet />
    </>
  );
};

export default Instances;
