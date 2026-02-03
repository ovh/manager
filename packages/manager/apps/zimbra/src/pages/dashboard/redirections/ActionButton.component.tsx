import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { ActionMenu, BUTTON_COLOR, BUTTON_VARIANT } from '@ovh-ux/muk';

import { ResourceStatus } from '@/data/api';
import { usePlatform } from '@/data/hooks';
import { useGenerateUrl } from '@/hooks';
import { DELETE_REDIRECTION, EMAIL_ACCOUNT_DELETE_REDIRECTION } from '@/tracking.constants';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

import { RedirectionItem } from './Redirections.types';

interface ActionButtonRedirectionAccountProps {
  item: RedirectionItem;
}

export const ActionButtonRedirection: React.FC<ActionButtonRedirectionAccountProps> = ({
  item,
}) => {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation(['common', NAMESPACES.ACTIONS]);
  const { platformUrn } = usePlatform();
  const navigate = useNavigate();
  const { accountId } = useParams();

  const hrefDeleteRedirections = useGenerateUrl(`./${item.id}/delete`, 'path');
  const handleDeleteRedirectionsClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [accountId ? EMAIL_ACCOUNT_DELETE_REDIRECTION : DELETE_REDIRECTION],
    });
    navigate(hrefDeleteRedirections);
  };
  const actionItems = [
    {
      id: 1,
      onClick: handleDeleteRedirectionsClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.redirection.delete],
      label: t(`${NAMESPACES.ACTIONS}:delete`),
      color: BUTTON_COLOR.critical,
    },
  ];
  return (
    <ActionMenu
      id={item.id}
      isDisabled={item.status !== ResourceStatus.READY}
      items={actionItems}
      variant={BUTTON_VARIANT.ghost}
      isCompact
    />
  );
};

export default ActionButtonRedirection;
