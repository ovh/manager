import { Text } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { TableColumn } from '@/components/flavorsTable/FlavorsTable.component';

export const FlavorColumnsBuilder = (): TableColumn[] => {
  const { t } = useTranslation('creation');

  return [
    { key: 'action', label: undefined },
    {
      key: 'name',
      label: <Text>{t('pci_instance_creation_table_header_name')}</Text>,
    },
    {
      key: 'memory',
      label: (
        <Text>
          {t('pci_instance_creation_table_header_memory')}{' '}
          <Text className="font-normal">
            {t('pci_instance_creation_table_header_memory_unit')}
          </Text>
        </Text>
      ),
    },
    {
      key: 'vcore',
      label: <Text>{t('pci_instance_creation_table_header_vcore')}</Text>,
    },
    {
      key: 'storage',
      label: (
        <Text>
          {t('pci_instance_creation_table_header_storage')}{' '}
          <Text className="font-normal">
            {t('pci_instance_creation_table_header_storage_unit')}
          </Text>
        </Text>
      ),
    },
    {
      key: 'mode',
      label: <Text>{t('pci_instance_creation_table_header_mode')}</Text>,
    },
    {
      key: 'priceHour',
      label: (
        <Text>
          {t('pci_instance_creation_table_header_price')}{' '}
          <Text className="font-normal">
            {t('pci_instance_creation_table_header_price_hourly_unit')}
          </Text>
        </Text>
      ),
    },
    {
      key: 'priceMonth',
      label: (
        <Text>
          {t('pci_instance_creation_table_header_price')}{' '}
          <Text className="font-normal">
            {t('pci_instance_creation_table_header_price_monthly_unit')}
          </Text>
        </Text>
      ),
    },
  ];
};
