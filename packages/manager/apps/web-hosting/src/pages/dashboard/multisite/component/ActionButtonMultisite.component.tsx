import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';

import { ActionMenu, ActionMenuItem } from '@ovh-ux/manager-react-components';

import { subRoutes, urls } from '@/routes/routes.constants';

const ActionButtonMultisite = ({
  site,
  domain,
  path,
}: {
  site: string;
  domain?: string;
  path: string;
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  const actionItems: ActionMenuItem[] = [
    // part domain
    {
      id: 1,
      onClick: () => navigate(urls.orderDomain.replace(subRoutes.serviceName, site)),
      label: t('add_domain'),
    },
    {
      id: 2,
      onClick: () =>
        navigate(
          urls.detacheDomain.replace(subRoutes.serviceName, site).replace(subRoutes.domain, domain),
        ),
      label: t('detache_domain'),
    },
    {
      id: 3,
      onClick: () =>
        navigate(
          urls.modifyDomain.replace(subRoutes.serviceName, site).replace(subRoutes.domain, domain),
        ),
      label: t('modify_domain'),
    },
    // part git
    {
      id: 4,
      onClick: () =>
        navigate(
          urls.associateGit.replace(subRoutes.serviceName, site).replace(subRoutes.path, path),
        ),
      label: t('associate_git'),
    },
    {
      id: 5,
      onClick: () =>
        navigate(urls.deleteGit.replace(subRoutes.serviceName, site).replace(subRoutes.path, path)),
      label: t('delete_git'),
    },
    {
      id: 6,
      onClick: () =>
        navigate(
          urls.configureGit.replace(subRoutes.serviceName, site).replace(subRoutes.path, path),
        ),

      label: t('configure_git'),
    },
    {
      id: 7,
      onClick: () =>
        navigate(
          urls.deployeGit.replace(subRoutes.serviceName, site).replace(subRoutes.path, path),
        ),
      label: t('Déployer GIT'),
    },
    {
      id: 8,
      onClick: () =>
        navigate(
          urls.lastDeploymentGit.replace(subRoutes.serviceName, site).replace(subRoutes.path, path),
        ),
      label: t('Informations sur le dernier déploiement'),
    },
    // part cdn
    {
      id: 9,
      onClick: () =>
        navigate(
          urls.modifyCdn.replace(subRoutes.serviceName, site).replace(subRoutes.domain, domain),
        ),
      label: t('modify_cdn'),
    },
    {
      id: 10,
      onClick: () =>
        navigate(
          urls.purgeCdn.replace(subRoutes.serviceName, site).replace(subRoutes.domain, domain),
        ),
      label: t('purge_cdn'),
    },
    // part module
    {
      id: 11,
      onClick: () => navigate(urls.addModule.replace(subRoutes.serviceName, site)),
      label: t('add_module'),
    },
    {
      id: 12,
      onClick: () => {}, // simple link
      label: t('access_interface'),
    },
    {
      id: 13,
      onClick: () =>
        navigate(
          urls.deleteModule.replace(subRoutes.serviceName, site).replace(subRoutes.path, path),
        ),
      label: t('delete_module'),
    },
    {
      id: 14,
      onClick: () => {}, // simple link
      label: t('access_website'),
    },
  ];

  return (
    <ActionMenu items={actionItems || []} id={''} isCompact variant={ODS_BUTTON_VARIANT.ghost} />
  );
};

export default ActionButtonMultisite;
