import { Suspense } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import CredentialCreationMethod from '@key-management-service/components/credential/credential-creation-method/credentialCreationMethod.component';
import { CredentialStatus } from '@key-management-service/components/credential/credential-status-badge/CredentialStatusBadge.component';
import { TileValueDate } from '@key-management-service/components/dashboard/tile-value-date/tileValueDate.component';
import { KMS_ROUTES_URIS } from '@key-management-service/routes/routes.constants';
import { getDownloadCredentialParameters } from '@key-management-service/utils/credential/credentialDownload';
import { useTranslation } from 'react-i18next';

import { Icon, Text } from '@ovhcloud/ods-react';

import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { Tile } from '@ovh-ux/muk';
import { Button, GridLayout } from '@ovh-ux/muk';
import { Clipboard } from '@ovh-ux/muk';

import { MukLink } from '@/common/components/link/Link.component';
import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { kmsIamActions } from '@/common/utils/iam/iam.constants';

import { useOutletCredential } from '../Credential.page';
import { CREDENTIAL_GENERAL_INFORMATIONS_TEST_IDS } from './generalInformations.constants';

const dateFormat: Intl.DateTimeFormatOptions = {
  hour12: false,
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
};

const CredentialGeneralInformations = () => {
  const { okms, credential } = useOutletCredential();
  const navigate = useNavigate();
  const { t } = useTranslation('key-management-service/credential');
  const { trackClick } = useOkmsTracking();

  const { filename, href: downloadHref, isDisabled } = getDownloadCredentialParameters(credential);

  return (
    <GridLayout>
      <Tile.Root title={t('key_management_service_credential_dashboard_tile_general_informations')}>
        <Tile.Item.Root>
          <Tile.Item.Term label={t('key_management_service_credential_dashboard_name')} />
          <Tile.Item.Description>
            <Text
              preset="span"
              // Temporary fix: wrap text without whitespace
              style={{ overflowWrap: 'anywhere' }}
              data-testid={CREDENTIAL_GENERAL_INFORMATIONS_TEST_IDS.displayName}
            >
              {credential.name || credential.id}
            </Text>
          </Tile.Item.Description>
        </Tile.Item.Root>
        <Tile.Item.Root>
          <Tile.Item.Term label={t('key_management_service_credential_dashboard_id')} />
          <Tile.Item.Description>
            <Clipboard
              className="w-full"
              value={credential.id}
              data-testid={CREDENTIAL_GENERAL_INFORMATIONS_TEST_IDS.id}
            />
          </Tile.Item.Description>
        </Tile.Item.Root>
        <Tile.Item.Root>
          <Tile.Item.Term label={t('key_management_service_credential_dashboard_description')} />
          <Tile.Item.Description>
            <Text
              preset="span"
              // Temporary fix: wrap text without whitespace
              style={{ overflowWrap: 'anywhere' }}
              data-testid={CREDENTIAL_GENERAL_INFORMATIONS_TEST_IDS.description}
            >
              {credential.description || ''}
            </Text>
          </Tile.Item.Description>
        </Tile.Item.Root>
        <Tile.Item.Root>
          <Tile.Item.Term label={t('key_management_service_credential_dashboard_status')} />
          <Tile.Item.Description>
            <CredentialStatus
              state={credential.status}
              data-testid={CREDENTIAL_GENERAL_INFORMATIONS_TEST_IDS.status}
            />
          </Tile.Item.Description>
        </Tile.Item.Root>
        <Tile.Item.Root>
          <Tile.Item.Term label={t('key_management_service_credential_dashboard_type')} />
          <Tile.Item.Description>
            <Text preset="span" data-testid={CREDENTIAL_GENERAL_INFORMATIONS_TEST_IDS.type}>
              {credential.certificateType}
            </Text>
          </Tile.Item.Description>
        </Tile.Item.Root>
        <Tile.Item.Root>
          <Tile.Item.Term label={t('key_management_service_credential_dashboard_origin')} />
          <Tile.Item.Description>
            <CredentialCreationMethod
              fromCSR={credential.fromCSR}
              data-testid={CREDENTIAL_GENERAL_INFORMATIONS_TEST_IDS.origin}
            />
          </Tile.Item.Description>
        </Tile.Item.Root>
        <Tile.Item.Root>
          <Tile.Item.Term label={t('key_management_service_credential_dashboard_creation')} />
          <Tile.Item.Description>
            <TileValueDate
              value={credential.createdAt}
              options={dateFormat}
              data-testid={CREDENTIAL_GENERAL_INFORMATIONS_TEST_IDS.creationDate}
            />
          </Tile.Item.Description>
        </Tile.Item.Root>
        <Tile.Item.Root>
          <Tile.Item.Term label={t('key_management_service_credential_dashboard_expiration')} />
          <Tile.Item.Description>
            <TileValueDate
              value={credential.expiredAt}
              options={dateFormat}
              data-testid={CREDENTIAL_GENERAL_INFORMATIONS_TEST_IDS.expirationDate}
            />
          </Tile.Item.Description>
        </Tile.Item.Root>
        <Tile.Item.Root>
          <Tile.Item.Term label={t('key_management_service_credential_dashboard_actions')} />
          <Tile.Item.Description divider={false}>
            <div className="flex items-center gap-4">
              {downloadHref && (
                <MukLink
                  href={downloadHref}
                  download={filename}
                  disabled={isDisabled}
                  onClick={() =>
                    trackClick({
                      location: PageLocation.page,
                      buttonType: ButtonType.button,
                      actionType: 'action',
                      actions: ['download', 'credential'],
                    })
                  }
                  data-testid={CREDENTIAL_GENERAL_INFORMATIONS_TEST_IDS.downloadButton}
                >
                  <>
                    {t('key_management_service_credential_download')}
                    <Icon name="download" />
                  </>
                </MukLink>
              )}
              <Button
                id="deleteAccessCertificate"
                size="sm"
                color="critical"
                variant="ghost"
                iamActions={[kmsIamActions.credentialDelete]}
                onClick={() => {
                  trackClick({
                    location: PageLocation.page,
                    buttonType: ButtonType.button,
                    actionType: 'action',
                    actions: ['delete', 'credential'],
                  });
                  navigate(KMS_ROUTES_URIS.credentialDelete);
                }}
                urn={okms.iam.urn}
                data-testid={CREDENTIAL_GENERAL_INFORMATIONS_TEST_IDS.deleteButton}
              >
                {t('key_management_service_credential_delete')}
              </Button>
            </div>
          </Tile.Item.Description>
        </Tile.Item.Root>
      </Tile.Root>
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </GridLayout>
  );
};

export default CredentialGeneralInformations;
