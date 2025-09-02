import { Subtitle } from '@ovh-ux/manager-react-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsCard } from '@ovhcloud/ods-components/react';
import CreateCredentialConfirmationDetailsText from './CreateCredentialConfirmationDetailsText.component';
import { OkmsCredential } from '@/types/okmsCredential.type';
import { getDaysFromDate } from '@/utils/credential/validityDateUtils';

type CreateCredentialConfirmationDetailsProps = {
  okmsCredential: OkmsCredential;
};

const CreateCredentialConfirmationDetails = ({
  okmsCredential,
}: CreateCredentialConfirmationDetailsProps) => {
  const { t } = useTranslation('key-management-service/credential');

  return (
    <OdsCard className="p-4">
      <div className="flex flex-col w-full gap-4 md:gap-5 break-words">
        <Subtitle>
          {t(
            'key_management_service_credential_create_confirmation_details_title',
          )}
        </Subtitle>
        <CreateCredentialConfirmationDetailsText
          label={t(
            'key_management_service_credential_create_confirmation_details_id_label',
          )}
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
          label={t(
            'key_management_service_credential_create_confirmation_details_validity_label',
          )}
          value={t(
            'key_management_service_credential_create_confirmation_details_validity_suffix',
            { days: getDaysFromDate(new Date(okmsCredential.expiredAt)) },
          )}
        />
      </div>
    </OdsCard>
  );
};

export default CreateCredentialConfirmationDetails;
