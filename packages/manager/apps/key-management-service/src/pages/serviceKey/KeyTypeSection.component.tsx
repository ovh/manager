import React from 'react';
import { Subtitle } from '@ovh-ux/manager-react-components';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  OdsFormField,
  OdsSelect,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { OkmsServiceKeyReference } from '@/types/okmsServiceKeyReference.type';
import {
  OkmsKeyTypes,
  OkmsServiceKeyTypeECCurve,
  OkmsServiceKeyTypeOctSize,
  OkmsServiceKeyTypeRSASize,
} from '@/types/okmsServiceKey.type';
import { useOkmsServiceKeyReference } from '@/data/hooks/useOkmsReferenceServiceKey';
import { ServiceKeyTypeRadioButton } from '@/components/serviceKey/create/serviceKeyTypeRadioButton';

export type KeyTypeSectionProps = {
  region: string;
  serviceKey: OkmsServiceKeyReference;
  setServiceKey: React.Dispatch<React.SetStateAction<OkmsServiceKeyReference>>;
  keyType: OkmsKeyTypes;
  setKeyType: React.Dispatch<React.SetStateAction<OkmsKeyTypes>>;
  keySize: OkmsServiceKeyTypeOctSize | OkmsServiceKeyTypeRSASize;
  setKeySize: React.Dispatch<
    React.SetStateAction<OkmsServiceKeyTypeOctSize | OkmsServiceKeyTypeRSASize>
  >;
  keyCurve: OkmsServiceKeyTypeECCurve;
  setKeyCurve: React.Dispatch<React.SetStateAction<OkmsServiceKeyTypeECCurve>>;
};

export const KeyTypeSection: React.FC<KeyTypeSectionProps> = ({
  region,
  serviceKey,
  setServiceKey,
  keyType,
  setKeyType,
  keyCurve,
  setKeyCurve,
  keySize,
  setKeySize,
}) => {
  const { t } = useTranslation('key-management-service/serviceKeys');
  const { data: servicekeyReference } = useOkmsServiceKeyReference(region);
  const { trackClick } = useOvhTracking();

  return (
    <>
      <div className="flex flex-col gap-6 md:gap-8">
        <Subtitle>
          {t('key_management_service_service-keys_create_crypto_title')}
        </Subtitle>
        <OdsFormField>
          <OdsText className="block" preset={ODS_TEXT_PRESET.heading5}>
            {t(
              'key_management_service_service-keys_create_crypto_origin_title',
            )}
          </OdsText>
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t(
              'key_management_service_service-keys_create_crypto_origin_subtitle',
            )}
          </OdsText>
        </OdsFormField>
        <OdsFormField>
          <div slot="label">
            <OdsText className="block" preset={ODS_TEXT_PRESET.heading5}>
              {t(
                'key_management_service_service-keys_create_crypto_field_type_title',
              )}
            </OdsText>
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t(
                'key_management_service_service-keys_create_crypto_field_type_subtitle',
              )}
            </OdsText>
          </div>
          <div className="grid gap-3">
            {servicekeyReference?.data.map((reference) => (
              <ServiceKeyTypeRadioButton
                key={reference.type.toString()}
                type={reference.type}
                value={reference.type.toString()}
                name={keyType}
                isChecked={serviceKey?.type === reference.type}
                onClick={() => {
                  trackClick({
                    location: PageLocation.funnel,
                    buttonType: ButtonType.button,
                    actionType: 'action',
                    actions: ['select_type_key', reference.type],
                  });
                  setServiceKey(reference);
                  setKeyType(reference.type);
                  setKeySize(
                    reference?.sizes.find((size) => size.default)?.value ||
                      null,
                  );
                  setKeyCurve(
                    reference?.curves.find((curve) => curve.default)?.value ||
                      null,
                  );
                }}
              />
            ))}
          </div>
        </OdsFormField>
      </div>
      {[OkmsKeyTypes.oct, OkmsKeyTypes.RSA].includes(serviceKey?.type) && (
        <OdsFormField key={serviceKey.type}>
          <div slot="label">
            <OdsText className="block" preset={ODS_TEXT_PRESET.heading5}>
              {t(
                'key_management_service_service-keys_create_crypto_field_size_title',
              )}
            </OdsText>
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t(
                'key_management_service_service-keys_create_crypto_field_size_subtitle',
              )}
            </OdsText>
          </div>
          <OdsSelect
            name="keySize"
            value={keySize?.toString()}
            onOdsChange={(event) => {
              const newKeySize = (event.detail.value as unknown) as
                | OkmsServiceKeyTypeOctSize
                | OkmsServiceKeyTypeRSASize;
              if (newKeySize) setKeySize(newKeySize);
            }}
          >
            {serviceKey?.sizes.map((size) => (
              <option key={size.value} value={size.value}>
                {t(
                  'key_management_service_service-keys_create_crypto_field_size_unit',
                  { size: size.value },
                )}{' '}
                {size.default &&
                  t(
                    'key_management_service_service-keys_create_crypto_field_size_curve_suffix_default',
                  )}
              </option>
            ))}
          </OdsSelect>
        </OdsFormField>
      )}
      {serviceKey?.type === OkmsKeyTypes.EC && (
        <OdsFormField>
          <div slot="label">
            <OdsText className="block" preset={ODS_TEXT_PRESET.heading5}>
              {t(
                'key_management_service_service-keys_create_crypto_field_curve_title',
              )}
            </OdsText>
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t(
                'key_management_service_service-keys_create_crypto_field_curve_subtitle',
              )}
            </OdsText>
          </div>
          <OdsSelect
            name="keyCurve"
            value={keyCurve}
            onOdsChange={(event) => {
              const newKeyCurve = event.detail
                .value as OkmsServiceKeyTypeECCurve;
              if (newKeyCurve) setKeyCurve(newKeyCurve);
            }}
          >
            {serviceKey?.curves.map((curve) => (
              <option key={curve.value} value={curve.value}>
                {curve.value}{' '}
                {curve.default &&
                  t(
                    'key_management_service_service-keys_create_crypto_field_size_curve_suffix_default',
                  )}
              </option>
            ))}
          </OdsSelect>
        </OdsFormField>
      )}
    </>
  );
};
