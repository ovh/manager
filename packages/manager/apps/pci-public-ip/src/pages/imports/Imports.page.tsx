import { useEffect, useState } from 'react';
import { Outlet, useHref, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useNavigation } from '@ovh-ux/manager-react-shell-client';

import {
  Datagrid,
  DataGridTextCell,
  useDatagridSearchParams,
} from '@ovhcloud/manager-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_MESSAGE_TYPE, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import {
  OsdsBreadcrumb,
  OsdsMessage,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';

import { ImportsIP } from '@/interface';
import { ImportIPAction } from '@/components/imports/ImportIPAction';
import useProject from '@/api/hooks/useProject';
import { useGetImportsIPs } from '@/api/hooks/useImportIP';

export default function ImportsPage(): JSX.Element {
  const { t } = useTranslation(['imports', 'common']);
  const [projectUrl, setProjectUrl] = useState('');

  const navigation = useNavigation();
  const { projectId } = useParams();
  const { data: project } = useProject(projectId || '');

  const hrefPublicIps = useHref('..');

  const { pagination, setPagination } = useDatagridSearchParams();

  useEffect(() => {
    navigation
      .getURL('public-cloud', `#/pci/projects/${projectId}`, {})
      .then((data) => {
        setProjectUrl(data as string);
      });
  }, [projectId, navigation]);

  const { error, data: importsIPs, isLoading } = useGetImportsIPs(
    projectId || '',
    {
      pagination,
    },
  );

  const columns = [
    {
      id: 'ip',
      cell: (props: ImportsIP) => (
        <DataGridTextCell> {props.ip}</DataGridTextCell>
      ),
      label: t('pci_additional_ips_failoverip_imports_block'),
    },
    {
      id: 'country',
      cell: (props: ImportsIP) => (
        <DataGridTextCell>{props.country?.toUpperCase()}</DataGridTextCell>
      ),
      label: t('pci_additional_ips_failoverip_imports_geoloc'),
    },
    {
      id: 'routed-to',
      cell: (props: ImportsIP) => (
        <DataGridTextCell>{props.routedTo?.serviceName}</DataGridTextCell>
      ),
      label: t('pci_additional_ips_failoverip_imports_id'),
    },
    {
      id: 'actions',
      cell: (props: ImportsIP) => <ImportIPAction ip={props.ip} />,
      label: '',
    },
  ];

  return (
    <>
      {project && (
        <OsdsBreadcrumb
          items={[
            {
              href: projectUrl,
              label: project.description,
            },
            {
              href: hrefPublicIps,
              label: t('pci_additional_ips_title', { ns: 'common' }),
            },
            {
              label: t('pci_additional_ips_failoverip_imports_title'),
            },
          ]}
        />
      )}
      <div className="header mb-10 mt-8">
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
          size={ODS_THEME_TYPOGRAPHY_SIZE._600}
          color={ODS_THEME_COLOR_INTENT.primary}
        >
          {t('pci_additional_ips_failoverip_imports_title')}
        </OsdsText>
      </div>

      {error && (
        <OsdsMessage className="mt-4" type={ODS_MESSAGE_TYPE.error}>
          {t('manager_error_page_default')}
        </OsdsMessage>
      )}

      {isLoading && !error && (
        <div className="text-center">
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
        </div>
      )}

      {!isLoading && !error && (
        <div className="mt-8">
          <Datagrid
            columns={columns}
            items={importsIPs.rows || []}
            totalItems={importsIPs.totalRows || 0}
            pagination={pagination}
            onPaginationChange={setPagination}
          />
        </div>
      )}
      <Outlet />
    </>
  );
}
