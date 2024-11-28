import { useEffect, useRef, useState } from 'react';
import { Outlet, useHref, useParams, useNavigate } from 'react-router-dom';
import {
  OsdsBreadcrumb,
  OsdsButton,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsDivider,
  OsdsIcon,
  OsdsSearchBar,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

import { useNavigation } from '@ovh-ux/manager-react-shell-client';

import { useTranslation } from 'react-i18next';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import { FilterComparator, FilterCategories } from '@ovh-ux/manager-core-api';
import {
  Notifications,
  Datagrid,
  PciGuidesHeader,
  DataGridTextCell,
  useColumnFilters,
  FilterList,
  FilterAdd,
  useDataGrid,
  Headers,
} from '@ovh-ux/manager-react-components';
import { PciDiscoveryBanner, useProject } from '@ovh-ux/manager-pci-common';
import { useUsers } from '@/api/hooks/useUser';
import { User } from '@/interface';
import Roles from './Roles';
import CreationDate from './CreationDate';
import Status from './Status';
import Actions from './Actions';
import RolesMatrix from './components/RolesMatrix/Index';
import { useAllRoles } from '@/api/hooks/useRole';

export default function ListingPage() {
  const { t } = useTranslation('common');
  const { t: tFilter } = useTranslation('filter');
  const navigation = useNavigation();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [urlProject, setUrlProject] = useState('');
  const [searchField, setSearchField] = useState('');
  const { data: project } = useProject();
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const filterPopoverRef = useRef(undefined);

  const { data: rolesAndServices } = useAllRoles(`${projectId}`);

  useEffect(() => {
    navigation
      .getURL('public-cloud', `#/pci/projects/${projectId}`, {})
      .then((data) => {
        setUrlProject(data as string);
      });
  }, [projectId, navigation]);

  const columns = [
    {
      id: 'username',
      cell: (props: User) => {
        return <DataGridTextCell>{props.username}</DataGridTextCell>;
      },
      label: t('pci_projects_project_users_username_label'),
    },
    {
      id: 'description',
      cell: (props: User) => {
        return <DataGridTextCell>{props.description}</DataGridTextCell>;
      },
      label: t('pci_projects_project_users_description_label'),
    },
    {
      id: 'roles',
      cell: (props: User) => {
        return <Roles roles={props.roles || []} />;
      },
      label: t('pci_projects_project_users_role_label'),
    },
    {
      id: 'creationDate',
      cell: (props: User) => {
        return <CreationDate date={props.creationDate} />;
      },
      label: t('pci_projects_project_users_createdAt_label'),
    },
    {
      id: 'status',
      cell: (props: User) => {
        return <Status status={props.status} />;
      },
      label: t('pci_projects_project_users_status_label'),
    },
    {
      id: 'actions',
      cell: (props: User) => {
        return (
          <div className="text-center">
            <Actions user={props} />
          </div>
        );
      },
      label: t(''),
    },
  ];

  const { pagination, setPagination, sorting, setSorting } = useDataGrid();

  const { error, data: users, isLoading } = useUsers(
    projectId || '',
    {
      pagination,
      sorting,
    },
    filters,
  );

  const hrefAdd = useHref(`./new`);

  useEffect(() => {
    if (
      !isLoading &&
      !filters.length &&
      pagination.pageIndex === 0 &&
      !users.totalRows
    ) {
      navigate(`/pci/projects/${projectId}/users/onboarding`);
    }
  }, [isLoading, users, navigate, filters, pagination]);

  return (
    <>
      {project && (
        <OsdsBreadcrumb
          items={[
            {
              href: urlProject,
              label: project.description,
            },
            {
              label: t('pci_projects_project_users_title'),
            },
          ]}
        ></OsdsBreadcrumb>
      )}

      <div className="header mt-8">
        <Headers
          title={t('pci_projects_project_users_title')}
          headerButton={
            <div className="min-w-[7rem]">
              <PciGuidesHeader category="instances" />
            </div>
          }
        ></Headers>
      </div>

      <OsdsDivider></OsdsDivider>
      <Notifications />

      <PciDiscoveryBanner project={project} />

      <div className={'sm:flex items-center justify-between mt-4'}>
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.flat}
          color={ODS_THEME_COLOR_INTENT.primary}
          href={hrefAdd}
          className="xs:mb-0.5 sm:mb-0"
        >
          <OsdsIcon
            size={ODS_ICON_SIZE.xs}
            name={ODS_ICON_NAME.PLUS}
            className={'mr-4 bg-white'}
            color={ODS_THEME_COLOR_INTENT.primary}
          />
          {t('pci_projects_project_users_add_label')}
        </OsdsButton>
        <div className="justify-between flex">
          <OsdsSearchBar
            className={'w-[70%]'}
            value={searchField}
            onOdsSearchSubmit={({ detail }) => {
              setPagination({
                pageIndex: 0,
                pageSize: pagination.pageSize,
              });
              addFilter({
                key: 'username',
                value: detail.inputValue,
                comparator: FilterComparator.Includes,
                label: t('pci_projects_project_users_username_label'),
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
                className={'mr-2'}
                color={ODS_THEME_COLOR_INTENT.primary}
              />
              {tFilter('common_criteria_adder_filter_label')}
            </OsdsButton>
            <OsdsPopoverContent>
              <FilterAdd
                columns={[
                  {
                    id: 'username',
                    label: t('pci_projects_project_users_username_label'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'description',
                    label: t('pci_projects_project_users_description_label'),
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
          <OsdsSpinner inline={true} size={ODS_SPINNER_SIZE.md} />
        </div>
      )}

      {!isLoading && !error && (
        <div className="mt-8">
          <Datagrid
            columns={columns}
            items={users?.rows || []}
            totalItems={users?.totalRows || 0}
            pagination={pagination}
            onPaginationChange={setPagination}
            sorting={sorting}
            onSortChange={setSorting}
          />
        </div>
      )}
      <Outlet />
      <RolesMatrix
        roles={rolesAndServices?.roles || []}
        services={rolesAndServices?.services || []}
      />
    </>
  );
}
