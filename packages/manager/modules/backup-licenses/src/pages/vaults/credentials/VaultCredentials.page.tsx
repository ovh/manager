import React from 'react';

import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import { OdsMessage, OdsSkeleton } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal } from '@ovh-ux/manager-react-components';

import { BACKUP_LICENSES_NAMESPACES } from '@/BackupLicenses.translations';
import { useReturnFocus } from '@/hooks/useReturnFocus/useReturnFocus';
import { routeUrls } from '@/routes/routes.constants';

import { getVaultActionsTriggerId } from '../vaults.constants';
import { CopyConfirmation } from './_components/CopyConfirmation.component';
import { VaultCredentialField } from './_components/VaultCredentialField.component';
import { VaultSecretField } from './_components/VaultSecretField.component';
import { useVaultCredentials } from './_hooks/useVaultCredentials.hook';

export const VAULT_CREDENTIALS_STATUS_TEST_ID = 'vault-credentials-status';

export default function VaultCredentialsPage() {
  const { t } = useTranslation([
    BACKUP_LICENSES_NAMESPACES.VAULTS,
    NAMESPACES.ACTIONS,
    NAMESPACES.REGION,
    NAMESPACES.SYSTEM,
  ]);
  const { vaultId } = useParams<{ vaultId: string }>();
  const navigate = useNavigate();
  const { vault, bucket, credentials, isVaultListResolved, isPending, isError } =
    useVaultCredentials(vaultId ?? '');

  const returnFocusToTrigger = useReturnFocus(getVaultActionsTriggerId(vaultId ?? ''));
  const hasStatus = isPending || isError;

  const closeModal = () => {
    navigate(routeUrls.vaults);
    returnFocusToTrigger();
  };

  // The modal is a deep-linkable route, so the disabled action menu is not a guard: a hand-typed URL
  // would otherwise open on a vault with no bucket able to serve keys.
  if (isVaultListResolved && (!vault || !bucket)) {
    return <Navigate to={routeUrls.vaults} replace />;
  }

  return (
    <Modal
      isOpen
      heading={t('credentials.title')}
      onDismiss={closeModal}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:close`)}
      onSecondaryButtonClick={closeModal}
    >
      <CopyConfirmation>
        <div className="flex flex-col gap-6" aria-busy={isPending}>
          {/* The only live region, mounted from the first render and never unmounted: a region born
              with its content is silent, so the wait and the failure have to land in a node that was
              already there. The four values stay outside it, so a reveal is never narrated. */}
          <div
            role="status"
            data-testid={VAULT_CREDENTIALS_STATUS_TEST_ID}
            // Out of flow while empty, since a zero-height flex item still claims the column's gap.
            className={hasStatus ? 'flex flex-col gap-6' : 'absolute'}
          >
            {isPending && (
              <div data-testid="vault-credentials-loading" className="flex flex-col gap-6">
                {/* ODS renders a skeleton as an empty shadow root: without this sentence the region
                    receives no text change and the wait is announced by nothing. */}
                <span className="sr-only">{t('credentials.loading')}</span>
                <OdsSkeleton />
                <OdsSkeleton />
              </div>
            )}
            {isError && (
              <OdsMessage color={ODS_MESSAGE_COLOR.critical} isDismissible={false}>
                {t('credentials.error')}
              </OdsMessage>
            )}
          </div>
          {credentials && (
            <>
              {/* `regionCode` et non `bucket.region` : le contrat distingue `common.RegionEnum`
                  (`eu-west-gra`) du code S3 court (`gra`) qu'un client S3 doit signer, et seul ce
                  dernier accompagne les clés — avec l'endpoint auquel il correspond. */}
              <VaultCredentialField
                label={t(`${NAMESPACES.REGION}:region`)}
                value={credentials.regionCode}
                testId="vault-credentials-region"
              />
              <VaultCredentialField
                label={t('credentials.field.endpoint')}
                value={credentials.endpoint}
                testId="vault-credentials-endpoint"
              />
              <VaultCredentialField
                label={t(`${NAMESPACES.SYSTEM}:key_access`)}
                value={credentials.accessKey}
                testId="vault-credentials-access-key"
              />
              <VaultSecretField
                label={t(`${NAMESPACES.SYSTEM}:key_secret`)}
                value={credentials.secretKey}
              />
            </>
          )}
        </div>
      </CopyConfirmation>
    </Modal>
  );
}
