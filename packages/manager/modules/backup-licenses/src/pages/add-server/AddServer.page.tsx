import React, { useContext } from 'react';

import { useNavigate } from 'react-router-dom';

import { Trans, useTranslation } from 'react-i18next';

import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  BaseLayout,
  Breadcrumb,
  ChangelogButton,
  GuideButton,
  StepComponent,
} from '@ovh-ux/manager-react-components';

import { BackupLicensesContext } from '@/BackupLicenses.context';
import AddServerRecapPanel from '@/components/add-server/AddServerRecapPanel/AddServerRecapPanel.component';
import LicenseStep from '@/components/order/LicenseStep/LicenseStep.component';
import VbrServerFields from '@/components/order/VbrServerFields/VbrServerFields.component';
import { LICENSE_CARDS, VDP_TIER_CARDS } from '@/data/licenses.data';
import {
  AddServerFieldName,
  AddServerStepId,
  useAddServerForm,
} from '@/hooks/useAddServerForm/useAddServerForm';
import { useCreateBackupLicense } from '@/hooks/useCreateBackupLicense/useCreateBackupLicense';
import { useMainGuideItem } from '@/hooks/useMainGuideItem';
import type { OrderFieldName } from '@/hooks/useOrderForm/useOrderForm';
import { useVspcTenantUrn } from '@/hooks/useVspcTenantUrn/useVspcTenantUrn';
import { BACKUP_LICENSES_NAMESPACES, CHANGELOG_LINKS, LABELS } from '@/module.constants';
import { routeUrls } from '@/routes/routes.constants';
import { CreateBackupLicenseBody } from '@/types/BackupLicense.type';
import { LicenseFamily } from '@/types/Order.type';

/** Champ de formulaire → id de l'élément DOM (cf. OrderTextField), pour le scroll-to-error. */
const FIELD_ELEMENT_IDS: Record<AddServerFieldName, string> = {
  displayName: 'vbr-display-name',
  backupServerExternalIp: 'vbr-external-ip',
  backupServerPrivateIp: 'vbr-private-ip',
};

/**
 * Ajout d'un serveur VBR supplémentaire (BKP-1217), depuis le CTA de la liste des
 * serveurs : le vault et sa localisation ont déjà été configurés à la première
 * commande, ce tunnel ne comporte donc que 2 étapes — licence puis serveur VBR —
 * au lieu des 3 du tunnel de commande initial (cf. Order.page).
 */
export default function AddServerPage() {
  const { t } = useTranslation([BACKUP_LICENSES_NAMESPACES.ORDER, NAMESPACES.ACTIONS]);
  const { appName } = useContext(BackupLicensesContext);
  const navigate = useNavigate();
  const form = useAddServerForm();
  const guideItems = useMainGuideItem();
  const createBackupLicense = useCreateBackupLicense();
  const vspcTenantUrn = useVspcTenantUrn();

  const { family, tier, firstInvalidField, firstInvalidStepId, canSubmit } = form;

  const familyKey = LICENSE_CARDS.find((card) => card.family === family)?.i18nKey ?? null;
  const tierKey = VDP_TIER_CARDS.find((card) => card.tier === tier)?.i18nKey ?? null;

  const licenseCollapsedValue = [
    familyKey ? t(`license.${familyKey}.title`) : '',
    family === LicenseFamily.DATA_PLATFORM && tierKey ? t(`tier.${tierKey}.title`) : '',
  ]
    .filter(Boolean)
    .join(' ');

  const handleFinalize = () => {
    form.setSubmitAttempted(true);
    const { resolvedLicenseApiValue } = form;
    if (!canSubmit || resolvedLicenseApiValue === null) {
      // Feedback actionnable plutôt qu'un bouton grisé : on réouvre l'étape fautive
      // et, pour le bloc serveur, on amène l'utilisateur droit au champ bloquant.
      if (firstInvalidStepId === AddServerStepId.LICENSE) {
        form.license.step.open();
      } else if (firstInvalidStepId === AddServerStepId.SERVER) {
        form.server.step.open();
        if (firstInvalidField) {
          const el = document.getElementById(FIELD_ELEMENT_IDS[firstInvalidField]);
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el?.focus?.();
        }
      }
      return;
    }

    const body: CreateBackupLicenseBody = {
      displayName: form.form.displayName.trim(),
      licenseType: resolvedLicenseApiValue,
      backupServerExternalIp: [form.form.backupServerExternalIp.trim()],
      ...(form.form.isBehindNat
        ? { backupServerPrivateIp: [form.form.backupServerPrivateIp.trim()] }
        : {}),
    };

    createBackupLicense.mutate(body, {
      onSuccess: () => navigate(routeUrls.linkedServers),
    });
  };

  // VbrServerFields est partagé avec Order.page et type ses callbacks sur les 4 champs
  // du tunnel complet (dont `vaultDisplayName`), inexistant dans ce parcours réduit —
  // ce parcours ne l'appelle jamais avec cette clé, ces gardes ne font que satisfaire le type.
  const handleFieldChange = (key: OrderFieldName, value: string) => {
    if (key === 'vaultDisplayName') return;
    form.setField(key, value);
  };

  const handleFieldBlur = (field: OrderFieldName) => {
    if (field === 'vaultDisplayName') return;
    form.touchField(field);
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
      onClickReturn={() => navigate(routeUrls.linkedServers)}
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-8">
          {createBackupLicense.isError && (
            <OdsMessage color={ODS_MESSAGE_COLOR.critical} isDismissible={false}>
              <OdsText>{t('add_server.error.submit')}</OdsText>
            </OdsMessage>
          )}

          <StepComponent
            order={1}
            {...form.license.step}
            title={
              form.license.step.isLocked ? (
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
              action: form.license.submit,
              label: t('step.continue'),
              isDisabled: !form.isLicenseValid,
            }}
            edit={{ action: form.license.edit, label: t('summary.edit') }}
          >
            <LicenseStep
              family={family}
              tier={tier}
              onSelectFamily={form.selectFamily}
              onSelectTier={form.selectTier}
            />
          </StepComponent>

          <StepComponent
            order={2}
            {...form.server.step}
            title={t('add_server.step.vbr_server.label')}
          >
            <VbrServerFields
              form={{ ...form.form, vaultDisplayName: '', regionApiValue: null }}
              errors={{ ...form.errors, vaultDisplayName: null }}
              onFieldChange={handleFieldChange}
              onFieldBlur={handleFieldBlur}
              onToggleNat={form.toggleNat}
            />
          </StepComponent>
        </div>

        <aside className="sticky top-8 self-start">
          <AddServerRecapPanel
            family={family}
            tier={tier}
            form={form.form}
            isSubmitting={createBackupLicense.isPending}
            onFinalize={handleFinalize}
            urn={vspcTenantUrn}
          />
        </aside>
      </div>
    </BaseLayout>
  );
}
