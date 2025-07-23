import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { ResourceStatus } from '@/data/api';
import { usePlatform } from '@/data/hooks';
import { useGenerateUrl } from '@/hooks';
import {
  DELETE_REDIRECTION,
  EDIT_REDIRECTION,
  EMAIL_ACCOUNT_DELETE_REDIRECTION,
  EMAIL_ACCOUNT_EDIT_REDIRECTION,
} from '@/tracking.constants';
import { FEATURE_FLAGS } from '@/utils';
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

  const hrefEditRedirections = useGenerateUrl(`./${item.id}/edit`, 'path');

  const handleEditRedirectionsClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [accountId ? EMAIL_ACCOUNT_EDIT_REDIRECTION : EDIT_REDIRECTION],
    });
    navigate(hrefEditRedirections);
  };

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
      onClick: handleEditRedirectionsClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.redirection.edit],
      label: t(`${NAMESPACES.ACTIONS}:modify`),
      hidden: !FEATURE_FLAGS.REDIRECTIONS_EDIT,
    },
    {
      id: 2,
      onClick: handleDeleteRedirectionsClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.redirection.delete],
      label: t(`${NAMESPACES.ACTIONS}:delete`),
      color: ODS_BUTTON_COLOR.critical,
    },
  ];
  return (
    <ActionMenu
      id={item.id}
      isDisabled={item.status !== ResourceStatus.READY}
      items={actionItems.filter((i) => !i.hidden)}
      variant={ODS_BUTTON_VARIANT.ghost}
      isCompact
    />
  );
};

export default ActionButtonRedirection;
