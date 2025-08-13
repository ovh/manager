import { FilterComparator } from '@ovh-ux/manager-core-api';
import { TProject } from '@ovh-ux/manager-pci-common';
import {
  ChangelogButton,
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
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsDivider,
  OsdsIcon,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import { Button, Input } from '@ovhcloud/ods-react';
import { Search } from 'lucide-react';

import { FC, FormEvent, useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  Navigate,
  Outlet,
  useHref,
  useRouteLoaderData,
} from 'react-router-dom';
import clsx from 'clsx';
import { useInstances } from '@/data/hooks/instance/useInstances';
import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import { Spinner } from '@/components/spinner/Spinner.component';
import { SECTIONS } from '@/routes/routes';
import { SearchNotifications } from '@/components/SearchNotifications/SearchNotifications';
import { CHANGELOG_LINKS } from '@/constants';
import DatagridComponent from './datagrid/components/Datagrid.component';
import { useDatagridOperationsPolling } from '@/pages/instances/datagrid/hooks/useDatagridOperationsPolling';

const initialSorting = {
  id: 'name',
  desc: false,
};

const SearchBar = ({
  onSearchSubmit,
  isDisabled,
}: {
  onSearchSubmit: (value: string) => void;
  isDisabled: boolean;
}) => {
  const [searchField, setSearchField] = useState('');

  const onSearchHandler = (event: FormEvent) => {
    event.preventDefault();
    onSearchSubmit(searchField);
    setSearchField('');
  };

  return (
    <form
      className="flex justify-end items-center w-full relative"
      onSubmit={onSearchHandler}
    >
      <Input
        value={searchField}
        disabled={isDisabled}
        onChange={(e) => setSearchField(e.target.value)}
        className="min-h-[40px] focus:bg-[#bef1ff] max-w-full sm:max-w-72  focus-visible:ring-transparent focus-visible:bg-primary-300 text-primary-100 pr-8 mr-4"
        clearable
      />
      <Button disabled={isDisabled}>
        <Search />
      </Button>
    </form>
  );
};
const Instances: FC = () => {
  const { t } = useTranslation(['list', 'common', NAMESPACES.ACTIONS]);

  const project = useRouteLoaderData('root') as TProject | undefined;
  const createInstanceHref = useHref('./new');
  const [sorting, setSorting] = useState(initialSorting);
  const { filters, addFilter, removeFilter } = useColumnFilters();

  const filterPopoverRef = useRef<HTMLOsdsPopoverElement>(null);

  const {
    data,
    isFetchingNextPage,
    refresh,
    isFetching,
    isPending,
    isRefetching,
  } = useInstances({
    limit: 20,
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

  const handleSearchSubmit = useCallback(
    (value: string) => {
      addFilter({
        key: 'search',
        value,
        comparator: FilterComparator.Includes,
        label: 'name',
      });
    },
    [addFilter],
  );

  useDatagridOperationsPolling(handleRefresh);

  if (data && !data.length && !filters.length && !isFetching)
    return <Navigate to={SECTIONS.onboarding} />;

  return (
    <>
      <PageLayout>
        {project && <Breadcrumb projectLabel={project.description ?? ''} />}
        <div className="header mb-6 mt-8">
          <div className="flex items-center justify-between">
            <Title>{t('common:pci_instances_common_instances_title')}</Title>
            <div className="flex items-center flex-wrap">
              <ChangelogButton links={CHANGELOG_LINKS} />
              <PciGuidesHeader category="instances" />
            </div>
          </div>
        </div>
        <div>
          <OsdsDivider />
          <Notifications />
          <SearchNotifications />
          <OsdsDivider />
          <div className="sm:flex items-center justify-between mt-4 min-h-[40px]">
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
            <div className="justify-between flex gap-5 min-h-[40px] items-center">
              <div className="flex items-center">
                {isRefetching ? (
                  <OsdsSpinner inline={true} size={ODS_SPINNER_SIZE.md} />
                ) : (
                  <OsdsButton
                    slot="reset-trigger"
                    size={ODS_BUTTON_SIZE.sm}
                    color={ODS_THEME_COLOR_INTENT.primary}
                    variant={ODS_BUTTON_VARIANT.stroked}
                    onClick={handleRefresh}
                    {...(isFetching && { disabled: true })}
                  >
                    <span slot="start" className="flex items-center mr-0">
                      <OsdsIcon
                        name={ODS_ICON_NAME.REFRESH}
                        size={ODS_ICON_SIZE.sm}
                        color={ODS_THEME_COLOR_INTENT.primary}
                      />
                    </span>
                  </OsdsButton>
                )}
              </div>
              <SearchBar
                onSearchSubmit={handleSearchSubmit}
                isDisabled={filters.length > 0 || isFetching}
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
                  <span slot="start" className="flex items-center mr-0">
                    <OsdsIcon
                      name={ODS_ICON_NAME.FILTER}
                      size={ODS_ICON_SIZE.sm}
                      color={ODS_THEME_COLOR_INTENT.primary}
                    />
                    <span>{t(`${NAMESPACES.ACTIONS}:filter`)}</span>
                  </span>
                </OsdsButton>
                <OsdsPopoverContent>
                  <FilterAdd
                    columns={filterColumns}
                    onAddFilter={(addedFilter, column) => {
                      addFilter({
                        ...addedFilter,
                        label: column.id,
                      });
                      void filterPopoverRef.current?.closeSurface();
                    }}
                  />
                </OsdsPopoverContent>
              </OsdsPopover>
            </div>
          </div>
          <div className={clsx({ 'mt-8': filters.length })}>
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
      {!isPending && <Outlet />}
    </>
  );
};

export default Instances;
