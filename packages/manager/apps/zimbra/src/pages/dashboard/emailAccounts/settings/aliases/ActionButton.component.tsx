import React from 'react';

import { useNavigate } from 'react-router-dom';

import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';

import { ManagerButton } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { ResourceStatus } from '@/data/api';
import { usePlatform } from '@/data/hooks';
import { useGenerateUrl } from '@/hooks';
import { EMAIL_ACCOUNT_DELETE_ALIAS } from '@/tracking.constants';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

import { AliasItem } from './Aliases.types';

interface ActionButtonAliasAccountProps {
  item: AliasItem;
}

export const ActionButtonAlias: React.FC<ActionButtonAliasAccountProps> = ({ item }) => {
  const { trackClick } = useOvhTracking();
  const { platformUrn } = usePlatform();
  const navigate = useNavigate();

  const hrefDeleteAlias = useGenerateUrl(`./${item.id}/delete`, 'path');

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
      id={`delete-alias-${item.id}`}
      data-testid="delete-alias"
      onClick={handleDeleteAliasClick}
      urn={platformUrn}
      iamActions={[IAM_ACTIONS.alias.delete]}
      isDisabled={item.status !== ResourceStatus.READY}
      variant={ODS_BUTTON_VARIANT.ghost}
      color={ODS_BUTTON_COLOR.critical}
      icon={ODS_ICON_NAME.trash}
      label=""
    />
  );
};

export default ActionButtonAlias;
