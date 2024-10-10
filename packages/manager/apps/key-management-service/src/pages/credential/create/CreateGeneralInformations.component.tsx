import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Subtitle } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { OsdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES_URLS } from '@/routes/routes.constants';
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
          <Subtitle>
            {t(
              'key_management_service_credential_create_general_creation_method_title',
            )}
          </Subtitle>
          <CreateGeneralInformationsCreationMethod
            csr={csr}
            setCsr={setCsr}
            isCustomCsr={isCustomCsr}
            setIsCustomCsr={setIsCustomCsr}
            credentialCreationMethodError={credentialCreationMethodError}
          />
          <div className="flex gap-4">
            <OsdsButton
              size={ODS_BUTTON_SIZE.md}
              inline
              variant={ODS_BUTTON_VARIANT.stroked}
              color={ODS_THEME_COLOR_INTENT.primary}
              onClick={() => {
                navigate(`/${okmsId}/${ROUTES_URLS.credentials}`);
              }}
            >
              {t('key_management_service_credential_create_cta_cancel')}
            </OsdsButton>
            <OsdsButton
              size={ODS_BUTTON_SIZE.md}
              inline
              color={ODS_THEME_COLOR_INTENT.primary}
              onClick={nextStep}
              disabled={
                !!credentialNameError ||
                !!credentialDescriptionError ||
                !!credentialValidityError ||
                (!!credentialCreationMethodError && isCustomCsr) ||
                undefined
              }
            >
              {t('key_management_service_credential_create_cta_add_identities')}
            </OsdsButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGeneralInformations;
