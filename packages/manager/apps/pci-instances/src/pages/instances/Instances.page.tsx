import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useRouteLoaderData } from 'react-router-dom';
import {
  Datagrid,
  DatagridColumn,
  DataGridTextCell,
  FilterAdd,
  FilterList,
  Notifications,
  PciGuidesHeader,
  PublicCloudProject,
  Title,
  useColumnFilters,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  OsdsBreadcrumb,
  OsdsButton,
  OsdsDivider,
  OsdsIcon,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSearchBar,
  OsdsText,
  OsdsSkeleton,
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
import { Instance, useInstances } from '@/data/hooks/instances/useInstances';
import StatusChip from '@/components/statusChip/StatusChip.component';

const initialSort = {
  id: 'name',
  desc: false,
};

const Instances: FC = () => {
  const { t } = useTranslation('list');
  const { projectId } = useParams() as { projectId: string }; // safe because projectId has already been handled by async route loader
  const project = useRouteLoaderData('root') as PublicCloudProject;
  const navigate = useNavigate();
  const [sorting, setSorting] = useState(initialSort);
  const [searchField, setSearchField] = useState('');
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const {
    addWarning,
    clearNotifications,
    notifications,
    addError,
  } = useNotifications();
  const filterPopoverRef = useRef<HTMLOsdsPopoverElement>(null);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    hasInconsistency,
    refresh,
    isFetching,
    isRefetching,
    isError,
  } = useInstances(projectId, {
    limit: 25,
    sort: sorting.id,
    sortOrder: sorting.desc ? 'desc' : 'asc',
    filters,
  });

  const datagridColumns: DatagridColumn<Instance>[] = useMemo(
    () => [
      {
        id: 'name',
        cell: (props: Instance) =>
          isRefetching ? (
            <OsdsSkeleton />
          ) : (
            <>
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                color={ODS_THEME_COLOR_INTENT.text}
                className={'block'}
              >
                {props.name}
              </OsdsText>
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                color={ODS_THEME_COLOR_INTENT.text}
                className={'block'}
              >
                {props.id}
              </OsdsText>
            </>
          ),
        label: t('nameId'),
        isSortable: true,
      },
      {
        id: 'region',
        cell: (props: Instance) =>
          isRefetching ? (
            <OsdsSkeleton />
          ) : (
            <DataGridTextCell>{props.region}</DataGridTextCell>
          ),
        label: t('region'),
        isSortable: false,
      },
      {
        id: 'flavor',
        cell: (props: Instance) =>
          isRefetching ? (
            <OsdsSkeleton />
          ) : (
            <DataGridTextCell>{props.flavorName}</DataGridTextCell>
          ),
        label: t('flavor'),
        isSortable: true,
      },
      {
        id: 'image',
        cell: (props: Instance) =>
          isRefetching ? (
            <OsdsSkeleton />
          ) : (
            <DataGridTextCell>{props.imageName}</DataGridTextCell>
          ),
        label: t('image'),
        isSortable: true,
      },
      {
        id: 'publicIPs',
        cell: (props: Instance) =>
          isRefetching ? (
            <OsdsSkeleton />
          ) : (
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              <ul>
                {props.addresses.get('public')?.map((item) => (
                  <li className={'w-fit'} key={item.ip}>
                    {item.ip}
                  </li>
                ))}
              </ul>
            </OsdsText>
          ),
        label: t('publicIPs'),
        isSortable: false,
      },
      {
        id: 'privateIPs',
        cell: (props: Instance) =>
          isRefetching ? (
            <OsdsSkeleton />
          ) : (
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              <ul>
                {props.addresses.get('private')?.map((item) => (
                  <li className={'w-fit'} key={item.ip}>
                    {item.ip}
                  </li>
                ))}
              </ul>
            </OsdsText>
          ),
        label: t('privateIPs'),
        isSortable: false,
      },
      {
        id: 'status',
        cell: (props: Instance) =>
          isRefetching ? (
            <OsdsSkeleton />
          ) : (
            <StatusChip status={props.status} />
          ),
        label: t('status'),
        isSortable: false,
      },
    ],
    [isRefetching, t],
  );

  const filterColumns = useMemo(
    () => [
      {
        id: 'name',
        label: t('nameId'),
        comparators: [FilterComparator.Includes],
      },
      {
        id: 'flavor',
        label: t('flavor'),
        comparators: [FilterComparator.Includes],
      },
      {
        id: 'image',
        label: t('image'),
        comparators: [FilterComparator.Includes],
      },
    ],
    [t],
  );

  const resetSortAndFilters = useCallback(() => {
    setSorting(initialSort);
    filters.forEach(removeFilter);
  }, [filters]);

  const handleRefresh = useCallback(() => {
    refresh();
    resetSortAndFilters();
  }, [refresh, resetSortAndFilters]);

  const errorMessage = useMemo(
    () => (
      <>
        <Trans
          t={t}
          i18nKey="unknownErrorMessage1"
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
        <Trans t={t} i18nKey="unknownErrorMessage2" />
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
    if (data && !filters.length && !data.length && !isFetching)
      navigate(`/pci/projects/${projectId}/instances/onboarding`);
  }, [data, filters.length, isFetching, navigate, projectId]);

  useEffect(() => {
    if (hasInconsistency) addWarning(t('inconsistencyMessage'), true);
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

  if (isLoading) return <Spinner />;

  return (
    <>
      {project && (
        <OsdsBreadcrumb
          items={[
            {
              href: '/',
              label: project.description,
            },
            {
              label: 'Instances',
            },
          ]}
        />
      )}
      <div className="header mb-6 mt-8">
        <div className="flex items-center justify-between">
          <Title>{t('instancesTitle')}</Title>
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
          >
            <span slot="start" className="flex items-center">
              <OsdsIcon
                name={ODS_ICON_NAME.ADD}
                size={ODS_ICON_SIZE.xxs}
                color={ODS_THEME_COLOR_INTENT.primary}
                className="mr-4"
              />
              <span>{t('createInstance')}</span>
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
                {...((filters.length > 0 || isFetching) && { disabled: true })}
              >
                <OsdsIcon
                  name={ODS_ICON_NAME.FILTER}
                  size={ODS_ICON_SIZE.xs}
                  className={'mr-2'}
                  color={ODS_THEME_COLOR_INTENT.primary}
                />
                {t('filter')}
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
            />
          </div>
        )}
        {isFetchingNextPage && (
          <div className="mt-5">
            <Spinner />
          </div>
        )}
      </div>
    </>
  );
};

export default Instances;
