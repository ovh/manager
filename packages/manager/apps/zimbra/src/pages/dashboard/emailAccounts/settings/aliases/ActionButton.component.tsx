import React from 'react';

import { useNavigate } from 'react-router-dom';

import { BUTTON_COLOR, BUTTON_VARIANT, ICON_NAME, Icon } from '@ovhcloud/ods-react';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { Button } from '@ovh-ux/muk';

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
    <Button
      id={`delete-alias-${item.id}`}
      data-testid="delete-alias"
      onClick={handleDeleteAliasClick}
      urn={platformUrn}
      iamActions={[IAM_ACTIONS.alias.delete]}
      disabled={item.status !== ResourceStatus.READY}
      variant={BUTTON_VARIANT.ghost}
      color={BUTTON_COLOR.critical}
    >
      <Icon name={ICON_NAME.trash} />
    </Button>
  );
};

export default ActionButtonAlias;
