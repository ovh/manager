import React from 'react';

import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { TEXT_PRESET, Text } from '@ovh-ux/muk';

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

  const infrastructureId = useWatch({
    control,
    name: 'infrastructureId',
  });

  return (
    <>
      <Text preset={TEXT_PRESET.heading2}>{title}</Text>
      <div className="mt-6 space-y-4">
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
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              id="description"
              label={t(`${NAMESPACES.DASHBOARD}:description`)}
              placeholder={descriptionPlaceholder}
              type="textarea"
              rows={4}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.description?.message}
              isDisabled={!infrastructureId}
            />
          )}
        />
      </div>
    </>
  );
};
