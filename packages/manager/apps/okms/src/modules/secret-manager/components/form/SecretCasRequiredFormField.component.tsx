import { useSecretSmartConfig } from '@secret-manager/hooks/useSecretSmartConfig';
import { Secret } from '@secret-manager/types/secret.type';
import { FieldValues, UseControllerProps, useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  FormField,
  FormFieldError,
  FormFieldHelper,
  FormFieldLabel,
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  RadioValueChangeDetail,
  Skeleton,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { HelpIconWithTooltip } from '@/common/components/help-icon-with-tooltip/HelpIconWithTooltip.component';

import { SECRET_FORM_FIELD_TEST_IDS } from './form.constants';

type CasRequiredFormValue = 'active' | 'inactive';

type SecretCasRequiredFormFieldProps<T extends FieldValues> = UseControllerProps<T> & {
  isCasRequiredSetOnOkms?: boolean;
  okmsId?: string;
  secret?: Secret;
};

export const SecretCasRequiredFormField = <T extends FieldValues>({
  name,
  control,
  secret,
  okmsId,
}: SecretCasRequiredFormFieldProps<T>) => {
  const { t } = useTranslation(['secret-manager', NAMESPACES.STATUS]);
  const { field, fieldState } = useController({ name, control });

  return (
    <FormField invalid={!!fieldState.error}>
      <FormFieldLabel className="flex items-center gap-2">
        {t('cas_with_description')}
        <HelpIconWithTooltip label={t('cas_with_description_tooltip')} />
      </FormFieldLabel>
      <RadioGroup
        value={field.value}
        onValueChange={(detail: RadioValueChangeDetail) => field.onChange(detail.value)}
        className="flex flex-row gap-4"
      >
        <Radio value="active" data-testid={SECRET_FORM_FIELD_TEST_IDS.CAS_REQUIRED_ACTIVE}>
          <RadioControl />
          <RadioLabel>
            <Text preset="paragraph">{t('activated')}</Text>
          </RadioLabel>
        </Radio>
        <Radio value="inactive" data-testid={SECRET_FORM_FIELD_TEST_IDS.CAS_REQUIRED_INACTIVE}>
          <RadioControl />
          <RadioLabel>
            <Text preset="paragraph">{t('disabled', { ns: NAMESPACES.STATUS })}</Text>
          </RadioLabel>
        </Radio>
      </RadioGroup>
      {fieldState.error?.message && <FormFieldError>{fieldState.error?.message}</FormFieldError>}
      {okmsId ? <FormHelper secret={secret} okmsId={okmsId} /> : null}
    </FormField>
  );
};

export const casRequiredToFormValue = (casRequired: boolean): CasRequiredFormValue => {
  return casRequired ? 'active' : 'inactive';
};

export const formValueToCasRequired = (formValue: CasRequiredFormValue): boolean => {
  return formValue === 'active';
};

const FormHelper = ({ secret, okmsId }: { secret?: Secret; okmsId: string }) => {
  const { t } = useTranslation(['secret-manager']);

  const { secretConfig, isPending, error } = useSecretSmartConfig({ secret, okmsId });

  if (isPending) return <Skeleton />;

  if (error) return null;

  if (secretConfig.isCasRequiredSetOnOkms) {
    return (
      <FormFieldHelper>
        <Text preset="caption">{t('form_helper_cas_required_okms')}</Text>
      </FormFieldHelper>
    );
  }
};
