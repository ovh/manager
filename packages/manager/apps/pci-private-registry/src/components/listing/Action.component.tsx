import { useContext, useMemo } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useHref, useParams } from 'react-router-dom';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { TRegistry } from '@/api/data/registry';
import { useGetRegistryPlan } from '@/api/hooks/useRegistry';
import { PRIVATE_REGISTRY_STATUS } from '@/constants';
import { useIAMFeatureAvailability } from '@/hooks/features/useIAMFeatureAvailability';
import { useGetActionsLinks } from '@/hooks/registry/useGetActionsLinks';

type ActionComponentProps = {
  registry: TRegistry;
};

export default function ActionComponent({
  registry,
}: Readonly<ActionComponentProps>) {
  const { t } = useTranslation(['common', 'ip-restrictions']);

  const { projectId } = useParams();
  const { data: registryPlan } = useGetRegistryPlan(projectId, registry?.id);
  const { tracking } = useContext(ShellContext)?.shell || {};
  const { isIAMEnabled, isPending } = useIAMFeatureAvailability();
  const links = useGetActionsLinks(registry.id, registry.url);

  const items = useMemo(
    () => [
      {
        id: 0,
        label: t('private_registry_rename'),
        href: links.rename,
        onClick: () =>
          tracking?.trackClick({
            name: 'PCI_PROJECTS_PRIVATEREGISTRY_UPDATE',
            type: 'action',
          }),
      },
      {
        id: 1,
        label: t('private_registry_upgrade_plan'),
        href: links.upgradePlan,
        disabled:
          registryPlan?.name?.charAt(0) === 'L' ||
          registry?.status === PRIVATE_REGISTRY_STATUS.SCALING_UP ||
          registry?.status === PRIVATE_REGISTRY_STATUS.INSTALLING,
        onClick: () =>
          tracking?.trackClick({
            name: 'PCI_PROJECTS_PRIVATEREGISTRY_CHANGEPLAN',
            type: 'action',
          }),
      },
      {
        id: 2,
        label: t('private_registry_harbor_ui'),
        href: links.harborUI,
        disabled: registry.status !== PRIVATE_REGISTRY_STATUS.READY,
        target: OdsHTMLAnchorElementTarget._blank,
        onClick: () =>
          tracking?.trackClick({
            name: 'PCI_PROJECTS_PRIVATEREGISTRY_HARBOR-UI',
            type: 'action',
          }),
      },
      {
        id: 3,
        label: t('private_registry_harbor_api'),
        href: links.harborAPI,
        disabled: registry.status !== PRIVATE_REGISTRY_STATUS.READY,
        onClick: () =>
          tracking?.trackClick({
            name: 'PCI_PROJECTS_PRIVATEREGISTRY_API-URL',
            type: 'action',
          }),
      },
      {
        id: 4,
        label: t('private_registry_regenerate_creds'),
        href: links.regenerateCredentials,
        disabled:
          registry.status !== PRIVATE_REGISTRY_STATUS.READY ||
          registry.iamEnabled,
        onClick: () =>
          tracking?.trackClick({
            name: 'PCI_PROJECTS_PRIVATEREGISTRY_CREDENTIALS',
            type: 'action',
          }),
      },
      ...(isIAMEnabled && !isPending
        ? [
            {
              id: 5,
              label: t('private_registry_iam_authentication_manage', {
                manage: registry.iamEnabled
                  ? t('private_registry_common_status_DISABLE')
                  : t('private_registry_common_status_ENABLE'),
              }),
              href: links.manageIAM,
              disabled: registry.status !== PRIVATE_REGISTRY_STATUS.READY,
              onClick: () =>
                tracking?.trackClick({
                  name: `PCI_PROJECTS_PRIVATEREGISTRY_${
                    registry.iamEnabled ? 'DISABLE' : 'ENABLE'
                  }_IAM_AUTHENTICATION`,
                  type: 'action',
                }),
            },
          ]
        : []),
      {
        id: 6,
        label: t('ip-restrictions:private_registry_cidr_manage_title'),
        href: links.manageCIDR,
        disabled:
          registry.status !== PRIVATE_REGISTRY_STATUS.READY &&
          registry.status !== PRIVATE_REGISTRY_STATUS.ERROR,
        onClick: () =>
          tracking?.trackClick({
            name: 'PCI_PROJECTS_PRIVATEREGISTRY_MANAGE_CIDR',
            type: 'action',
          }),
      },
      {
        id: 7,
        label: t('private_registry_common_delete'),
        href: links.deleteRegistry,
        disabled:
          registry.status !== PRIVATE_REGISTRY_STATUS.READY &&
          registry.status !== PRIVATE_REGISTRY_STATUS.ERROR,
        onClick: () =>
          tracking?.trackClick({
            name: 'PCI_PROJECTS_PRIVATEREGISTRY_DELETE',
            type: 'action',
          }),
      },
    ],
    [
      isIAMEnabled,
      isPending,
      links,
      registry.iamEnabled,
      registry.status,
      registryPlan?.name,
      t,
      tracking,
    ],
  );

  return <ActionMenu items={items} isCompact />;
}
