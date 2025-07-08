import React, { useEffect } from 'react';
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
import { CertificateType } from '@/types/okmsCredential.type';

type CreateGeneralInformationsProps = {
  name: string | null;
  setName: (name: string | null) => void;
  validity: number;
  setValidity: (validity: number) => void;
  description: string | null;
  setDescription: (description: string | null) => void;
  csr: string | null;
  setCsr: (csr: string | null) => void;
  certificateType: CertificateType | null;
  setCertificateType: (certificateType: CertificateType | null) => void;
  isCustomCsr: boolean;
  setIsCustomCsr: (isCustomCsr: boolean) => void;
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
  certificateType,
  setCertificateType,
  isCustomCsr,
  setIsCustomCsr,
  nextStep,
}: CreateGeneralInformationsProps) => {
  const { t } = useTranslation('key-management-service/credential');
  const { okmsId } = useParams() as { okmsId: string };
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  const credentialNameError = validateCredentialName(name);
  const credentialDescriptionError = validateCredentialDescription(description);
  const credentialValidityError = validateValidityDate(validity);
  const credentialCreationMethodError = validateCredentialCreationMethod(csr);

  useEffect(() => {
    if (!isCustomCsr) {
      setCsr(null);
      setCertificateType('EC');
    } else {
      setCertificateType(null);
    }
  }, [isCustomCsr]);

  return (
    <div className="max-w-lg gap-4 lg:gap-6">
      <div className="flex flex-col gap-7 md:gap-9">
        <div className="flex flex-col gap-3 md:gap-4">
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
          <div className="-mt-4 flex flex-col">
            <CreateGeneralInformationsValidity
              validity={validity}
              setValidity={setValidity}
              credentialValidityError={credentialValidityError}
            />
          </div>
          <CreateGeneralInformationsCreationMethod
            csr={csr}
            setCsr={setCsr}
            certificateType={certificateType}
            setCertificateType={setCertificateType}
            isCustomCsr={isCustomCsr}
            setIsCustomCsr={setIsCustomCsr}
            credentialCreationMethodError={credentialCreationMethodError}
          />
        </div>
        <div className="flex gap-4">
          <OdsButton
            data-testid="button-cancel"
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
            data-testid="button-next-step"
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
  );
};

export default CreateGeneralInformations;
