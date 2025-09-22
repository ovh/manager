import { useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';

import { OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';

export type EstimationRow = {
  label: string;
  value?: string;
  show: boolean;
};

const Estimation = ({ rows }: { rows: EstimationRow[] }) => {
  const { t } = useTranslation('node-pool');

  return (
    <div className="flex flex-col gap-6 mb-8">
      <OsdsText
        className="font-bold"
        color={ODS_TEXT_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.heading}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
      >
        {t('kube_common_node_pool_estimated_cost')}
      </OsdsText>

      {rows
        .filter((row) => row.show)
        .map(({ label, value }, index) => (
          <OsdsText
            key={index}
            color={ODS_THEME_COLOR_INTENT.text}
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
          >
            {value ? (
              <>
                <strong>{label}</strong> {value}
              </>
            ) : (
              label
            )}
          </OsdsText>
        ))}
    </div>
  );
};

export default Estimation;
