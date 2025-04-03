import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { DedicatedServerWithIAM } from '@/data/types/server.type';
import { OdsPopover, OdsButton } from '@ovhcloud/ods-components/react';
import { ODS_POPOVER_POSITION } from '@ovhcloud/ods-components';
export const ActionCell: React.FC<DedicatedServerWithIAM> = (vs) => {
  const { shell } = React.useContext(ShellContext);
  const { t } = useTranslation('dedicated-servers');
  const { trackClick } = useOvhTracking();

  return (
    <div className="w-min">
      <OdsButton
        class="my-trigger"
        icon="ellipsis-vertical"
        id={`service-key-actions-${vs.name}`}
        variant="outline"
        label=""
      ></OdsButton>
      <OdsPopover
        triggerId={`service-key-actions-${vs.name}`}
        withArrow={false}
        position={ODS_POPOVER_POSITION.bottomStart}
      >
        <OdsButton
          variant="ghost"
          label={t('action-goDetails')}
          onClick={() => {
            shell.navigation.navigateTo('dedicated', `#/server/${vs.name}`, {});
          }}
        ></OdsButton>
      </OdsPopover>
    </div>
  );
};

export default ActionCell;
