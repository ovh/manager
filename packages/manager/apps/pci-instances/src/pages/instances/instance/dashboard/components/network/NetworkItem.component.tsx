import { FC, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { FormField, FormFieldLabel, Text } from '@ovhcloud/ods-react';
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
        <Text className="my-4">
          {t('pci_instances_dashboard_network_name_label')}
          {address.subnet?.network.name}
        </Text>
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
