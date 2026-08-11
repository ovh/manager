import React, { useContext } from 'react';

import { useNavigate } from 'react-router-dom';

import { Trans, useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  BaseLayout,
  Breadcrumb,
  ChangelogButton,
  GuideButton,
  StepComponent,
} from '@ovh-ux/manager-react-components';

import { BackupLicensesContext } from '@/BackupLicenses.context';
import LicenseStep from '@/components/order/LicenseStep/LicenseStep.component';
import LocationStep from '@/components/order/LocationStep/LocationStep.component';
import OrderRecapPanel from '@/components/order/OrderRecapPanel/OrderRecapPanel.component';
import ServerVaultStep from '@/components/order/ServerVaultStep/ServerVaultStep.component';
import { useCheckoutBackupLicensesCart } from '@/data/hooks/useCheckoutBackupLicensesCart/useCheckoutBackupLicensesCart';
import { LICENSE_CARDS, VDP_TIER_CARDS } from '@/data/licenses.data';
import { useLocationLabel } from '@/hooks/useLocationLabel/useLocationLabel';
import { useMainGuideItem } from '@/hooks/useMainGuideItem';
import { useOrderCartPreparation } from '@/hooks/useOrderCartPreparation/useOrderCartPreparation';
import { OrderFieldName, useOrderForm } from '@/hooks/useOrderForm/useOrderForm';
import { BACKUP_LICENSES_NAMESPACES, CHANGELOG_LINKS, LABELS } from '@/module.constants';
import { routeUrls } from '@/routes/routes.constants';
import { LicenseFamily, OrderStepId } from '@/types/Order.type';

/** Champ de formulaire → id de l'élément DOM (cf. OrderTextField), pour le scroll-to-error. */
const FIELD_ELEMENT_IDS: Record<OrderFieldName, string> = {
  displayName: 'vbr-display-name',
  backupServerExternalIp: 'vbr-external-ip',
  backupServerPrivateIp: 'vbr-private-ip',
  vaultDisplayName: 'vault-display-name',
};

export default function OrderPage() {
  const { t } = useTranslation([BACKUP_LICENSES_NAMESPACES.ORDER, NAMESPACES.ACTIONS]);
  const { appName } = useContext(BackupLicensesContext);
  const navigate = useNavigate();
  const order = useOrderForm();
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

  const cart = useOrderCartPreparation({ form, licenseType: resolvedLicenseApiValue });

  const submitOrder = useCheckoutBackupLicensesCart({
    onSuccess: () => {
      order.clearPersistedOrder();
      navigate(routeUrls.linkedServers);
    },
  });
  const isSubmitting = submitOrder.isPending;

  const isSubmitDisabled = isSubmitting || (canSubmit && !cart.isReadyToCheckout);

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

  const handleFinalize = () => {
    if (isSubmitting) return;
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

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb appName={appName} rootLabel={appName} />}
      header={{
        title: LABELS.BACKUP_LICENSES,
        changelogButton: <ChangelogButton links={CHANGELOG_LINKS} />,
        headerButton: <GuideButton items={guideItems} />,
      }}
      backLinkLabel={t(`${NAMESPACES.ACTIONS}:back`)}
      onClickReturn={isSubmitting ? undefined : () => navigate(routeUrls.onboarding)}
    >
      <div
        aria-busy={isSubmitting}
        className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
      >
        <div className="flex flex-col gap-8">
          <StepComponent
            order={1}
            {...order.license.step}
            title={
              order.license.step.isLocked ? (
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
            next={{
              action: order.license.submit,
              label: t('step.continue'),
              isDisabled: !order.isLicenseValid || isSubmitting,
            }}
            edit={{
              action: order.license.edit,
              label: t('summary.edit'),
              isDisabled: isSubmitting,
            }}
          >
            <LicenseStep
              family={family}
              tier={tier}
              familyDisabled={isSubmitting}
              tierDisabled={isSubmitting}
              onSelectFamily={order.selectFamily}
              onSelectTier={order.selectTier}
            />
          </StepComponent>

          <StepComponent
            order={2}
            {...order.serverVault.step}
            title={
              order.serverVault.step.isLocked ? (
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
            next={{
              action: order.serverVault.submit,
              label: t('step.continue'),
              isDisabled: !order.isServerVaultValid || isSubmitting,
            }}
            edit={{
              action: order.serverVault.edit,
              label: t('summary.edit'),
              isDisabled: isSubmitting,
            }}
          >
            <ServerVaultStep
              form={form}
              errors={errors}
              isDisabled={isSubmitting}
              onFieldChange={order.setField}
              onFieldBlur={order.touchField}
              onToggleNat={order.toggleNat}
            />
          </StepComponent>

          <StepComponent
            order={3}
            {...order.location.step}
            title={
              order.location.step.isLocked ? (
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
            next={{
              action: handleFinalize,
              label: t('summary.cta'),
              isDisabled: isSubmitDisabled,
              isLoading: isSubmitting,
            }}
            edit={{
              action: order.location.edit,
              label: t('summary.edit'),
              isDisabled: isSubmitting,
            }}
          >
            <LocationStep
              selected={form.regionApiValue}
              isDisabled={isSubmitting}
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
            isSubmitting={isSubmitting}
            isSubmitDisabled={isSubmitDisabled}
            submitError={submitOrder.isError ? t('error.submit') : null}
            onFinalize={handleFinalize}
          />
        </aside>
      </div>
    </BaseLayout>
  );
}
