import { useMemo } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';

import { ActionMenu, ActionMenuItem } from '@ovh-ux/manager-react-components';

import { useWebHostingWebsite } from '@/data/hooks/webHosting/webHostingWebsite/useWebHostingWebsite';
import {
  WebHostingWebsiteDomainType,
  WebHostingWebsiteType,
} from '@/data/types/product/webHosting';
import { GitStatus, ServiceStatus } from '@/data/types/status';
import { subRoutes, urls } from '@/routes/routes.constants';

interface ActionButtonMultisiteProps {
  context: 'site' | 'domain';
  siteId?: number;
  domainId?: number;
  site?: string;
  domain?: string;
  path?: string;
  domains?: WebHostingWebsiteDomainType[];
}

const ActionButtonMultisite: React.FC<ActionButtonMultisiteProps> = ({
  context,
  siteId,
  domainId,
  domain,
  path,
  domains,
}: ActionButtonMultisiteProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const { serviceName } = useParams();

  const { data: websites = [] } = useWebHostingWebsite(serviceName) as {
    data?: WebHostingWebsiteType[];
    isLoading: boolean;
  };

  const actionCondition = (
    condition: boolean,
    action: Omit<ActionMenuItem, 'id'> & { id: number },
  ): ActionMenuItem | null => (condition ? action : null);
  const allActions: ActionMenuItem[] = useMemo(() => {
    if (context === 'site') {
      const website = websites.find((w) => w.id === siteId);
      const vcsStatus = website?.currentState?.git?.status;

      const hasModule = !!website?.currentState?.module?.name;

      const canAssociateGit = [GitStatus.DISABLED, GitStatus.INITIALERROR].includes(
        vcsStatus ?? GitStatus.DISABLED,
      );

      const canConfigureGit = [GitStatus.CREATED, GitStatus.ERROR, GitStatus.DEPLOYING].includes(
        vcsStatus ?? GitStatus.DISABLED,
      );

      const canDeployGit = [GitStatus.CREATED, GitStatus.ERROR].includes(
        vcsStatus ?? GitStatus.DISABLED,
      );

      const canViewLastDeploymentGit = [
        GitStatus.CREATED,
        GitStatus.ERROR,
        GitStatus.INITIALERROR,
        GitStatus.DEPLOYING,
        GitStatus.DELETING,
      ].includes(vcsStatus ?? GitStatus.DISABLED);

      const siteActions: ActionMenuItem[] = [
        {
          id: 1,
          onClick: () => navigate(urls.addDomain.replace(subRoutes.serviceName, serviceName)),
          label: t('add_domain'),
        },
        actionCondition(!hasModule, {
          id: 2,
          onClick: () => navigate(urls.addModule.replace(subRoutes.serviceName, serviceName)),
          label: t('add_module'),
        }),
        actionCondition(hasModule, {
          id: 3,
          onClick: () =>
            navigate(
              urls.deleteModule
                .replace(subRoutes.serviceName, serviceName)
                .replace(subRoutes.path, path ?? ''),
            ),
          label: t('delete_module'),
        }),
        actionCondition(hasModule, {
          id: 4,
          onClick: () => {},
          label: t('access_interface'),
        }),
        {
          id: 5,
          onClick: () => {},
          label: t('access_website'),
        },
        actionCondition(canAssociateGit, {
          id: 6,
          onClick: () =>
            navigate(
              urls.associateGit
                .replace(subRoutes.serviceName, serviceName)
                .replace(subRoutes.path, path ?? ''),
            ),
          label: t('associate_git'),
        }),
        actionCondition(canConfigureGit, {
          id: 7,
          onClick: () =>
            navigate(
              urls.configureGit
                .replace(subRoutes.serviceName, serviceName)
                .replace(subRoutes.path, path ?? ''),
            ),
          label: t('configure_git'),
        }),
        actionCondition(canDeployGit, {
          id: 8,
          onClick: () =>
            navigate(
              urls.deployeGit
                .replace(subRoutes.serviceName, serviceName)
                .replace(subRoutes.path, path ?? ''),
            ),
          label: t('deploye_git'),
        }),
        actionCondition(canViewLastDeploymentGit, {
          id: 9,
          onClick: () =>
            navigate(
              urls.lastDeploymentGit
                .replace(subRoutes.serviceName, serviceName)
                .replace(subRoutes.path, path ?? ''),
            ),
          label: t('last_deployment_git'),
        }),
      ].filter(Boolean);

      return siteActions;
    } else {
      const currentDomain = domains?.find((d) => d.id === domainId);
      const canAccesscdn = currentDomain?.currentState?.cdn.status !== ServiceStatus.NONE;

      const domainActions: ActionMenuItem[] = [
        {
          id: 10,
          onClick: () =>
            navigate(
              urls.modifyDomain
                .replace(subRoutes.serviceName, serviceName)
                .replace(subRoutes.domain, domain ?? ''),
            ),
          label: t('modify_domain'),
        },
        {
          id: 11,
          onClick: () =>
            navigate(
              urls.detacheDomain
                .replace(subRoutes.serviceName, serviceName)
                .replace(subRoutes.domain, domain ?? ''),
            ),
          label: t('detache_domain'),
        },
        actionCondition(canAccesscdn, {
          id: 12,
          onClick: () =>
            navigate(
              urls.modifyCdn
                .replace(subRoutes.serviceName, serviceName)
                .replace(subRoutes.domain, domain ?? ''),
            ),
          label: t('modify_cdn'),
        }),
        actionCondition(canAccesscdn, {
          id: 13,
          onClick: () =>
            navigate(
              urls.purgeCdn
                .replace(subRoutes.serviceName, serviceName)
                .replace(subRoutes.domain, domain ?? ''),
            ),
          label: t('purge_cdn'),
        }),
      ].filter(Boolean);

      return domainActions;
    }
  }, [context, domains, t, websites, siteId, navigate, serviceName, path, domainId, domain]);

  return (
    <ActionMenu
      id={`actions-${context}-${siteId ?? domainId}`}
      items={allActions}
      isCompact
      variant={ODS_BUTTON_VARIANT.ghost}
    />
  );
};

export default ActionButtonMultisite;
