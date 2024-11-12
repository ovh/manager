import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import {
  ActionMenu,
  ActionMenuItem,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { Gateway } from '@/interface';

type ActionsProps = {
  gateway: Gateway;
};
export default function Actions({ gateway }: Readonly<ActionsProps>) {
  const { t } = useTranslation();
  const projectUrl = useProjectUrl('public-cloud');
  const hrefRemove = useHref(
    `./delete?id=${gateway.id}&name=${gateway.name}&region=${gateway.region}`,
  );
  const hrefEdit = useHref(
    `./edit?gatewayId=${gateway.id}&region=${gateway.region}`,
  );

  const items: ActionMenuItem[] = [
    {
      id: 0,
      label: t('pci_projects_project_public_gateway_modify'),
      href: hrefEdit,
    },
    {
      id: 1,
      label: t('pci_projects_project_public_gateway_go_to_private_networks'),
      href: `${projectUrl}/private-networks`,
    },
    {
      id: 2,
      label: t('pci_projects_project_public_gateway_delete'),
      href: hrefRemove,
    },
  ];
  return <ActionMenu items={items} isCompact />;
}
