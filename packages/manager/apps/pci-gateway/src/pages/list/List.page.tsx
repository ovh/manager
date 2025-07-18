import {
  ChangelogButton,
  Datagrid,
  FilterAdd,
  FilterList,
  Headers,
  Notifications,
  PciGuidesHeader,
  useColumnFilters,
  useDataGrid,
  useProjectUrl,
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
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useContext, useEffect, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Outlet, useHref, useParams } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import { FilterCategories, FilterComparator } from '@ovh-ux/manager-core-api';
import { PciDiscoveryBanner, useProject } from '@ovh-ux/manager-pci-common';
import { useAggregatedGateway } from '@/api/hooks/useGateway';
import ListGuard from '@/pages/list/ListGuard';
import { useDatagridColumn } from '@/hooks/useDatagridColumn';
import HidePreloader from '@/core/HidePreloader';
import { CHANGELOG_CHAPTERS } from '@/tracking.constants';
import { CHANGELOG_LINKS } from '@/constants';

export default function ListingPage() {
  const { t } = useTranslation('common');
  const { t: tFilter } = useTranslation('filter');
  const projectUrl = useProjectUrl('public-cloud');

  const hrefAdd = useHref(`./new`);

  const { tracking } = useContext(ShellContext).shell;
  const { projectId } = useParams();
  const [searchField, setSearchField] = useState('');
  const { data: project } = useProject();
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const filterPopoverRef = useRef(undefined);

  const { pagination, setPagination } = useDataGrid();

  const columns = useDatagridColumn();
  const {
    data: aggregatedGateways,
    isLoading: isGatewayLoading,
    isPending: isGatewayPending,
    error,
  } = useAggregatedGateway(
    projectId,
    {
      pagination,
    },
    filters,
  );
  const isLoading = isGatewayLoading || isGatewayPending;
  return (
    <ListGuard projectId={projectId}>
      <>
        <HidePreloader />
        {project && (
          <OsdsBreadcrumb
            items={[
              {
                href: projectUrl,
                label: project.description,
              },
              {
                label: t('pci_projects_project_public_gateway_title'),
              },
            ]}
          />
        )}
        <div className="header mb-6 mt-8">
          <Headers
            title={t('pci_projects_project_public_gateway_title')}
            description={t('pci_projects_project_public_gateways_intro_part_1')}
            headerButton={<PciGuidesHeader category="instances" />}
            changelogButton={
              <ChangelogButton
                links={CHANGELOG_LINKS}
                chapters={CHANGELOG_CHAPTERS}
              />
            }
          />
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          >
            <ul>
              <li>{t('pci_projects_project_public_gateways_intro_part_2')}</li>
              <li>{t('pci_projects_project_public_gateways_intro_part_3')}</li>
            </ul>
          </OsdsText>
        </div>

        <OsdsDivider></OsdsDivider>
        <Notifications />
        <div className="mb-5">
          <PciDiscoveryBanner project={project} />
        </div>
        <div className="sm:flex items-center justify-between mt-4">
          <OsdsButton
            size={ODS_BUTTON_SIZE.sm}
            variant={ODS_BUTTON_VARIANT.flat}
            color={ODS_THEME_COLOR_INTENT.primary}
            className="xs:mb-0.5 sm:mb-0"
            href={hrefAdd}
            onClick={() => {
              tracking.trackClick({
                name: 'PCI_PROJECTS_PUBLIC_GATEWAY_ADD',
                type: 'action',
              });
            }}
          >
            <OsdsIcon
              size={ODS_ICON_SIZE.xs}
              name={ODS_ICON_NAME.PLUS}
              className="mr-2 bg-white"
              color={ODS_THEME_COLOR_INTENT.primary}
            />
            {t('pci_projects_project_public_gateway_create')}
          </OsdsButton>
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
                  key: 'search',
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
                      label: t('pci_projects_project_public_gateway_name'),
                      comparators: FilterCategories.String,
                    },
                    {
                      id: 'region',
                      label: t('pci_projects_project_public_gateway_region'),
                      comparators: FilterCategories.String,
                    },
                    {
                      id: 'formattedIps',
                      label: t('pci_projects_project_public_gateway_public_ip'),
                      comparators: FilterCategories.String,
                    },
                    {
                      id: 'model',
                      label: t('pci_projects_project_public_gateway_flavour'),
                      comparators: FilterCategories.String,
                    },
                    {
                      id: 'status',
                      label: t('pci_projects_project_public_gateway_status'),
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
        {isLoading && (
          <div className="text-center">
            <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
          </div>
        )}

        {!isLoading && !error && (
          <div className="mt-8">
            <Datagrid
              columns={columns}
              items={aggregatedGateways?.rows || []}
              totalItems={aggregatedGateways?.totalRows || 0}
              pagination={pagination}
              onPaginationChange={setPagination}
              className="overflow-x-visible"
            />
          </div>
        )}
        <Outlet />
      </>
    </ListGuard>
  );
}
