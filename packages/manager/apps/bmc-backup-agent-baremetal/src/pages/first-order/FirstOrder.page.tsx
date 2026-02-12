import { Outlet, useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { OdsButton, OdsCombobox, OdsFormField } from '@ovhcloud/ods-components/react';

import { BaremetalOption } from '@ovh-ux/backup-agent/components/CommonFields/BaremetalOption/BaremetalOption.component';
import { baremetalsQueries } from '@ovh-ux/backup-agent/data/queries/baremetals.queries';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { OnboardingDescription } from '@/components/onboarding/onboardingDescription/OnboardingDescription.component';
import { OnboardingLayout } from '@/components/onboarding/onboardingLayout/OnboardingLayout.component';
import { useOnboardingContent } from '@/hooks/onboarding/useOnboardingData';
import { useOnboardingHeroImage } from '@/hooks/onboarding/useOnboardingHeroImage';
import { urlParams, urls } from '@/routes/Routes.constants';

const FIRST_ORDER_SCHEMA = z.object({
  baremetal: z.string().min(1),
});
type FirstOrderSchema = z.infer<typeof FIRST_ORDER_SCHEMA>;

export default function FirstOrderPage() {
  const { t } = useTranslation([
    'onboarding',
    NAMESPACES.ACTIONS,
    NAMESPACES.ONBOARDING,
    NAMESPACES.FORM,
  ]);

  const { productName, title } = useOnboardingContent();
  const img = useOnboardingHeroImage();
  const { data: baremetals, isPending: isLoading } = useQuery(baremetalsQueries.all());
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FirstOrderSchema>({
    resolver: zodResolver(FIRST_ORDER_SCHEMA),
    defaultValues: { baremetal: '' },
  });

  const onSubmit: SubmitHandler<FirstOrderSchema> = (dataForm) => {
    if (!dataForm.baremetal) {
      return;
    }
    navigate(urls.firstOrderConfirmation.replace(urlParams.baremetalName, dataForm.baremetal));
  };

  return (
    <>
      <section className="flex flex-col items-center justify-center gap-10">
        <OnboardingLayout
          title={title ?? t('onboarding:title_fallback', { productName })}
          img={img}
          description={<OnboardingDescription />}
        />
        <form
          className={`flex justify-center ${
            errors.baremetal ? 'items-center' : 'items-end'
          } w-full gap-4`}
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            control={control}
            name="baremetal"
            render={({ field, fieldState: { invalid } }) => (
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
                  {baremetals?.map(({ name, ip, iam: { displayName } }) => (
                    <BaremetalOption key={name} name={name} ip={ip} displayName={displayName} />
                  ))}
                </OdsCombobox>
              </OdsFormField>
            )}
          />
          <OdsButton
            type="submit"
            label={t(`${NAMESPACES.ACTIONS}:start`)}
            isDisabled={isLoading}
          />
        </form>
      </section>
      <Outlet />
    </>
  );
}
