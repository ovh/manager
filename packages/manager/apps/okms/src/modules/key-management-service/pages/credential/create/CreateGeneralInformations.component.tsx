import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { CertificateType } from '@key-management-service/types/okmsCredential.type';
import { validateCredentialCreationMethod } from '@key-management-service/utils/credential/validateCredentialCreationMethod';
import { validateCredentialDescription } from '@key-management-service/utils/credential/validateCredentialDescription';
import { validateCredentialName } from '@key-management-service/utils/credential/validateCredentialName';
import { validateValidityDate } from '@key-management-service/utils/credential/validateValidityDate';
import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { Button } from '@ovh-ux/muk';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { useRequiredParams } from '@/common/hooks/useRequiredParams';

import CreateGeneralInformationsCreationMethod from './general-informations/CreateGeneralInformationsCreationMethod.component';
import CreateGeneralInformationsDescription from './general-informations/CreateGeneralInformationsDescription';
import CreateGeneralInformationsName from './general-informations/CreateGeneralInformationsName.component';
import CreateGeneralInformationsValidity from './general-informations/CreateGeneralInformationsValidity';

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
  const { okmsId } = useRequiredParams('okmsId');
  const navigate = useNavigate();
  const { trackClick } = useOkmsTracking();

  const credentialNameError = validateCredentialName(name);
  const credentialDescriptionError = validateCredentialDescription(description);
  const credentialValidityError = validateValidityDate(validity);
  const credentialCreationMethodError = validateCredentialCreationMethod(csr);

  useEffect(() => {
    if (!isCustomCsr) {
      setCsr(null);
      setCertificateType('ECDSA');
    } else {
      setCertificateType(null);
    }
  }, [isCustomCsr, setCsr, setCertificateType]);

  return (
    <div className="max-w-lg gap-4 lg:gap-6">
      <div className="flex flex-col gap-7 md:gap-9">
        <div className="flex flex-col gap-3 md:gap-4">
          <Text preset="heading-3">
            {t('key_management_service_credential_create_general_information_title')}
          </Text>
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
          <Button
            data-testid="button-cancel"
            variant="outline"
            color="primary"
            onClick={() => {
              trackClick({
                location: PageLocation.funnel,
                buttonType: ButtonType.button,
                actionType: 'action',
                actions: ['cancel'],
              });
              navigate(KMS_ROUTES_URLS.credentialListing(okmsId));
            }}
          >
            {t('key_management_service_credential_create_cta_cancel')}
          </Button>
          <Button
            data-testid="button-next-step"
            color="primary"
            onClick={() => {
              trackClick({
                location: PageLocation.funnel,
                buttonType: ButtonType.button,
                actionType: 'action',
                actions: ['next'],
              });
              nextStep();
            }}
            disabled={
              !name ||
              !!credentialNameError ||
              !!credentialDescriptionError ||
              !!credentialValidityError ||
              (isCustomCsr && !csr)
            }
          >
            {t('key_management_service_credential_create_cta_add_identities')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateGeneralInformations;
