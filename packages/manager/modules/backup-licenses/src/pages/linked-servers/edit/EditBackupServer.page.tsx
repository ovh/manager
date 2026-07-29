import React, { useEffect } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { ODS_MESSAGE_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';

import LicenseTypeAccordionGroup from '@/components/edit/LicenseTypeAccordionGroup/LicenseTypeAccordionGroup.component';
import VdpTierAccordionGroup from '@/components/edit/VdpTierAccordionGroup/VdpTierAccordionGroup.component';
import OrderTextField from '@/components/order/OrderTextField/OrderTextField.component';
import { useEditBackupServer } from '@/data/hooks/useEditBackupServer/useEditBackupServer';
import { VDP_TIER_CARDS } from '@/data/licenses.data';
import { backupServersQueries } from '@/data/queries/backupServers.queries';
import {
  EditFormChange,
  useEditBackupServerForm,
} from '@/hooks/useEditBackupServerForm/useEditBackupServerForm';
import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';
import { LicenseApiValue, LicenseFamily, VdpTier } from '@/types/Order.type';
import { firstIpWithoutMask } from '@/utils/formatIpList/formatIpList';
import { getLicenseTypeDisplay } from '@/utils/licenseLabel/licenseLabel';

const FIELD_LABEL_KEYS: Record<EditFormChange['field'], string> = {
  displayName: 'edit.field.name.label',
  licenseType: 'edit.field.license_type.label',
  externalIp: 'edit.field.public_ip.label',
  privateIp: 'edit.field.private_ip.label',
};

/**
 * Modale d'édition d'un serveur VBR (BKP-1218), route enfant de la liste — même mécanisme
 * que la suppression (BKP-1219) : l'échec reste **dans la modale** pour permettre un nouvel
 * essai sans perdre la saisie, le toast est réservé au succès.
 */
export default function EditBackupServerPage() {
  const ns = BACKUP_LICENSES_NAMESPACES.LINKED_SERVERS;
  const { t } = useTranslation([ns, NAMESPACES.ACTIONS, BACKUP_LICENSES_NAMESPACES.ORDER]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addSuccess } = useNotifications();
  const { backupServerId } = useParams<{ backupServerId: string }>();

  const closeModal = () => navigate('..');

  // Pas de query de détail, même choix que 1219 : la liste est déjà en cache dès lors qu'on
  // ouvre la modale depuis le tableau.
  const { data: servers, isPending: areServersPending } = useQuery(
    backupServersQueries.withClient(queryClient).list(),
  );
  const server = servers?.find(({ id }) => id === backupServerId);
  const serverName = server?.currentState.displayName;

  const { form, errors, isValid, changes, setField, touchField, setSubmitAttempted } =
    useEditBackupServerForm(server);

  const {
    mutate: editBackupServer,
    isPending,
    isSuccess,
    error,
  } = useEditBackupServer({
    onSuccess: () => {
      addSuccess(t(`${ns}:edit.success`));
      closeModal();
    },
  });

  // Serveur introuvable une fois la liste chargée (lien obsolète, serveur supprimé
  // entretemps) : la liste rafraîchie derrière fait foi, on y renvoie sans message d'erreur.
  useEffect(() => {
    if (!areServersPending && !server && !isPending && !isSuccess) {
      navigate('..', { replace: true });
    }
  }, [areServersPending, server, isPending, isSuccess, navigate]);

  const handleSubmit = () => {
    setSubmitAttempted(true);
    if (!backupServerId || !form || !isValid) return;
    editBackupServer({
      backupServerId,
      displayName: form.displayName,
      licenseType: form.licenseType,
      externalIps: [form.externalIp],
      privateIps: [form.privateIp],
    });
  };

  /** Libellé affichable d'une valeur de licence (mêmes libellés que la colonne du tableau). */
  const toLicenseLabel = (value: string) => {
    const { i18nKey, rawLabel } = getLicenseTypeDisplay(value);
    return i18nKey ? t(`${ns}:${i18nKey}`) : rawLabel;
  };

  const currentValueHint = (value: string) => t(`${ns}:edit.current_value`, { value });

  // Même hiérarchie que le tunnel de commande (famille puis niveau VDP) : Enterprise Plus et les
  // 3 niveaux Data Platform ne sont pas des paliers pairs, les aplatir en une seule liste avait
  // créé une confusion (retour PO).
  const selectedFamily: LicenseFamily =
    form && (LicenseApiValue.ENTERPRISE_PLUS as string) === form.licenseType
      ? LicenseFamily.ENTERPRISE_PLUS
      : LicenseFamily.DATA_PLATFORM;

  const selectedTier: VdpTier | null = form
    ? (VDP_TIER_CARDS.find((card) => (card.apiValue as string) === form.licenseType)?.tier ?? null)
    : null;

  const handleSelectFamily = (family: LicenseFamily) => {
    if (family === LicenseFamily.ENTERPRISE_PLUS) {
      setField('licenseType', LicenseApiValue.ENTERPRISE_PLUS);
      return;
    }
    if (selectedFamily === LicenseFamily.DATA_PLATFORM) return;
    const defaultTier = VDP_TIER_CARDS.find((card) => card.recommended) ?? VDP_TIER_CARDS[0]!;
    setField('licenseType', defaultTier.apiValue);
  };

  const handleSelectTier = (tier: VdpTier) => {
    const card = VDP_TIER_CARDS.find((c) => c.tier === tier)!;
    setField('licenseType', card.apiValue);
  };

  return (
    <Modal
      isOpen
      heading={t(`${ns}:edit.title`)}
      primaryLabel={t(`${NAMESPACES.ACTIONS}:save`)}
      primaryButtonTestId="edit-backup-server-submit"
      onPrimaryButtonClick={handleSubmit}
      isPrimaryButtonLoading={isPending}
      isPrimaryButtonDisabled={isPending || !form || !isValid}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      isSecondaryButtonDisabled={isPending}
      onSecondaryButtonClick={closeModal}
      onDismiss={closeModal}
    >
      <div className="flex flex-col gap-4">
        {!!error && (
          <OdsMessage
            color={ODS_MESSAGE_COLOR.critical}
            isDismissible={false}
            data-testid="edit-backup-server-error"
          >
            <OdsText>
              {[t(`${ns}:edit.error`, { serverName }), error.response?.data?.message]
                .filter(Boolean)
                .join(' ')}
            </OdsText>
          </OdsMessage>
        )}
        {form && server && (
          <>
            <OrderTextField
              id="edit-backup-server-name"
              label={t(`${ns}:edit.field.name.label`)}
              value={form.displayName}
              hint={currentValueHint(server.currentState.displayName)}
              error={errors.displayName ? t(`${ns}:${errors.displayName}`) : null}
              required
              onChange={(value) => setField('displayName', value)}
              onBlur={() => touchField('displayName')}
            />
            <div>
              <OdsText preset={ODS_TEXT_PRESET.heading6} className="block">
                {t(`${ns}:edit.field.license_type.label`)}
              </OdsText>
              <OdsText
                preset={ODS_TEXT_PRESET.caption}
                className="mb-3 block text-[var(--ods-color-neutral-600)]"
              >
                {currentValueHint(toLicenseLabel(server.currentState.licenseType ?? ''))}
              </OdsText>
              <LicenseTypeAccordionGroup
                groupLabel={t(`${ns}:edit.field.license_type.label`)}
                selectedFamily={selectedFamily}
                onSelectFamily={handleSelectFamily}
              />
              {selectedFamily === LicenseFamily.DATA_PLATFORM && (
                <VdpTierAccordionGroup
                  groupLabel={t(`${BACKUP_LICENSES_NAMESPACES.ORDER}:step.vdp_tier.label`)}
                  selectedTier={selectedTier}
                  onSelectTier={handleSelectTier}
                  className="mt-3"
                />
              )}
            </div>
            {form.licenseType !== (server.currentState.licenseType ?? '') && (
              <OdsMessage
                color={ODS_MESSAGE_COLOR.information}
                isDismissible={false}
                data-testid="edit-backup-server-license-notice"
              >
                {t(`${ns}:edit.license_change_notice`)}
              </OdsMessage>
            )}
            <OrderTextField
              id="edit-backup-server-public-ip"
              label={t(`${ns}:edit.field.public_ip.label`)}
              value={form.externalIp}
              hint={currentValueHint(firstIpWithoutMask(server.currentState.externalIps))}
              error={errors.externalIp ? t(`${ns}:${errors.externalIp}`) : null}
              required
              onChange={(value) => setField('externalIp', value)}
              onBlur={() => touchField('externalIp')}
            />
            <OrderTextField
              id="edit-backup-server-private-ip"
              label={t(`${ns}:edit.field.private_ip.label`)}
              value={form.privateIp}
              hint={currentValueHint(firstIpWithoutMask(server.currentState.privateIps))}
              error={errors.privateIp ? t(`${ns}:${errors.privateIp}`) : null}
              required
              onChange={(value) => setField('privateIp', value)}
              onBlur={() => touchField('privateIp')}
            />
            {changes.length > 0 && (
              <div
                className="flex flex-col gap-2 rounded-md border border-solid border-[var(--ods-color-neutral-200)] bg-[var(--ods-color-neutral-050)] p-4"
                data-testid="edit-backup-server-changes-recap"
              >
                <OdsText preset={ODS_TEXT_PRESET.caption} className="font-semibold">
                  {t(`${ns}:edit.recap.title`)}
                </OdsText>
                <ul className="m-0 flex list-none flex-col gap-1 p-0">
                  {changes.map((change) => (
                    <li key={change.field}>
                      <OdsText preset={ODS_TEXT_PRESET.caption}>
                        {t(`${ns}:${FIELD_LABEL_KEYS[change.field]}`)} :{' '}
                        {change.field === 'licenseType'
                          ? toLicenseLabel(change.before)
                          : change.before}{' '}
                        →{' '}
                        {change.field === 'licenseType'
                          ? toLicenseLabel(change.after)
                          : change.after}
                      </OdsText>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
