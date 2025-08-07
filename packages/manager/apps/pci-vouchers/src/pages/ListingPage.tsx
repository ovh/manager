import { Outlet, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ChangelogButton,
  Datagrid,
  Headers,
  Notifications,
  PciGuidesHeader,
  useDatagridSearchParams,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Message,
  Spinner,
} from '@ovhcloud/ods-react';

import {
  isDiscoveryProject,
  PciDiscoveryBanner,
  useProject,
} from '@ovh-ux/manager-pci-common';
import { useVouchers } from '@/api/hooks/useVouchers';
import { useDatagridColumn } from '@/hooks/UseDatagridColumn';
import { CHANGELOG_LINKS } from '@/constants';
import { CHANGELOG_CHAPTERS } from '@/tracking.constants';

export default function ListingPage() {
  const { t } = useTranslation('common');
  const { t: tError } = useTranslation('error');
  const navigate = useNavigate();

  const { projectId } = useParams();
  const projectUrl = useProjectUrl('public-cloud');

  const { data: project } = useProject(projectId || '');
  const columns = useDatagridColumn();

  const {
    pagination,
    setPagination,
    sorting,
    setSorting,
  } = useDatagridSearchParams();

  const { error, data: vouchers, isLoading } = useVouchers(projectId || '', {
    pagination,
    sorting,
  });

  return (
    <>
      {project && (
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href={projectUrl}>
              {project.description}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">
              {t('cpb_project_management_credit_vouchers')}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      )}
      <div className="mt-4">
        <Headers
          title={t('cpb_project_management_credit_vouchers')}
          changelogButton={
            <ChangelogButton
              links={CHANGELOG_LINKS}
              chapters={CHANGELOG_CHAPTERS}
            />
          }
          headerButton={<PciGuidesHeader category="storage" />}
        />
      </div>
      <Notifications />
      <Headers description={t('cpb_vouchers_add_explain_bis')} />
      <Headers description={t('cpb_vouchers_credit_comment')} />

      <PciDiscoveryBanner project={project} />

      <div className="flex mb-3 mt-6">
        <Button
          className="mr-1"
          size="sm"
          variant="outline"
          color="primary"
          onClick={() => navigate('./add')}
          disabled={isDiscoveryProject(project)}
        >
          {t('cpb_vouchers_add_button')}
        </Button>
        <Button
          size="sm"
          variant="outline"
          color="primary"
          className="ml-0.5"
          onClick={() => navigate('./credit/buy')}
          disabled={isDiscoveryProject(project)}
        >
          {t('cpb_vouchers_add_credit_button')}
        </Button>
      </div>

      {error && (
        <Message className="mt-4" color="critical">
          {tError('manager_error_page_default')}
        </Message>
      )}

      {isLoading && !error && (
        <div className="text-center mt-8">
          <Spinner size="md" data-testid="ListingPage-spinner" />
        </div>
      )}

      {!isLoading && !error && (
        <div className="mt-8">
          <Datagrid
            columns={columns}
            items={vouchers?.rows || []}
            totalItems={vouchers?.totalRows || 0}
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
