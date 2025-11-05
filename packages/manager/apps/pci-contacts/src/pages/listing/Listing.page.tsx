import { Suspense, useContext, useEffect, useState } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
  OdsButton,
  OdsLink,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Region } from '@ovh-ux/manager-config';
import { PciDiscoveryBanner, isDiscoveryProject, useProject } from '@ovh-ux/manager-pci-common';
import {
  BaseLayout,
  ChangelogButton,
  Datagrid,
  Notifications,
  PciGuidesHeader,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { ShellContext, ShellContextType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { ProjectValidationGuard } from '@/components/ProjectValidationGuard';
import { ROADMAP_CHANGELOG_LINKS } from '@/constants';
import { useProjectAcl, useProjectAclAccountsInfo } from '@/data/hooks/useAcl';
import { useProjectService } from '@/data/hooks/useServices';
import { TService } from '@/data/types/service.type';
import { usePaginatedItems } from '@/hooks/usePaginatedItems';
import { useParam } from '@/hooks/useParam';
import { urls } from '@/routes/routes.constant';
import { CONTACTS_TRACKING } from '@/tracking.constant';

import { getDatagridColumns } from './datagrid-columns';

const CONTACTS_DATAGRID_PAGINATION = 10;

const useGetContactsPageHref = (context: ShellContextType, serviceInfo: TService | undefined) => {
  const [contactsPageHref, setContactsPageHref] = useState('#');
  useEffect(() => {
    if (!serviceInfo || !serviceInfo.domain) {
      return;
    }
    context?.shell?.navigation
      .getURL('dedicated', '#/contacts/services', {
        tab: 'SERVICES',
        serviceName: serviceInfo.domain,
      })
      .then((url) => setContactsPageHref(url as string));
  }, [context, serviceInfo]);
  return contactsPageHref;
};

export default function ListingPage() {
  const { t } = useTranslation(['contacts', NAMESPACES.FORM]);
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();
  const hrefProject = useProjectUrl('public-cloud');
  const context = useContext(ShellContext);
  if (!context.environment) {
    throw new Error('Shell.context.environment could not be found.');
  }
  const user = context.environment.getUser();
  const projectId = useParam('projectId');
  const { data: project } = useProject();
  const { data: serviceInfo } = useProjectService(projectId);
  const { data: aclAccountIds } = useProjectAcl(projectId);
  const userAcls = useProjectAclAccountsInfo(projectId, aclAccountIds || []);
  const { flattenData, hasNextPage, fetchNextPage } = usePaginatedItems(
    userAcls || [],
    CONTACTS_DATAGRID_PAGINATION,
  );
  const columns = getDatagridColumns(t);
  const isAdmin = serviceInfo && user.nichandle === serviceInfo.contactAdmin;
  const onEditContactClick = (type: 'admin' | 'billing') => {
    trackClick({
      actionType: 'action',
      actions:
        type === 'admin'
          ? CONTACTS_TRACKING.LISTING.EDIT_ADMIN_CONTACT
          : CONTACTS_TRACKING.LISTING.EDIT_BILLING_CONTACT,
    });
  };
  const openAddContactModal = () => {
    trackClick({
      actionType: 'action',
      actions: CONTACTS_TRACKING.LISTING.ADD_CONTACT,
    });
    navigate(`./${urls.add}`);
  };
  const isEuRegion = context.environment.getRegion() === Region.EU;
  const discoveryProject = isDiscoveryProject(project);
  const canChangeContacts = isEuRegion && !discoveryProject;
  const contactsPageHref = useGetContactsPageHref(context, serviceInfo);

  if (!project || !serviceInfo || !userAcls) {
    return (
      <ProjectValidationGuard>
        <OdsSpinner size="md" />
      </ProjectValidationGuard>
    );
  }

  return (
    <ProjectValidationGuard>
      <BaseLayout
        header={{
          title: t('pci_projects_project_contacts_title'),
          changelogButton: <ChangelogButton links={ROADMAP_CHANGELOG_LINKS} />,
          headerButton: <PciGuidesHeader category="instances" />,
        }}
        breadcrumb={
          <OdsBreadcrumb>
            <OdsBreadcrumbItem href={hrefProject} label={project.description} />
            <OdsBreadcrumbItem href={'#'} label={t('pci_projects_project_contacts_title')} />
          </OdsBreadcrumb>
        }
      >
        <div className="flex flex-col gap-4 mb-8">
          <PciDiscoveryBanner project={project} />
          <Notifications />
          <div className="contacts-card">
            <div className="row">
              <OdsText className="contacts-card-info text-right">{t('cpb_rights_owner')}</OdsText>
              <OdsText className="contacts-card-info text-left">{serviceInfo.contactAdmin}</OdsText>
              <div className="contacts-card-info">
                {canChangeContacts && (
                  <OdsLink
                    href={contactsPageHref}
                    label={t('cpb_rights_modify')}
                    icon={ODS_ICON_NAME.externalLink}
                    onClick={() => onEditContactClick('admin')}
                    target="_blank"
                  />
                )}
              </div>
            </div>
            <div className="row mt-4">
              <OdsText className="contacts-card-info text-right">
                {t('cpb_rights_billing_contact')}
              </OdsText>
              <OdsText className="contacts-card-info text-left">
                {serviceInfo.contactBilling}
              </OdsText>
              <div className="contacts-card-info">
                {canChangeContacts && (
                  <OdsLink
                    href={contactsPageHref}
                    label={t('cpb_rights_modify')}
                    icon={ODS_ICON_NAME.externalLink}
                    onClick={() => onEditContactClick('billing')}
                    target="_blank"
                  />
                )}
              </div>
            </div>
          </div>
          <OdsText>{t('cpb_rights_expl2')}</OdsText>
          <OdsText>{t('cpb_rights_note')}</OdsText>

          {isAdmin && (
            <OdsButton
              className="my-8 size-fit"
              label={t('common_add')}
              icon="plus"
              color={ODS_BUTTON_COLOR.primary}
              variant={ODS_BUTTON_VARIANT.default}
              onClick={openAddContactModal}
              isDisabled={discoveryProject}
            />
          )}

          <Datagrid
            columns={columns}
            items={flattenData}
            totalItems={userAcls.length}
            hasNextPage={hasNextPage}
            onFetchNextPage={fetchNextPage}
          />
        </div>

        <Suspense>
          <Outlet />
        </Suspense>
      </BaseLayout>
    </ProjectValidationGuard>
  );
}
