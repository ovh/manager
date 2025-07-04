import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { TResourceUsage } from '@/api/hook/useConsumption';
import CommonUsageList from './CommonUsageList';

type TAiEndpointListProps = {
  resourcesUsage: TResourceUsage[];
};

export default function AiEndpointList({
  resourcesUsage,
}: Readonly<TAiEndpointListProps>) {
  const { t } = useTranslation('consumption/hourly-instance/resource-usage');
  const { currency } = useContext(ShellContext).environment.getUser();

  const columns = [
    {
      id: 'type',
      cell: (row: TResourceUsage) => (
        <DataGridTextCell>{row.name}</DataGridTextCell>
      ),
      label: t('pci_billing_private_registry_type'),
    },
    {
      id: 'consumption',
      cell: (row: TResourceUsage) => (
        <DataGridTextCell>{row.quantity.value}</DataGridTextCell>
      ),
      label: t('pci_billing_private_registry_tokens'),
    },
    {
      id: 'price',
      cell: (row: TResourceUsage) => (
        <DataGridTextCell>
          {row.totalPrice.toFixed(2)} {currency.symbol}
        </DataGridTextCell>
      ),
      label: t('pci_billing_private_registry_price'),
    },
  ];

  return <CommonUsageList resourcesUsage={resourcesUsage} columns={columns} />;
}
