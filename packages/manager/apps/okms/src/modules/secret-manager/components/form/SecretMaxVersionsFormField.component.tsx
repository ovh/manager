import { useSecretSmartConfig } from '@secret-manager/hooks/useSecretSmartConfig';
import { Secret } from '@secret-manager/types/secret.type';
import {
  MAX_VERSIONS_MAX_VALUE,
  MAX_VERSIONS_MIN_VALUE,
} from '@secret-manager/validation/secret-config/secretConfigSchema';
import { FieldValues, UseControllerProps, useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  FormField,
  FormFieldError,
  FormFieldHelper,
  FormFieldLabel,
  Quantity,
  QuantityControl,
  QuantityInput,
} from '@ovhcloud/ods-react';
import { Skeleton, Text } from '@ovhcloud/ods-react';

import { SECRET_FORM_FIELD_TEST_IDS } from './form.constants';

type SecretMaxVersionsFormFieldProps<T extends FieldValues> = UseControllerProps<T> & {
  secret?: Secret;
  okmsId?: string;
};

export const SecretMaxVersionsFormField = <T extends FieldValues>({
  name,
  control,
  secret,
  okmsId,
}: SecretMaxVersionsFormFieldProps<T>) => {
  const { t } = useTranslation('secret-manager');
  const { field, fieldState } = useController({ name, control });

  return (
    <FormField>
      <FormFieldLabel className="flex items-center gap-2">
        {t('maximum_number_of_versions')}
      </FormFieldLabel>
      <Quantity
        id={field.name}
        name={field.name}
        value={String(field.value ?? 0)}
        onBlur={field.onBlur}
        onValueChange={({ valueAsNumber }) => field.onChange(valueAsNumber)}
        data-testid={SECRET_FORM_FIELD_TEST_IDS.MAX_VERSIONS}
        min={MAX_VERSIONS_MIN_VALUE}
        max={MAX_VERSIONS_MAX_VALUE}
        className="justify-start"
      >
        <QuantityControl>
          <QuantityInput />
        </QuantityControl>
      </Quantity>
      {okmsId ? <FormHelper secret={secret} okmsId={okmsId} /> : null}
      {fieldState.error?.message && <FormFieldError>{fieldState.error?.message}</FormFieldError>}
    </FormField>
  );
};

const FormHelper = ({ secret, okmsId }: { secret?: Secret; okmsId: string }) => {
  const { t } = useTranslation(['secret-manager']);

  const { secretConfig, isPending, error } = useSecretSmartConfig({ secret, okmsId });

  if (isPending) return <Skeleton />;

  if (error) return null;

  if (secretConfig.maxVersions) {
    return (
      <FormFieldHelper>
        <Text preset="caption">
          {secretConfig.maxVersions.origin === 'DEFAULT'
            ? t('form_helper_max_versions_default', { value: secretConfig.maxVersions.value })
            : t('form_helper_max_versions_domain', { value: secretConfig.maxVersions.value })}
        </Text>
      </FormFieldHelper>
    );
  }

  return null;
};
