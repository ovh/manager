import React from 'react';

import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { InformationFormProps } from '@/components/form/information-form/InformationForm.props';
import { TextField } from '@/components/form/text-field/TextField.component';
import type { TenantFormData } from '@/types/tenants.type';
import { toRequiredLabel } from '@/utils/form.utils';
import { DESCRIPTION_MAX_CHARS } from '@/utils/schemas/description.schema';
import { TITLE_MAX_CHARS, TITLE_MIN_CHARS } from '@/utils/schemas/title.schema';

export const InformationForm = ({
  title,
  namePlaceholder,
  descriptionPlaceholder,
}: InformationFormProps) => {
  const { t } = useTranslation([NAMESPACES.DASHBOARD, NAMESPACES.ERROR, 'shared']);
  const {
    control,
    formState: { errors },
  } = useFormContext<TenantFormData>();

  const infrastructureId = useWatch({
    control,
    name: 'infrastructureId',
  });

  return (
    <>
      <Text preset={TEXT_PRESET.heading2}>{title}</Text>
      <div className="mt-6">
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              id="title"
              label={toRequiredLabel(t(`${NAMESPACES.DASHBOARD}:name`), t('shared:mandatory'))}
              placeholder={namePlaceholder}
              type="text"
              isRequired
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.title?.message}
              isDisabled={!infrastructureId}
              helper={t(`${NAMESPACES.FORM}:error_between_min_max_chars`, {
                min: TITLE_MIN_CHARS,
                max: TITLE_MAX_CHARS,
              })}
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              id="description"
              label={toRequiredLabel(
                t(`${NAMESPACES.DASHBOARD}:description`),
                t('shared:mandatory'),
              )}
              placeholder={descriptionPlaceholder}
              type="textarea"
              isRequired
              rows={4}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.description?.message}
              isDisabled={!infrastructureId}
              helper={t(`${NAMESPACES.FORM}:error_max_chars`, { value: DESCRIPTION_MAX_CHARS })}
            />
          )}
        />
      </div>
    </>
  );
};
