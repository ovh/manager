import {
  OsdsButton,
  OsdsText,
  OsdsInput,
  OsdsFormField,
  OsdsToggle,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import {
  ODS_INPUT_TYPE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
} from '@ovhcloud/ods-components';

import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
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
  const { t: tAdd } = useTranslation('add');

  return (
    <OsdsFormField
      class="mt-6"
      error={
        hasError
          ? tAdd('kubernetes_add_cluster_name_input_pattern_validation_error')
          : ''
      }
      inline
    >
      <OsdsText
        className="ml-4 font-bold"
        color={ODS_TEXT_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
      >
        {tAdd('kubernetes_add_name')}
      </OsdsText>
      <OsdsInput
        placeholder={tAdd('kubernetes_add_nodepool_name_placeholder')}
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
  );
};

export default NodePoolName;
