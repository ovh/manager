import { TableColumn } from '@/components/flavorsTable/FlavorsTable.component';

export const GpuFlavorColumnsBuilder = (
  t: (key: string) => string,
): TableColumn[] => [
  { key: 'action', title: null, subtitle: null },
  {
    key: 'name',
    title: t('pci_instance_creation_table_header_name'),
  },
  {
    key: 'gpu',
    title: t('pci_instance_creation_table_header_gpu'),
  },
  {
    key: 'numberOfGpu',
    title: t('pci_instance_creation_table_header_number_of_gpu'),
  },
  {
    key: 'vRamTotal',
    title: t('pci_instance_creation_table_header_vram_total'),
    subtitle: t('pci_instance_creation_table_header_vram_unit'),
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
    key: 'disks',
    title: t('pci_instance_creation_table_header_storage'),
    subtitle: t('pci_instance_creation_table_header_storage_unit'),
  },
  {
    key: 'prices',
    title: t('pci_instance_creation_table_header_price_ht_by_hour'),
    subtitle: t('pci_instance_creation_table_header_price_ht_by_month'),
  },
];
