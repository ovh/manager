import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_ICON_NAME, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { BACKUP_LICENSES_NAMESPACES } from '@/BackupLicenses.translations';
import { ActionButton } from '@/components/ActionButton/ActionButton.component';

import { useCopyCredential } from '../_hooks/useCopyCredential.hook';

export type VaultCredentialFieldProps = {
  label: string;
  /** What the copy control puts in the clipboard — always the full value, masked or not. */
  value: string;
  displayValue?: React.ReactNode;
  testId: string;
  children?: React.ReactNode;
};

export const VaultCredentialField = ({
  label,
  value,
  displayValue,
  testId,
  children,
}: VaultCredentialFieldProps) => {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.VAULTS);
  const copyCredential = useCopyCredential();

  return (
    <div className="flex flex-col gap-3">
      <OdsText preset={ODS_TEXT_PRESET.caption}>{label}</OdsText>
      <div className="flex items-center gap-4">
        <OdsText data-testid={testId} preset={ODS_TEXT_PRESET.code} className="break-all">
          {displayValue ?? value}
        </OdsText>
        <ActionButton
          testId={`${testId}-copy`}
          icon={ODS_ICON_NAME.fileCopy}
          // Interpolated unescaped: the name lands in an attribute React escapes for the DOM anyway,
          // and i18next's default would have a screen reader read out "Clé d&#39;accès".
          accessibleName={t('credentials.a11y.copy_field', {
            field: label,
            interpolation: { escapeValue: false },
          })}
          onClick={() => copyCredential(value)}
        />
        {children}
      </div>
    </div>
  );
};
