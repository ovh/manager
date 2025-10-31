import React from 'react';
import { TileValue } from '@key-management-service/components/dashboard/tile-value/tileValue.component';
import { useServiceKeyTypeTranslations } from '@key-management-service/hooks/serviceKey/useServiceKeyTypeTranslations';
import { OkmsKeyTypes } from '@key-management-service/types/okmsServiceKey.type';

type KeyStatusProps = {
  type: OkmsKeyTypes;
};

export const ServiceKeyType = ({ type }: KeyStatusProps) => {
  const translatedType = useServiceKeyTypeTranslations(type);

  return <TileValue value={translatedType} />;
};
