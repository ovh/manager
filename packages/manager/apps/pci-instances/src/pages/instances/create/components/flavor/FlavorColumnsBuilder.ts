import { useTranslation } from 'react-i18next';
import { TableColumn } from '@/components/flavorsTable/FlavorsTable.component';

export function FlavorColumnsBuilder(): TableColumn[] {
  const { t } = useTranslation('creation');

  return [
    { key: 'action', title: null, subtitle: null },
    {
      key: 'name',
      title: t('pci_instance_creation_table_header_name'),
    },
    {
      key: 'memory',
      title: t('pci_instance_creation_table_header_memory'),
      subtitle: t('pci_instance_creation_table_header_memory_unit'),
    },
    {
      key: 'vCore',
      title: t('pci_instance_creation_table_header_vcore'),
    },
    {
      key: 'storage',
      title: t('pci_instance_creation_table_header_storage'),
      subtitle: t('pci_instance_creation_table_header_storage_unit'),
    },
    {
      key: 'mode',
      title: t('pci_instance_creation_table_header_mode'),
    },
    {
      key: 'hourlyPrice',
      title: t('pci_instance_creation_table_header_price'),
      subtitle: t('pci_instance_creation_table_header_price_hourly_unit'),
    },
    {
      key: 'monthlyPrice',
      title: t('pci_instance_creation_table_header_price'),
      subtitle: t('pci_instance_creation_table_header_price_monthly_unit'),
    },
  ];
}
