import { FC, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@ovhcloud/ods-react';
import StatusChip from '@/components/statusChip/StatusChip.component';
import { TInstanceAddress } from '@/types/instance/entity.type';
import { TAction } from '@/types/instance/action/action.type';
import IpAddress from './IpAddress.component';

type TNetworkItemProps = {
  address: TInstanceAddress;
  isFloatingIp?: boolean;
  actions?: TAction[];
};

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
        {address.subnet?.network.name && (
          <Text className="my-4">
            {t('pci_instances_dashboard_network_name_label')}
            {address.subnet.network.name}
          </Text>
        )}
        {isFloatingIp && (
          <StatusChip
            status={{
              label: t('pci_instances_dashboard_network_floating_title'),
              severity: 'warning',
            }}
          />
        )}
      </div>
      <IpAddress
        label={t(`pci_instances_dashboard_network_ipv${address.version}`)}
        value={address.ip}
        actions={actions}
      />
      {address.subnet?.gatewayIP && (
        <IpAddress
          label={t('pci_instances_dashboard_network_gateway')}
          value={address.subnet.gatewayIP}
        />
      )}
      {children}
    </section>
  );
};

export default NetworkItem;
