import React from 'react';

import { useTranslation } from 'react-i18next';

import OrderTextField from '@/components/order/OrderTextField/OrderTextField.component';
import {
  EditFormErrors,
  EditFormField,
} from '@/hooks/useEditBackupServerForm/useEditBackupServerForm';
import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';
import { BackupServerResource } from '@/types/BackupServer.type';
import { firstIpWithoutMask } from '@/utils/formatIpList/formatIpList';

interface EditServerFieldsFormState {
  displayName: string;
  externalIp: string;
  privateIp: string;
}

interface EditServerFieldsStepProps {
  server: BackupServerResource;
  form: EditServerFieldsFormState;
  errors: EditFormErrors;
  onFieldChange: <K extends keyof EditServerFieldsFormState>(
    key: K,
    value: EditServerFieldsFormState[K],
  ) => void;
  onFieldBlur: (field: EditFormField) => void;
}

/**
 * Étape ② de l'édition (BKP-1218) : nom + IP publique + IP privée, toutes en édition — pas de
 * toggle NAT ni de bloc Vault comme dans `VbrServerFields` du tunnel de commande, le ticket ne
 * porte que sur ces 3 champs. Chaque champ affiche sa valeur installée en `hint`
 * (reconnaissance plutôt que rappel).
 */
export default function EditServerFieldsStep({
  server,
  form,
  errors,
  onFieldChange,
  onFieldBlur,
}: EditServerFieldsStepProps) {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.LINKED_SERVERS);

  return (
    <div className="flex flex-col gap-6">
      <OrderTextField
        id="edit-backup-server-name"
        label={t('edit.field.name.label')}
        value={form.displayName}
        hint={t('edit.current_value', { value: server.currentState.displayName })}
        error={errors.displayName ? t(errors.displayName) : null}
        required
        onChange={(value) => onFieldChange('displayName', value)}
        onBlur={() => onFieldBlur('displayName')}
      />

      <OrderTextField
        id="edit-backup-server-external-ip"
        label={t('edit.field.public_ip.label')}
        value={form.externalIp}
        hint={t('edit.current_value', {
          value: firstIpWithoutMask(server.currentState.externalIps),
        })}
        error={errors.externalIp ? t(errors.externalIp) : null}
        required
        onChange={(value) => onFieldChange('externalIp', value)}
        onBlur={() => onFieldBlur('externalIp')}
      />

      <OrderTextField
        id="edit-backup-server-private-ip"
        label={t('edit.field.private_ip.label')}
        value={form.privateIp}
        hint={t('edit.current_value', {
          value: firstIpWithoutMask(server.currentState.privateIps),
        })}
        error={errors.privateIp ? t(errors.privateIp) : null}
        required
        onChange={(value) => onFieldChange('privateIp', value)}
        onBlur={() => onFieldBlur('privateIp')}
      />
    </div>
  );
}
