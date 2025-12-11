import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  useOvhTracking,
  ShellContext,
  ButtonType,
} from '@ovh-ux/manager-react-shell-client';

import { ActionMenu, BUTTON_VARIANT } from '@ovh-ux/muk';
import { DedicatedServer } from '@/data/types/server.type';

export const ActionCell = (server: DedicatedServer) => {
  const { shell } = React.useContext(ShellContext);
  const { t } = useTranslation('dedicated-servers');
  const { trackClick } = useOvhTracking();

  return (
    <ActionMenu
      id={`service-key-actions-${server.name}`}
      items={[
        {
          id: 1,
          onClick: () => {
            trackClick({
              actionType: 'action',
              actions: [
                'datagrid',
                ButtonType.button,
                'details_dedicated-server',
                `${server.region}_${server.commercialRange}`,
              ],
            });
            shell.navigation.navigateTo(
              'dedicated',
              `#/server/${server.name}`,
              {},
            );
          },
          label: t('action-goDetails'),
        },
      ]}
      isCompact
      variant={BUTTON_VARIANT.ghost}
    />
  );
};

export default ActionCell;
