import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { DomainsItem } from './Domains';
import { useGenerateUrl, usePlatform } from '@/hooks';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

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
  const { platformUrn } = usePlatform();
  const actionItems = [
    {
      id: 1,
      href: hrefDeleteDomain,
      label: t('zimbra_domains_tooltip_delete'),
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.domain.delete],
    },
  ];
  return <ActionMenu items={actionItems} isCompact />;
};

export default ActionButtonDomain;
