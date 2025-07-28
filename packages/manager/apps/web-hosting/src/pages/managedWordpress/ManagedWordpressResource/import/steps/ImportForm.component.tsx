import { ManagerButton, Subtitle } from '@ovh-ux/manager-react-components';
import {
  OdsFormField,
  OdsInput,
  OdsPassword,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_COLOR,
  ODS_INPUT_TYPE,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { zForm } from '@/utils/formSchemas.utils';

export default function ImportForm() {
  const { t } = useTranslation([NAMESPACES.FORM, 'common']);
  const [step, setStep] = useState(1);

  const {
    control,
    handleSubmit,
    formState: { isValid, errors, isDirty },
  } = useForm({
    defaultValues: {
      url: '',
      password: '',
      login: '',
    },
    mode: 'onChange',
    resolver: zodResolver(zForm(t).ADD_SITE_FORM_SCHEMA),
  });

  const onStep1Submit = () => {
    setStep(2);
  };

  return (
    <>
      {step === 1 && (
        <form
          className="flex flex-col items-start w-full md:w-1/2 gap-4 mt-4"
          onSubmit={handleSubmit(onStep1Submit)}
        >
          <OdsText preset={ODS_TEXT_PRESET.span}>
            {t(`${NAMESPACES.FORM}:mandatory_fields`)}
          </OdsText>

          <Subtitle>{t('common:web_hosting_common_url_connexion')}</Subtitle>
          <Controller
            name="url"
            control={control}
            render={({ field: { name, value, onBlur, onChange } }) => (
              <OdsFormField className="w-full" error={errors?.url?.message}>
                <label slot="label">
                  {t('common:web_hosting_common_admin_url')}*
                </label>
                <OdsInput
                  type={ODS_INPUT_TYPE.text}
                  name={name}
                  value={value as string}
                  data-testid="input-login"
                  hasError={!!errors.url}
                  onOdsBlur={onBlur}
                  onOdsChange={onChange}
                  isClearable
                />
              </OdsFormField>
            )}
          />

          <Subtitle>{t('common:web_hosting_common_wordpress_login')}</Subtitle>
          <Controller
            name="login"
            control={control}
            render={({ field: { name, value, onBlur, onChange } }) => (
              <OdsFormField className="w-full" error={errors?.login?.message}>
                <label slot="label">
                  {t('common:web_hosting_common_admin_login')}*
                </label>
                <OdsInput
                  type={ODS_INPUT_TYPE.text}
                  name={name}
                  value={value as string}
                  data-testid="input-login"
                  hasError={!!errors.login}
                  onOdsBlur={onBlur}
                  onOdsChange={onChange}
                  isClearable
                />
              </OdsFormField>
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field: { name, value, onBlur, onChange } }) => (
              <OdsFormField
                className="w-full"
                error={errors?.password?.message}
              >
                <label slot="label">
                  {t('common:web_hosting_common_admin_password')}*
                </label>
                <OdsPassword
                  name={name}
                  value={value as string}
                  data-testid="input-password"
                  hasError={!!errors.password}
                  onOdsBlur={onBlur}
                  onOdsChange={onChange}
                  className="w-full"
                  isClearable
                  isMasked
                />
              </OdsFormField>
            )}
          />

          <OdsFormField>
            <ManagerButton
              type="submit"
              label={t('common:web_hosting_common_action_continue')}
              isDisabled={!isDirty || !isValid}
              color={ODS_BUTTON_COLOR.primary}
              id="import-step1"
            />
          </OdsFormField>
        </form>
      )}

      {step === 2 && (
        <form>
          <div>Step 2</div>
        </form>
      )}
    </>
  );
}
