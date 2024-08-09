import React from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsLink } from '@ovhcloud/ods-components/react';
import { ActionMenu, DataGridTextCell } from '@ovhcloud/manager-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { VrackServicesWithIAM, isEditable } from '@/data';
import { useVrackMenuItems } from './useVrackMenuItems.hook';

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
          <OsdsLink href={vrackUrl} color={ODS_THEME_COLOR_INTENT.primary}>
            {vrackId}
          </OsdsLink>
        ) : (
          <DataGridTextCell>{vrackId}</DataGridTextCell>
        )}
      </div>
      <div className="flex-none">
        <ActionMenu isCompact items={menuItems} disabled={!isEditable(vs)} />
      </div>
    </div>
  );
};
