import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { DomainsItem } from './Domains';
import { useGenerateUrl, usePlatform } from '@/hooks';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import { ResourceStatus } from '@/api/api.type';

interface ActionButtonDomainProps {
  domainItem: DomainsItem;
}
const ActionButtonDomain: React.FC<ActionButtonDomainProps> = ({
  domainItem,
}) => {
  const { t } = useTranslation('domains');
  const hrefDeleteDomain = useGenerateUrl('./delete', 'href', {
    deleteDomainId: domainItem.id,
  });
  const hrefEditDomain = useGenerateUrl('./edit', 'href', {
    editDomainId: domainItem.id,
  });
  const { platformUrn } = usePlatform();
  const actionItems = [
    {
      id: 1,
      href: hrefEditDomain,
      label: t('zimbra_domains_tooltip_configure'),
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.domain.edit],
    },
    {
      id: 2,
      href: hrefDeleteDomain,
      label: t('zimbra_domains_tooltip_delete'),
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.domain.delete],
    },
  ];
  return (
    <ActionMenu
      disabled={domainItem.status !== ResourceStatus.READY}
      items={actionItems}
      isCompact
    />
  );
};

export default ActionButtonDomain;
