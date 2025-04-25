import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useNavigate, useParams } from 'react-router-dom';
import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { RedirectionItem } from './Redirections';
import { useGenerateUrl, usePlatform } from '@/hooks';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import { ResourceStatus } from '@/api/api.type';
import { FEATURE_FLAGS } from '@/utils';
import {
  DELETE_REDIRECTION,
  EDIT_REDIRECTION,
  EMAIL_ACCOUNT_DELETE_REDIRECTION,
  EMAIL_ACCOUNT_EDIT_REDIRECTION,
} from '@/tracking.constant';

interface ActionButtonRedirectionAccountProps {
  redirectionItem: RedirectionItem;
}

const ActionButtonRedirection: React.FC<ActionButtonRedirectionAccountProps> = ({
  redirectionItem,
}) => {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation('common');
  const { platformUrn } = usePlatform();
  const navigate = useNavigate();
  const { accountId } = useParams();

  const hrefEditRedirections = useGenerateUrl(
    `./${redirectionItem.id}/edit`,
    'path',
  );

  const handleEditRedirectionsClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [accountId ? EMAIL_ACCOUNT_EDIT_REDIRECTION : EDIT_REDIRECTION],
    });
    navigate(hrefEditRedirections);
  };

  const hrefDeleteRedirections = useGenerateUrl(
    `./${redirectionItem.id}/delete`,
    'path',
  );
  const handleDeleteRedirectionsClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [
        accountId ? EMAIL_ACCOUNT_DELETE_REDIRECTION : DELETE_REDIRECTION,
      ],
    });
    navigate(hrefDeleteRedirections);
  };
  const actionItems = [
    {
      id: 1,
      onClick: handleEditRedirectionsClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.redirection.edit],
      label: t('modify'),
      hidden: !FEATURE_FLAGS.REDIRECTIONS_EDIT,
    },
    {
      id: 2,
      onClick: handleDeleteRedirectionsClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.redirection.delete],
      label: t('delete'),
      color: ODS_BUTTON_COLOR.critical,
    },
  ];
  return (
    <ActionMenu
      id={redirectionItem.id}
      isDisabled={redirectionItem.status !== ResourceStatus.READY}
      items={actionItems.filter((i) => !i.hidden)}
      variant={ODS_BUTTON_VARIANT.ghost}
      isCompact
    />
  );
};

export default ActionButtonRedirection;
