import { useServiceKeyTypeTranslations } from '@key-management-service/hooks/service-key/useServiceKeyTypeTranslations';
import { OkmsKeyTypes } from '@key-management-service/types/okmsServiceKey.type';

import { Text } from '@ovhcloud/ods-react';

type KeyStatusProps = {
  type: OkmsKeyTypes;
};

export const ServiceKeyType = ({ type }: KeyStatusProps) => {
  const translatedType = useServiceKeyTypeTranslations(type);

  return <Text preset="span">{translatedType}</Text>;
};
