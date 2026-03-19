import {
  DataGridTextCell,
  priceToUcent,
  useCatalogPrice,
} from '@ovh-ux/manager-react-components';
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
  const { getTextPrice } = useCatalogPrice(2);

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
          {getTextPrice(priceToUcent(row.totalPrice ?? 0))}
        </DataGridTextCell>
      ),
      label: t('pci_billing_private_registry_price'),
    },
  ];

  return <CommonUsageList resourcesUsage={resourcesUsage} columns={columns} />;
}
