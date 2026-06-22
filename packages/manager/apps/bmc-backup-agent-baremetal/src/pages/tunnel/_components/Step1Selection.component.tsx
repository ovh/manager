import { useEffect, useId, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsCheckbox,
  OdsCombobox,
  OdsComboboxItem,
  OdsFormField,
  OdsMessage,
  OdsSkeleton,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { baremetalsQueries } from '@ovh-ux/backup-agent/data/queries/baremetals.queries';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Contract } from '@ovh-ux/manager-module-order';
import { LinkType, Links } from '@ovh-ux/manager-react-components';

import { useCheckoutBackupAgentCart } from '@/hooks/useCheckoutBackupAgentCart';
import { useCreateBackupAgentCart } from '@/hooks/useCreateBackupAgentCart';
import { Step1CompletedData, TunnelOs } from '@/types/Tunnel.type';
import { TUNNEL_LINKS } from '@/utils/tunnel.constants';

const schema = z.object({
  serverName: z.string().min(1),
  termsAccepted: z.literal(true),
});
type FormValues = z.infer<typeof schema>;

type BaremetalQueryFn = Extract<
  NonNullable<ReturnType<typeof baremetalsQueries.all>['queryFn']>,
  (...args: never[]) => unknown
>;
type Baremetal = Awaited<ReturnType<BaremetalQueryFn>>[number];

export type Step1SelectionProps = {
  onCheckoutPendingChange?: (pending: boolean) => void;
  onComplete: (data: Step1CompletedData) => void;
};

export const Step1Selection = ({ onCheckoutPendingChange, onComplete }: Step1SelectionProps) => {
  const { t } = useTranslation(['tunnel', NAMESPACES.ERROR]);
  const comboboxId = useId();
  const termsCheckboxId = useId();

  const {
    data: baremetals,
    isPending: isBaremetalsPending,
    isError: isBaremetalsError,
    refetch: refetchBaremetals,
  } = useQuery(baremetalsQueries.all());

  const { control, handleSubmit, setValue, watch } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { serverName: '', termsAccepted: false as unknown as true },
  });
  const watchedServerName = watch('serverName');
  const watchedTermsAccepted = watch('termsAccepted');

  const [cartId, setCartId] = useState<string | null>(null);
  const [contractList, setContractList] = useState<Contract[]>([]);
  const [cartPending, setCartPending] = useState(false);
  const [cartError, setCartError] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const selectedBaremetalRef = useRef<Baremetal | null>(null);

  const { mutateAsync: createCart } = useCreateBackupAgentCart();
  const { mutate: checkout, isPending: checkoutPending } = useCheckoutBackupAgentCart({
    onSuccess: () => {
      const server = selectedBaremetalRef.current;
      if (!server) return;
      onComplete({
        serverName: server.name,
        serverIp: server.ip,
        serverRegion: server.region,
        os: /win/i.test(server.os) ? 'WINDOWS' : 'LINUX',
      });
    },
    onError: (error) => {
      setCheckoutError(error.response?.data.message ?? error.message);
    },
  });

  useEffect(() => {
    onCheckoutPendingChange?.(checkoutPending);
  }, [checkoutPending, onCheckoutPendingChange]);

  // Build (or rebuild, on server change) the cart. A cancellation flag drops stale
  // results when the user switches servers faster than a cart completes.
  useEffect(() => {
    if (!watchedServerName || !baremetals) return undefined;
    const server = baremetals.find((bm) => bm.name === watchedServerName);
    if (!server) return undefined;
    selectedBaremetalRef.current = server;

    let cancelled = false;
    setCartId(null);
    setContractList([]);
    setCartError(false);
    setCheckoutError(null);
    setValue('termsAccepted', false as unknown as true);
    setCartPending(true);

    createCart({
      agentIp: server.ip,
      agentRegionName: server.region,
      agentServiceName: server.name,
    })
      .then((result) => {
        if (cancelled) return;
        setCartId(result.cartId);
        setContractList(result.contractList);
        setCartPending(false);
      })
      .catch(() => {
        if (cancelled) return;
        setCartError(true);
        setCartPending(false);
      });

    return () => {
      cancelled = true;
    };
  }, [watchedServerName, baremetals, createCart, setValue]);

  const handleCartRetry = () => {
    const server = selectedBaremetalRef.current;
    if (!server) return;
    setCartError(false);
    setCartPending(true);
    createCart({
      agentIp: server.ip,
      agentRegionName: server.region,
      agentServiceName: server.name,
    })
      .then((result) => {
        setCartId(result.cartId);
        setContractList(result.contractList);
        setCartPending(false);
      })
      .catch(() => {
        setCartError(true);
        setCartPending(false);
      });
  };

  const onSubmit = () => {
    if (!cartId) return;
    setCheckoutError(null);
    checkout({ cartId });
  };

  const isEmptyBaremetals = !isBaremetalsPending && !isBaremetalsError && baremetals?.length === 0;

  const isButtonDisabled =
    !watchedServerName || !watchedTermsAccepted || !cartId || cartPending || checkoutPending;

  const isPaymentRelated = (message: string | null) =>
    !!message && /payment|paiement|moyen de paiement/i.test(message);

  const renderCombobox = () => {
    if (isBaremetalsPending) {
      return <OdsSkeleton style={{ width: '100%', height: '40px' }} />;
    }
    if (isBaremetalsError) {
      return (
        <OdsMessage color="critical" isDismissible={false} className="w-full">
          <div className="flex w-full items-center justify-between gap-4">
            <span>{t('tunnel:baremetals_error')}</span>
            <OdsButton
              variant={ODS_BUTTON_VARIANT.outline}
              label={t('tunnel:retry')}
              onClick={() => refetchBaremetals()}
            />
          </div>
        </OdsMessage>
      );
    }
    return (
      <Controller
        control={control}
        name="serverName"
        render={({ field }) => (
          <OdsFormField className="w-full">
            <label htmlFor={comboboxId}>{t('tunnel:step1_server_label')}</label>
            <OdsCombobox
              id={comboboxId}
              style={{ width: '100%' }}
              name={field.name}
              value={field.value}
              isDisabled={isEmptyBaremetals || checkoutPending}
              placeholder={t('tunnel:step1_server_placeholder')}
              onOdsBlur={field.onBlur}
              onOdsChange={(event) => field.onChange(event.detail.value ?? '')}
            >
              {baremetals?.map((bm) => (
                <OdsComboboxItem
                  key={bm.name}
                  value={bm.name}
                  selectionLabel={bm.iam?.displayName ?? bm.name}
                >
                  {`${bm.iam?.displayName ?? bm.name} - ${bm.ip} (${bm.datacenter})`}
                </OdsComboboxItem>
              ))}
            </OdsCombobox>
            {isEmptyBaremetals && (
              <div className="mt-2 flex flex-col gap-1">
                <OdsText preset="caption">{t('tunnel:no_baremetal_hint')}</OdsText>
                <Links
                  href={TUNNEL_LINKS.orderBaremetal}
                  target="_blank"
                  type={LinkType.external}
                  label={t('tunnel:order_baremetal_link')}
                />
              </div>
            )}
          </OdsFormField>
        )}
      />
    );
  };

  const renderTermsSection = () => {
    if (cartPending) {
      return (
        <div className="flex flex-col gap-2">
          <OdsText preset="caption">{t('tunnel:cart_loading')}</OdsText>
          <OdsSkeleton style={{ width: '100%', height: '20px' }} />
          <OdsSkeleton style={{ width: '60%', height: '20px' }} />
        </div>
      );
    }
    if (cartError) {
      return (
        <OdsMessage color="critical" isDismissible={false} className="w-full">
          <div className="flex w-full items-center justify-between gap-4">
            <span>{t('tunnel:cart_error')}</span>
            <OdsButton
              variant={ODS_BUTTON_VARIANT.outline}
              label={t('tunnel:retry')}
              onClick={handleCartRetry}
            />
          </div>
        </OdsMessage>
      );
    }
    if (!watchedServerName || !cartId) {
      return <OdsText preset="caption">{t('tunnel:terms_placeholder')}</OdsText>;
    }
    return (
      <div className="flex flex-col gap-5">
        <ul className="flex flex-col gap-2 pl-5 list-disc">
          {contractList.map((contract) => (
            <li key={contract.name}>
              <Links
                href={contract.url}
                target="_blank"
                type={LinkType.external}
                label={contract.name}
              />
            </li>
          ))}
        </ul>
        <Controller
          control={control}
          name="termsAccepted"
          render={({ field }) => (
            <div className="flex items-center gap-3">
              <OdsCheckbox
                name={field.name}
                inputId={termsCheckboxId}
                isChecked={!!field.value}
                isDisabled={checkoutPending}
                onOdsChange={(event) => field.onChange(event.detail.checked)}
              />
              <label className="cursor-pointer" htmlFor={termsCheckboxId}>
                <OdsText preset="span">{t('tunnel:terms_accept_label')}</OdsText>
              </label>
            </div>
          )}
        />
        <OdsText preset="caption">{t('tunnel:step1_order_confirmation_hint')}</OdsText>
      </div>
    );
  };

  return (
    <form className="flex flex-col gap-6" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-1">
        <OdsText preset="heading-4">{t('tunnel:step1_title')}</OdsText>
        <OdsText preset="caption">{t('tunnel:step1_add_more_servers_hint')}</OdsText>
      </div>

      {/* Persistent live region: announces the combobox skeleton -> populated/error transition. */}
      <div aria-live="polite" aria-busy={isBaremetalsPending}>
        {renderCombobox()}
      </div>

      <section className="flex flex-col gap-3" aria-label={t('tunnel:terms_section_label')}>
        <OdsText preset="heading-6">{t('tunnel:terms_section_label')}</OdsText>
        {/* Persistent live region: announces the cart skeleton -> contract-links/terms transition. */}
        <div aria-live="polite" aria-busy={cartPending}>
          {renderTermsSection()}
        </div>
      </section>

      {checkoutError && (
        <OdsMessage color="critical" isDismissible={false} className="w-full">
          <div className="flex flex-col gap-2">
            {isPaymentRelated(checkoutError) ? (
              <>
                <span>{t('tunnel:checkout_no_payment_error')}</span>
                <Links
                  href={TUNNEL_LINKS.paymentSettings}
                  target="_blank"
                  type={LinkType.external}
                  label={t('tunnel:payment_settings_link')}
                />
              </>
            ) : (
              <span>{t(`${NAMESPACES.ERROR}:error_message`, { message: checkoutError })}</span>
            )}
          </div>
        </OdsMessage>
      )}

      <div>
        <OdsButton
          type="submit"
          label={t('tunnel:continue')}
          isDisabled={isButtonDisabled}
          isLoading={checkoutPending}
        />
      </div>
    </form>
  );
};

export default Step1Selection;
