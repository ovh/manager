import React from 'react';
import { ManagerButton } from '@ovh-ux/manager-react-components';
import { useNavigate } from 'react-router-dom';
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
import { AliasItem } from './EmailAccountsAlias.page';
import { useGenerateUrl, usePlatform } from '@/hooks';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import { ResourceStatus } from '@/api/api.type';
import { EMAIL_ACCOUNT_DELETE_ALIAS } from '@/tracking.constant';

interface ActionButtonAliasAccountProps {
  aliasItem: AliasItem;
}

const ActionButtonAlias: React.FC<ActionButtonAliasAccountProps> = ({
  aliasItem,
}) => {
  const { trackClick } = useOvhTracking();
  const { platformUrn } = usePlatform();
  const navigate = useNavigate();

  const hrefDeleteAlias = useGenerateUrl(`./${aliasItem.id}/delete`, 'path');

  const handleDeleteAliasClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [EMAIL_ACCOUNT_DELETE_ALIAS],
    });
    navigate(hrefDeleteAlias);
  };

  return (
    <ManagerButton
      id={`delete-alias-${aliasItem.id}`}
      data-testid="delete-alias"
      onClick={handleDeleteAliasClick}
      urn={platformUrn}
      iamActions={[IAM_ACTIONS.alias.delete]}
      isDisabled={aliasItem.status !== ResourceStatus.READY}
      variant={ODS_BUTTON_VARIANT.ghost}
      color={ODS_BUTTON_COLOR.critical}
      icon={ODS_ICON_NAME.trash}
      label=""
    />
  );
};

export default ActionButtonAlias;
