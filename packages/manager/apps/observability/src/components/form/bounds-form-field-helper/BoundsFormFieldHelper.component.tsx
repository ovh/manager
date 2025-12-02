import { useTranslation } from 'react-i18next';

import { FormFieldHelper, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { BoundsFormFieldHelperProps } from '@/components/form/bounds-form-field-helper/BoundsFormFieldHelper.props';

export const BoundsFormFieldHelper = ({ min, max, error }: BoundsFormFieldHelperProps) => {
  const { t } = useTranslation('shared');
  return (
    <FormFieldHelper>
      {min && max && (
        <Text preset={TEXT_PRESET.caption}>
          {t('form.bounds.helper', {
            min,
            max,
          })}
        </Text>
      )}
      {error?.message && (
        <div>
          <Text preset={TEXT_PRESET.caption}>{error.message}</Text>
        </div>
      )}
    </FormFieldHelper>
  );
};
