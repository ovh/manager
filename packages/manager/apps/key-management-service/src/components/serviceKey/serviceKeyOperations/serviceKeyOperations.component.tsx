import React from 'react';
import { OkmsServiceKeyOperations } from '@/types/okmsServiceKey.type';
import { TileValue } from '@/components/dashboard/tile-value/tileValue.component';
import { useServiceKeyOperationsTranslations } from '@/hooks/serviceKey/useServiceKeyOperationsTranslations';

type KeyStatusProps = {
  operations: OkmsServiceKeyOperations[];
  isText?: boolean;
};

export const ServiceKeyOperations = ({ operations }: KeyStatusProps) => {
  const translatedOperations = useServiceKeyOperationsTranslations(operations);

  return <TileValue value={translatedOperations.join(', ')} />;
};
