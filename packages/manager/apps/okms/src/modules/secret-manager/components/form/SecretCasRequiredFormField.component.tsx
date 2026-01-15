import { useSecretSmartConfig } from '@secret-manager/hooks/useSecretSmartConfig';
import { Secret } from '@secret-manager/types/secret.type';
import { UseControllerProps, useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { OdsFormField, OdsRadio } from '@ovhcloud/ods-components/react';
import { Skeleton, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { HelpIconWithTooltip } from '@/common/components/help-icon-with-tooltip/HelpIconWithTooltip.component';

import { SECRET_FORM_FIELD_TEST_IDS } from './form.constants';

type CasRequiredFormValue = 'active' | 'inactive';

type FormFieldInput = {
  casRequired?: CasRequiredFormValue;
};

type SecretCasRequiredFormFieldProps<T extends FormFieldInput> = UseControllerProps<T> & {
  secret?: Secret;
  okmsId?: string;
};

export const SecretCasRequiredFormField = <T extends FormFieldInput>({
  name,
  control,
  secret,
  okmsId,
}: SecretCasRequiredFormFieldProps<T>) => {
  const { t } = useTranslation(['secret-manager', NAMESPACES.STATUS]);
  const { field, fieldState } = useController({ name, control });

  return (
    <OdsFormField error={fieldState.error?.message}>
      <label slot="label" className="relative mb-1 flex items-center gap-2">
        <span>{t('cas_with_description')}</span>
        <HelpIconWithTooltip label={t('cas_with_description_tooltip')} />
      </label>
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <OdsRadio
            inputId={`${field.name}-active`}
            name={field.name}
            value="active"
            isChecked={field.value === 'active'}
            onOdsChange={field.onChange}
            data-testid={SECRET_FORM_FIELD_TEST_IDS.CAS_REQUIRED_ACTIVE}
          />
          <label htmlFor={`${field.name}-active`}>
            <Text preset="paragraph">{t('activated')}</Text>
          </label>
        </div>
        <div className="flex items-center gap-2">
          <OdsRadio
            inputId={`${field.name}-inactive`}
            name={field.name}
            value="inactive"
            isChecked={field.value === 'inactive'}
            onOdsChange={field.onChange}
            data-testid={SECRET_FORM_FIELD_TEST_IDS.CAS_REQUIRED_INACTIVE}
          />
          <label htmlFor={`${field.name}-inactive`}>
            <Text preset="paragraph">{t('disabled', { ns: NAMESPACES.STATUS })}</Text>
          </label>
        </div>
      </div>
      {okmsId ? <FormHelper secret={secret} okmsId={okmsId} /> : null}
    </OdsFormField>
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
      <Text slot="helper" preset="caption">
        {t('form_helper_cas_required_okms')}
      </Text>
    );
  }

  return null;
};
