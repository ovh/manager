import { useTranslation } from 'react-i18next';

import { TEXT_PRESET, Text, Toggle, ToggleControl, ToggleLabel } from '@ovhcloud/ods-react';

import { ANTI_AFFINITY_MAX_NODES } from '@/constants';

type NodePoolAntiAffinityProps = {
  isChecked: boolean;
  isEnabled: boolean;
  onChange: (val: boolean) => void;
};
const NodePoolAntiAffinity = ({ isChecked, onChange, isEnabled }: NodePoolAntiAffinityProps) => {
  const { t } = useTranslation('billing-anti-affinity');

  return (
    <div className="mb-6 max-w-3xl">
      <Text className="text-[--ods-color-text-500]" preset={TEXT_PRESET.heading4}>
        {t('kubernetes_node_pool_anti_affinity')}
      </Text>
      <Text>
        {t('kubernetes_node_pool_anti_affinity_description', {
          maxNodes: ANTI_AFFINITY_MAX_NODES,
        })}
      </Text>
      <div className="mt-8">
        <Toggle
          withLabels
          data-testid="toggle-anti-affinity"
          disabled={!isEnabled}
          color="primary"
          checked={isChecked}
          onChange={() => isEnabled && onChange(!isChecked)}
        >
          <ToggleControl />
          <ToggleLabel className="font-semibold text-[--ods-color-text]">
            {t(`kubernetes_node_pool_anti_affinity_${isChecked}`)}
          </ToggleLabel>
        </Toggle>
      </div>
    </div>
  );
};

export default NodePoolAntiAffinity;
