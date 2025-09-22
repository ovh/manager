import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT, ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_COLOR_INTENT, ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsFormField, OsdsText, OsdsToggle } from '@ovhcloud/ods-components/react';

type NodeToggleProps = {
  nodePoolEnabled: boolean;
  onNodePoolEnabledChange: (val: boolean) => void;
  step: { isLocked: boolean };
};

const NodePoolToggle = ({
  nodePoolEnabled,
  step,
  onNodePoolEnabledChange,
}: Readonly<NodeToggleProps>) => {
  const { t } = useTranslation('node-pool');
  return (
    <>
      <OsdsFormField className="mt-8" inline>
        <OsdsToggle
          color={ODS_THEME_COLOR_INTENT.primary}
          checked={nodePoolEnabled || undefined}
          onClick={() => onNodePoolEnabledChange(!nodePoolEnabled)}
        >
          <OsdsText
            className="ml-4 font-bold"
            color={ODS_TEXT_COLOR_INTENT.text}
            level={ODS_TEXT_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            slot="end"
          >
            {t(`kube_common_node_pool_configure_${nodePoolEnabled}`)}
          </OsdsText>
        </OsdsToggle>
      </OsdsFormField>
      {!step.isLocked && (
        <p>
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('kubernetes_add_node_pool_description')}
          </OsdsText>
        </p>
      )}
    </>
  );
};

export default NodePoolToggle;
