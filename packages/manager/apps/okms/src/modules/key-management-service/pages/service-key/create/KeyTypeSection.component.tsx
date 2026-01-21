import React from 'react';

import { ServiceKeyTypeRadioButton } from '@key-management-service/components/service-key/create/serviceKeyTypeRadioButton';
import { useOkmsServiceKeyReference } from '@key-management-service/data/hooks/useOkmsReferenceServiceKey';
import {
  OkmsKeyTypes,
  OkmsServiceKeyCurve,
  OkmsServiceKeySize,
} from '@key-management-service/types/okmsServiceKey.type';
import { OkmsServiceKeyReference } from '@key-management-service/types/okmsServiceKeyReference.type';
import { useTranslation } from 'react-i18next';

import { OdsSelectChangeEventDetail, OdsSelectCustomEvent } from '@ovhcloud/ods-components';
import { OdsFormField, OdsSelect } from '@ovhcloud/ods-components/react';
import { Text } from '@ovhcloud/ods-react';

import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { TrackingTags } from '@/tracking.constant';

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
  const { trackClick } = useOkmsTracking();

  const handleSelectKeyType = (reference: OkmsServiceKeyReference) => {
    const keyTypeTrackingTag = reference.type as unknown as TrackingTags;

    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['select', 'type', keyTypeTrackingTag],
    });

    setServiceKey(reference);
    setKeyType(reference.type);

    const preselectedSize = reference.sizes.find((size) => size.default);
    const preselectedCurve = reference.curves.find((curve) => curve.default);
    setKeySize(preselectedSize?.value || undefined);
    setKeyCurve(preselectedCurve?.value || undefined);
  };

  const handleSelectKeySize = (event: OdsSelectCustomEvent<OdsSelectChangeEventDetail>) => {
    const newKeySize = event.detail.value as unknown as OkmsServiceKeySize;
    if (newKeySize) {
      setKeySize(newKeySize);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3 md:gap-4">
        <Text preset="heading-3">
          {t('key_management_service_service-keys_create_crypto_title')}
        </Text>
        <div className="space-y-2">
          <Text className="block" preset="heading-5">
            {t('key_management_service_service-keys_create_crypto_origin_title')}
          </Text>
          <Text preset="paragraph">
            {t('key_management_service_service-keys_create_crypto_origin_subtitle')}
          </Text>
        </div>
        <OdsFormField>
          <div slot="label" className="mb-2 space-y-2">
            <Text className="block" preset="heading-5">
              {t('key_management_service_service-keys_create_crypto_field_type_title')}
            </Text>
            <Text preset="paragraph">
              {t('key_management_service_service-keys_create_crypto_field_type_subtitle')}
            </Text>
          </div>
          <div className="grid gap-3">
            {servicekeyReferenceList?.map((reference) => (
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

      {serviceKey && [OkmsKeyTypes.oct, OkmsKeyTypes.RSA].includes(serviceKey.type) && (
        <OdsFormField key={serviceKey.type}>
          <div slot="label" className="mb-2 space-y-2">
            <Text className="block" preset="heading-5">
              {t('key_management_service_service-keys_create_crypto_field_size_title')}
            </Text>
            <Text preset="paragraph">
              {t('key_management_service_service-keys_create_crypto_field_size_subtitle')}
            </Text>
          </div>
          <OdsSelect name="keySize" value={keySize?.toString()} onOdsChange={handleSelectKeySize}>
            {serviceKey?.sizes.map((size) => (
              <option key={size.value} value={size.value}>
                {t('key_management_service_service-keys_create_crypto_field_size_unit', {
                  size: size.value,
                })}{' '}
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
          <div slot="label" className="mb-2 space-y-2">
            <Text className="block" preset="heading-5">
              {t('key_management_service_service-keys_create_crypto_field_curve_title')}
            </Text>
            <Text preset="paragraph">
              {t('key_management_service_service-keys_create_crypto_field_curve_subtitle')}
            </Text>
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
