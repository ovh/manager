import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';
import { useProject, isDiscoveryProject } from '@ovh-ux/manager-pci-common';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import {
  BaseLayout,
  Notifications,
  ChangelogButton,
  PciGuidesHeader,
  Datagrid,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
  OdsSpinner,
  OdsText,
  OdsButton,
  OdsLink,
} from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useProjectService } from '@/data/hooks/useServices';
import { useProjectAcl, useProjectAclAccountsInfo } from '@/data/hooks/useAcl';
import { getDatagridColumns } from './datagrid-columns';
import { AccountAcl } from '@/data/api/acl';
import { urls } from '@/routes/routes.constant';
import { ROADMAP_CHANGELOG_LINKS } from '@/constants';
import { TService } from '@/data/types/service.type';
import { usePaginatedItems } from '@/hooks/usePaginatedItems';
import { useParam } from '@/hooks/useParam';

const CONTACTS_DATAGRID_PAGINATION = 10;

const useGetContactsPageHref = (
  context: ShellContextType,
  serviceInfo: TService | undefined,
) => {
  const [contactsPageHref, setContactsPageHref] = useState('#');
  useEffect(() => {
    if (!serviceInfo) {
      return;
    }
    context.shell.navigation
      .getURL('dedicated', '#/contacts/services', {
        tab: 'SERVICES',
        serviceName: serviceInfo.serviceId,
      })
      .then((url) => setContactsPageHref(url as string));
  }, [context, serviceInfo]);
  return contactsPageHref;
};

export default function ContactsPage() {
  const { t } = useTranslation(['contacts']);
  const navigate = useNavigate();
  const hrefProject = useProjectUrl('public-cloud');
  const context = useContext(ShellContext);
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
  const openAddContactModal = () => {
    navigate(`./${urls.contactAndRightsAdd}`);
  };
  const isEuRegion = context.environment.getRegion() === 'EU';
  const discoveryProject = isDiscoveryProject(project);
  const canChangeContacts = isEuRegion && !discoveryProject;
  const contactsPageHref = useGetContactsPageHref(context, serviceInfo);

  if (!project || !serviceInfo || !userAcls) {
    return <OdsSpinner size="md" />;
  }

  return (
    <BaseLayout
      header={{
        title: t('pci_projects_project_contacts_title'),
        changelogButton: <ChangelogButton links={ROADMAP_CHANGELOG_LINKS} />,
        headerButton: <PciGuidesHeader category="instances" />,
      }}
      breadcrumb={
        <OdsBreadcrumb>
          <OdsBreadcrumbItem href={hrefProject} label={project.description} />
          <OdsBreadcrumbItem
            href={'#'}
            label={t('pci_projects_project_contacts_title')}
          />
        </OdsBreadcrumb>
      }
    >
      <div className="flex flex-col gap-4 mb-8">
        <Notifications />
        <div className="contacts-card">
          <div className="row">
            <OdsText className="contacts-card-info text-right">
              {t('cpb_rights_owner')}
            </OdsText>
            <OdsText className="contacts-card-info text-left">
              {serviceInfo.contactAdmin}
            </OdsText>
            <div className="contacts-card-info">
              {canChangeContacts && (
                <OdsLink
                  href={contactsPageHref}
                  label={t('cpb_rights_modify')}
                  icon={ODS_ICON_NAME.externalLink}
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
            className="my-8"
            label={t('common_add')}
            variant={ODS_BUTTON_VARIANT.outline}
            onClick={openAddContactModal}
          />
        )}

        <Datagrid
          columns={columns}
          items={flattenData as AccountAcl[]}
          totalItems={userAcls.length}
          hasNextPage={hasNextPage}
          onFetchNextPage={fetchNextPage}
        />
      </div>

      <Outlet />
    </BaseLayout>
  );
}
