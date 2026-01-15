import { CertificateType } from '@key-management-service/types/okmsCredential.type';
import { CredentialCreationMethodErrorsType } from '@key-management-service/utils/credential/validateCredentialCreationMethod';
import { useTranslation } from 'react-i18next';

import { OdsFormField, OdsRadio, OdsTextarea } from '@ovhcloud/ods-components/react';
import { Text } from '@ovhcloud/ods-react';

import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';

import { CSR_PLACEHOLDER } from '../CreateGeneralInformations.constants';

type CreateGeneralInformationsCreationMethodProps = {
  csr: string | null;
  setCsr: (csr: string | null) => void;
  isCustomCsr: boolean;
  setIsCustomCsr: (isCustomCsr: boolean) => void;
  certificateType: CertificateType | null;
  setCertificateType: (certificateType: CertificateType | null) => void;
  credentialCreationMethodError: CredentialCreationMethodErrorsType | undefined;
};

const CreateGeneralInformationsCreationMethod = ({
  csr,
  setCsr,
  isCustomCsr,
  setIsCustomCsr,
  credentialCreationMethodError,
  certificateType,
  setCertificateType,
}: CreateGeneralInformationsCreationMethodProps) => {
  const { t } = useTranslation('key-management-service/credential');
  const { trackClick } = useOkmsTracking();

  const getCreationMethodErrorMessage = (error: CredentialCreationMethodErrorsType | undefined) => {
    if (error === 'REQUIRED') {
      return t('key_management_service_credential_update_custom_csr_error_required');
    }
    return undefined;
  };

  return (
    <>
      <OdsFormField>
        <div slot="label" className="mb-2 space-y-2">
          <Text className="block" preset="heading-5">
            {t('key_management_service_credential_create_general_creation_method_title')}
          </Text>
          <Text preset="paragraph">
            {t(
              'key_management_service_credential_create_general_information_creation_method_subtitle',
            )}
          </Text>
        </div>
        <div className="flex items-center gap-3">
          <OdsRadio
            name="method"
            inputId="radio-method-no-key"
            data-testid="radio-method-no-key"
            isChecked={!isCustomCsr}
            onClick={() => {
              trackClick({
                location: PageLocation.funnel,
                buttonType: ButtonType.button,
                actionType: 'action',
                actions: ['select', 'type', 'ovh-generated'],
              });
              setIsCustomCsr(false);
            }}
          />
          <label htmlFor="radio-method-no-key">
            <Text className="block" preset="paragraph">
              {t(
                'key_management_service_credential_create_general_information_creation_method_no_key',
              )}
            </Text>
            <Text preset="caption">
              {t(
                `key_management_service_credential_create_general_information_creation_method_no_key_desc`,
              )}
            </Text>
          </label>
        </div>
        <div className="flex items-center gap-3">
          <OdsRadio
            name="method"
            inputId="radio-method-key"
            data-testid="radio-method-key"
            isChecked={isCustomCsr}
            onClick={() => {
              trackClick({
                location: PageLocation.funnel,
                buttonType: ButtonType.button,
                actionType: 'action',
                actions: ['select', 'type', 'custom'],
              });
              setIsCustomCsr(true);
            }}
          />
          <label htmlFor="radio-method-key">
            <Text className="block" preset="paragraph">
              {t(
                'key_management_service_credential_create_general_information_creation_method_key',
              )}
            </Text>
            <Text preset="caption">
              {t(
                `key_management_service_credential_create_general_information_creation_method_key_desc`,
              )}
            </Text>
          </label>
        </div>
      </OdsFormField>
      {isCustomCsr ? (
        <OdsFormField error={getCreationMethodErrorMessage(credentialCreationMethodError)}>
          <div slot="label" className="mb-2 space-y-2">
            <Text className="block" preset="heading-5">
              {t('key_management_service_credential_create_general_information_csr_title')}
            </Text>
            <Text preset="paragraph">
              {t('key_management_service_credential_create_general_information_csr_subtitle')}
            </Text>
          </div>
          <OdsTextarea
            name="credentialCreationMethod"
            data-testid="textarea-csr"
            value={csr}
            hasError={!!credentialCreationMethodError}
            placeholder={CSR_PLACEHOLDER}
            rows={10}
            onOdsChange={(e) => setCsr(e.detail.value)}
          />
        </OdsFormField>
      ) : (
        <OdsFormField className="flex flex-col gap-4">
          <div slot="label" className="flex flex-col gap-2">
            <Text className="block" preset="heading-5">
              {t(
                'key_management_service_credential_create_general_information_certificate_type_title',
              )}
            </Text>
            <Text preset="paragraph">
              {t(
                'key_management_service_credential_crate_general_information_certificate_type_subtitle',
              )}
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <OdsRadio
              inputId="certificateTypeECDSA"
              id="certificateTypeECDSA"
              data-testid="radio-certificate-type-ec"
              name="certificateType"
              value={certificateType}
              isChecked={certificateType === 'ECDSA'}
              onClick={() => {
                setCertificateType('ECDSA');
              }}
            ></OdsRadio>
            <label htmlFor="certificateTypeECDSA">
              <Text preset="span">
                {t(
                  'key_management_service_credential_crate_general_information_certificate_type_ec_radio_label',
                )}
              </Text>
            </label>
          </div>
          <div className="flex items-center gap-2">
            <OdsRadio
              inputId="certificateTypeRSA"
              id="certificateTypeRSA"
              data-testid="radio-certificate-type-rsa"
              name="certificateType"
              value={certificateType}
              isChecked={certificateType === 'RSA'}
              onClick={() => {
                setCertificateType('RSA');
              }}
            ></OdsRadio>
            <label htmlFor="certificateTypeRSA">
              <Text preset="span">
                {t(
                  'key_management_service_credential_crate_general_information_certificate_type_rsa_radio_label',
                )}
              </Text>
            </label>
          </div>
        </OdsFormField>
      )}
    </>
  );
};

export default CreateGeneralInformationsCreationMethod;
