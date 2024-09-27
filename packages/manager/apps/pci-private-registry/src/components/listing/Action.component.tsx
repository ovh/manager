import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useHref, useParams } from 'react-router-dom';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { TRegistry } from '@/api/data/registry';
import { useGetRegistryPlan } from '@/api/hooks/useRegistry';
import { PRIVATE_REGISTRY_STATUS } from '@/constants';

type ActionComponentProps = {
  registry: TRegistry;
};

export default function ActionComponent({
  registry,
}: Readonly<ActionComponentProps>) {
  const { t } = useTranslation();

  const { projectId } = useParams();
  const { data: registryPlan } = useGetRegistryPlan(projectId, registry?.id);

  const hrefUpgradePlan = useHref(`./upgrade-plan?registryId=${registry.id}`);
  const hrefRename = useHref(`./update?registryId=${registry.id}`);
  const hrefHarborUI = registry?.url;
  const hrefHarborAPI = useHref(`${registry?.id}/api-url`);
  const hrefRegenerateCredentials = useHref(`${registry?.id}/credentials`);
  const hrefDelete = useHref(`./delete?registryId=${registry.id}`);

  const items = [
    {
      id: 0,
      label: t('private_registry_upgrade_plan'),
      href: hrefUpgradePlan,
      disabled:
        registryPlan?.name?.charAt(0) === 'L' ||
        registry?.status === PRIVATE_REGISTRY_STATUS.SCALING_UP ||
        registry?.status === PRIVATE_REGISTRY_STATUS.INSTALLING,
    },
    {
      id: 1,
      label: t('private_registry_harbor_ui'),
      href: hrefHarborUI,
      disabled: registry.status !== PRIVATE_REGISTRY_STATUS.READY,
      target: OdsHTMLAnchorElementTarget._blank,
    },
    {
      id: 2,
      label: t('private_registry_harbor_api'),
      href: hrefHarborAPI,
      disabled: registry.status !== PRIVATE_REGISTRY_STATUS.READY,
    },
    {
      id: 3,
      label: t('private_registry_regenerate_creds'),
      href: hrefRegenerateCredentials,
      disabled: registry.status !== PRIVATE_REGISTRY_STATUS.READY,
    },
    {
      id: 4,
      label: t('private_registry_rename'),
      href: hrefRename,
    },
    {
      id: 5,
      label: t('private_registry_common_delete'),
      href: hrefDelete,
      disabled:
        registry.status !== PRIVATE_REGISTRY_STATUS.READY &&
        registry.status !== PRIVATE_REGISTRY_STATUS.ERROR,
    },
  ];

  return <ActionMenu items={items} isCompact />;
}