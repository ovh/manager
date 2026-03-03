import { CertificateType } from '@key-management-service/types/okmsCredential.type';
import { CredentialCreationMethodErrorsType } from '@key-management-service/utils/credential/validateCredentialCreationMethod';
import { useTranslation } from 'react-i18next';

import {
  FormField,
  FormFieldError,
  FormFieldLabel,
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  RadioValueChangeDetail,
  Text,
  Textarea,
} from '@ovhcloud/ods-react';

import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';

import { CSR_PLACEHOLDER } from './CreateGeneralInformations.constants';

type CreateGeneralInformationsCreationMethodProps = {
  csr: string | null;
  setCsr: (csr: string | null) => void;
  isCustomCsr: boolean;
  setIsCustomCsr: (isCustomCsr: boolean) => void;
  certificateType: CertificateType | null;
  setCertificateType: (certificateType: CertificateType | null) => void;
  credentialCreationMethodError: CredentialCreationMethodErrorsType | undefined;
};

export const CreateGeneralInformationsCreationMethod = ({
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
      <FormField>
        <FormFieldLabel className="mb-2 block space-y-2">
          <Text preset="heading-5">
            {t('key_management_service_credential_create_general_creation_method_title')}
          </Text>
          <Text preset="paragraph">
            {t(
              'key_management_service_credential_create_general_information_creation_method_subtitle',
            )}
          </Text>
        </FormFieldLabel>

        {/* Radio group to select the creation method */}
        <RadioGroup
          value={isCustomCsr ? 'key' : 'no-key'}
          onValueChange={(detail: RadioValueChangeDetail) => {
            const isKey = detail.value === 'key';
            trackClick({
              location: PageLocation.funnel,
              buttonType: ButtonType.button,
              actionType: 'action',
              actions: ['select', 'type', isKey ? 'custom' : 'ovh-generated'],
            });
            setIsCustomCsr(isKey);
          }}
          className="flex flex-col gap-3"
        >
          <Radio
            value="no-key"
            data-testid="radio-method-no-key"
            className="flex items-center gap-3"
          >
            <RadioControl />
            <RadioLabel>
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
            </RadioLabel>
          </Radio>
          <Radio value="key" data-testid="radio-method-key" className="flex items-center gap-3">
            <RadioControl />
            <RadioLabel>
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
            </RadioLabel>
          </Radio>
        </RadioGroup>
      </FormField>
      {isCustomCsr ? (
        <FormField invalid={!!credentialCreationMethodError}>
          <FormFieldLabel className="mb-2 block space-y-2">
            <Text preset="heading-5">
              {t('key_management_service_credential_create_general_information_csr_title')}
            </Text>
            <Text preset="paragraph">
              {t('key_management_service_credential_create_general_information_csr_subtitle')}
            </Text>
          </FormFieldLabel>
          <Textarea
            name="credentialCreationMethod"
            data-testid="textarea-csr"
            value={csr || ''}
            placeholder={CSR_PLACEHOLDER}
            rows={10}
            onChange={(e) => setCsr(e.target.value)}
          />
          {credentialCreationMethodError && (
            <FormFieldError>
              {getCreationMethodErrorMessage(credentialCreationMethodError)}
            </FormFieldError>
          )}
        </FormField>
      ) : (
        <FormField className="flex flex-col gap-4">
          <FormFieldLabel className="block space-y-2">
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
          </FormFieldLabel>

          {/* Radio group to select the certificate type */}
          <RadioGroup
            value={certificateType || undefined}
            onValueChange={(detail: RadioValueChangeDetail) => {
              setCertificateType(detail.value as CertificateType);
            }}
            className="flex flex-col gap-2"
          >
            <Radio
              value="ECDSA"
              data-testid="radio-certificate-type-ec"
              className="flex items-center gap-2"
            >
              <RadioControl />
              <RadioLabel>
                <Text preset="span">
                  {t(
                    'key_management_service_credential_crate_general_information_certificate_type_ec_radio_label',
                  )}
                </Text>
              </RadioLabel>
            </Radio>
            <Radio
              value="RSA"
              data-testid="radio-certificate-type-rsa"
              className="flex items-center gap-2"
            >
              <RadioControl />
              <RadioLabel>
                <Text preset="span">
                  {t(
                    'key_management_service_credential_crate_general_information_certificate_type_rsa_radio_label',
                  )}
                </Text>
              </RadioLabel>
            </Radio>
          </RadioGroup>
        </FormField>
      )}
    </>
  );
};
