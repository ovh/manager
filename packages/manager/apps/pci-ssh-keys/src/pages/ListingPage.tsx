import { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import {
  OsdsBreadcrumb,
  OsdsButton,
  OsdsDivider,
  OsdsIcon,
  OsdsSearchBar,
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
} from '@ovhcloud/ods-components';
import { useSshKeys } from '@/hooks/useSsh';
import GuidesHeader from '@/components/guides/GuidesHeader';
import useProject from '@/hooks/useProject';
import { SshKey } from '@/interface';
import DataGridTextCell from '@/components/datagrid/DataGridTextCell';
import useDataGridParams, { PAGE_SIZES } from '@/hooks/useDataGridParams';
import DataGrid from '@/components/datagrid/DataGrid';
import Key from '@/components/ssh-keys/listing/Key';
import RemoveSsh from '@/components/ssh-keys/listing/RemoveSsh.tsx';
import Notifications from '@/components/Notifications';

export default function ListingPage() {
  const { t } = useTranslation('common');
  // const { t: tError } = useTranslation('error');

  const navigation = useNavigation();
  const { projectId } = useParams();
  const [urlProject, setUrlProject] = useState('');
  useEffect(() => {
    navigation
      .getURL('public-cloud', `#/pci/projects/${projectId}`, {})
      .then((data) => {
        setUrlProject(data as string);
      });
  }, [projectId, navigation]);

  const { data: project } = useProject(projectId || '');

  const columns = [
    {
      id: 'name',
      cell: (props: SshKey) => {
        return <DataGridTextCell>{props.name}</DataGridTextCell>;
      },
      label: t('pci_projects_project_sshKeys_name'),
    },
    {
      id: 'publicKey',
      cell: (props: SshKey) => {
        return <Key publicKey={props.publicKey} />;
      },
      label: t('pci_projects_project_sshKeys_public'),
    },
    {
      id: 'actions',
      cell: (props: SshKey) => {
        return <RemoveSsh sshId={props.id} />;
      },
      label: '',
    },
  ];

  const {
    pagination,
    setPagination,
    sorting,
    setSorting,
  } = useDataGridParams();

  const { error, data: sshKeys, isLoading } = useSshKeys(projectId || '', {
    pagination,
    sorting,
  });

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
              label: t('pci_projects_project_sshKeys_title'),
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
          {t('pci_projects_project_sshKeys_title')}
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
        >
          <OsdsIcon
            size={ODS_ICON_SIZE.xs}
            name={ODS_ICON_NAME.PLUS}
            className={'mr-2'}
            color={ODS_THEME_COLOR_INTENT.primary}
          />
          {t('pci_projects_project_sshKeys_add')}
        </OsdsButton>
        <OsdsSearchBar className={'w-2/12'} />
      </div>

      {!isLoading && !error && (
        <div className={'mt-8'}>
          <DataGrid
            columns={columns}
            items={sshKeys?.rows || []}
            totalItems={sshKeys?.totalRows || 0}
            pagination={pagination}
            pageCount={sshKeys?.pageCount || 0}
            pageSizes={PAGE_SIZES}
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
