import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';

import { ManagerButton } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { ResourceStatus } from '@/data/api';
import { usePlatform } from '@/data/hooks';
import { useGenerateUrl } from '@/hooks';
import { DELETE_AUTO_REPLY, EMAIL_ACCOUNT_DELETE_AUTO_REPLY } from '@/tracking.constants';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

import { AutoReplyItem } from './AutoReplies.types';

export interface ActionButtonAutoReplyProps {
  item: AutoReplyItem;
}

export const ActionButtonAutoReply: React.FC<ActionButtonAutoReplyProps> = ({ item }) => {
  const { trackClick } = useOvhTracking();
  const { platformUrn } = usePlatform();
  const { accountId } = useParams();

  const navigate = useNavigate();

  const hrefDeleteAutoReply = useGenerateUrl(`./${item.id}/delete`, 'href');

  const handleDeleteClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [accountId ? EMAIL_ACCOUNT_DELETE_AUTO_REPLY : DELETE_AUTO_REPLY],
    });

    navigate(hrefDeleteAutoReply);
  };

  return (
    <ManagerButton
      id={`delete-auto-reply-${item.id}`}
      data-testid="delete-auto-reply"
      onClick={handleDeleteClick}
      urn={platformUrn}
      iamActions={[IAM_ACTIONS.autoReply.delete]}
      isDisabled={item.status !== ResourceStatus.READY ? true : null}
      variant={ODS_BUTTON_VARIANT.ghost}
      color={ODS_BUTTON_COLOR.critical}
      icon={ODS_ICON_NAME.trash}
      label=""
    ></ManagerButton>
  );
};

export default ActionButtonAutoReply;
