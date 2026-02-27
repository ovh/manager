import { useServiceKeyOperationsTranslations } from '@key-management-service/hooks/service-key/useServiceKeyOperationsTranslations';
import { OkmsServiceKeyOperations } from '@key-management-service/types/okmsServiceKey.type';

import { Text } from '@ovhcloud/ods-react';

type KeyStatusProps = {
  operations: OkmsServiceKeyOperations[];
  isText?: boolean;
};

export const ServiceKeyOperations = ({ operations }: KeyStatusProps) => {
  const { operationNamesMap } = useServiceKeyOperationsTranslations();
  const translatedOperations = operations.map((operation) => operationNamesMap[operation]);

  return <Text preset="span">{translatedOperations.join(', ')}</Text>;
};
