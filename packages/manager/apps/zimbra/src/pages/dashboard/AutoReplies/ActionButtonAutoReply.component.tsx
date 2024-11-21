import React from 'react';
import { ManagerButton } from '@ovh-ux/manager-react-components';
import { useSearchParams } from 'react-router-dom';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsIcon } from '@ovhcloud/ods-components/react';
import { AutoRepliesItem } from './AutoReplies';
import { useGenerateUrl, usePlatform } from '@/hooks';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import { ResourceStatus } from '@/api/api.type';

interface ActionButtonAutoReplyProps {
  autoReplyItem: AutoRepliesItem;
}

const ActionButtonAutoReply: React.FC<ActionButtonAutoReplyProps> = ({
  autoReplyItem,
}) => {
  const { platformUrn } = usePlatform();

  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const hrefDeleteAutoReply = useGenerateUrl('./delete', 'href', {
    deleteAutoReplyId: autoReplyItem.id,
    ...params,
  });

  return (
    <ManagerButton
      data-testid="delete-auto-reply"
      href={hrefDeleteAutoReply}
      inline
      urn={platformUrn}
      iamActions={[IAM_ACTIONS.autoReply.delete]}
      disabled={autoReplyItem.status !== ResourceStatus.READY ? true : null}
      variant={ODS_BUTTON_VARIANT.ghost}
      color={ODS_THEME_COLOR_INTENT.primary}
    >
      <OsdsIcon
        name={ODS_ICON_NAME.BIN}
        size={ODS_ICON_SIZE.xs}
        color={ODS_THEME_COLOR_INTENT.primary}
      ></OsdsIcon>
    </ManagerButton>
  );
};

export default ActionButtonAutoReply;
