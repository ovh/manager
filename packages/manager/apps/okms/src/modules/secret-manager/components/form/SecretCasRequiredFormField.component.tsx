import { useSecretSmartConfig } from '@secret-manager/hooks/useSecretSmartConfig';
import { Secret } from '@secret-manager/types/secret.type';
import { FieldValues, UseControllerProps, useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { OdsFormField } from '@ovhcloud/ods-components/react';
import {
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
    <OdsFormField error={fieldState.error?.message}>
      <label slot="label" className="relative mb-1 flex items-center gap-2">
        <span>{t('cas_with_description')}</span>
        <HelpIconWithTooltip label={t('cas_with_description_tooltip')} />
      </label>
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
