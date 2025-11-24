import { useMemo } from 'react';
import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BUTTON_VARIANT } from '@ovhcloud/ods-react';

import { ActionMenu, ActionMenuItemProps } from '@ovh-ux/muk';

import { useWebHostingWebsite } from '@/data/hooks/webHosting/webHostingWebsite/useWebHostingWebsite';
import {
  WebHostingWebsiteDomainType,
  WebHostingWebsiteType,
} from '@/data/types/product/webHosting';
import { GitStatus, ServiceStatus } from '@/data/types/status';
import { useHostingUrl } from '@/hooks/useHostingUrl';
import { subRoutes, urls } from '@/routes/routes.constants';

interface ActionButtonMultisiteProps {
  context: 'site' | 'domain';
  siteId?: string;
  domainId?: string;
  site?: string;
  domain?: string;
  path?: string;
  domains?: WebHostingWebsiteDomainType[];
  isDisabled?: boolean;
}

const ActionButtonMultisite: React.FC<ActionButtonMultisiteProps> = ({
  context,
  siteId,
  site,
  domainId,
  domain,
  path,
  domains,
  isDisabled,
}: ActionButtonMultisiteProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const { serviceName } = useParams();
  const associateGitLink = useHostingUrl(
    serviceName,
    `multisite/git-association?path=${path ?? ''}`,
  );
  const configureGitLink = useHostingUrl(
    serviceName,
    `multisite/git-configuration?path=${path ?? ''}`,
  );
  const { data: websites = [] } = useWebHostingWebsite(serviceName) as {
    data?: WebHostingWebsiteType[];
    isLoading: boolean;
  };
  const actionCondition = (
    condition: boolean,
    action: Omit<ActionMenuItemProps, 'id'> & { id: number },
  ): ActionMenuItemProps | null => (condition ? action : null);
  const allActions: ActionMenuItemProps[] = useMemo(() => {
    if (context === 'site') {
      const website = websites.find((w) => w.id === siteId);
      const vcsStatus = website?.currentState?.git?.status;
      // @TODO FOR NEXT STEP
      // const hasModule = !!website?.currentState?.module?.name;

      const canAssociateGit = [GitStatus.DISABLED, GitStatus.INITIALERROR].includes(vcsStatus);

      const canConfigureGit = [GitStatus.CREATED, GitStatus.ERROR, GitStatus.DEPLOYING].includes(
        vcsStatus,
      );

      const canDeployGit = [GitStatus.CREATED, GitStatus.ERROR].includes(vcsStatus);

      const canViewLastDeploymentGit = [
        GitStatus.CREATED,
        GitStatus.ERROR,
        GitStatus.INITIALERROR,
        GitStatus.DEPLOYING,
        GitStatus.DELETING,
      ].includes(vcsStatus);

      const canDeleteGit = [
        GitStatus.CREATED,
        GitStatus.ERROR,
        GitStatus.INITIALERROR,
        GitStatus.DEPLOYING,
      ].includes(vcsStatus);

      const siteActions: ActionMenuItemProps[] = [
        {
          id: 1,
          onClick: () =>
            navigate(urls.addDomain.replace(subRoutes.serviceName, serviceName), {
              state: { site, path },
            }),
          label: t('add_domain'),
        },
        // @TODO FOR NEXT STEP
        /* actionCondition(!hasModule, {
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
        }), */
        /* {
          id: 5,
          onClick: () => {},
          label: t('access_website'),
        }, */
        actionCondition(canAssociateGit, {
          id: 6,
          onClick: () => window.location.replace(associateGitLink),
          label: t('associate_git'),
        }),
        actionCondition(canConfigureGit, {
          id: 7,
          onClick: () => window.location.replace(configureGitLink),
          label: t('configure_git'),
        }),
        actionCondition(canDeployGit, {
          id: 8,
          onClick: () =>
            navigate(
              urls.deployeGit
                .replace(subRoutes.serviceName, serviceName)
                .replace(subRoutes.path, path ?? ''),
              { state: { serviceName, path } },
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
              { state: { serviceName, path } },
            ),
          label: t('last_deployment_git'),
        }),
        actionCondition(canDeleteGit, {
          id: 10,
          onClick: () =>
            navigate(
              urls.deleteGit
                .replace(subRoutes.serviceName, serviceName)
                .replace(subRoutes.path, path ?? ''),
              { state: { serviceName, path } },
            ),
          label: t('delete_git'),
        }),
      ].filter(Boolean);

      return siteActions;
    } else {
      const currentDomain = domains?.find((d) => d.id === domainId);
      const canAccesscdn = currentDomain?.currentState?.cdn.status !== ServiceStatus.NONE;
      const canActivateCdn = currentDomain?.currentState?.cdn.status === ServiceStatus.NONE;

      const domainActions: ActionMenuItemProps[] = [
        {
          id: 11,
          onClick: () =>
            navigate(
              urls.modifyDomain
                .replace(subRoutes.serviceName, serviceName)
                .replace(subRoutes.domain, domain ?? ''),
              {
                state: {
                  serviceName,
                  path,
                  domain,
                  gitStatus: websites.find((w) => w.id === currentDomain?.currentState.websiteId)
                    ?.currentState?.git?.status,
                  firewallStatus: currentDomain?.currentState?.firewall?.status,
                  cdnStatus: currentDomain?.currentState?.cdn?.status,
                },
              },
            ),

          label: t('modify_domain'),
        },
        {
          id: 12,
          onClick: () =>
            navigate(
              urls.detacheDomain
                .replace(subRoutes.serviceName, serviceName)
                .replace(subRoutes.domain, domain ?? ''),
            ),
          label: t('detache_domain'),
        },
        actionCondition(canActivateCdn, {
          id: 15,
          onClick: () =>
            navigate(
              urls.activateCdn
                .replace(subRoutes.serviceName, serviceName)
                .replace(subRoutes.domain, domain ?? ''),
              { state: { domain, serviceName } },
            ),
          label: t('activate_cdn'),
        }),
        actionCondition(canAccesscdn, {
          id: 13,
          onClick: () =>
            navigate(
              urls.modifyCdn
                .replace(subRoutes.serviceName, serviceName)
                .replace(subRoutes.domain, domain ?? ''),
            ),
          label: t('modify_cdn'),
        }),
        actionCondition(canAccesscdn, {
          id: 14,
          onClick: () =>
            navigate(
              urls.purgeCdn
                .replace(subRoutes.serviceName, serviceName)
                .replace(subRoutes.domain, domain ?? ''),
              { state: { domain, serviceName } },
            ),
          label: t('purge_cdn'),
        }),
      ].filter(Boolean);

      return domainActions;
    }
  }, [
    context,
    domains,
    t,
    websites,
    siteId,
    site,
    navigate,
    serviceName,
    path,
    domainId,
    domain,
    associateGitLink,
    configureGitLink,
  ]);

  return (
    <ActionMenu
      id={`actions-${context}-${siteId ?? domainId}`}
      items={allActions}
      isCompact
      variant={BUTTON_VARIANT.ghost}
      isDisabled={isDisabled}
    />
  );
};

export default ActionButtonMultisite;
