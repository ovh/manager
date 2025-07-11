import { FilterCategories, FilterComparator } from '@ovh-ux/manager-core-api';
import { useProject } from '@ovh-ux/manager-pci-common';
import {
  ChangelogButton,
  Datagrid,
  FilterAdd,
  FilterList,
  Headers,
  Notifications,
  PciGuidesHeader,
  RedirectionGuard,
  useColumnFilters,
  useDataGrid,
  useNotifications,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  Button,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Spinner,
  SPINNER_SIZE,
  BUTTON_COLOR,
} from '@ovhcloud/ods-react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsBreadcrumb,
  OsdsButton,
  OsdsIcon,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSearchBar,
} from '@ovhcloud/ods-components/react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useKubes } from '@/api/hooks/useKubernetes';
import { useDatagridColumn } from './useDatagridColumn';
import { CHANGELOG_CHAPTERS } from '@/tracking.constants';
import { CHANGELOG_LINKS } from '@/constants';

export default function ListPage() {
  const { t } = useTranslation('listing');
  const { t: tFilter } = useTranslation('filter');

  const { projectId } = useParams();
  const { data: project } = useProject();
  const hrefProject = useProjectUrl('public-cloud');
  const { pagination, setPagination } = useDataGrid();
  const columns = useDatagridColumn();
  const navigate = useNavigate();
  const { clearNotifications } = useNotifications();
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const [searchField, setSearchField] = useState('');
  const filterPopoverRef = useRef(undefined);

  const { data: allKube, isPending } = useKubes(projectId, pagination, filters);

  return (
    <RedirectionGuard
      isLoading={isPending}
      condition={!isPending && allKube.rows?.length === 0 && !filters?.length}
      route={`/pci/projects/${projectId}/kubernetes/onboarding`}
    >
      {project && (
        <OsdsBreadcrumb
          items={[
            {
              href: hrefProject,
              label: project.description,
            },
            {
              label: t('kube_list_title'),
            },
          ]}
        />
      )}

      <div className="header mt-8">
        <Headers
          title={t('kube_list_title')}
          headerButton={
            <>
              <div className="min-w-[7rem]">
                <PciGuidesHeader category="kubernetes" />
              </div>
            </>
          }
          changelogButton={
            <ChangelogButton
              links={CHANGELOG_LINKS}
              chapters={CHANGELOG_CHAPTERS}
            />
          }
        />
      </div>

      <Notifications />

      <div className="sm:flex items-center justify-between mt-4">
        <Button
          color={BUTTON_COLOR.primary}
          size={BUTTON_SIZE.sm}
          variant={BUTTON_VARIANT.default}
          onClick={() => {
            clearNotifications();
            navigate('./new');
          }}
        >
          {t('kube_list_cluster_create')}
        </Button>

        <div className="justify-between flex">
          <OsdsSearchBar
            className="w-[70%]"
            value={searchField}
            onOdsSearchSubmit={({ detail }) => {
              setPagination({
                pageIndex: 0,
                pageSize: pagination.pageSize,
              });
              addFilter({
                key: 'name',
                value: detail.inputValue,
                comparator: FilterComparator.Includes,
                label: '',
              });
              setSearchField('');
            }}
          />
          <OsdsPopover ref={filterPopoverRef}>
            <OsdsButton
              slot="popover-trigger"
              size={ODS_BUTTON_SIZE.sm}
              color={ODS_THEME_COLOR_INTENT.primary}
              variant={ODS_BUTTON_VARIANT.stroked}
            >
              <OsdsIcon
                name={ODS_ICON_NAME.FILTER}
                size={ODS_ICON_SIZE.xs}
                className="mr-2"
                color={ODS_THEME_COLOR_INTENT.primary}
              />
              {tFilter('common_criteria_adder_filter_label')}
            </OsdsButton>
            <OsdsPopoverContent>
              <FilterAdd
                columns={[
                  {
                    id: 'name',
                    label: t('kube_list_name'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'id',
                    label: t('kube_list_id'),
                    comparators: FilterCategories.String,
                  },
                ]}
                onAddFilter={(addedFilter, column) => {
                  setPagination({
                    pageIndex: 0,
                    pageSize: pagination.pageSize,
                  });
                  addFilter({
                    ...addedFilter,
                    label: column.label,
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

      {isPending ? (
        <div className="text-center">
          <Spinner size={SPINNER_SIZE.md} data-testid="List-spinner" />
        </div>
      ) : (
        <div>
          <Datagrid
            columns={columns}
            items={allKube?.rows || []}
            totalItems={allKube?.totalRows || 0}
            pagination={pagination}
            onPaginationChange={setPagination}
            className="overflow-x-visible"
          />
        </div>
      )}
    </RedirectionGuard>
  );
}
