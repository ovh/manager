import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useNavigate } from 'react-router-dom';
import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
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
  const navigate = useNavigate();
  const { platformUrn } = usePlatform();

  const hrefDeleteDomain = useGenerateUrl('./delete', 'path', {
    deleteDomainId: domainItem.id,
  });

  const handleDeleteDomainClick = () => {
    navigate(hrefDeleteDomain);
  };

  const hrefEditDomain = useGenerateUrl('./edit', 'path', {
    editDomainId: domainItem.id,
  });

  const handleEditDomainClick = () => {
    navigate(hrefEditDomain);
  };

  const actionItems = [
    {
      id: 1,
      onclick: handleEditDomainClick,
      label: t('zimbra_domains_tooltip_configure'),
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.domain.edit],
    },
    {
      id: 2,
      onclick: handleDeleteDomainClick,
      label: t('zimbra_domains_tooltip_delete'),
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.domain.delete],
      color: ODS_BUTTON_COLOR.critical,
    },
  ];
  return (
    <ActionMenu
      id={domainItem.id}
      isDisabled={domainItem.status !== ResourceStatus.READY}
      items={actionItems}
      variant={ODS_BUTTON_VARIANT.ghost}
      isCompact
    />
  );
};

export default ActionButtonDomain;
