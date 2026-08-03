import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_ICON_NAME } from '@ovhcloud/ods-components';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { BACKUP_LICENSES_NAMESPACES } from '@/BackupLicenses.translations';
import { ActionButton } from '@/components/ActionButton/ActionButton.component';
import { VAULT_SECRET_MASK } from '@/module.constants';

import { VaultCredentialField } from './VaultCredentialField.component';

export const VAULT_SECRET_FIELD_TEST_ID = 'vault-credentials-secret-key';

export type VaultSecretFieldProps = {
  label: string;
  value: string;
};

export const VaultSecretField = ({ label, value }: VaultSecretFieldProps) => {
  const { t } = useTranslation([BACKUP_LICENSES_NAMESPACES.VAULTS, NAMESPACES.ACTIONS]);
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <VaultCredentialField
      label={label}
      value={value}
      displayValue={
        isRevealed ? (
          value
        ) : (
          <>
            {/* Twelve bullets read out as twelve bullets: the glyphs are decoration, and the sentence
                beside them is what tells a screen reader the value is held back. */}
            <span aria-hidden="true">{VAULT_SECRET_MASK}</span>
            <span className="sr-only">{t('credentials.a11y.value_hidden')}</span>
          </>
        )
      }
      testId={VAULT_SECRET_FIELD_TEST_ID}
    >
      <ActionButton
        testId={`${VAULT_SECRET_FIELD_TEST_ID}-toggle`}
        icon={isRevealed ? ODS_ICON_NAME.eyeOff : ODS_ICON_NAME.eye}
        visibleLabel={isRevealed ? t('credentials.hide') : t(`${NAMESPACES.ACTIONS}:display`)}
        accessibleName={t(
          isRevealed ? 'credentials.a11y.hide_secret' : 'credentials.a11y.show_secret',
        )}
        onClick={() => setIsRevealed((revealed) => !revealed)}
      />
    </VaultCredentialField>
  );
};
