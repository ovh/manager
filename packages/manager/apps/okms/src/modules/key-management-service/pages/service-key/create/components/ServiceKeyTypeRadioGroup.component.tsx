import React from 'react';

import { useOkmsServiceKeyReference } from '@key-management-service/data/hooks/useOkmsReferenceServiceKey';
import { useServiceKeyTypeTranslations } from '@key-management-service/hooks/service-key/useServiceKeyTypeTranslations';
import { OkmsKeyTypes } from '@key-management-service/types/okmsServiceKey.type';
import { useTranslation } from 'react-i18next';

import {
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  RadioValueChangeDetail,
  Text,
} from '@ovhcloud/ods-react';

export type ServiceKeyTypeRadioGroupProps = {
  region: string;
  selectedKeyType: OkmsKeyTypes;
  onSelectKeyType: (keyType: OkmsKeyTypes) => void;
};

export const ServiceKeyTypeRadioGroup = ({
  region,
  selectedKeyType,
  onSelectKeyType,
}: ServiceKeyTypeRadioGroupProps) => {
  const { data: servicekeyReferenceList } = useOkmsServiceKeyReference(region);

  const handleValueChange = (detail: RadioValueChangeDetail) => {
    const newKeyType = detail.value as OkmsKeyTypes;
    onSelectKeyType(newKeyType);
  };

  return (
    <RadioGroup name="keyType" value={selectedKeyType} onValueChange={handleValueChange}>
      {servicekeyReferenceList?.map((reference) => (
        <RadioItem
          key={reference.type.toString()}
          type={reference.type}
          value={reference.type.toString()}
        />
      ))}
    </RadioGroup>
  );
};

type RadioItemProps = {
  type: OkmsKeyTypes;
  value: string;
};

const RadioItem = ({ type, value }: RadioItemProps) => {
  const { t } = useTranslation('key-management-service/serviceKeys');
  const translatedType = useServiceKeyTypeTranslations(type);

  return (
    <Radio value={value}>
      <RadioControl />
      <RadioLabel className="flex flex-col gap-0">
        <Text className="block" preset="paragraph">
          {translatedType}
        </Text>
        <Text preset="caption">
          {t(
            `key_management_service_service-keys_create_crypto_field_type_description_${type.toLowerCase()}`,
          )}
        </Text>
      </RadioLabel>
    </Radio>
  );
};
