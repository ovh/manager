import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { z } from 'zod';

import { OdsButton, OdsCombobox, OdsFormField, OdsMessage } from '@ovhcloud/ods-components/react';

import { BaremetalOption } from '@ovh-ux/backup-agent/components/CommonFields/BaremetalOption/BaremetalOption.component';
import { useBaremetalsList } from '@ovh-ux/backup-agent/data/hooks/baremetal/useBaremetalsList';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useOrderURL } from '@ovh-ux/manager-module-order';
import { Links } from '@ovh-ux/manager-react-components';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';

import { generateOrderExpressUrl } from '@/utils/generateOrderExpressUrl';

const FIRST_ORDER_SCHEMA = z.object({
  baremetal: z.string().min(1),
});
type FirstOrderSchema = z.infer<typeof FIRST_ORDER_SCHEMA>;

export const FirstOrderFormComponent = () => {
  const { t } = useTranslation(['onboarding', NAMESPACES.ACTIONS, NAMESPACES.FORM]);
  const { flattenData, isLoading } = useBaremetalsList();
  const { data: billingUrl, isPending: isBillingUrlPending } = useNavigationGetUrl([
    'dedicated',
    '#/billing/orders',
    {},
  ]);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FirstOrderSchema>({
    resolver: zodResolver(FIRST_ORDER_SCHEMA as any),
    defaultValues: { baremetal: '' },
  });

  const baseUrl = useOrderURL('express_review_base');
  const onSubmit: SubmitHandler<FirstOrderSchema> = (dataForm) => {
    const selectedBaremetal = flattenData?.find(({ name }) => name === dataForm.baremetal);

    if (!selectedBaremetal) {
      return;
    }

    const { name, ip, region } = selectedBaremetal;
    window.open(
      generateOrderExpressUrl({
        baseUrl,
        agentIp: ip,
        agentRegionName: region,
        agentServiceName: name,
      }),
      '_blank',
    );
  };
  return (
    <section className="flex flex-col justify-center">
      <OdsMessage color="information" isDismissible={false} className="w-full pb-5">
        <Trans
          ns="onboarding"
          i18nKey="baremetal_label_delay_order"
          values={{ href: (billingUrl as string) ?? '#' }}
          components={{
            OrderLink: (
              <Links
                className="px-2"
                href={(billingUrl as string) ?? '#'}
                isDisabled={isBillingUrlPending}
              />
            ),
          }}
        />
      </OdsMessage>
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
    </section>
  );
};
