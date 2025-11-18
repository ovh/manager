import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  OdsButton,
  OdsCombobox,
  OdsComboboxItem,
  OdsFormField,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { useBaremetalsList } from '@/data/hooks/baremetal/useBaremetalsList';

type Inputs = {
  baremetal: string;
};

export const FirstOrderFormComponent = () => {
  const { t } = useTranslation([NAMESPACES.ACTIONS, NAMESPACES.FORM]);
  const { flattenData, isLoading } = useBaremetalsList();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (dataForm) => console.log({ dataForm });

  return (
    <form
      className={`flex justify-center ${!!errors.baremetal ? 'items-center' : 'items-end'} gap-4 w-full`}
      onSubmit={void handleSubmit(onSubmit)}
    >
      <Controller
        name="baremetal"
        control={control}
        rules={{ required: t(`${NAMESPACES.FORM}:error_required_field`) }}
        render={({ field }) => (
          <OdsFormField className="w-full max-w-xl" error={errors.baremetal?.message}>
            <label htmlFor="baremetal-field" slot="label">
              {t('select_baremetal')}
            </label>
            <OdsCombobox
              id="baremetal-field"
              ref={field.ref}
              name={field.name}
              value={field.value}
              onOdsChange={field.onChange}
              onOdsBlur={field.onBlur}
              placeholder={t('select_baremetal')}
              isDisabled={isLoading}
              isRequired={!!errors.baremetal}
            >
              {flattenData?.map((baremetalService) => (
                <OdsComboboxItem
                  key={baremetalService.name}
                  value={baremetalService.name}
                  selectionLabel={`${baremetalService.name} - ${baremetalService.ip}`}
                >
                  <div className="flex flex-col py-3">
                    <OdsText preset="span">{baremetalService.iam.displayName}</OdsText>
                    <OdsText
                      preset="caption"
                      className="[&::part(text)]:text-[var(--ods-color-neutral-400)] -mt-3"
                    >
                      {baremetalService.ip}
                    </OdsText>
                  </div>
                </OdsComboboxItem>
              ))}
            </OdsCombobox>
          </OdsFormField>
        )}
      />
      <OdsButton type="submit" label={t(`${NAMESPACES.ACTIONS}:start`)} isDisabled={isLoading} />
    </form>
  );
};
