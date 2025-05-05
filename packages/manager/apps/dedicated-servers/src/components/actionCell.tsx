import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  useOvhTracking,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';
import { OdsPopover, OdsButton } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_POPOVER_POSITION,
} from '@ovhcloud/ods-components';
import { DedicatedServer } from '@/data/types/server.type';

export const ActionCell = (server: DedicatedServer) => {
  const { shell } = React.useContext(ShellContext);
  const { t } = useTranslation('dedicated-servers');
  const { trackClick } = useOvhTracking();

  return (
    <div className="w-min">
      <OdsButton
        icon={ODS_ICON_NAME.ellipsisVertical}
        id={`service-key-actions-${server.name}`}
        variant={ODS_BUTTON_VARIANT.ghost}
        label=""
      />
      <OdsPopover
        triggerId={`service-key-actions-${server.name}`}
        position={ODS_POPOVER_POSITION.bottomStart}
      >
        <OdsButton
          variant="ghost"
          label={t('action-goDetails')}
          onClick={() => {
            shell.navigation.navigateTo(
              'dedicated',
              `#/server/${server.name}`,
              {},
            );
          }}
        />
      </OdsPopover>
    </div>
  );
};

export default ActionCell;
