import { useEffect, useRef, useState } from 'react';
import {
  Outlet,
  useHref,
  useParams,
  useRouteLoaderData,
} from 'react-router-dom';
import {
  OsdsBreadcrumb,
  OsdsButton,
  OsdsDivider,
  OsdsIcon,
  OsdsSearchBar,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';

import { useNavigation } from '@ovh-ux/manager-react-shell-client';

import { useTranslation } from 'react-i18next';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import {
  Notifications,
  Datagrid,
  PciGuidesHeader,
  DataGridTextCell,
  useDatagridSearchParams,
} from '@ovhcloud/manager-components';
import { FilterComparator, FilterCategories } from '@ovh-ux/manager-core-api';
import { useUsers } from '@/hooks/useUser';
import { User } from '@/interface';
import Roles from '@/components/users/listing/Roles';
import CreationDate from '@/components/users/listing/CreationDate';
import Status from '@/components/users/listing/Status';
import Actions from '@/components/users/listing/Actions';
import { Project } from '@/data/project';
import FilterAdd from '@/components/FilterAdd';
import FilterList from '@/components/FilterList';
import useColumnFilters from '@/components/useColumnFilters';

export default function ListingPage() {
  const { t } = useTranslation('common');
  const navigation = useNavigation();
  const { projectId } = useParams();
  const [urlProject, setUrlProject] = useState('');
  const [searchField, setSearchField] = useState('');
  const project = useRouteLoaderData('users') as Project;
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const searchBar = useRef(undefined);

  useEffect(() => {
    navigation
      .getURL('public-cloud', `#/pci/projects/${projectId}`, {})
      .then((data) => {
        setUrlProject(data as string);
      });
  }, [projectId, navigation]);

  useEffect(() => {
    const onOdsValueChange = ({ detail }) => {
      setSearchField(detail.value);
    };
    searchBar.current?.addEventListener('odsValueChange', onOdsValueChange);
    return () =>
      searchBar.current?.removeEventListener(
        'odsValueChange',
        onOdsValueChange,
      );
  }, [searchBar.current]);

  const columns = [
    {
      id: 'name',
      cell: (props: User) => (
        <DataGridTextCell>{props.username}</DataGridTextCell>
      ),
      label: t('pci_projects_project_users_username_label'),
    },
    {
      id: 'description',
      cell: (props: User) => (
        <DataGridTextCell>{props.description}</DataGridTextCell>
      ),
      label: t('pci_projects_project_users_description_label'),
    },
    {
      id: 'roles',
      cell: (props: User) => <Roles roles={props.roles || []} />,
      label: t('pci_projects_project_users_role_label'),
    },
    {
      id: 'creationDate',
      cell: (props: User) => <CreationDate date={props.creationDate} />,
      label: t('pci_projects_project_users_createdAt_label'),
    },
    {
      id: 'status',
      cell: (props: User) => <Status status={props.status} />,
      label: t('pci_projects_project_users_status_label'),
    },
    {
      id: 'actions',
      cell: (props: User) => <Actions user={props} />,
      label: t(''),
    },
  ];

  const {
    pagination,
    setPagination,
    sorting,
    setSorting,
  } = useDatagridSearchParams();

  const { error, data: users, isLoading } = useUsers(
    projectId || '',
    {
      pagination,
      sorting,
    },
    filters,
  );

  const hrefAdd = useHref(`./new`);

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
      <div className={'flex items-center justify-between mt-4'}>
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
          size={ODS_THEME_TYPOGRAPHY_SIZE._600}
          color={ODS_THEME_COLOR_INTENT.primary}
        >
          {t('pci_projects_project_users_title')}
        </OsdsText>
        <PciGuidesHeader category="storage"></PciGuidesHeader>
      </div>
      <OsdsDivider></OsdsDivider>
      <Notifications />
      <div className={'flex items-center justify-between mt-4'}>
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.stroked}
          color={ODS_THEME_COLOR_INTENT.primary}
          href={hrefAdd}
        >
          <OsdsIcon
            size={ODS_ICON_SIZE.xs}
            name={ODS_ICON_NAME.PLUS}
            className={'mr-2'}
            color={ODS_THEME_COLOR_INTENT.primary}
          />
          {t('pci_projects_project_users_add_label')}
        </OsdsButton>
        <OsdsSearchBar
          ref={searchBar}
          className={'w-2/12'}
          value={searchField}
          onOdsSearchSubmit={({ detail }) => {
            addFilter({
              key: 'username',
              value: detail.inputValue,
              comparator: FilterComparator.Includes,
              label: t('pci_projects_project_users_username_label'),
            });
            setSearchField('');
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              addFilter({
                key: 'username',
                value: searchField,
                comparator: FilterComparator.Includes,
                label: t('pci_projects_project_users_username_label'),
              });
              setSearchField('');
            }
          }}
        />
      </div>

      {/* TODO put filters inside popover when ODS is fixed */}
      <div className="m-4">
        <FilterList filters={filters} onRemoveFilter={removeFilter} />
        <FilterAdd
          columns={[
            {
              id: 'username',
              label: t('pci_projects_project_users_username_label'),
              comparators: FilterCategories.String,
            },
          ]}
          onAddFilter={(addedFilter, column) => {
            setPagination({ pageIndex: 0, pageSize: pagination.pageSize });
            addFilter({
              ...addedFilter,
              label: column.label,
            });
          }}
        />
      </div>

      {isLoading && (
        <div className="text-center">
          <OsdsSpinner inline={true} size={ODS_SPINNER_SIZE.md} />
        </div>
      )}

      {!isLoading && !error && (
        <div>
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
    </>
  );
}
