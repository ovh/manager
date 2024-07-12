import React from 'react';
import { OkmsServiceKeyOperations } from '@/types/okmsServiceKey.type';
import { TileValue } from '@/components/dashboard/tile-value/tileValue.component';
import { useServiceKeyOperationsTranslations } from '@/hooks/serviceKey/useServiceKeyOperationsTranslations';

type KeyStatusProps = {
  operations: OkmsServiceKeyOperations[];
};

export const ServiceKeyOperations = ({ operations }: KeyStatusProps) => {
  const value = useServiceKeyOperationsTranslations(operations);

  return <TileValue value={value} />;
};
