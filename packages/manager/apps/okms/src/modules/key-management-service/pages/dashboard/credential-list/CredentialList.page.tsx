import { Suspense } from 'react';

import { Outlet, useNavigate, useOutletContext } from 'react-router-dom';

import CredentialDatagrid from '@key-management-service/components/credential/credential-datagrid/CredentialDatagrid';
import { KmsDashboardOutletContext } from '@key-management-service/pages/dashboard/KmsDashboard.type';
import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { useAuthorizationIam } from '@ovh-ux/muk';
import { Button } from '@ovh-ux/muk';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { kmsIamActions } from '@/common/utils/iam/iam.constants';

const CredentialList = () => {
  const { t } = useTranslation('key-management-service/credential');
  const navigate = useNavigate();
  const { okms } = useOutletContext<KmsDashboardOutletContext>();
  const { trackClick } = useOkmsTracking();

  const { isAuthorized, isLoading: isLoadingIam } = useAuthorizationIam(
    [kmsIamActions.credentialGet],
    okms.iam.urn,
  );

  return (
    <div className="flex flex-col gap-6">
      <Text preset="paragraph">{t('key_management_service_credential_headline')}</Text>
      <Button
        id="createAccessCertificate"
        loading={isLoadingIam}
        color="primary"
        className="w-fit"
        onClick={() => {
          trackClick({
            location: PageLocation.page,
            buttonType: ButtonType.button,
            actionType: 'action',
            actions: ['create', 'credential'],
          });
          navigate(KMS_ROUTES_URLS.credentialCreate(okms.id));
        }}
        iamActions={[kmsIamActions.credentialCreate]}
        urn={okms.iam.urn}
      >
        {t('key_management_service_credential_cta_create')}
      </Button>
      {!isLoadingIam &&
        (isAuthorized ? (
          <CredentialDatagrid okms={okms} />
        ) : (
          <Text preset="paragraph">{t('key_management_service_credential_not_authorized')}</Text>
        ))}
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default CredentialList;
