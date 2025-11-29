import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { OkmsCredential } from '@key-management-service/types/okmsCredential.type';
import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_COLOR } from '@ovhcloud/ods-components';
import { OdsButton } from '@ovhcloud/ods-components/react';

import { useRequiredParams } from '@/common/hooks/useRequiredParams';

import CreateCredentialConfirmationDetails from './CreateCredentialConfirmationDetails.component';
import CreateCredentialConfirmationPrivateKey from './CreateCredentialConfirmationPrivateKey.component';

type CreateCredentialConfirmationProps = {
  okmsCredential: OkmsCredential;
};

const CreateCredentialConfirmation = ({ okmsCredential }: CreateCredentialConfirmationProps) => {
  const { t } = useTranslation('key-management-service/credential');
  const [isKeyDownloaded, setIsKeyDownloaded] = useState(false);
  const { okmsId } = useRequiredParams('okmsId');
  const navigate = useNavigate();

  return (
    <div className="grid max-w-screen-lg grid-cols-1 gap-4 md:gap-6">
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
        onClick={() => navigate(KMS_ROUTES_URLS.credentialListing(okmsId))}
        label={t('key_management_service_credential_create_confirmation_button_done_label')}
      />
    </div>
  );
};

export default CreateCredentialConfirmation;
