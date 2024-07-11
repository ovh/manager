import React from 'react';
import { OkmsServiceKeyAllOperations } from '@/types/okmsServiceKey.type';
import { TileValue } from '@/components/dashboard/tileValue/tileValue.component';
import { useServiceKeyOperationsTranslations } from '@/hooks/serviceKey/useServiceKeyOperationsTranslations';

type KeyStatusProps = {
  operations: OkmsServiceKeyAllOperations[];
};

export const ServiceKeyOperations = ({ operations }: KeyStatusProps) => {
  const value = useServiceKeyOperationsTranslations(operations);

  return <TileValue value={value} />;
};
