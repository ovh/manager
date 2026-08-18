import React, { useContext } from 'react';

import { useNavigate } from 'react-router-dom';

import { Trans, useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  BaseLayout,
  Breadcrumb,
  ChangelogButton,
  GuideButton,
  RedirectionGuard,
  StepComponent,
} from '@ovh-ux/manager-react-components';

import { BackupLicensesContext } from '@/BackupLicenses.context';
import LicenseStep from '@/components/order/LicenseStep/LicenseStep.component';
import LocationStep from '@/components/order/LocationStep/LocationStep.component';
import OrderPendingBanner from '@/components/order/OrderPendingBanner/OrderPendingBanner.component';
import OrderRecapPanel from '@/components/order/OrderRecapPanel/OrderRecapPanel.component';
import ServerVaultStep from '@/components/order/ServerVaultStep/ServerVaultStep.component';
import { useCheckoutBackupLicensesCart } from '@/data/hooks/useCheckoutBackupLicensesCart/useCheckoutBackupLicensesCart';
import { LICENSE_CARDS, VDP_TIER_CARDS } from '@/data/licenses.data';
import { useBackupLicensesSubscriptionStatus } from '@/hooks/useBackupLicensesSubscriptionStatus/useBackupLicensesSubscriptionStatus';
import { useLocationLabel } from '@/hooks/useLocationLabel/useLocationLabel';
import { useMainGuideItem } from '@/hooks/useMainGuideItem';
import { useOrderCartPreparation } from '@/hooks/useOrderCartPreparation/useOrderCartPreparation';
import { OrderFieldName, useOrderForm } from '@/hooks/useOrderForm/useOrderForm';
import { registerPendingOrder } from '@/hooks/usePendingOrder/usePendingOrder';
import { BACKUP_LICENSES_NAMESPACES, CHANGELOG_LINKS, LABELS } from '@/module.constants';
import { routeUrls } from '@/routes/routes.constants';
import { LicenseFamily, OrderStepId } from '@/types/Order.type';
import { SubscriptionStatus } from '@/types/Subscription.type';
import { getOrderSubmitErrorMessage } from '@/utils/orderSubmitError/orderSubmitError';

/** Champ de formulaire → id de l'élément DOM (cf. OrderTextField), pour le scroll-to-error. */
const FIELD_ELEMENT_IDS: Record<OrderFieldName, string> = {
  displayName: 'vbr-display-name',
  backupServerExternalIp: 'vbr-external-ip',
  veeamClientIp: 'vbr-veeam-client-ip',
  backupServerPrivateIp: 'vbr-private-ip',
  vaultDisplayName: 'vault-display-name',
};

export default function OrderPage() {
  const { t } = useTranslation([BACKUP_LICENSES_NAMESPACES.ORDER, NAMESPACES.ACTIONS]);
  const { appName } = useContext(BackupLicensesContext);
  const navigate = useNavigate();
  const subscription = useBackupLicensesSubscriptionStatus();
  const isPending =
    subscription.status === SubscriptionStatus.PENDING ||
    subscription.status === SubscriptionStatus.ERROR;
  const order = useOrderForm({
    frozenState: subscription.pendingOrder?.order ?? null,
    isFrozen: isPending,
  });
  const guideItems = useMainGuideItem();

  const {
    family,
    tier,
    form,
    errors,
    firstInvalidField,
    firstInvalidStepId,
    canSubmit,
    resolvedLicenseApiValue,
  } = order;

  const cart = useOrderCartPreparation({
    form,
    licenseType: resolvedLicenseApiValue,
    isEnabled: !isPending,
  });

  const submitOrder = useCheckoutBackupLicensesCart({
    onSuccess: (placedOrder, { cartId }) => {
      registerPendingOrder({
        orderId: placedOrder?.orderId ?? null,
        cartId,
        submittedAt: Date.now(),
        order: { family, tier, form },
      });
      order.clearPersistedOrder();
    },
  });
  const isSubmitting = submitOrder.isPending;
  const isFrozen = isSubmitting || isPending;

  const isSubmitDisabled = isFrozen || (canSubmit && !cart.isReadyToCheckout);

  const familyKey = LICENSE_CARDS.find((card) => card.family === family)?.i18nKey ?? null;
  const tierKey = VDP_TIER_CARDS.find((card) => card.tier === tier)?.i18nKey ?? null;
  const locationLabel = useLocationLabel(form.regionApiValue);

  // Rappel du choix injecté dans le titre replié (cf. spec §6) : « Veeam Data Platform Premium ».
  const licenseCollapsedValue = [
    familyKey ? t(`license.${familyKey}.title`) : '',
    family === LicenseFamily.DATA_PLATFORM && tierKey ? t(`tier.${tierKey}.title`) : '',
  ]
    .filter(Boolean)
    .join(' ');

  const submitErrorMessage = getOrderSubmitErrorMessage(submitOrder.error, t('error.submit'));

  const handleFinalize = () => {
    if (isFrozen) return;
    order.setSubmitAttempted(true);
    if (!canSubmit || resolvedLicenseApiValue === null) {
      // Feedback actionnable plutôt qu'un bouton grisé : on réouvre l'étape fautive
      // et, pour le bloc serveur/vault, on amène l'utilisateur droit au champ bloquant.
      if (firstInvalidStepId === OrderStepId.LICENSE) {
        order.license.step.open();
      } else if (firstInvalidStepId === OrderStepId.SERVER_VAULT) {
        order.serverVault.step.open();
        if (firstInvalidField) {
          const el = document.getElementById(FIELD_ELEMENT_IDS[firstInvalidField]);
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el?.focus?.();
        }
      } else if (firstInvalidStepId === OrderStepId.LOCATION) {
        order.location.step.open();
      }
      return;
    }

    if (!cart.isReadyToCheckout || cart.cartId === null) return;

    submitOrder.mutate({ cartId: cart.cartId });
  };

  const stepProps = (step: { isOpen: boolean; isChecked: boolean; isLocked: boolean }) =>
    isPending ? { isOpen: true, isChecked: true, isLocked: false } : step;

  const licenseStep = stepProps(order.license.step);
  const serverVaultStep = stepProps(order.serverVault.step);
  const locationStep = stepProps(order.location.step);

  return (
    <RedirectionGuard
      condition={subscription.status === SubscriptionStatus.READY}
      isLoading={subscription.isLoading && !isPending}
      route={routeUrls.linkedServers}
    >
      <BaseLayout
        breadcrumb={<Breadcrumb appName={appName} rootLabel={appName} />}
        header={{
          title: LABELS.BACKUP_LICENSES,
          changelogButton: <ChangelogButton links={CHANGELOG_LINKS} />,
          headerButton: <GuideButton items={guideItems} />,
        }}
        backLinkLabel={t(`${NAMESPACES.ACTIONS}:back`)}
        onClickReturn={isFrozen ? undefined : () => navigate(routeUrls.onboarding)}
      >
        {isPending && (
          <div className="mb-8">
            <OrderPendingBanner
              submittedAt={subscription.pendingOrder?.submittedAt ?? null}
              orderId={subscription.pendingOrder?.orderId ?? null}
              hasDeliveryFailed={subscription.status === SubscriptionStatus.ERROR}
              onRestart={subscription.clearPendingOrder}
            />
          </div>
        )}

        <div
          aria-busy={isFrozen}
          className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
        >
          <div
            className={`flex flex-col gap-8${isPending ? ' opacity-60 pointer-events-none' : ''}`}
            aria-disabled={isPending || undefined}
          >
            <StepComponent
              order={1}
              {...licenseStep}
              title={
                licenseStep.isLocked ? (
                  <Trans
                    t={t}
                    i18nKey="step.license_type.collapsed_title"
                    values={{ value: licenseCollapsedValue }}
                    components={{ b: <b /> }}
                  />
                ) : (
                  t('step.license_type.label')
                )
              }
              subtitle={t('step.license_type.subtitle')}
              next={
                isPending
                  ? undefined
                  : {
                      action: order.license.submit,
                      label: t('step.continue'),
                      isDisabled: !order.isLicenseValid || isSubmitting,
                    }
              }
              edit={
                isPending
                  ? undefined
                  : {
                      action: order.license.edit,
                      label: t('summary.edit'),
                      isDisabled: isSubmitting,
                    }
              }
            >
              <LicenseStep
                family={family}
                tier={tier}
                familyDisabled={isFrozen}
                tierDisabled={isFrozen}
                onSelectFamily={order.selectFamily}
                onSelectTier={order.selectTier}
              />
            </StepComponent>

            <StepComponent
              order={2}
              {...serverVaultStep}
              title={
                serverVaultStep.isLocked ? (
                  <Trans
                    t={t}
                    i18nKey="step.server_vault.collapsed_title"
                    values={{ value: form.displayName }}
                    components={{ b: <b /> }}
                  />
                ) : (
                  t('step.server_vault.label')
                )
              }
              next={
                isPending
                  ? undefined
                  : {
                      action: order.serverVault.submit,
                      label: t('step.continue'),
                      isDisabled: !order.isServerVaultValid || isSubmitting,
                    }
              }
              edit={
                isPending
                  ? undefined
                  : {
                      action: order.serverVault.edit,
                      label: t('summary.edit'),
                      isDisabled: isSubmitting,
                    }
              }
            >
              <ServerVaultStep
                form={form}
                errors={errors}
                isDisabled={isFrozen}
                onFieldChange={order.setField}
                onFieldBlur={order.touchField}
                onToggleNat={order.toggleNat}
              />
            </StepComponent>

            <StepComponent
              order={3}
              {...locationStep}
              title={
                locationStep.isLocked ? (
                  <Trans
                    t={t}
                    i18nKey="step.location.collapsed_title"
                    values={{ value: locationLabel }}
                    components={{ b: <b /> }}
                  />
                ) : (
                  t('region.section_title')
                )
              }
              next={
                isPending
                  ? undefined
                  : {
                      action: handleFinalize,
                      label: t('summary.cta'),
                      isDisabled: isSubmitDisabled,
                      isLoading: isSubmitting,
                    }
              }
              edit={
                isPending
                  ? undefined
                  : {
                      action: order.location.edit,
                      label: t('summary.edit'),
                      isDisabled: isSubmitting,
                    }
              }
            >
              <LocationStep
                selected={form.regionApiValue}
                isDisabled={isFrozen}
                onSelect={order.selectRegion}
                cart={cart}
              />
            </StepComponent>
          </div>

          <aside className="sticky top-8 self-start">
            <OrderRecapPanel
              family={family}
              tier={tier}
              form={form}
              isSubmitting={isFrozen}
              isSubmitDisabled={isSubmitDisabled}
              submitError={submitOrder.isError ? submitErrorMessage : null}
              onFinalize={handleFinalize}
            />
          </aside>
        </div>
      </BaseLayout>
    </RedirectionGuard>
  );
}
