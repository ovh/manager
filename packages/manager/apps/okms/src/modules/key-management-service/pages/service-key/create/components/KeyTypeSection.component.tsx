import React from 'react';

import { ServiceKeyTypeRadioGroup } from '@key-management-service/pages/service-key/create/components/ServiceKeyTypeRadioGroup.component';
import {
  OkmsKeyTypes,
  OkmsServiceKeyCurve,
  OkmsServiceKeySize,
} from '@key-management-service/types/okmsServiceKey.type';
import { OkmsServiceKeyReference } from '@key-management-service/types/okmsServiceKeyReference.type';
import { useTranslation } from 'react-i18next';

import {
  FormField,
  FormFieldLabel,
  Select,
  SelectContent,
  SelectControl,
  Text,
} from '@ovhcloud/ods-react';

import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { TrackingTags } from '@/tracking.constant';

export type KeyTypeSectionProps = {
  keyType: OkmsKeyTypes;
  keySize: OkmsServiceKeySize | undefined;
  keyCurve: OkmsServiceKeyCurve | undefined;
  setKeyType: (keyType: OkmsKeyTypes) => void;
  setKeySize: (keySize: OkmsServiceKeySize | undefined) => void;
  setKeyCurve: (keyCurve: OkmsServiceKeyCurve | undefined) => void;
  region: string;
  currentReference: OkmsServiceKeyReference | undefined;
};

export const KeyTypeSection = ({
  keyType,
  keySize,
  keyCurve,
  setKeyType,
  setKeySize,
  setKeyCurve,
  region,
  currentReference,
}: KeyTypeSectionProps) => {
  const { t } = useTranslation('key-management-service/serviceKeys');

  const { trackClick } = useOkmsTracking();

  const handleSelectKeyType = (keyType: OkmsKeyTypes) => {
    setKeyType(keyType);

    const keyTypeTrackingTag = keyType as unknown as TrackingTags;
    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['select', 'type', keyTypeTrackingTag],
    });
  };

  const handleSelectKeySize = (detail: { value: string[] }) => {
    const newKeySize = detail.value[0] as unknown as OkmsServiceKeySize;
    if (newKeySize) {
      setKeySize(newKeySize);
    }
  };

  const handleSelectKeyCurve = (detail: { value: string[] }) => {
    const newKeyCurve = detail.value[0] as OkmsServiceKeyCurve;
    if (newKeyCurve) setKeyCurve(newKeyCurve);
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
        <KeyTypeSelectionFormField
          region={region}
          keyType={keyType}
          onSelectKeyType={handleSelectKeyType}
        />
      </div>

      {currentReference && [OkmsKeyTypes.oct, OkmsKeyTypes.RSA].includes(keyType) && (
        <KeySizeSelectionFormField
          key={keyType}
          currentReference={currentReference}
          keySize={keySize}
          onSelectKeySize={handleSelectKeySize}
        />
      )}
      {currentReference && keyType === OkmsKeyTypes.EC && (
        <KeyCurveSelectionFormField
          currentReference={currentReference}
          keyCurve={keyCurve}
          onSelectKeyCurve={handleSelectKeyCurve}
        />
      )}
    </>
  );
};

/* KeyTypeSelectionFormField */

type KeyTypeSelectionFormFieldProps = {
  region: string;
  keyType: OkmsKeyTypes;
  onSelectKeyType: (keyType: OkmsKeyTypes) => void;
};

const KeyTypeSelectionFormField = ({
  region,
  keyType,
  onSelectKeyType,
}: KeyTypeSelectionFormFieldProps) => {
  const { t } = useTranslation('key-management-service/serviceKeys');

  return (
    <FormField>
      <FormFieldLabel>
        <div className="mb-2 space-y-2">
          <Text className="block" preset="heading-5">
            {t('key_management_service_service-keys_create_crypto_field_type_title')}
          </Text>
          <Text preset="paragraph">
            {t('key_management_service_service-keys_create_crypto_field_type_subtitle')}
          </Text>
        </div>
      </FormFieldLabel>
      <ServiceKeyTypeRadioGroup
        region={region}
        selectedKeyType={keyType}
        onSelectKeyType={onSelectKeyType}
      />
    </FormField>
  );
};

/* KeySizeSelectionFormField */

type KeySizeSelectionFormFieldProps = {
  currentReference: OkmsServiceKeyReference;
  keySize: OkmsServiceKeySize | undefined;
  onSelectKeySize: (detail: { value: string[] }) => void;
};

const KeySizeSelectionFormField = ({
  currentReference,
  keySize,
  onSelectKeySize,
}: KeySizeSelectionFormFieldProps) => {
  const { t } = useTranslation('key-management-service/serviceKeys');

  return (
    <FormField>
      <FormFieldLabel>
        <div className="mb-2 space-y-2">
          <Text className="block" preset="heading-5">
            {t('key_management_service_service-keys_create_crypto_field_size_title')}
          </Text>
          <Text preset="paragraph">
            {t('key_management_service_service-keys_create_crypto_field_size_subtitle')}
          </Text>
        </div>
      </FormFieldLabel>
      <Select
        value={keySize ? [keySize.toString()] : []}
        onValueChange={onSelectKeySize}
        items={currentReference?.sizes.map((size) => ({
          label: `${t('key_management_service_service-keys_create_crypto_field_size_unit', {
            size: size.value,
          })}${size.default ? ` ${t('key_management_service_service-keys_create_crypto_field_size_curve_suffix_default')}` : ''}`,
          value: String(size.value),
        }))}
      >
        <SelectControl />
        <SelectContent />
      </Select>
    </FormField>
  );
};

/* KeyCurveSelectionFormField */

type KeyCurveSelectionFormFieldProps = {
  currentReference: OkmsServiceKeyReference;
  keyCurve: OkmsServiceKeyCurve | undefined;
  onSelectKeyCurve: (detail: { value: string[] }) => void;
};

const KeyCurveSelectionFormField = ({
  currentReference,
  keyCurve,
  onSelectKeyCurve,
}: KeyCurveSelectionFormFieldProps) => {
  const { t } = useTranslation('key-management-service/serviceKeys');

  return (
    <FormField>
      <FormFieldLabel>
        <div className="mb-2 space-y-2">
          <Text className="block" preset="heading-5">
            {t('key_management_service_service-keys_create_crypto_field_curve_title')}
          </Text>
          <Text preset="paragraph">
            {t('key_management_service_service-keys_create_crypto_field_curve_subtitle')}
          </Text>
        </div>
      </FormFieldLabel>
      <Select
        value={keyCurve ? [keyCurve] : []}
        onValueChange={onSelectKeyCurve}
        items={currentReference?.curves.map((curve) => ({
          label: `${curve.value}${curve.default ? ` ${t('key_management_service_service-keys_create_crypto_field_size_curve_suffix_default')}` : ''}`,
          value: curve.value,
        }))}
      >
        <SelectControl />
        <SelectContent />
      </Select>
    </FormField>
  );
};
