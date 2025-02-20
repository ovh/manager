import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { RedirectionsItem } from './Redirections';
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

interface ActionButtonRedirectionsAccountProps {
  redirectionsItem: RedirectionsItem;
}

const ActionButtonRedirections: React.FC<ActionButtonRedirectionsAccountProps> = ({
  redirectionsItem,
}) => {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation('common');
  const { platformUrn } = usePlatform();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const editEmailAccountId = searchParams.get('editEmailAccountId');

  const hrefEditRedirections = useGenerateUrl('./edit', 'path', {
    editRedirectionId: redirectionsItem.id,
    ...params,
  });

  const handleEditRedirectionsClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [
        editEmailAccountId ? EMAIL_ACCOUNT_EDIT_REDIRECTION : EDIT_REDIRECTION,
      ],
    });
    navigate(hrefEditRedirections);
  };

  const hrefDeleteRedirections = useGenerateUrl('./delete', 'path', {
    deleteRedirectionId: redirectionsItem.id,
    ...params,
  });
  const handleDeleteRedirectionsClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [
        editEmailAccountId
          ? EMAIL_ACCOUNT_DELETE_REDIRECTION
          : DELETE_REDIRECTION,
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
      id={redirectionsItem.id}
      isDisabled={redirectionsItem.status !== ResourceStatus.READY}
      items={actionItems.filter((i) => !i.hidden)}
      variant={ODS_BUTTON_VARIANT.ghost}
      isCompact
    />
  );
};

export default ActionButtonRedirections;
