import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_SIZE, ODS_TEXT_LEVEL } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
} from '@ovhcloud/ods-common-theming';
import { Clipboard } from '@ovh-ux/manager-react-components';
import { clsx } from 'clsx';
import StatusChip from '@/components/statusChip/StatusChip.component';
import {
  ActionsMenu,
  TActionsMenuItem,
} from '@/components/menu/ActionsMenu.component';
import { DeepReadonlyMap } from '@/types/utils.type';
import { TInstanceAddress } from '@/types/instance/entity.type';

type TNetworkItemProps = {
  address: TInstanceAddress;
  isFloatingIp?: boolean;
  actions?: DeepReadonlyMap<string, TActionsMenuItem[]>;
};

const NetworkItem: FC<TNetworkItemProps> = ({
  address,
  actions,
  isFloatingIp,
}) => {
  const { t } = useTranslation('dashboard');

  return (
    <div className="my-5">
      <div className="flex items-center gap-x-4">
        <OsdsText
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.primary}
          hue={ODS_THEME_COLOR_HUE._800}
        >
          {address.subnet?.name}
        </OsdsText>
        {isFloatingIp && (
          <StatusChip
            status={{
              label: t('pci_instances_dashboard_network_floating_title'),
              severity: 'warning',
            }}
          />
        )}
      </div>
      <div className="my-4">
        <OsdsText
          size={ODS_TEXT_SIZE._200}
          level={ODS_TEXT_LEVEL.heading}
          color={ODS_THEME_COLOR_INTENT.primary}
          hue={ODS_THEME_COLOR_HUE._800}
        >
          {t(`pci_instances_dashboard_network_ipv${address.version}`)}
        </OsdsText>
        <div className={clsx(!!actions && 'flex items-center justify-between')}>
          <div className={clsx({ 'w-[85%]': !!actions })}>
            <Clipboard value={address.ip} />
          </div>
          {actions && <ActionsMenu items={actions} />}
        </div>
      </div>
      {address.subnet?.gatewayIP && (
        <div className="my-4">
          <OsdsText
            size={ODS_TEXT_SIZE._200}
            level={ODS_TEXT_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.primary}
            hue={ODS_THEME_COLOR_HUE._800}
          >
            {t('pci_instances_dashboard_network_gateway')}
          </OsdsText>
          <div className={clsx({ 'w-[85%]': !!actions })}>
            <Clipboard value={address.subnet.gatewayIP} />
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkItem;
