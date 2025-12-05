import { useTranslation } from 'react-i18next';

import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';

export type EstimationRow =
  | {
      label: string;
      value: string;
      show: true;
    }
  | {
      label: string;
      value?: null;
      show: false;
    };

const Estimation = ({ rows }: { rows: EstimationRow[] }) => {
  const { t } = useTranslation('node-pool');

  return (
    <div className="mb-8 flex flex-col">
      <Text className="my-6 text-[--ods-color-text-500]" preset={TEXT_PRESET.heading4}>
        {t('kube_common_node_pool_estimated_cost')}
      </Text>

      {rows
        .filter((row) => row.show)
        .map(({ label, value }, index) => (
          <Text className="mb-4" key={index} preset={TEXT_PRESET.paragraph}>
            {value ? (
              <>
                <span className="font-bold">{label}</span> {value}
              </>
            ) : (
              label
            )}
          </Text>
        ))}
    </div>
  );
};

export default Estimation;
