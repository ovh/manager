import React, { useEffect, useRef } from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import LicenseTypeStep from '@/components/order/LicenseTypeStep/LicenseTypeStep.component';
import OrderFooter from '@/components/order/OrderFooter/OrderFooter.component';
import OrderStepper from '@/components/order/OrderStepper/OrderStepper.component';
import OrderSummary from '@/components/order/OrderSummary/OrderSummary.component';
import VbrVaultStep from '@/components/order/VbrVaultStep/VbrVaultStep.component';
import VdpTierStep from '@/components/order/VdpTierStep/VdpTierStep.component';
import { OrderFieldName, useOrderForm } from '@/hooks/useOrderForm/useOrderForm';
import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';
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
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.ORDER);
  const navigate = useNavigate();
  const order = useOrderForm();
  const topRef = useRef<HTMLDivElement>(null);

  const {
    family,
    tier,
    form,
    steps,
    currentStep,
    currentIndex,
    isFirstStep,
    isLastStep,
    errors,
    firstInvalidField,
    isCurrentStepValid,
    canSubmit,
  } = order;

  // Après un changement d'étape, on ramène le haut du funnel dans le viewport :
  // si l'utilisateur avait scrollé en bas des cartes, l'étape suivante démarre en haut.
  useEffect(() => {
    topRef.current?.scrollIntoView({ block: 'start' });
  }, [currentStep]);

  const getPrimaryLabel = (): string => {
    if (currentStep === OrderStepId.SERVER_VAULT) return t('footer.order');
    if (currentStep === OrderStepId.VDP_TIER) return t('footer.to_server_vault');
    // LICENSE_TYPE
    if (family === LicenseFamily.ENTERPRISE_PLUS) return t('footer.to_server_vault');
    if (family === LicenseFamily.DATA_PLATFORM) return t('footer.to_vdp');
    return t('footer.continue');
  };

  const handlePrimary = () => {
    if (!isLastStep) {
      order.goNext();
      return;
    }
    order.setSubmitAttempted(true);
    if (!canSubmit) {
      // Feedback actionnable plutôt qu'un bouton grisé : setSubmitAttempted révèle
      // les erreurs inline sur tous les champs, et on amène l'utilisateur droit au
      // premier champ bloquant.
      if (firstInvalidField) {
        const el = document.getElementById(FIELD_ELEMENT_IDS[firstInvalidField]);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el?.focus?.();
      }
      return;
    }
    // Commande soumise : on repart d'un funnel vierge à la prochaine entrée.
    order.clearPersistedOrder();
    // TODO(BKP-1208): brancher la commande Agora (createCart de @ovh-ux/manager-module-order).
    // API non figée → on redirige vers la page de service, destination du parcours.
    navigate(routeUrls.linkedServers);
  };

  const handleLeft = () => {
    if (isFirstStep) {
      navigate(routeUrls.onboarding);
      return;
    }
    order.goBackStep();
  };

  // L'étape VDP affiche 3 cartes côte à côte : elle a besoin de plus de largeur
  // pour ne pas étirer les cartes. Les autres étapes restent en colonne étroite.
  const containerWidth = currentStep === OrderStepId.VDP_TIER ? 'max-w-[980px]' : 'max-w-[720px]';

  return (
    // `px-[0.5rem]` et non `px-4` : l'échelle `spacing` custom du repo régénère `.px-4` en local,
    // qui écrase alors globalement le `px-4` déjà utilisé par `BaseLayout` (MRC) — le CSS importé
    // de MRC est hissé avant `@tailwind utilities` par la règle CSS `@import`, donc perdant.
    <div ref={topRef} className={`mx-auto mt-8 px-[0.5rem] pt-6 scroll-mt-4 ${containerWidth}`}>
      <OdsText preset={ODS_TEXT_PRESET.heading3} className="block text-center">
        {t('title')}
      </OdsText>

      <OrderStepper steps={steps} currentIndex={currentIndex} onStepSelect={order.goToStep} />

      {currentStep === OrderStepId.LICENSE_TYPE && (
        <LicenseTypeStep selected={family} onSelect={order.selectFamily} />
      )}
      {currentStep === OrderStepId.VDP_TIER && (
        <VdpTierStep selected={tier} onSelect={order.selectTier} />
      )}
      {currentStep === OrderStepId.SERVER_VAULT && (
        <VbrVaultStep
          form={form}
          errors={errors}
          onFieldChange={(key, value) => order.setField(key, value)}
          onFieldBlur={order.touchField}
          onToggleNat={order.toggleNat}
          onSelectRegion={order.selectRegion}
        />
      )}

      {/* Récap replié en pied de la dernière étape (sous la localisation), avant le footer. */}
      {isLastStep && (
        <OrderSummary family={family} tier={tier} form={form} onEdit={order.goToStep} />
      )}

      <OrderFooter
        leftLabel={isFirstStep ? t('footer.cancel') : t('footer.back')}
        onLeft={handleLeft}
        primaryLabel={getPrimaryLabel()}
        // Dernière étape : bouton toujours actif — un clic invalide déclenche le
        // scroll-to-error (handlePrimary) au lieu d'un bouton grisé sans explication.
        primaryDisabled={isLastStep ? false : !isCurrentStepValid}
        onPrimary={handlePrimary}
        isSticky={isLastStep}
        priceLabel={isLastStep ? t('summary.price.label') : undefined}
        priceValue={isLastStep ? t('summary.price.value') : undefined}
      />
    </div>
  );
}
