import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, Card, Button, Icon } from '@ovhcloud/ods-react';
import type { TVpsNetworkForView } from '../view-models/dashboard.view-model';

type TVpsNetworkTileProps = {
  network: TVpsNetworkForView;
};

export const VpsNetworkTile = ({ network }: TVpsNetworkTileProps) => {
  const { t } = useTranslation('vps');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = async (value: string, field: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const renderIpRow = (label: string, value: string | null, field: string) => {
    if (!value) return null;

    return (
      <div className="flex items-center justify-between">
        <Text preset="paragraph" className="text-gray-600">
          {label}
        </Text>
        <div className="flex items-center gap-2">
          <Text preset="paragraph" className="font-mono">
            {value}
          </Text>
          <Button
            variant="ghost"
            size="sm"
            label={
              copiedField === field
                ? t('vps_dashboard_network_copied')
                : t('vps_dashboard_network_copy')
            }
            onClick={() => handleCopy(value, field)}
          />
        </div>
      </div>
    );
  };

  return (
    <Card className="p-6">
      <Text preset="heading-4" className="mb-4">
        {t('vps_dashboard_network_tile_title')}
      </Text>

      <div className="space-y-3">
        {renderIpRow(t('vps_dashboard_network_ipv4'), network.ipV4, 'ipv4')}
        {renderIpRow(t('vps_dashboard_network_ipv6'), network.ipV6, 'ipv6')}
      </div>
    </Card>
  );
};
