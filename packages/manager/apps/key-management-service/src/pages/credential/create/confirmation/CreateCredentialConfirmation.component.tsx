import React, { useState } from 'react';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_COLOR } from '@ovhcloud/ods-components';
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
      <OdsButton
        color={ODS_BUTTON_COLOR.primary}
        isDisabled={!isKeyDownloaded}
        onClick={() => navigate(`/${okmsId}/${ROUTES_URLS.credentials}`)}
        label={t(
          'key_management_service_credential_create_confirmation_button_done_label',
        )}
      />
    </div>
  );
};

export default CreateCredentialConfirmation;
