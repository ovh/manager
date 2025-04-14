import { FilterComparator } from '@ovh-ux/manager-core-api';
import { TProject } from '@ovh-ux/manager-pci-common';
import {
  FilterAdd,
  FilterList,
  Notifications,
  PageLayout,
  PciGuidesHeader,
  Title,
  useColumnFilters,
} from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  OsdsSearchBarCustomEvent,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsDivider,
  OsdsIcon,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSearchBar,
} from '@ovhcloud/ods-components/react';
import { FC, useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Navigate,
  Outlet,
  useHref,
  useLocation,
  useRouteLoaderData,
} from 'react-router-dom';
import NotFoundPage from '../404/NotFound.page';
import DatagridComponent from '@/components/datagrid/Datagrid.component';
import { useInstances } from '@/data/hooks/instance/useInstances';
import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import { Spinner } from '@/components/spinner/Spinner.component';
import { SECTIONS } from '@/routes/routes';
import { SearchNotifications } from '@/components/SearchNotifications/SearchNotifications';

const initialSorting = {
  id: 'name',
  desc: false,
};

const Instances: FC = () => {
  const { t } = useTranslation(['list', 'common']);

  const project = useRouteLoaderData('root') as TProject;
  const createInstanceHref = useHref('./new');
  const [sorting, setSorting] = useState(initialSorting);
  const [searchField, setSearchField] = useState('');
  const { filters, addFilter, removeFilter } = useColumnFilters();

  const filterPopoverRef = useRef<HTMLOsdsPopoverElement>(null);
  const location = useLocation();
  const notFoundAction: boolean = location.state?.notFoundAction;

  const { data, isFetchingNextPage, refresh, isFetching } = useInstances({
    limit: 10,
    sort: sorting.id,
    sortOrder: sorting.desc ? 'desc' : 'asc',
    filters,
  });

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
  }, [filters, sorting, removeFilter]);

  const handleRefresh = useCallback(() => {
    refresh();
    resetSortAndFilters();
  }, [refresh, resetSortAndFilters]);

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

  if (data && !data.length && !filters.length && !isFetching)
    return <Navigate to={SECTIONS.onboarding} />;

  if (notFoundAction) {
    return <NotFoundPage />;
  }

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
          <SearchNotifications />
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
          <DatagridComponent
            sorting={sorting}
            filters={filters}
            onRefresh={handleRefresh}
            onSortChange={setSorting}
          />
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
