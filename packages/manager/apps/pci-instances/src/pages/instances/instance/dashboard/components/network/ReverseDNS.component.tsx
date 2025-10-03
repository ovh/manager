import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@ovhcloud/ods-react';
import { LoadingCell } from '@/pages/instances/datagrid/components/cell/LoadingCell.component';
import { useReverseDns } from '@/data/hooks/network/useNetwork';

const ReverseDNS: FC<{ ip: string }> = ({ ip }) => {
  const { t } = useTranslation('dashboard');
  const { data = [], isPending } = useReverseDns(ip);

  if (isPending || data.length > 0)
    return (
      <LoadingCell isLoading={isPending}>
        <Text preset="label">{t('pci_instances_dashboard_network_dns')}</Text>
        {data.map((dns) => (
          <Text key={dns}>{dns}</Text>
        ))}
      </LoadingCell>
    );

  return null;
};

export default ReverseDNS;
