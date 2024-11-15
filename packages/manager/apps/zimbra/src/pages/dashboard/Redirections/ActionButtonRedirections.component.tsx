import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { RedirectionsItem } from './Redirections';
import { useGenerateUrl, usePlatform } from '@/hooks';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import { ResourceStatus } from '@/api/api.type';
import { FEATURE_FLAGS } from '@/utils';

interface ActionButtonRedirectionsAccountProps {
  redirectionsItem: RedirectionsItem;
}

const ActionButtonRedirections: React.FC<ActionButtonRedirectionsAccountProps> = ({
  redirectionsItem,
}) => {
  const { t } = useTranslation('redirections');
  const { platformUrn } = usePlatform();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const hrefEditRedirections = useGenerateUrl('./edit', 'path', {
    editRedirectionId: redirectionsItem.id,
    ...params,
  });

  const handleEditRedirectionsClick = () => {
    navigate(hrefEditRedirections);
  };

  const hrefDeleteRedirections = useGenerateUrl('./delete', 'path', {
    deleteRedirectionId: redirectionsItem.id,
    ...params,
  });
  const handleDeleteRedirectionsClick = () => {
    navigate(hrefDeleteRedirections);
  };
  const actionItems = [
    {
      id: 1,
      onClick: handleEditRedirectionsClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.redirection.edit],
      label: t('zimbra_redirections_datagrid_tooltip_modification'),
      hidden: !FEATURE_FLAGS.REDIRECTIONS_EDIT,
    },
    {
      id: 2,
      onClick: handleDeleteRedirectionsClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.redirection.delete],
      label: t('zimbra_redirections_datagrid_tooltip_delete'),
      color: ODS_BUTTON_COLOR.critical,
    },
  ];
  return (
    <ActionMenu
      id={redirectionsItem.id}
      isDisabled={redirectionsItem.status !== ResourceStatus.READY}
      items={actionItems.filter((i) => !i.hidden)}
      variant={ODS_BUTTON_VARIANT.ghost}
      isCompact
    />
  );
};

export default ActionButtonRedirections;
