import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT, ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_COLOR_INTENT, ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsFormField, OsdsText, OsdsToggle } from '@ovhcloud/ods-components/react';

import { ANTI_AFFINITY_MAX_NODES } from '@/constants';

type NodePoolAntiAffinityProps = {
  isChecked: boolean;
  isEnabled: boolean;
  onChange: (val: boolean) => void;
};
const NodePoolAntiAffinity = ({ isChecked, onChange, isEnabled }: NodePoolAntiAffinityProps) => {
  const { t } = useTranslation('billing-anti-affinity');

  return (
    <div className="mb-6">
      <OsdsText
        className="mb-4 font-bold block"
        color={ODS_TEXT_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.heading}
        size={ODS_TEXT_SIZE._400}
      >
        {t('kubernetes_node_pool_anti_affinity')}
      </OsdsText>
      <OsdsText
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {t('kubernetes_node_pool_anti_affinity_description', {
          maxNodes: ANTI_AFFINITY_MAX_NODES,
        })}
      </OsdsText>
      <OsdsFormField className="mt-8" inline>
        <OsdsToggle
          data-testid="toggle-anti-affinity"
          disabled={!isEnabled || undefined}
          color={ODS_THEME_COLOR_INTENT.primary}
          checked={isChecked || undefined}
          onClick={() => isEnabled && onChange(!isChecked)}
        >
          <OsdsText
            className="ml-4 font-bold"
            color={ODS_TEXT_COLOR_INTENT.text}
            level={ODS_TEXT_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            slot="end"
          >
            {t(`kubernetes_node_pool_anti_affinity_${isChecked}`)}
          </OsdsText>
        </OsdsToggle>
      </OsdsFormField>
    </div>
  );
};

export default NodePoolAntiAffinity;
