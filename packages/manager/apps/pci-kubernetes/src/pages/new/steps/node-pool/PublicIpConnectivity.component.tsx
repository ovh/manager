import { useTranslation } from 'react-i18next';

import { TEXT_PRESET, Text, Toggle, ToggleControl, ToggleLabel } from '@ovhcloud/ods-react';

type PublicIpConnectivityProps = {
  price: string;
};

const PublicIpConnectivity = ({ price }: PublicIpConnectivityProps) => {
  const { t } = useTranslation('node-pool');

  return (
    <div className="max-w-3xl">
      <Text className="my-6 font-bold text-[--ods-color-text-500]" preset={TEXT_PRESET.heading4}>
        {t('kube_common_node_pool_public_connetivity_title')}
      </Text>
      <div className="mb-6">
        <div className="flex gap-4">
          <Toggle withLabels disabled checked>
            <ToggleControl />
            <ToggleLabel className=" text-[--ods-color-text]" color="text">
              <span className="font-semibold">
                {t('kube_common_node_pool_public_connetivity_public_ip')}
              </span>
              <span> {` (${price} / ${t('kube_common_node_pool_node')})`}</span>
            </ToggleLabel>
          </Toggle>
        </div>
      </div>
    </div>
  );
};

export default PublicIpConnectivity;
