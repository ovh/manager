import React, { useState } from 'react';
import { OsdsButton } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import CreateCredentialConfirmationDetails from './CreateCredentialConfirmationDetails.component';
import CreateCredentialConfirmationPrivateKey from './CreateCredentialConfirmationPrivateKey.component';
import { OkmsCredential } from '@/types/okmsCredential.type';
import { ROUTES_URLS } from '@/routes/routes.constants';

type CreateCredentialConfirmationProps = {
  okmsCredential: OkmsCredential;
};

const CreateCredentialConfirmation = ({
  okmsCredential,
}: CreateCredentialConfirmationProps) => {
  const { t } = useTranslation('key-management-service/credential');
  const [isKeyDownloaded, setIsKeyDownloaded] = useState(false);
  const { okmsId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6 max-w-screen-lg">
      <CreateCredentialConfirmationDetails okmsCredential={okmsCredential} />
      <CreateCredentialConfirmationPrivateKey
        privateKey={okmsCredential.privateKeyPEM}
        credentialId={okmsCredential.id}
        isKeyDownloaded={isKeyDownloaded}
        setIsKeyDownloaded={setIsKeyDownloaded}
      />
      <span>
        <OsdsButton
          color={ODS_THEME_COLOR_INTENT.primary}
          disabled={!isKeyDownloaded || undefined}
          onClick={() => navigate(`/${okmsId}/${ROUTES_URLS.credentials}`)}
          inline
        >
          {t(
            'key_management_service_credential_create_confirmation_button_done_label',
          )}
        </OsdsButton>
      </span>
    </div>
  );
};

export default CreateCredentialConfirmation;
