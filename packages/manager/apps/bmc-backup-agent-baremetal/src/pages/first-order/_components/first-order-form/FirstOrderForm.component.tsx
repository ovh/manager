import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { OdsButton } from '@ovhcloud/ods-components/react';

import { BaremetalOption } from '@ovh-ux/backup-agent/components/CommonFields/BaremetalOption/BaremetalOption.component';
import { RhfField } from '@ovh-ux/backup-agent/components/Fields/RhfField/RhfField.component';
import { useBaremetalsList } from '@ovh-ux/backup-agent/data/hooks/baremetal/useBaremetalsList';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';

type Inputs = {
  baremetal: string;
};

export const FirstOrderFormComponent = () => {
  const { t } = useTranslation(['onboarding', NAMESPACES.ACTIONS, NAMESPACES.FORM]);
  const { flattenData, isLoading } = useBaremetalsList();

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (dataForm) => console.log({ dataForm });

  return (
    <form
      className={`flex justify-center ${!!errors.baremetal ? 'items-center' : 'items-end'} gap-4 w-full`}
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <RhfField
        control={control}
        controllerParams={register('baremetal', { required: true })}
        helperMessage={t(`${NAMESPACES.FORM}:required_field`)}
        className="w-full max-w-xl"
      >
        <RhfField.Label>{t('select_baremetal')}</RhfField.Label>
        <RhfField.Combobox placeholder={t('select_baremetal')} isDisabled={isLoading}>
          {flattenData?.map(({ name, ip, iam: { displayName } }) => (
            <BaremetalOption key={name} name={name} ip={ip} displayName={displayName} />
          ))}
        </RhfField.Combobox>
      </RhfField>
      <OdsButton type="submit" label={t(`${NAMESPACES.ACTIONS}:start`)} isDisabled={isLoading} />
    </form>
  );
};
