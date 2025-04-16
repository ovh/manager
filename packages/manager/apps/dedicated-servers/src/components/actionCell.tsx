import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { DedicatedServer } from '@/data/types/server.type';
import { OdsPopover, OdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME, ODS_POPOVER_POSITION } from '@ovhcloud/ods-components';
export const ActionCell: React.FC<DedicatedServer> = (vs) => {
  const { shell } = React.useContext(ShellContext);
  const { t } = useTranslation('dedicated-servers');
  const { trackClick } = useOvhTracking();

  return (
    <div className="w-min">
      <OdsButton
        icon={ODS_ICON_NAME.ellipsisVertical}
        id={`service-key-actions-${vs.name}`}
        variant={ODS_BUTTON_VARIANT.outline}
        label=""
      />
      <OdsPopover
        triggerId={`service-key-actions-${vs.name}`}
        position={ODS_POPOVER_POSITION.bottomStart}
      >
        <OdsButton
          variant="ghost"
          label={t('action-goDetails')}
          onClick={() => {
            shell.navigation.navigateTo('dedicated', `#/server/${vs.name}`, {});
          }}
        />
      </OdsPopover>
    </div>
  );
};

export default ActionCell;
