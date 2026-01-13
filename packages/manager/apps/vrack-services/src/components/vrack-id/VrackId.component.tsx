import React from 'react';

import { useTranslation } from 'react-i18next';

import { BUTTON_VARIANT, Link, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import type { VrackServicesWithIAM } from '@ovh-ux/manager-network-common';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ActionMenu } from '@ovh-ux/muk';

import { isEditable } from '@/utils/vrack-services';

import { useVrackMenuItems } from './useVrackMenuItems.hook';

export type VrackIdProps = { isListing?: boolean } & VrackServicesWithIAM;

export const VrackId: React.FC<VrackIdProps> = ({ isListing, ...vs }) => {
  const { shell } = React.useContext(ShellContext);
  const [vrackUrl, setVrackUrl] = React.useState('#');
  const { t } = useTranslation(NAMESPACES.DASHBOARD);
  const vrackId = vs?.currentState?.vrackId;
  const menuItems = useVrackMenuItems({ vs, isListing });

  React.useEffect(() => {
    if (vrackId) {
      shell.navigation
        .getURL('dedicated', `#/vrack/${vrackId}`, {})
        .then((url) => void setVrackUrl(url as string));
    }
  }, [vrackId, shell.navigation]);

  return isListing ? (
    <Text>{vrackId ?? t('none')}</Text>
  ) : (
    <div className="flex items-center">
      <div className="grow">
        {vrackId ? <Link href={vrackUrl}>{vrackId}</Link> : <Text>{vrackId}</Text>}
      </div>
      <div className="flex-none">
        <ActionMenu
          id={`action-menu-${vs.id}`}
          isCompact
          items={menuItems}
          variant={BUTTON_VARIANT.ghost}
          isDisabled={!isEditable(vs)}
        />
      </div>
    </div>
  );
};
