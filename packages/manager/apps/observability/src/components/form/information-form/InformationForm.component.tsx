import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { InformationFormProps } from '@/components/form/information-form/InformationForm.props';
import { TextField } from '@/components/form/text-field/TextField.component';
import type { TenantFormData } from '@/types/tenants.type';
import { toRequiredLabel } from '@/utils/form.utils';

export const InformationForm = ({
  title,
  namePlaceholder,
  descriptionPlaceholder,
}: InformationFormProps) => {
  const { t } = useTranslation([NAMESPACES.DASHBOARD, 'shared']);
  const {
    control,
    formState: { errors },
  } = useFormContext<TenantFormData>();

  return (
    <>
      <OdsText preset={ODS_TEXT_PRESET.heading4}>{title}</OdsText>
      <div className="space-y-4 mt-6">
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              id="title"
              label={toRequiredLabel(t(`${NAMESPACES.DASHBOARD}:name`))}
              placeholder={namePlaceholder}
              type="text"
              isRequired
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.title?.message}
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              id="description"
              label={t('shared:description')}
              placeholder={descriptionPlaceholder}
              type="textarea"
              rows={4}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.description?.message}
            />
          )}
        />
      </div>
    </>
  );
};
