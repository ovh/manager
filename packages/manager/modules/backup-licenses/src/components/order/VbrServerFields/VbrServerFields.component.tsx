import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_MESSAGE_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsMessage, OdsText, OdsToggle } from '@ovhcloud/ods-components/react';

import OrderTextField from '@/components/order/OrderTextField/OrderTextField.component';
import { OrderFieldErrors, OrderFieldName } from '@/hooks/useOrderForm/useOrderForm';
import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';
import { ServerVaultFormState } from '@/types/Order.type';

interface VbrServerFieldsProps {
  form: ServerVaultFormState;
  errors: OrderFieldErrors;
  isDisabled?: boolean;
  onFieldChange: (key: OrderFieldName, value: string) => void;
  onFieldBlur: (field: OrderFieldName) => void;
  onToggleNat: (checked: boolean) => void;
}

/** Sous-bloc 1 de l'étape 3 : configuration du serveur VBR + toggle NAT + IP privée conditionnelle. */
export default function VbrServerFields({
  form,
  errors,
  isDisabled = false,
  onFieldChange,
  onFieldBlur,
  onToggleNat,
}: VbrServerFieldsProps) {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.ORDER);

  return (
    <div>
      <OdsText preset={ODS_TEXT_PRESET.heading5} className="mb-6 block">
        {t('vbr.section_title')}
      </OdsText>

      <div className="flex flex-col gap-6">
        <OrderTextField
          id="vbr-display-name"
          label={t('field.service_name.label')}
          value={form.displayName}
          placeholder={t('field.service_name.placeholder')}
          hint={t('field.service_name.hint')}
          error={errors.displayName ? t(errors.displayName) : null}
          required
          isDisabled={isDisabled}
          onChange={(value) => onFieldChange('displayName', value)}
          onBlur={() => onFieldBlur('displayName')}
        />

        <OrderTextField
          id="vbr-external-ip"
          label={t('field.public_ip.label')}
          value={form.backupServerExternalIp}
          placeholder={t('field.public_ip.placeholder')}
          hint={t('field.public_ip.hint')}
          error={errors.backupServerExternalIp ? t(errors.backupServerExternalIp) : null}
          required
          isDisabled={isDisabled}
          onChange={(value) => onFieldChange('backupServerExternalIp', value)}
          onBlur={() => onFieldBlur('backupServerExternalIp')}
        />

        <OrderTextField
          id="vbr-veeam-client-ip"
          label={t('field.veeam_client_ip.label')}
          value={form.veeamClientIp}
          placeholder={t('field.veeam_client_ip.placeholder')}
          hint={t('field.veeam_client_ip.hint')}
          isDisabled={isDisabled}
          onChange={(value) => onFieldChange('veeamClientIp', value)}
          onBlur={() => onFieldBlur('veeamClientIp')}
        />

        <label
          htmlFor="vbr-nat-toggle"
          className="flex cursor-pointer items-start gap-4 rounded-lg border border-[var(--ods-color-neutral-200)] bg-[var(--ods-color-neutral-050)] p-6"
        >
          {/*
            OdsToggle ne resynchronise pas fiablement sa prop `value` contrôlée
            (bug ODS connu, cf. sap-features-hub/ToggleField). Sans remount, un
            aller-retour NAT laisse le web component désynchronisé et `onToggleNat`
            reçoit une valeur périmée → le bloc IP privée reste affiché.
            `key` force le remount à chaque changement pour garder le DOM aligné.
          */}
          <OdsToggle
            key={String(form.isBehindNat)}
            id="vbr-nat-toggle"
            name="vbr-nat-toggle"
            value={form.isBehindNat}
            isDisabled={isDisabled}
            onOdsChange={(event) => onToggleNat(!!event.detail.value)}
          />
          <span className="flex flex-col">
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>{t('nat.toggle_title')}</OdsText>
            <OdsText
              preset={ODS_TEXT_PRESET.caption}
              className="[--ods-color-text:var(--ods-color-neutral-500)]"
            >
              {t('nat.toggle_desc')}
            </OdsText>
          </span>
        </label>

        {form.isBehindNat && (
          <div className="flex flex-col gap-6">
            <OdsMessage color={ODS_MESSAGE_COLOR.information} isDismissible={false}>
              {t('nat.callout')}
            </OdsMessage>
            <OrderTextField
              id="vbr-private-ip"
              label={t('field.private_ip.label')}
              value={form.backupServerPrivateIp}
              placeholder={t('field.private_ip.placeholder')}
              hint={t('field.private_ip.hint')}
              error={errors.backupServerPrivateIp ? t(errors.backupServerPrivateIp) : null}
              required
              isDisabled={isDisabled}
              onChange={(value) => onFieldChange('backupServerPrivateIp', value)}
              onBlur={() => onFieldBlur('backupServerPrivateIp')}
            />
          </div>
        )}
      </div>
    </div>
  );
}
