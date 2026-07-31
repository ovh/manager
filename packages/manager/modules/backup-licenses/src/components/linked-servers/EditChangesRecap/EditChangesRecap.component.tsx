import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { EditFormChange } from '@/hooks/useEditBackupServerForm/useEditBackupServerForm';
import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';
import { getLicenseTypeDisplay } from '@/utils/licenseLabel/licenseLabel';

interface EditChangesRecapProps {
  changes: EditFormChange[];
}

const FIELD_LABEL_KEYS: Record<EditFormChange['field'], string> = {
  displayName: 'edit.field.name.label',
  externalIp: 'edit.field.public_ip.label',
  privateIp: 'edit.field.private_ip.label',
  licenseType: 'edit.field.license_type.label',
};

/**
 * Récap « avant → après » (BKP-1218), affiché juste avant le bouton « Enregistrer » dès qu'au
 * moins un champ a été modifié : reconnaissance plutôt que rappel, sur une opération qu'il
 * n'est pas trivial d'annuler une fois enregistrée. Complète le message de licence différée
 * (celui-ci explique *quand* le changement s'applique, ce récap confirme *quoi* a changé).
 */
export default function EditChangesRecap({ changes }: EditChangesRecapProps) {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.LINKED_SERVERS);

  const toLabel = (change: EditFormChange, value: string) => {
    if (change.field !== 'licenseType') return value;
    const { i18nKey, rawLabel } = getLicenseTypeDisplay(value);
    return i18nKey ? t(i18nKey) : rawLabel;
  };

  return (
    <div data-testid="edit-backup-server-changes-recap" className="flex flex-col gap-2">
      <OdsText preset={ODS_TEXT_PRESET.heading6}>{t('edit.recap.title')}</OdsText>
      <ul className="list-disc pl-5">
        {changes.map((change) => (
          <li key={change.field}>
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t(FIELD_LABEL_KEYS[change.field])} : {toLabel(change, change.before)} →{' '}
              {toLabel(change, change.after)}
            </OdsText>
          </li>
        ))}
      </ul>
    </div>
  );
}
