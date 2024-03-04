import { useEffect, useState } from 'react';
import { Outlet, useHref, useParams } from 'react-router-dom';
import {
  OsdsBreadcrumb,
  OsdsButton,
  OsdsChip,
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
  ODS_CHIP_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import { Notifications } from '@ovhcloud/manager-components';
import { useUsers } from '@/hooks/useUser';
import GuidesHeader from '@/components/guides/GuidesHeader';
import useProject from '@/hooks/useProject';
import { User } from '@/interface';
import DataGridTextCell from '@/components/datagrid/DataGridTextCell';
import useDataGridParams from '@/hooks/useDataGridParams';
import DataGrid from '@/components/datagrid/DataGrid';
import Roles from '@/components/users/listing/Roles';
import CreationDate from '@/components/users/listing/CreationDate';
import Status from '@/components/users/listing/Status';
import Actions from '@/components/users/listing/Actions';

export default function ListingPage() {
  const { t } = useTranslation('common');
  const navigation = useNavigation();
  const { projectId } = useParams();
  const [urlProject, setUrlProject] = useState('');
  const [searchField, setSearchField] = useState('');
  const [searchQueries, setSearchQueries] = useState<string[]>([]);
  const { data: project } = useProject(projectId || '');

  useEffect(() => {
    navigation
      .getURL('public-cloud', `#/pci/projects/${projectId}`, {})
      .then((data) => {
        setUrlProject(data as string);
      });
  }, [projectId, navigation]);

  const columns = [
    {
      id: 'name',
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
        return <Actions user={props} />;
      },
      label: t(''),
    },
  ];

  const {
    pagination,
    setPagination,
    sorting,
    setSorting,
  } = useDataGridParams();

  const { error, data: users, isLoading } = useUsers(
    projectId || '',
    {
      pagination,
      sorting,
    },
    searchQueries,
  );

  const onPaginationChange = ({
    page,
    pageSize,
  }: {
    page: number;
    pageSize: number;
  }) => setPagination(page, pageSize);

  const onSortChange = (sorts: { id: string; desc: boolean }[]) => {
    setSorting(sorts[0].id, sorts[0].desc);
  };

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
        <GuidesHeader></GuidesHeader>
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
          className={'w-2/12'}
          value={searchField}
          onOdsSearchSubmit={({ detail }) => {
            const { inputValue } = detail;
            setSearchField('');
            if (searchQueries.indexOf(inputValue) < 0) {
              setSearchQueries([...searchQueries, inputValue]);
            } else {
              setSearchQueries([...searchQueries]);
            }
          }}
        />
      </div>

      <div className="flex mt-2">
        {searchQueries.map((query, index) => (
          <OsdsChip
            key={index}
            className="mr-2"
            color={ODS_THEME_COLOR_INTENT.primary}
            variant={ODS_CHIP_VARIANT.flat}
            removable={true}
            onOdsChipRemoval={() => {
              setSearchQueries(searchQueries.filter((_, i) => i !== index));
            }}
          >
            {query}
          </OsdsChip>
        ))}
      </div>

      {isLoading && (
        <div className="text-center">
          <OsdsSpinner inline={true} size={ODS_SPINNER_SIZE.md} />
        </div>
      )}

      {!isLoading && !error && (
        <div>
          <DataGrid
            columns={columns}
            items={users?.rows || []}
            totalItems={users?.totalRows || 0}
            pagination={pagination}
            pageCount={users?.pageCount || 0}
            onPaginationChange={onPaginationChange}
            sorting={sorting}
            onSortChange={onSortChange}
          />
        </div>
      )}
      <Outlet />
    </>
  );
}
