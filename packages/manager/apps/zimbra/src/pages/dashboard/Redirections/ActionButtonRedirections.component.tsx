import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { RedirectionsItem } from './Redirections';
import { useGenerateUrl, usePlatform } from '@/hooks';

interface ActionButtonRedirectionsAccountProps {
  redirectionsItem: RedirectionsItem;
}

const ActionButtonRedirections: React.FC<ActionButtonRedirectionsAccountProps> = ({
  redirectionsItem,
}) => {
  const { t } = useTranslation('redirections');
  const { platformUrn } = usePlatform();

  const hrefEditRedirections = useGenerateUrl('./edit', 'href', {
    editRedirectionsId: redirectionsItem.id,
  });

  const hrefDeleteRedirections = useGenerateUrl('./delete', 'href', {
    deleteRedirectionsId: redirectionsItem.id,
  });
  const actionItems = [
    {
      id: 1,
      href: hrefEditRedirections,
      urn: platformUrn,
      label: t('zimbra_redirections_datagrid_tooltip_modification'),
    },
    {
      id: 2,
      href: hrefDeleteRedirections,
      urn: platformUrn,
      label: t('zimbra_redirections_datagrid_tooltip_delete'),
    },
  ];
  return <ActionMenu items={actionItems} isCompact />;
};

export default ActionButtonRedirections;
