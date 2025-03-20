import React from 'react';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { OdsLink } from '@ovhcloud/ods-components/react';
import { ActionMenu, DataGridTextCell } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { VrackServicesWithIAM } from '@ovh-ux/manager-network-common';
import { useVrackMenuItems } from './useVrackMenuItems.hook';
import { isEditable } from '@/utils/vrack-services';

export type VrackIdProps = { isListing?: boolean } & VrackServicesWithIAM;

export const VrackId: React.FC<VrackIdProps> = ({ isListing, ...vs }) => {
  const { shell } = React.useContext(ShellContext);
  const [vrackUrl, setVrackUrl] = React.useState('#');
  const vrackId = vs?.currentState?.vrackId;
  const menuItems = useVrackMenuItems({ vs, isListing });

  React.useEffect(() => {
    if (vrackId) {
      shell.navigation
        .getURL('dedicated', `#/vrack/${vrackId}`, {})
        .then(setVrackUrl);
    }
  }, [vrackId]);

  return isListing ? (
    <DataGridTextCell>{vs.currentState.vrackId}</DataGridTextCell>
  ) : (
    <div className="flex items-center">
      <div className="grow">
        {vrackId ? (
          <OdsLink href={vrackUrl} label={vrackId} />
        ) : (
          <DataGridTextCell>{vrackId}</DataGridTextCell>
        )}
      </div>
      <div className="flex-none">
        <ActionMenu
          id={`action-menu-${vs.id}`}
          isCompact
          items={menuItems}
          variant={ODS_BUTTON_VARIANT.ghost}
          isDisabled={!isEditable(vs)}
        />
      </div>
    </div>
  );
};
