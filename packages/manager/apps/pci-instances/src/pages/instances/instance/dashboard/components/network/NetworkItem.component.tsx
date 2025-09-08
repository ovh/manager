import { FC, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
} from '@ovhcloud/ods-common-theming';
import { FormField, FormFieldLabel } from '@ovhcloud/ods-react';
import StatusChip from '@/components/statusChip/StatusChip.component';
import { ActionsMenu } from '@/components/menu/ActionsMenu.component';
import { TInstanceAddress } from '@/types/instance/entity.type';
import { Clipboard } from '@/components/clipboard/Clipboard.component';
import { TAction } from '@/types/instance/action/action.type';

type TNetworkItemProps = {
  address: TInstanceAddress;
  isFloatingIp?: boolean;
  actions?: TAction[];
};

const IPAddressItem: FC<{
  label: string;
  value: string;
  actions?: TAction[];
}> = ({ label, value, actions }) => (
  <div className="my-4 flex items-end w-full">
    <FormField className="flex-grow">
      <FormFieldLabel>{label}</FormFieldLabel>
      <Clipboard value={value} />
    </FormField>
    <div className="w-[40px] flex-shrink-0">
      {actions && (
        <ActionsMenu
          actionButton={{ variant: 'ghost' }}
          items={new Map([[`${label}_actions`, actions]])}
        />
      )}
    </div>
  </div>
);

const NetworkItem: FC<PropsWithChildren<TNetworkItemProps>> = ({
  address,
  actions,
  isFloatingIp,
  children,
}) => {
  const { t } = useTranslation('dashboard');

  return (
    <section className="my-5">
      <div className="flex items-center gap-x-4">
        <OsdsText
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.primary}
          hue={ODS_THEME_COLOR_HUE._800}
        >
          {address.subnet?.network.name}
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
      <IPAddressItem
        label={t(`pci_instances_dashboard_network_ipv${address.version}`)}
        value={address.ip}
        actions={actions}
      />
      {address.subnet?.gatewayIP && (
        <IPAddressItem
          label={t('pci_instances_dashboard_network_gateway')}
          value={address.subnet.gatewayIP}
        />
      )}
      {children}
    </section>
  );
};

export default NetworkItem;
