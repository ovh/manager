import { useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { OdsButton, OdsCombobox } from '@ovhcloud/ods-components/react';
import { OdsFormField } from '@ovhcloud/ods-components/react';

import { BaremetalOption } from '@ovh-ux/backup-agent/components/CommonFields/BaremetalOption/BaremetalOption.component';
import { useBaremetalsList } from '@ovh-ux/backup-agent/data/hooks/baremetal/useBaremetalsList';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';

const FIRST_ORDER_SCHEMA = z.object({
  baremetal: z.string().min(1),
});
type FirstOrderSchema = z.infer<typeof FIRST_ORDER_SCHEMA>;

export const FirstOrderFormComponent = () => {
  const { t } = useTranslation(['onboarding', NAMESPACES.ACTIONS, NAMESPACES.FORM]);
  const { flattenData, isLoading } = useBaremetalsList();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FirstOrderSchema>({
    resolver: zodResolver(FIRST_ORDER_SCHEMA as any),
    defaultValues: { baremetal: '' },
  });
  const onSubmit: SubmitHandler<FirstOrderSchema> = (dataForm) => {
    console.log({ dataForm });
    navigate('confirmation');
  };

  return (
    <form
      className={`flex justify-center ${!!errors.baremetal ? 'items-center' : 'items-end'} w-full gap-4`}
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* TODO: fix RhfField component to use it here */}
      <Controller
        control={control}
        name="baremetal"
        render={({ field, fieldState: { invalid } }) => {
          return (
            <OdsFormField
              className="w-full max-w-xl"
              error={invalid ? t(`${NAMESPACES.FORM}:required_field`) : undefined}
            >
              <label htmlFor={field.name}>{t('select_baremetal')}</label>
              <OdsCombobox
                id={field.name}
                {...field}
                placeholder={t('select_baremetal')}
                isDisabled={isLoading}
                hasError={invalid}
                onOdsBlur={field.onBlur}
                onOdsChange={field.onChange}
              >
                {flattenData?.map(({ name, ip, iam: { displayName } }) => (
                  <BaremetalOption key={name} name={name} ip={ip} displayName={displayName} />
                ))}
              </OdsCombobox>
            </OdsFormField>
          );
        }}
      />
      <OdsButton type="submit" label={t(`${NAMESPACES.ACTIONS}:start`)} isDisabled={isLoading} />
    </form>
  );
};
