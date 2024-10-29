import React, { useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsIcon } from '@ovhcloud/ods-components/react';
import {
  Description,
  ManagerButton,
  useAuthorizationIam,
} from '@ovh-ux/manager-react-components';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import Loading from '@/components/Loading/Loading';
import CredentialDatagrid from '../../../components/credential/credentialDatagrid/CredentialDatagrid';
import { ROUTES_URLS } from '@/routes/routes.constants';
import { OkmsContext } from '..';
import { kmsIamActions } from '@/utils/iam/iam.constants';

const CredentialList = () => {
  const { t } = useTranslation('key-management-service/credential');
  const navigate = useNavigate();
  const okms = useContext(OkmsContext);
  const { trackClick } = useOvhTracking();

  const { isAuthorized, isLoading: isLoadingIam } = useAuthorizationIam(
    [kmsIamActions.credentialGet],
    okms.iam.urn,
  );

  if (isLoadingIam) return <Loading />;

  return (
    <div className={'flex flex-col gap-8 mt-8'}>
      <Description>
        {t('key_management_service_credential_headline')}
      </Description>
      <ManagerButton
        size={ODS_BUTTON_SIZE.sm}
        inline
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.stroked}
        className={'w-fit'}
        onClick={() => {
          trackClick({
            location: PageLocation.page,
            buttonType: ButtonType.button,
            actionType: 'action',
            actions: ['create_access_certificate'],
          });
          navigate(ROUTES_URLS.createCredential);
        }}
        iamActions={[kmsIamActions.credentialCreate]}
        urn={okms.iam.urn}
      >
        <span slot="start">
          <OsdsIcon
            name={ODS_ICON_NAME.ADD}
            size={ODS_ICON_SIZE.xs}
            color={ODS_THEME_COLOR_INTENT.primary}
          ></OsdsIcon>
        </span>
        {t('key_management_service_credential_cta_create')}
      </ManagerButton>
      {isAuthorized ? (
        <CredentialDatagrid />
      ) : (
        <Description>
          {t('key_management_service_credential_not_authorized')}
        </Description>
      )}
      <Outlet />
    </div>
  );
};

export default CredentialList;
