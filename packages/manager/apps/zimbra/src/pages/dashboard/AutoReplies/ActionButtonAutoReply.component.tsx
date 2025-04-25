import React from 'react';
import { ManagerButton } from '@ovh-ux/manager-react-components';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { AutoRepliesItem } from './AutoReplies';
import { useGenerateUrl, usePlatform } from '@/hooks';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import { ResourceStatus } from '@/api/api.type';
import {
  DELETE_AUTO_REPLY,
  EMAIL_ACCOUNT_DELETE_AUTO_REPLY,
} from '@/tracking.constant';

interface ActionButtonAutoReplyProps {
  autoReplyItem: AutoRepliesItem;
}

const ActionButtonAutoReply: React.FC<ActionButtonAutoReplyProps> = ({
  autoReplyItem,
}) => {
  const { trackClick } = useOvhTracking();
  const { platformUrn } = usePlatform();
  const { accountId } = useParams();

  const navigate = useNavigate();

  const hrefDeleteAutoReply = useGenerateUrl(
    `./${autoReplyItem.id}/delete`,
    'href',
  );

  const handleDeleteClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [
        accountId ? EMAIL_ACCOUNT_DELETE_AUTO_REPLY : DELETE_AUTO_REPLY,
      ],
    });

    navigate(hrefDeleteAutoReply);
  };

  return (
    <ManagerButton
      id={`delete-auto-reply-${autoReplyItem.id}`}
      data-testid="delete-auto-reply"
      onClick={handleDeleteClick}
      urn={platformUrn}
      iamActions={[IAM_ACTIONS.autoReply.delete]}
      isDisabled={autoReplyItem.status !== ResourceStatus.READY ? true : null}
      variant={ODS_BUTTON_VARIANT.ghost}
      color={ODS_BUTTON_COLOR.critical}
      icon={ODS_ICON_NAME.trash}
      label=""
    ></ManagerButton>
  );
};

export default ActionButtonAutoReply;
