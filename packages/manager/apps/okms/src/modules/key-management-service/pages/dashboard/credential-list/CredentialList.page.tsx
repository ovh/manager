import { Outlet, useNavigate, useOutletContext } from 'react-router-dom';

import CredentialDatagrid from '@key-management-service/components/credential/credential-datagrid/CredentialDatagrid';
import { KmsDashboardOutletContext } from '@key-management-service/pages/dashboard/KmsDashboard.type';
import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_COLOR, ODS_BUTTON_SIZE, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { ManagerButton, useAuthorizationIam } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

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
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
        {t('key_management_service_credential_headline')}
      </OdsText>
      <ManagerButton
        id="createAccessCertificate"
        isLoading={isLoadingIam}
        size={ODS_BUTTON_SIZE.sm}
        color={ODS_BUTTON_COLOR.primary}
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
        label={t('key_management_service_credential_cta_create')}
      />
      {!isLoadingIam &&
        (isAuthorized ? (
          <CredentialDatagrid okms={okms} />
        ) : (
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t('key_management_service_credential_not_authorized')}
          </OdsText>
        ))}
      <Outlet />
    </div>
  );
};

export default CredentialList;
