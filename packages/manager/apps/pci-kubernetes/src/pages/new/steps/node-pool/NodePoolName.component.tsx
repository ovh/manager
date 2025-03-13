import {
  OsdsText,
  OsdsInput,
  OsdsFormField,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import {
  ODS_INPUT_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';

import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';

type NodeNameProps = {
  hasError: boolean;
  onTouched: (val: boolean) => void;
  name: string;
  onNameChange: (val: string) => void;
};

const NodePoolName = ({
  hasError,
  onTouched,
  name,
  onNameChange,
}: NodeNameProps) => {
  const { t } = useTranslation('add');

  return (
    <>
      <OsdsText
        className="mb-4 font-bold"
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.heading}
        size={ODS_TEXT_SIZE._400}
        slot="label"
      >
        {t('kubernetes_add_nodepool_name_placeholder')}
      </OsdsText>
      <OsdsFormField
        class="mt-6"
        error={
          hasError
            ? t('kube_add_node_pool_name_input_pattern_validation_error')
            : ''
        }
        inline
      >
        <OsdsText
          slot="label"
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._200}
        >
          {t('kubernetes_add_name')}
        </OsdsText>
        <OsdsInput
          placeholder={t('kube_add_node_pool_name_label')}
          value={name}
          color={ODS_THEME_COLOR_INTENT.primary}
          type={ODS_INPUT_TYPE.text}
          onOdsValueChange={(e) => {
            onNameChange(e.detail.value);
          }}
          onOdsInputBlur={() => onTouched(true)}
          error={hasError}
        />
      </OsdsFormField>
    </>
  );
};

export default NodePoolName;
