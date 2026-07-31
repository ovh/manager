import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_MESSAGE_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsCard,
  OdsDivider,
  OdsMessage,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import EditChangesRecap from '@/components/linked-servers/EditChangesRecap/EditChangesRecap.component';
import OrderSummaryRow from '@/components/order/OrderRecapPanel/OrderSummaryRow.component';
import { LICENSE_CARDS, VDP_TIER_CARDS } from '@/data/licenses.data';
import { EditFormChange } from '@/hooks/useEditBackupServerForm/useEditBackupServerForm';
import { BACKUP_LICENSES_NAMESPACES, LABELS } from '@/module.constants';
import { LicenseFamily, VdpTier } from '@/types/Order.type';

interface EditRecapPanelProps {
  family: LicenseFamily | null;
  tier: VdpTier | null;
  displayName: string;
  externalIp: string;
  privateIp: string;
  changes: EditFormChange[];
  errorMessage: string | null;
  isSaving: boolean;
  onSave: () => void;
}

/**
 * Panneau récapitulatif — colonne sticky, sur le modèle d'`OrderRecapPanel` : relecture des
 * champs édités + CTA final. S'y ajoute, propre à l'édition, le récap « avant → après »
 * (`EditChangesRecap`, affiché seulement si un champ a changé) et le message d'erreur : le
 * tunnel de commande n'appelle pas encore d'API réelle (submit stubé), l'édition si.
 */
export default function EditRecapPanel({
  family,
  tier,
  displayName,
  externalIp,
  privateIp,
  changes,
  errorMessage,
  isSaving,
  onSave,
}: EditRecapPanelProps) {
  const { t } = useTranslation([
    BACKUP_LICENSES_NAMESPACES.LINKED_SERVERS,
    BACKUP_LICENSES_NAMESPACES.ORDER,
    NAMESPACES.ACTIONS,
  ]);

  const familyKey = LICENSE_CARDS.find((card) => card.family === family)?.i18nKey ?? null;
  const tierKey = VDP_TIER_CARDS.find((card) => card.tier === tier)?.i18nKey ?? null;
  const isVdp = family === LicenseFamily.DATA_PLATFORM;
  const emptyLabel = t(`${BACKUP_LICENSES_NAMESPACES.ORDER}:summary.empty`);

  return (
    <OdsCard className="flex flex-col gap-6 p-6">
      <OdsText preset={ODS_TEXT_PRESET.heading6}>{LABELS.BACKUP_LICENSES}</OdsText>

      <OdsDivider className="m-0" />

      <div className="flex flex-col gap-3">
        <OrderSummaryRow
          label={t(`${BACKUP_LICENSES_NAMESPACES.ORDER}:summary.field.family`)}
          value={
            familyKey ? t(`${BACKUP_LICENSES_NAMESPACES.ORDER}:license.${familyKey}.title`) : null
          }
          emptyLabel={emptyLabel}
        />
        {isVdp && (
          <OrderSummaryRow
            label={t(`${BACKUP_LICENSES_NAMESPACES.ORDER}:summary.field.tier`)}
            value={tierKey ? t(`${BACKUP_LICENSES_NAMESPACES.ORDER}:tier.${tierKey}.title`) : null}
            emptyLabel={emptyLabel}
          />
        )}
        <OrderSummaryRow
          label={t(`${BACKUP_LICENSES_NAMESPACES.LINKED_SERVERS}:edit.field.name.label`)}
          value={displayName}
          emptyLabel={emptyLabel}
        />
        <OrderSummaryRow
          label={t(`${BACKUP_LICENSES_NAMESPACES.LINKED_SERVERS}:edit.field.public_ip.label`)}
          value={externalIp}
          emptyLabel={emptyLabel}
        />
        <OrderSummaryRow
          label={t(`${BACKUP_LICENSES_NAMESPACES.LINKED_SERVERS}:edit.field.private_ip.label`)}
          value={privateIp}
          emptyLabel={emptyLabel}
        />
      </div>

      {changes.length > 0 && (
        <>
          <OdsDivider className="m-0" />
          <EditChangesRecap changes={changes} />
        </>
      )}

      {errorMessage && (
        <OdsMessage
          color={ODS_MESSAGE_COLOR.critical}
          isDismissible={false}
          data-testid="edit-backup-server-error"
        >
          {errorMessage}
        </OdsMessage>
      )}

      {/* Jamais désactivé : un clic avec formulaire invalide révèle les erreurs et rouvre
          l'étape fautive (cf. EditBackupServer.page), feedback actionnable plutôt qu'un
          bouton grisé silencieux — même parti pris que le CTA du tunnel de commande. */}
      <OdsButton
        type="button"
        className="w-full"
        data-testid="edit-backup-server-save"
        label={t(`${NAMESPACES.ACTIONS}:save`)}
        isDisabled={isSaving}
        onClick={onSave}
      />
    </OdsCard>
  );
}
