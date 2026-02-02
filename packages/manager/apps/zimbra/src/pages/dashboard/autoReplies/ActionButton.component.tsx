import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { BUTTON_COLOR, BUTTON_VARIANT, ICON_NAME, Icon } from '@ovhcloud/ods-react';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { Button } from '@ovh-ux/muk';

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
    <Button
      id={`delete-auto-reply-${item.id}`}
      data-testid="delete-auto-reply"
      onClick={handleDeleteClick}
      urn={platformUrn}
      iamActions={[IAM_ACTIONS.autoReply.delete]}
      disabled={item.status !== ResourceStatus.READY ? true : null}
      variant={BUTTON_VARIANT.ghost}
      color={BUTTON_COLOR.critical}
    >
      <Icon name={ICON_NAME.trash} />
    </Button>
  );
};

export default ActionButtonAutoReply;
