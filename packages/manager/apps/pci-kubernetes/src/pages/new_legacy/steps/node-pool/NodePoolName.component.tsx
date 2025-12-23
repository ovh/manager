import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT, ODS_THEME_TYPOGRAPHY_LEVEL } from '@ovhcloud/ods-common-theming';
import { ODS_INPUT_TYPE, ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsFormField, OsdsInput, OsdsText } from '@ovhcloud/ods-components/react';

type NodeNameProps = {
  error?: string | null;
  onTouched: (val: boolean) => void;
  name: string;
  onNameChange: (val: string) => void;
};

const NodePoolName = ({ error, onTouched, name, onNameChange }: NodeNameProps) => {
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
      <OsdsFormField class="mt-6" error={error ? t(error) : ''} inline>
        <OsdsText
          slot="label"
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          color={error ? ODS_THEME_COLOR_INTENT.error : ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._200}
        >
          {t('kubernetes_add_name')}
        </OsdsText>
        <div className="w-fit">
          <OsdsInput
            placeholder={t('kube_add_node_pool_name_label')}
            value={name}
            color={error ? ODS_THEME_COLOR_INTENT.error : ODS_THEME_COLOR_INTENT.primary}
            type={ODS_INPUT_TYPE.text}
            onOdsValueChange={(e) => {
              onNameChange(e.detail.value ?? '');
            }}
            onOdsInputBlur={() => onTouched(true)}
            error={!!error}
          />
        </div>
      </OsdsFormField>
    </>
  );
};

export default NodePoolName;
