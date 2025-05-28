import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { Subtitle } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { OdsButton } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { KMS_ROUTES_URLS } from '@/routes/routes.constants';
import { validateCredentialName } from '@/utils/credential/validateCredentialName';
import { validateCredentialDescription } from '@/utils/credential/validateCredentialDescription';

import { validateValidityDate } from '@/utils/credential/validateValidityDate';
import CreateGeneralInformationsName from './generalInformations/CreateGeneralInformationsName.component';
import CreateGeneralInformationsDescription from './generalInformations/CreateGeneralInformationsDescription';
import CreateGeneralInformationsValidity from './generalInformations/CreateGeneralInformationsValidity';
import CreateGeneralInformationsCreationMethod from './generalInformations/CreateGeneralInformationsCreationMethod.component';
import { validateCredentialCreationMethod } from '@/utils/credential/validateCredentialCreationMethod';

type CreateGeneralInformationsProps = {
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  validity: number;
  setValidity: Dispatch<SetStateAction<number>>;
  description: string | null;
  setDescription: Dispatch<SetStateAction<string | null>>;
  csr: string | null;
  setCsr: Dispatch<SetStateAction<string | null>>;
  isCustomCsr: boolean;
  setIsCustomCsr: Dispatch<SetStateAction<boolean>>;
  nextStep: () => void;
};

const CreateGeneralInformations = ({
  name,
  setName,
  validity,
  setValidity,
  description,
  setDescription,
  csr,
  setCsr,
  isCustomCsr,
  setIsCustomCsr,
  nextStep,
}: CreateGeneralInformationsProps) => {
  const { t } = useTranslation('key-management-service/credential');
  const { okmsId } = useParams();
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  const credentialNameError = validateCredentialName(name);
  const credentialDescriptionError = validateCredentialDescription(description);
  const credentialValidityError = validateValidityDate(validity);
  const credentialCreationMethodError = validateCredentialCreationMethod(csr);

  useEffect(() => {
    if (!isCustomCsr) {
      setCsr(null);
    }
  }, [isCustomCsr]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <div className="flex flex-col gap-7 md:gap-9">
        <div className="flex flex-col gap-6 md:gap-8">
          <Subtitle>
            {t(
              'key_management_service_credential_create_general_information_title',
            )}
          </Subtitle>
          <CreateGeneralInformationsName
            name={name}
            setName={setName}
            credentialNameError={credentialNameError}
          />
          <CreateGeneralInformationsDescription
            description={description}
            setDescription={setDescription}
            credentialDescriptionError={credentialDescriptionError}
          />
          <CreateGeneralInformationsValidity
            validity={validity}
            setValidity={setValidity}
            credentialValidityError={credentialValidityError}
          />
          <CreateGeneralInformationsCreationMethod
            csr={csr}
            setCsr={setCsr}
            isCustomCsr={isCustomCsr}
            setIsCustomCsr={setIsCustomCsr}
            credentialCreationMethodError={credentialCreationMethodError}
          />
          <div className="flex gap-4">
            <OdsButton
              size={ODS_BUTTON_SIZE.md}
              variant={ODS_BUTTON_VARIANT.outline}
              color={ODS_BUTTON_COLOR.primary}
              onClick={() => {
                trackClick({
                  location: PageLocation.funnel,
                  buttonType: ButtonType.button,
                  actionType: 'action',
                  actions: ['cancel'],
                });
                navigate(KMS_ROUTES_URLS.credentialListing(okmsId));
              }}
              label={t('key_management_service_credential_create_cta_cancel')}
            />
            <OdsButton
              size={ODS_BUTTON_SIZE.md}
              color={ODS_BUTTON_COLOR.primary}
              onClick={() => {
                trackClick({
                  location: PageLocation.funnel,
                  buttonType: ButtonType.button,
                  actionType: 'action',
                  actions: ['next'],
                });
                nextStep();
              }}
              isDisabled={
                !name ||
                !!credentialNameError ||
                !!credentialDescriptionError ||
                !!credentialValidityError ||
                (isCustomCsr && !csr)
              }
              label={t(
                'key_management_service_credential_create_cta_add_identities',
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGeneralInformations;
