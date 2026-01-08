import { OkmsCredential } from '@key-management-service/types/okmsCredential.type';
import { getDaysFromDate } from '@key-management-service/utils/credential/validityDateUtils';
import { useTranslation } from 'react-i18next';

import { Card, Text } from '@ovhcloud/ods-react';

import CreateCredentialConfirmationDetailsText from './CreateCredentialConfirmationDetailsText.component';

type CreateCredentialConfirmationDetailsProps = {
  okmsCredential: OkmsCredential;
};

const CreateCredentialConfirmationDetails = ({
  okmsCredential,
}: CreateCredentialConfirmationDetailsProps) => {
  const { t } = useTranslation('key-management-service/credential');

  return (
    <Card className="p-4">
      <div className="flex w-full flex-col gap-4 break-words md:gap-5">
        <Text preset="heading-3">
          {t('key_management_service_credential_create_confirmation_details_title')}
        </Text>
        <CreateCredentialConfirmationDetailsText
          label={t('key_management_service_credential_create_confirmation_details_id_label')}
          value={okmsCredential.id}
        />
        <CreateCredentialConfirmationDetailsText
          label={t(
            'key_management_service_credential_create_confirmation_details_display-name_label',
          )}
          value={okmsCredential.name}
        />
        <CreateCredentialConfirmationDetailsText
          label={t(
            'key_management_service_credential_create_confirmation_details_description_label',
          )}
          value={okmsCredential.description}
        />
        <CreateCredentialConfirmationDetailsText
          label={t('key_management_service_credential_create_confirmation_details_validity_label')}
          value={t(
            'key_management_service_credential_create_confirmation_details_validity_suffix',
            { days: getDaysFromDate(new Date(okmsCredential.expiredAt)) },
          )}
        />
      </div>
    </Card>
  );
};

export default CreateCredentialConfirmationDetails;
