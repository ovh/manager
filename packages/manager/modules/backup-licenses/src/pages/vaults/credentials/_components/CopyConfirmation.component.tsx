import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import { OdsMessage } from '@ovhcloud/ods-components/react';

import { BACKUP_LICENSES_NAMESPACES } from '@/BackupLicenses.translations';

import { CopyConfirmationContext } from '../_hooks/useCopyCredential.hook';

export const COPY_CONFIRMATION_TEST_ID = 'vault-credentials-copy-confirmation';

/**
 * Hosts the per-copy confirmation (ux.md § Notifications) *inside* the dialog. It cannot be a
 * notification: ODS 18's `ods-modal` opens a native `<dialog>` with `showModal()`, so the page's
 * `<Notifications />` host sits behind the backdrop, inert and unreadable, and the store is cleared
 * by the navigation that closes the modal.
 */
export const CopyConfirmation = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.VAULTS);
  const [copyCount, setCopyCount] = useState(0);
  const confirmCopy = useCallback(() => setCopyCount((count) => count + 1), []);

  return (
    <CopyConfirmationContext.Provider value={confirmCopy}>
      <div className="flex flex-col gap-6">
        {children}
        {/* Mounted from the start, and re-keyed on every copy: a live region is only announced for
            the changes it receives while already in the tree, and replacing the node is what makes
            a screen reader repeat a sentence it has just read. */}
        <div role="status" data-testid={COPY_CONFIRMATION_TEST_ID}>
          {copyCount > 0 && (
            <OdsMessage key={copyCount} color={ODS_MESSAGE_COLOR.success} isDismissible={false}>
              {t('credentials.copied_toast')}
            </OdsMessage>
          )}
        </div>
      </div>
    </CopyConfirmationContext.Provider>
  );
};
