import { TileValue } from '@key-management-service/components/dashboard/tile-value/tileValue.component';
import { useServiceKeyOperationsTranslations } from '@key-management-service/hooks/service-key/useServiceKeyOperationsTranslations';
import { OkmsServiceKeyOperations } from '@key-management-service/types/okmsServiceKey.type';

type KeyStatusProps = {
  operations: OkmsServiceKeyOperations[];
  isText?: boolean;
};

export const ServiceKeyOperations = ({ operations }: KeyStatusProps) => {
  const translatedOperations = useServiceKeyOperationsTranslations(operations);

  return <TileValue value={translatedOperations.join(', ')} />;
};
