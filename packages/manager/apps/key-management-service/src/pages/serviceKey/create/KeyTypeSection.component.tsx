import React from 'react';
import { Subtitle } from '@ovh-ux/manager-react-components';
import {
  ODS_TEXT_PRESET,
  OdsSelectChangeEventDetail,
  OdsSelectCustomEvent,
} from '@ovhcloud/ods-components';
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
  OkmsServiceKeyCurve,
  OkmsServiceKeySize,
} from '@/types/okmsServiceKey.type';
import { useOkmsServiceKeyReference } from '@/data/hooks/useOkmsReferenceServiceKey';
import { ServiceKeyTypeRadioButton } from '@/components/serviceKey/create/serviceKeyTypeRadioButton';

export type KeyTypeSectionProps = {
  region: string;
  serviceKey: OkmsServiceKeyReference | undefined;
  setServiceKey: (serviceKey: OkmsServiceKeyReference | undefined) => void;
  keyType: OkmsKeyTypes | undefined;
  setKeyType: (keyType: OkmsKeyTypes | undefined) => void;
  keySize: OkmsServiceKeySize | undefined;
  setKeySize: (keySize: OkmsServiceKeySize | undefined) => void;
  keyCurve: OkmsServiceKeyCurve | undefined;
  setKeyCurve: (keyCurve: OkmsServiceKeyCurve | undefined) => void;
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
  const { data: servicekeyReferenceList } = useOkmsServiceKeyReference(region);
  const { trackClick } = useOvhTracking();

  const handleSelectKeyType = (reference: OkmsServiceKeyReference) => {
    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['select_type_key', reference.type],
    });
    setServiceKey(reference);
    setKeyType(reference.type);

    const preselectedSize = reference.sizes.find((size) => size.default);
    const preselectedCurve = reference.curves.find((curve) => curve.default);
    setKeySize(preselectedSize?.value || undefined);
    setKeyCurve(preselectedCurve?.value || undefined);
  };

  const handleSelectKeySize = (
    event: OdsSelectCustomEvent<OdsSelectChangeEventDetail>,
  ) => {
    const newKeySize = (event.detail.value as unknown) as OkmsServiceKeySize;
    if (newKeySize) {
      setKeySize(newKeySize);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3 md:gap-4">
        <Subtitle>
          {t('key_management_service_service-keys_create_crypto_title')}
        </Subtitle>
        <div className="space-y-2">
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
        </div>
        <OdsFormField>
          <div slot="label" className="space-y-2 mb-2">
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
            {servicekeyReferenceList?.data.map((reference) => (
              <ServiceKeyTypeRadioButton
                key={reference.type.toString()}
                type={reference.type}
                value={reference.type.toString()}
                name={keyType || ''}
                isChecked={serviceKey?.type === reference.type}
                onClick={() => handleSelectKeyType(reference)}
              />
            ))}
          </div>
        </OdsFormField>
      </div>

      {serviceKey &&
        [OkmsKeyTypes.oct, OkmsKeyTypes.RSA].includes(serviceKey.type) && (
          <OdsFormField key={serviceKey.type}>
            <div slot="label" className="space-y-2 mb-2">
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
              onOdsChange={handleSelectKeySize}
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
          <div slot="label" className="space-y-2 mb-2">
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
              const newKeyCurve = event.detail.value as OkmsServiceKeyCurve;
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
