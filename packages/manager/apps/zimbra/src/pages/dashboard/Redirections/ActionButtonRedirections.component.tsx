import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useSearchParams } from 'react-router-dom';
import { RedirectionsItem } from './Redirections';
import { useGenerateUrl, usePlatform } from '@/hooks';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import { ResourceStatus } from '@/api/api.type';

interface ActionButtonRedirectionsAccountProps {
  redirectionsItem: RedirectionsItem;
}

const ActionButtonRedirections: React.FC<ActionButtonRedirectionsAccountProps> = ({
  redirectionsItem,
}) => {
  const { t } = useTranslation('redirections');
  const { platformUrn } = usePlatform();

  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const hrefEditRedirections = useGenerateUrl('./edit', 'href', {
    editRedirectionId: redirectionsItem.id,
    ...params,
  });

  const hrefDeleteRedirections = useGenerateUrl('./delete', 'href', {
    deleteRedirectionId: redirectionsItem.id,
    ...params,
  });

  const actionItems = [
    {
      id: 1,
      href: hrefEditRedirections,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.redirection.edit],
      label: t('zimbra_redirections_datagrid_tooltip_modification'),
    },
    {
      id: 2,
      href: hrefDeleteRedirections,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.redirection.delete],
      label: t('zimbra_redirections_datagrid_tooltip_delete'),
    },
  ];
  return (
    <ActionMenu
      disabled={redirectionsItem.status !== ResourceStatus.READY}
      items={actionItems}
      isCompact
    />
  );
};

export default ActionButtonRedirections;
